const ACTIVE_WINDOW_MS = 60_000;
const ANALYTICS_CACHE_TTL_SECONDS = 300;
const GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
const ALLOWED_HOSTS = new Set(["sakaker.co", "www.sakaker.co"]);
const PREVIEW_HOST_SUFFIX = ".sakaker-pages-test.pages.dev";
const LOCAL_ALLOWED_HOSTS = new Set(["localhost", "127.0.0.1"]);

function normalizeAllowedOrigins(env = {}) {
  const values = new Set();
  for (const item of String(env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "").split(",")) {
    const value = item.trim();
    if (!value) continue;
    values.add(value);
    try { values.add(new URL(value).origin); values.add(new URL(value).hostname); } catch (_) {}
  }
  return values;
}
function isAllowedHost(hostname) {
  return ALLOWED_HOSTS.has(hostname) || hostname === "sakaker-pages-test.pages.dev"
    || hostname.endsWith(PREVIEW_HOST_SUFFIX) || hostname === "localhost" || hostname === "127.0.0.1"
    || /(^|\.)vercel\.app$/i.test(hostname) || /(^|\.)pages\.dev$/i.test(hostname);
}
function isAllowedOrigin(origin, env = {}) {
  if (!origin) return true;
  try {
    const url = new URL(origin), allowed = normalizeAllowedOrigins(env);
    return allowed.has(origin) || allowed.has(url.origin) || allowed.has(url.hostname) || isAllowedHost(url.hostname);
  } catch (_) { return false; }
}
function json(request, body, status = 200, env = {}) {
  const origin = request.headers.get("Origin"), requestOrigin = new URL(request.url).origin;
  const headers = { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8", "Vary": "Origin" };
  if (origin && isAllowedOrigin(origin, env)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  } else if (origin === requestOrigin) headers["Access-Control-Allow-Origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}
function validRequest(request, env = {}) {
  const url = new URL(request.url), origin = request.headers.get("Origin");
  return isAllowedHost(url.hostname) && (!origin || origin === url.origin || isAllowedOrigin(origin, env));
}
function validId(value) { return typeof value === "string" && /^[a-f0-9-]{36}$/i.test(value); }
async function hashId(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}
async function graphql(env, query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Authorization": "Bearer " + env.CF_ANALYTICS_API_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });
  if (!response.ok) throw new Error("Cloudflare Analytics HTTP " + response.status);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error("Cloudflare Analytics GraphQL query failed");
  return payload.data;
}
function utcDate(date) { return date.toISOString().slice(0, 10); }
function addUtcDays(day, count) {
  const date = new Date(day + "T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() + count);
  return utcDate(date);
}
async function fetchAnalyticsCounts(env) {
  if (!env.CF_ANALYTICS_API_TOKEN || !env.CF_ZONE_ID) {
    return { total: null, today: null, analyticsConfigured: false };
  }
  const settingsQuery = `query CounterDatasetSettings($zoneTag: String) {
    viewer { zones(filter: { zoneTag: $zoneTag }) {
      settings { httpRequests1dGroups { enabled maxDuration maxPageSize notOlderThan availableFields } }
    } }
  }`;
  const settingsData = await graphql(env, settingsQuery, { zoneTag: env.CF_ZONE_ID });
  const settings = settingsData?.viewer?.zones?.[0]?.settings?.httpRequests1dGroups;
  if (!settings?.enabled) throw new Error("Cloudflare daily analytics dataset is not enabled");
  const fields = Array.isArray(settings.availableFields) ? settings.availableFields : [];
  if (!fields.includes("uniq_uniques")) throw new Error("Cloudflare daily unique-IP metric is unavailable");
  const maxDuration = Number(settings.maxDuration), retention = Number(settings.notOlderThan);
  const maxPageSize = Math.floor(Number(settings.maxPageSize));
  if (![maxDuration, retention, maxPageSize].every(value => Number.isFinite(value) && value > 0)) {
    throw new Error("Cloudflare returned invalid Analytics dataset limits");
  }
  const now = new Date(), endDay = utcDate(now);
  // Count the latest 30 UTC calendar days, including today.
  const startDay = addUtcDays(endDay, -29);
  const daysPerQuery = Math.max(1, Math.floor(maxDuration / 86400));
  if (retention < 30 * 86400) throw new Error("Cloudflare Analytics retention is shorter than the requested 30-day counter window");
  const dailyQuery = `query DailyUniqueVisitors($zoneTag: String, $start: Date, $end: Date, $limit: Int) {
    viewer { zones(filter: { zoneTag: $zoneTag }) {
      httpRequests1dGroups(
        limit: $limit
        filter: { date_geq: $start, date_leq: $end }
        orderBy: [date_ASC]
      ) { dimensions { date } uniq { uniques } }
    } }
  }`;
  let total = 0, today = 0, dayCount = 0, cursor = startDay;
  while (cursor <= endDay) {
    const chunkEndCandidate = addUtcDays(cursor, daysPerQuery - 1);
    const chunkEnd = chunkEndCandidate < endDay ? chunkEndCandidate : endDay;
    const data = await graphql(env, dailyQuery, {
      zoneTag: env.CF_ZONE_ID, start: cursor, end: chunkEnd, limit: maxPageSize
    });
    const rows = data?.viewer?.zones?.[0]?.httpRequests1dGroups;
    if (!Array.isArray(rows)) throw new Error("Cloudflare returned an invalid daily Analytics result");
    if (rows.length >= maxPageSize) throw new Error("Cloudflare Analytics page limit reached; refusing an incomplete total");
    for (const row of rows) {
      const count = Number(row?.uniq?.uniques);
      if (!Number.isFinite(count) || count < 0) throw new Error("Cloudflare returned an invalid unique-IP count");
      total += count;
      dayCount += 1;
      if (row?.dimensions?.date === endDay) today = count;
    }
    cursor = addUtcDays(chunkEnd, 1);
  }
  return {
    total, today, analyticsConfigured: true, totalBasis: "sum_of_daily_unique_ips_last_30_days",
    periodDays: 30,
    timezone: "UTC", historyStart: startDay, historyEnd: endDay, daysReturned: dayCount
  };
}
async function readAnalyticsCounts(request, env) {
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const cacheKey = new Request(new URL("/__sakaker_analytics_counter_v1", new URL(request.url).origin));
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached.json();
  }
  const counts = await fetchAnalyticsCounts(env);
  if (cache && counts.analyticsConfigured) {
    await cache.put(cacheKey, new Response(JSON.stringify(counts), {
      headers: { "Cache-Control": "public, max-age=" + ANALYTICS_CACHE_TTL_SECONDS }
    }));
  }
  return counts;
}
async function readCounts(db, request, env) {
  const [analytics, active] = await Promise.all([
    readAnalyticsCounts(request, env),
    db.prepare("SELECT COUNT(*) AS count FROM active_sessions WHERE last_seen >= ?1")
      .bind(Date.now() - ACTIVE_WINDOW_MS).first()
  ]);
  return { ...analytics, online: Number(active?.count || 0) };
}
export async function onRequestOptions({ request, env }) {
  if (!validRequest(request, env)) return json(request, { error: "origin_not_allowed" }, 403, env);
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Origin": origin || new URL(request.url).origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400", "Vary": "Origin"
  };
  if (origin && isAllowedOrigin(origin, env)) headers["Access-Control-Allow-Credentials"] = "true";
  return new Response(null, { status: 204, headers });
}
export async function onRequestGet({ request, env }) {
  if (!validRequest(request, env)) return json(request, { error: "origin_not_allowed" }, 403, env);
  if (!env.VISITOR_DB) return json(request, { error: "counter_not_configured" }, 503, env);
  try { return json(request, await readCounts(env.VISITOR_DB, request, env), 200, env); }
  catch (error) {
    console.error("Visitor counter read failed", error);
    return json(request, { error: "counter_unavailable" }, 503, env);
  }
}
export async function onRequestPost({ request, env }) {
  if (!validRequest(request, env)) return json(request, { error: "origin_not_allowed" }, 403, env);
  if (!env.VISITOR_DB) return json(request, { error: "counter_not_configured" }, 503, env);
  try {
    const body = await request.json();
    if (!validId(body?.sessionId)) return json(request, { error: "invalid_session_id" }, 400, env);
    const now = Date.now(), sessionHash = await hashId(body.sessionId);
    await env.VISITOR_DB.batch([
      env.VISITOR_DB.prepare(
        "INSERT INTO active_sessions (session_hash, last_seen) VALUES (?1, ?2) ON CONFLICT(session_hash) DO UPDATE SET last_seen = excluded.last_seen"
      ).bind(sessionHash, now),
      env.VISITOR_DB.prepare("DELETE FROM active_sessions WHERE last_seen < ?1").bind(now - ACTIVE_WINDOW_MS)
    ]);
    return json(request, await readCounts(env.VISITOR_DB, request, env), 200, env);
  } catch (error) {
    console.error("Visitor counter update failed", error);
    return json(request, { error: "counter_unavailable" }, 503, env);
  }
}

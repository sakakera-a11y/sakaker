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
async function fetchTodayCount(env) {
  if (!env.CF_ANALYTICS_API_TOKEN || !env.CF_ZONE_ID) {
    throw new Error("Cloudflare Analytics is not configured");
  }
  const today = new Date().toISOString().slice(0, 10);
  const query = `query TodayUniqueVisitors($zoneTag: String, $day: Date) {
    viewer { zones(filter: { zoneTag: $zoneTag }) {
      httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $day, date_leq: $day }
      ) { dimensions { date } uniq { uniques } }
    } }
  }`;
  const data = await graphql(env, query, { zoneTag: env.CF_ZONE_ID, day: today });
  const rows = data?.viewer?.zones?.[0]?.httpRequests1dGroups;
  if (!Array.isArray(rows)) throw new Error("Invalid Cloudflare daily Analytics response");
  const row = rows.find(item => item?.dimensions?.date === today);
  const todayCount = row ? Number(row.uniq?.uniques) : 0;
  if (!Number.isFinite(todayCount) || todayCount < 0) throw new Error("Invalid daily visitor count");
  return todayCount;
}
async function readCounts(db, request, env) {
  const [today, active] = await Promise.all([
    fetchTodayCount(env),
    db.prepare("SELECT COUNT(*) AS count FROM active_sessions WHERE last_seen >= ?1")
      .bind(Date.now() - ACTIVE_WINDOW_MS).first()
  ]);
  return { today, online: Number(active?.count || 0), timezone: "UTC" };
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

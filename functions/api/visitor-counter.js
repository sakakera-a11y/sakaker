const LEGACY_UNIQUE_VISITORS = 1410;
const ACTIVE_WINDOW_MS = 60_000;
const ALLOWED_HOSTS = new Set(["sakaker.co", "www.sakaker.co"]);
const PREVIEW_HOST_SUFFIX = ".sakaker-pages-test.pages.dev";
const LOCAL_ALLOWED_HOSTS = new Set(["localhost", "127.0.0.1"]);

function normalizeAllowedOrigins(env = {}) {
  const values = new Set();
  const raw = env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "";
  for (const item of String(raw).split(",")) {
    const value = item.trim();
    if (!value) continue;
    values.add(value);
    try {
      values.add(new URL(value).origin);
      values.add(new URL(value).hostname);
    } catch (_) {
      // Ignore malformed values; they are validated later.
    }
  }
  return values;
}

function isAllowedHost(hostname) {
  return ALLOWED_HOSTS.has(hostname)
    || hostname === "sakaker-pages-test.pages.dev"
    || hostname.endsWith(PREVIEW_HOST_SUFFIX)
    || LOCAL_ALLOWED_HOSTS.has(hostname)
    || /(^|\.)vercel\.app$/i.test(hostname)
    || /(^|\.)pages\.dev$/i.test(hostname);
}

function isAllowedOrigin(origin, env = {}) {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const allowed = normalizeAllowedOrigins(env);
    if (allowed.has(origin) || allowed.has(url.origin) || allowed.has(url.hostname)) return true;
    return isAllowedHost(url.hostname);
  } catch (_) {
    return false;
  }
}

function json(request, body, status = 200, env = {}) {
  const origin = request.headers.get("Origin");
  const requestOrigin = new URL(request.url).origin;
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };

  if (origin && isAllowedOrigin(origin, env)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  } else if (origin === requestOrigin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function validRequest(request, env = {}) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const sameOrigin = !origin || origin === url.origin;
  const externalOriginAllowed = !!origin && isAllowedOrigin(origin, env);
  return isAllowedHost(url.hostname) && (sameOrigin || externalOriginAllowed);
}

function riyadhDayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validId(value) {
  return typeof value === "string" && /^[a-f0-9-]{36}$/i.test(value);
}

async function hashId(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function baselineCount(env, name, fallback = 0) {
  const raw = env[name];
  if (raw === undefined || raw === null || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid ${name} baseline`);
  }
  return value;
}

async function readCounts(db, dayKey, env) {
  const [visitors, today, active] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS count FROM visitor_totals").first(),
    db.prepare("SELECT COUNT(*) AS count FROM daily_visitor_marks WHERE day = ?1").bind(dayKey).first(),
    db.prepare("SELECT COUNT(*) AS count FROM active_sessions WHERE last_seen >= ?1").bind(Date.now() - ACTIVE_WINDOW_MS).first()
  ]);
  const totalBaseline = baselineCount(env, "VISITOR_TOTAL_BASELINE", LEGACY_UNIQUE_VISITORS);
  const baselineDay = env.VISITOR_BASELINE_DAY || "";
  const todayBaseline = baselineDay === dayKey
    ? baselineCount(env, "VISITOR_TODAY_BASELINE", 0)
    : 0;
  return {
    online: Number(active?.count || 0),
    total: totalBaseline + Number(visitors?.count || 0),
    today: todayBaseline + Number(today?.count || 0)
  };
}

export async function onRequestOptions({ request, env }) {
  if (!validRequest(request, env)) return json(request, { error: "origin_not_allowed" }, 403, env);
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Origin": origin || new URL(request.url).origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };

  if (origin && isAllowedOrigin(origin, env)) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return new Response(null, { status: 204, headers });
}

export async function onRequestGet({ request, env }) {
  if (!validRequest(request, env)) return json(request, { error: "origin_not_allowed" }, 403, env);
  if (!env.VISITOR_DB) return json(request, { error: "counter_not_configured" }, 503, env);
  try {
    return json(request, await readCounts(env.VISITOR_DB, riyadhDayKey(), env), 200, env);
  } catch (error) {
    console.error("Visitor counter read failed", error);
    return json(request, { error: "counter_unavailable" }, 503, env);
  }
}

export async function onRequestPost({ request, env }) {
  if (!validRequest(request, env)) return json(request, { error: "origin_not_allowed" }, 403, env);
  if (!env.VISITOR_DB) return json(request, { error: "counter_not_configured" }, 503, env);
  try {
    const body = await request.json();
    if (!validId(body?.visitorId) || !validId(body?.sessionId)) {
      return json(request, { error: "invalid_visitor_id" }, 400, env);
    }

    const now = Date.now();
    const dayKey = riyadhDayKey(new Date(now));
    const [visitorHash, sessionHash] = await Promise.all([
      hashId(body.visitorId),
      hashId(body.sessionId)
    ]);

    await env.VISITOR_DB.batch([
      env.VISITOR_DB.prepare(
        "INSERT OR IGNORE INTO visitor_totals (visitor_hash, first_seen) VALUES (?1, ?2)"
      ).bind(visitorHash, now),
      env.VISITOR_DB.prepare(
        "INSERT OR IGNORE INTO daily_visitor_marks (day, visitor_hash, first_seen) VALUES (?1, ?2, ?3)"
      ).bind(dayKey, visitorHash, now),
      env.VISITOR_DB.prepare(
        "INSERT INTO active_sessions (session_hash, last_seen) VALUES (?1, ?2) ON CONFLICT(session_hash) DO UPDATE SET last_seen = excluded.last_seen"
      ).bind(sessionHash, now),
      env.VISITOR_DB.prepare(
        "DELETE FROM active_sessions WHERE last_seen < ?1"
      ).bind(now - ACTIVE_WINDOW_MS)
    ]);

    return json(request, await readCounts(env.VISITOR_DB, dayKey, env), 200, env);
  } catch (error) {
    console.error("Visitor counter update failed", error);
    return json(request, { error: "counter_unavailable" }, 503, env);
  }
}

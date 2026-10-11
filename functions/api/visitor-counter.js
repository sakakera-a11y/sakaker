const LEGACY_UNIQUE_VISITORS = 1410;
const ACTIVE_WINDOW_MS = 60_000;
const ALLOWED_HOSTS = new Set(["sakaker.co", "www.sakaker.co"]);

function json(request, body, status = 200) {
  const origin = request.headers.get("Origin");
  const requestOrigin = new URL(request.url).origin;
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };
  if (origin === requestOrigin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function validRequest(request) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  return ALLOWED_HOSTS.has(url.hostname)
    && (!origin || origin === url.origin);
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

async function readCounts(db, dayKey) {
  const [visitors, today, active] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS count FROM visitor_totals").first(),
    db.prepare("SELECT COUNT(*) AS count FROM daily_visitor_marks WHERE day = ?1").bind(dayKey).first(),
    db.prepare("SELECT COUNT(*) AS count FROM active_sessions WHERE last_seen >= ?1").bind(Date.now() - ACTIVE_WINDOW_MS).first()
  ]);
  return {
    online: Number(active?.count || 0),
    total: LEGACY_UNIQUE_VISITORS + Number(visitors?.count || 0),
    today: Number(today?.count || 0)
  };
}

export async function onRequestOptions({ request }) {
  if (!validRequest(request)) return json(request, { error: "origin_not_allowed" }, 403);
  const origin = request.headers.get("Origin");
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    }
  });
}

export async function onRequestGet({ request, env }) {
  if (!validRequest(request)) return json(request, { error: "origin_not_allowed" }, 403);
  if (!env.VISITOR_DB) return json(request, { error: "counter_not_configured" }, 503);
  try {
    return json(request, await readCounts(env.VISITOR_DB, riyadhDayKey()));
  } catch (error) {
    console.error("Visitor counter read failed", error);
    return json(request, { error: "counter_unavailable" }, 503);
  }
}

export async function onRequestPost({ request, env }) {
  if (!validRequest(request)) return json(request, { error: "origin_not_allowed" }, 403);
  if (!env.VISITOR_DB) return json(request, { error: "counter_not_configured" }, 503);
  try {
    const body = await request.json();
    if (!validId(body?.visitorId) || !validId(body?.sessionId)) {
      return json(request, { error: "invalid_visitor_id" }, 400);
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

    return json(request, await readCounts(env.VISITOR_DB, dayKey));
  } catch (error) {
    console.error("Visitor counter update failed", error);
    return json(request, { error: "counter_unavailable" }, 503);
  }
}

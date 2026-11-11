const PROJECT_ID = "sakaker-9247f";
const TOKEN_ISSUER = "https://securetoken.google.com/" + PROJECT_ID;
const GOOGLE_KEYS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const ALLOWED_HOSTS = new Set(["sakaker.co", "www.sakaker.co", "localhost", "127.0.0.1"]);
let signingKeys = null;
let signingKeysExpiresAt = 0;

function allowedHost(host) {
  return ALLOWED_HOSTS.has(host) || host === "sakaker-pages-test.pages.dev" ||
    host === "sakaker1.pages.dev" || host.endsWith(".sakaker1.pages.dev") ||
    host.endsWith(".sakaker-pages-test.pages.dev");
}
function validRequest(request) {
  const url = new URL(request.url);
  if (!allowedHost(url.hostname)) return false;
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    return originUrl.origin === url.origin && allowedHost(originUrl.hostname);
  } catch (_) { return false; }
}
function response(request, body, status = 200) {
  const origin = request.headers.get("Origin");
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };
  if (origin && validRequest(request)) headers["Access-Control-Allow-Origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}
function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}
function decodeJsonSegment(segment) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(segment)));
}
async function getSigningKeys(force = false) {
  const now = Date.now();
  if (!force && signingKeys && now < signingKeysExpiresAt) return signingKeys;
  const result = await fetch(GOOGLE_KEYS_URL, { headers: { Accept: "application/json" } });
  if (!result.ok) throw new Error("Firebase signing keys unavailable");
  const payload = await result.json();
  if (!Array.isArray(payload.keys) || !payload.keys.length) throw new Error("Invalid Firebase signing keys");
  signingKeys = payload.keys;
  signingKeysExpiresAt = now + 45 * 60 * 1000;
  return signingKeys;
}
async function verifyFirebaseToken(request) {
  const authorization = request.headers.get("Authorization") || "";
  const match = authorization.match(/^Bearer\s+([A-Za-z0-9._-]+)$/);
  if (!match) return null;
  const token = match[1];
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  let header, claims;
  try {
    header = decodeJsonSegment(parts[0]);
    claims = decodeJsonSegment(parts[1]);
  } catch (_) { return null; }
  if (header.alg !== "RS256" || typeof header.kid !== "string") return null;
  const now = Math.floor(Date.now() / 1000);
  if (claims.iss !== TOKEN_ISSUER || claims.aud !== PROJECT_ID ||
      typeof claims.sub !== "string" || !claims.sub || claims.sub.length > 128 ||
      !Number.isFinite(claims.exp) || claims.exp <= now ||
      !Number.isFinite(claims.iat) || claims.iat > now + 60 ||
      !Number.isFinite(claims.auth_time) || claims.auth_time > now + 60) return null;
  try {
    let keys = await getSigningKeys();
    let jwk = keys.find(key => key.kid === header.kid && key.kty === "RSA");
    if (!jwk) {
      keys = await getSigningKeys(true);
      jwk = keys.find(key => key.kid === header.kid && key.kty === "RSA");
    }
    if (!jwk) return null;
    const publicKey = await crypto.subtle.importKey(
      "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
    );
    const signedContent = new TextEncoder().encode(parts[0] + "." + parts[1]);
    const signature = decodeBase64Url(parts[2]);
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5", publicKey, signature, signedContent
    );
    return valid ? claims.sub : null;
  } catch (error) {
    console.error("Castle rating token verification failed", error);
    return null;
  }
}
async function hashUid(uid) {
  const digest = await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode("sakaker-castle-rating-v1:" + uid)
  );
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}
async function ensureSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS castle_ratings (
      uid_hash TEXT PRIMARY KEY,
      choice TEXT NOT NULL CHECK (choice IN ('like', 'dislike')),
      created_at INTEGER NOT NULL
    )
  `).run();
}
async function readRating(db, uidHash) {
  const [totals, own] = await Promise.all([
    db.prepare(`
      SELECT
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN choice = 'like' THEN 1 ELSE 0 END), 0) AS likes,
        COALESCE(SUM(CASE WHEN choice = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
      FROM castle_ratings
    `).first(),
    db.prepare("SELECT choice FROM castle_ratings WHERE uid_hash = ?1").bind(uidHash).first()
  ]);
  return {
    counts: {
      total: Number(totals?.total || 0),
      likes: Number(totals?.likes || 0),
      dislikes: Number(totals?.dislikes || 0)
    },
    mine: own?.choice || null
  };
}
export async function onRequestOptions({ request }) {
  if (!validRequest(request)) return response(request, { error: "origin_not_allowed" }, 403);
  const origin = request.headers.get("Origin") || new URL(request.url).origin;
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    }
  });
}
export async function onRequestGet({ request, env }) {
  if (!validRequest(request)) return response(request, { error: "origin_not_allowed" }, 403);
  if (!env.VISITOR_DB) return response(request, { error: "rating_not_configured" }, 503);
  const uid = await verifyFirebaseToken(request);
  if (!uid) return response(request, { error: "authentication_required" }, 401);
  try {
    await ensureSchema(env.VISITOR_DB);
    return response(request, await readRating(env.VISITOR_DB, await hashUid(uid)));
  } catch (error) {
    console.error("Castle rating read failed", error);
    return response(request, { error: "rating_unavailable" }, 503);
  }
}
export async function onRequestPost({ request, env }) {
  if (!validRequest(request)) return response(request, { error: "origin_not_allowed" }, 403);
  if (!env.VISITOR_DB) return response(request, { error: "rating_not_configured" }, 503);
  const uid = await verifyFirebaseToken(request);
  if (!uid) return response(request, { error: "authentication_required" }, 401);
  try {
    const body = await request.json();
    if (!body || !["like", "dislike"].includes(body.choice)) {
      return response(request, { error: "invalid_choice" }, 400);
    }
    await ensureSchema(env.VISITOR_DB);
    const uidHash = await hashUid(uid);
    const inserted = await env.VISITOR_DB.prepare(
      "INSERT INTO castle_ratings (uid_hash, choice, created_at) VALUES (?1, ?2, ?3) ON CONFLICT(uid_hash) DO NOTHING"
    ).bind(uidHash, body.choice, Date.now()).run();
    const result = await readRating(env.VISITOR_DB, uidHash);
    return response(request, { ...result, alreadyVoted: Number(inserted?.meta?.changes || 0) === 0 });
  } catch (error) {
    console.error("Castle rating vote failed", error);
    return response(request, { error: "rating_unavailable" }, 503);
  }
}

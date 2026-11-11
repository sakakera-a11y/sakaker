import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";

globalThis.crypto ??= webcrypto;

const source = await (await import("node:fs/promises")).readFile(
  new URL("../functions/api/castle-rating.js", import.meta.url), "utf8"
);
const rating = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

const keyPair = await crypto.subtle.generateKey({
  name: "RSASSA-PKCS1-v1_5",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256"
}, true, ["sign", "verify"]);
const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
publicJwk.kid = "castle-rating-test-key";
publicJwk.alg = "RS256";
publicJwk.use = "sig";
globalThis.fetch = async () => Response.json({ keys: [publicJwk] });

function base64url(value) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  return Buffer.from(bytes).toString("base64url");
}
async function makeToken(uid = "firebase-test-user-1") {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: publicJwk.kid }));
  const claims = base64url(JSON.stringify({
    iss: "https://securetoken.google.com/sakaker-9247f",
    aud: "sakaker-9247f",
    sub: uid,
    iat: now,
    exp: now + 3600,
    auth_time: now,
    user_id: uid
  }));
  const content = header + "." + claims;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", keyPair.privateKey, new TextEncoder().encode(content)
  );
  return content + "." + base64url(signature);
}
function fakeD1() {
  const votes = new Map();
  function statement(sql, params = []) {
    return {
      sql, params,
      bind(...values) { return statement(sql, values); },
      async run() {
        if (sql.includes("CREATE TABLE")) return { meta: { changes: 0 } };
        if (sql.includes("INSERT INTO castle_ratings")) {
          const [hash, choice, createdAt] = params;
          if (votes.has(hash)) return { meta: { changes: 0 } };
          votes.set(hash, { choice, createdAt });
          return { meta: { changes: 1 } };
        }
        throw new Error("Unexpected D1 run: " + sql);
      },
      async first() {
        if (sql.includes("FROM castle_ratings") && sql.includes("COUNT(*)")) {
          const rows = [...votes.values()];
          return {
            total: rows.length,
            likes: rows.filter(row => row.choice === "like").length,
            dislikes: rows.filter(row => row.choice === "dislike").length
          };
        }
        if (sql.includes("SELECT choice FROM castle_ratings")) {
          const row = votes.get(params[0]);
          return row ? { choice: row.choice } : null;
        }
        throw new Error("Unexpected D1 first: " + sql);
      }
    };
  }
  return { votes, prepare: sql => statement(sql) };
}
function makeRequest(method, token, body, origin = "https://sakaker.co") {
  return new Request("https://sakaker.co/api/castle-rating", {
    method,
    headers: {
      Origin: origin,
      Authorization: "Bearer " + token,
      ...(body === undefined ? {} : { "Content-Type": "application/json" })
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
}

test("one Firebase UID can cast only one vote, even when the second choice differs", async () => {
  const db = fakeD1();
  const token = await makeToken("same-user-across-devices");
  const first = await rating.onRequestPost({
    request: makeRequest("POST", token, { choice: "like" }),
    env: { VISITOR_DB: db }
  });
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), {
    counts: { total: 1, likes: 1, dislikes: 0 },
    mine: "like",
    alreadyVoted: false
  });

  const second = await rating.onRequestPost({
    request: makeRequest("POST", token, { choice: "dislike" }),
    env: { VISITOR_DB: db }
  });
  assert.equal(second.status, 200);
  assert.deepEqual(await second.json(), {
    counts: { total: 1, likes: 1, dislikes: 0 },
    mine: "like",
    alreadyVoted: true
  });
  assert.equal(db.votes.size, 1);
  assert.equal([...db.votes.keys()][0].includes("same-user-across-devices"), false);
});

test("a different authenticated UID can vote independently", async () => {
  const db = fakeD1();
  const firstToken = await makeToken("user-one");
  const secondToken = await makeToken("user-two");
  await rating.onRequestPost({
    request: makeRequest("POST", firstToken, { choice: "like" }),
    env: { VISITOR_DB: db }
  });
  const second = await rating.onRequestPost({
    request: makeRequest("POST", secondToken, { choice: "dislike" }),
    env: { VISITOR_DB: db }
  });
  assert.equal(second.status, 200);
  assert.deepEqual((await second.json()).counts, { total: 2, likes: 1, dislikes: 1 });
});

test("GET returns only aggregate counts and the current user's own choice", async () => {
  const db = fakeD1();
  const token = await makeToken("reader-user");
  await rating.onRequestPost({
    request: makeRequest("POST", token, { choice: "like" }),
    env: { VISITOR_DB: db }
  });
  const result = await rating.onRequestGet({
    request: makeRequest("GET", token),
    env: { VISITOR_DB: db }
  });
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), {
    counts: { total: 1, likes: 1, dislikes: 0 },
    mine: "like"
  });
});

test("rejects invalid Firebase signatures and cross-origin requests", async () => {
  const token = await makeToken();
  const parts = token.split(".");
  const tampered = parts[0] + "." + base64url(JSON.stringify({ sub: "forged" })) + "." + parts[2];
  const badTokenResponse = await rating.onRequestGet({
    request: makeRequest("GET", tampered),
    env: { VISITOR_DB: fakeD1() }
  });
  assert.equal(badTokenResponse.status, 401);

  const crossOriginResponse = await rating.onRequestGet({
    request: makeRequest("GET", token, undefined, "https://attacker.example"),
    env: { VISITOR_DB: fakeD1() }
  });
  assert.equal(crossOriginResponse.status, 403);
});

test("requires authentication, a valid choice, and the D1 binding", async () => {
  const unauthenticated = await rating.onRequestGet({
    request: new Request("https://sakaker.co/api/castle-rating"),
    env: { VISITOR_DB: fakeD1() }
  });
  assert.equal(unauthenticated.status, 401);

  const token = await makeToken("choice-user");
  const invalidChoice = await rating.onRequestPost({
    request: makeRequest("POST", token, { choice: "maybe" }),
    env: { VISITOR_DB: fakeD1() }
  });
  assert.equal(invalidChoice.status, 400);

  const missingDatabase = await rating.onRequestGet({
    request: makeRequest("GET", token),
    env: {}
  });
  assert.equal(missingDatabase.status, 503);
});

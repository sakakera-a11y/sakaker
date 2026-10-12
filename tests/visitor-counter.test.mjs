import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { webcrypto } from "node:crypto";

globalThis.crypto ??= webcrypto;

const source = await readFile(new URL("../functions/api/visitor-counter.js", import.meta.url), "utf8");
const counter = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function riyadhDayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function fakeD1() {
  const visitors = new Set();
  const daily = new Set();
  const sessions = new Map();

  function statement(sql, params = []) {
    return {
      bind(...values) { return statement(sql, values); },
      async first() {
        if (sql.includes("FROM visitor_totals")) return { count: visitors.size };
        if (sql.includes("FROM daily_visitor_marks")) {
          const day = params[0];
          return { count: [...daily].filter(mark => mark.startsWith(`${day}:`)).length };
        }
        if (sql.includes("FROM active_sessions")) {
          const cutoff = Number(params[0]);
          return { count: [...sessions.values()].filter(lastSeen => lastSeen >= cutoff).length };
        }
        throw new Error(`Unexpected query: ${sql}`);
      },
      sql,
      params
    };
  }

  return {
    prepare: sql => statement(sql),
    async batch(statements) {
      for (const item of statements) {
        const [a, b, c] = item.params;
        if (item.sql.includes("INSERT OR IGNORE INTO visitor_totals")) visitors.add(a);
        else if (item.sql.includes("INSERT OR IGNORE INTO daily_visitor_marks")) daily.add(`${a}:${b}`);
        else if (item.sql.includes("INSERT INTO active_sessions")) sessions.set(a, b);
        else if (item.sql.includes("DELETE FROM active_sessions")) {
          for (const [key, lastSeen] of sessions) if (lastSeen < a) sessions.delete(key);
        } else throw new Error(`Unexpected batch statement: ${item.sql}`);
      }
    }
  };
}

function request(path = "/api/visitor-counter", { method = "GET", origin = "https://sakaker-pages-test.pages.dev", body } = {}) {
  return new Request(`https://sakaker-pages-test.pages.dev${path}`, {
    method,
    headers: {
      Origin: origin,
      ...(body === undefined ? {} : { "Content-Type": "application/json" })
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
}

test("GET reports a clear configuration error when D1 is not bound", async () => {
  const response = await counter.onRequestGet({ request: request(), env: {} });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "counter_not_configured" });
});

test("rejects cross-origin requests", async () => {
  const response = await counter.onRequestGet({
    request: request("/api/visitor-counter", { origin: "https://attacker.example" }),
    env: { VISITOR_DB: fakeD1() }
  });
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { error: "origin_not_allowed" });
});

test("counts a visitor once per day and preserves same-day cutover baselines", async () => {
  const day = riyadhDayKey();
  const env = {
    VISITOR_DB: fakeD1(),
    VISITOR_TOTAL_BASELINE: "1410",
    VISITOR_TODAY_BASELINE: "7",
    VISITOR_BASELINE_DAY: day
  };
  const visitorA = "11111111-1111-4111-8111-111111111111";
  const visitorB = "22222222-2222-4222-8222-222222222222";
  const session = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

  const first = await counter.onRequestPost({
    request: request("/api/visitor-counter", { method: "POST", body: { visitorId: visitorA, sessionId: session } }),
    env
  });
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { online: 1, total: 1411, today: 8 });

  const repeated = await counter.onRequestPost({
    request: request("/api/visitor-counter", { method: "POST", body: { visitorId: visitorA, sessionId: session } }),
    env
  });
  assert.equal(repeated.status, 200);
  assert.deepEqual(await repeated.json(), { online: 1, total: 1411, today: 8 });

  const newVisitor = await counter.onRequestPost({
    request: request("/api/visitor-counter", { method: "POST", body: { visitorId: visitorB, sessionId: session } }),
    env
  });
  assert.equal(newVisitor.status, 200);
  assert.deepEqual(await newVisitor.json(), { online: 1, total: 1412, today: 9 });
});

test("rejects malformed visitor and session identifiers", async () => {
  const response = await counter.onRequestPost({
    request: request("/api/visitor-counter", {
      method: "POST",
      body: { visitorId: "not-a-uuid", sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }
    }),
    env: { VISITOR_DB: fakeD1() }
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "invalid_visitor_id" });
});

import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";

globalThis.crypto ??= webcrypto;

const source = await (await import("node:fs/promises")).readFile(
  new URL("../functions/api/visitor-counter.js", import.meta.url), "utf8"
);
const counter = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function fakeD1() {
  const sessions = new Map();
  function statement(sql, params = []) {
    return {
      sql, params,
      bind(...values) { return statement(sql, values); },
      async first() {
        if (sql.includes("FROM active_sessions")) {
          const cutoff = Number(params[0]);
          return { count: [...sessions.values()].filter(lastSeen => lastSeen >= cutoff).length };
        }
        throw new Error("Unexpected D1 query: " + sql);
      }
    };
  }
  return {
    sessions,
    prepare: sql => statement(sql),
    async batch(items) {
      for (const item of items) {
        const [id, value] = item.params;
        if (item.sql.includes("INSERT INTO active_sessions")) sessions.set(id, value);
        else if (item.sql.includes("DELETE FROM active_sessions")) {
          for (const [key, lastSeen] of sessions) if (lastSeen < item.params[0]) sessions.delete(key);
        } else throw new Error("Unexpected D1 statement: " + item.sql);
      }
    }
  };
}

function makeRequest(method = "GET", body) {
  return new Request("https://sakaker-pages-test.pages.dev/api/visitor-counter", {
    method,
    headers: {
      Origin: "https://sakaker-pages-test.pages.dev",
      ...(body === undefined ? {} : { "Content-Type": "application/json" })
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
}

function utcDay(date) { return date.toISOString().slice(0, 10); }
function addDays(day, amount) {
  const date = new Date(day + "T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() + amount);
  return utcDay(date);
}

function mockAnalyticsFetch(calls = []) {
  globalThis.fetch = async (_url, init) => {
    const payload = JSON.parse(init.body);
    calls.push(payload);
    if (payload.query.includes("CounterDatasetSettings")) {
      return Response.json({ data: { viewer: { zones: [{ settings: {
        httpRequests1dGroups: {
          enabled: true, maxDuration: 86400, maxPageSize: 100,
          notOlderThan: 90 * 86400, availableFields: ["uniq_uniques"]
        }
      } }] } } });
    }
    const { start, end } = payload.variables;
    const rows = [];
    for (let day = start; day <= end; day = addDays(day, 1)) {
      rows.push({ dimensions: { date: day }, uniq: { uniques: day === end ? 7 : 4 } });
    }
    return Response.json({ data: { viewer: { zones: [{ httpRequests1dGroups: rows }] } } });
  };
  return calls;
}

test("GET returns Cloudflare Analytics totals and D1 online sessions", async () => {
  const calls = mockAnalyticsFetch();
  const db = fakeD1();
  const response = await counter.onRequestGet({
    request: makeRequest(),
    env: { VISITOR_DB: db, CF_ANALYTICS_API_TOKEN: "test-token", CF_ZONE_ID: "test-zone" }
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.analyticsConfigured, true);
  assert.equal(body.total, 367);
  assert.equal(body.today, 7);
  assert.equal(body.online, 0);
  assert.equal(body.totalBasis, "sum_of_daily_unique_ips");
  assert.equal(body.historyStart, addDays(body.historyEnd, -90));
  assert.equal(body.historyEnd, utcDay(new Date()));
  assert.equal(body.daysReturned, 91);
  assert.equal(calls.length, body.daysReturned + 1);
  assert.match(calls[0].query, /\$zoneTag: String/);
  assert.match(calls[1].query, /\$zoneTag: String/);
  assert.match(calls[1].query, /\$start: Date/);
});

test("POST refreshes a hashed active session and returns Analytics totals", async () => {
  mockAnalyticsFetch();
  const db = fakeD1();
  const response = await counter.onRequestPost({
    request: makeRequest("POST", { sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }),
    env: { VISITOR_DB: db, CF_ANALYTICS_API_TOKEN: "test-token", CF_ZONE_ID: "test-zone" }
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.online, 1);
  assert.equal(body.total, 367);
  assert.equal(body.totalBasis, "sum_of_daily_unique_ips");
  assert.equal(body.historyStart, addDays(body.historyEnd, -90));
  assert.equal(body.daysReturned, 91);
  assert.equal(body.today, 7);
  assert.equal(db.sessions.size, 1);
  assert.equal([...db.sessions.keys()][0].length, 64);
});

test("GET returns a configuration error when D1 is not bound", async () => {
  const response = await counter.onRequestGet({ request: makeRequest(), env: {} });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "counter_not_configured" });
});

test("rejects cross-origin requests", async () => {
  const request = new Request("https://sakaker-pages-test.pages.dev/api/visitor-counter", {
    headers: { Origin: "https://attacker.example" }
  });
  const response = await counter.onRequestGet({ request, env: { VISITOR_DB: fakeD1() } });
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { error: "origin_not_allowed" });
});

test("returns unavailable rather than a fabricated Analytics total when credentials are missing", async () => {
  const response = await counter.onRequestGet({
    request: makeRequest(),
    env: { VISITOR_DB: fakeD1() }
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.analyticsConfigured, false);
  assert.equal(body.total, null);
  assert.equal(body.today, null);
});

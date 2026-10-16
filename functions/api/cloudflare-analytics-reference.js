const GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function authorized(request, env) {
  const expected = env.ANALYTICS_REFERENCE_KEY;
  const header = request.headers.get("Authorization") || "";
  return typeof expected === "string"
    && expected.length >= 32
    && header.startsWith("Bearer ")
    && header.slice(7) === expected;
}

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) {
    return json({ error: "unauthorized" }, 401);
  }
  if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ZONE_ID) {
    return json({ error: "analytics_reference_not_configured" }, 503);
  }

  const end = new Date();
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
  const query = `
    query SakakerTrafficReference($zoneTag: string, $start: Time, $end: Time) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequestsAdaptiveGroups(
            limit: 1
            filter: {
              datetime_geq: $start
              datetime_lt: $end
              requestSource: "eyeball"
              clientRequestHTTPHost_in: ["sakaker.co", "www.sakaker.co"]
            }
          ) {
            sum { visits }
            uniq { uniques }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query,
        variables: {
          zoneTag: env.CLOUDFLARE_ZONE_ID,
          start: start.toISOString(),
          end: end.toISOString()
        }
      })
    });

    if (!response.ok) {
      console.error("Cloudflare analytics reference returned HTTP", response.status);
      return json({ error: "analytics_reference_upstream_error" }, 502);
    }

    const payload = await response.json();
    if (payload.errors?.length) {
      console.error("Cloudflare analytics reference GraphQL errors", payload.errors.length);
      return json({ error: "analytics_reference_query_failed" }, 502);
    }

    const group = payload.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups?.[0];
    return json({
      source: "cloudflare_graphql_analytics",
      mode: "reference_only",
      affectsVisitorCounter: false,
      window: { start: start.toISOString(), end: end.toISOString() },
      visits: Number(group?.sum?.visits || 0),
      uniqueVisitors: Number(group?.uniq?.uniques || 0)
    });
  } catch (error) {
    console.error("Cloudflare analytics reference request failed", error);
    return json({ error: "analytics_reference_unavailable" }, 502);
  }
}

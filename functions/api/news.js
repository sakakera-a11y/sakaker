const SOURCES = [
  { name: "عاجل", url: "https://ajel.sa/rss.xml", category: "saudi" },
  { name: "BBC News · World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "world" }
];

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const forceFresh = url.searchParams.has("fresh");
  const cache = !forceFresh && typeof caches !== "undefined" ? caches.default : null;
  const cacheKey = new Request(new URL("/api/news", request.url).toString(), { method: "GET" });
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  const attempts = SOURCES.map(async source => {
    const response = await fetch(source.url, {
      headers: {
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9",
        "User-Agent": "SakakerCastleNews/1.0"
      },
      signal: AbortSignal.timeout(9000),
      redirect: "follow"
    });
    if (!response.ok) throw new Error(source.name + " returned HTTP " + response.status);
    const xml = await response.text();
    if (!/<(?:rss|feed|rdf:RDF)\b/i.test(xml.slice(0, 4000)) || !/<(?:item|entry)\b/i.test(xml)) {
      throw new Error(source.name + " returned an invalid RSS document");
    }
    return { name: source.name, url: source.url, category: source.category, xml };
  });

  // Return every working source so the newspaper can combine local and world headlines.
  const results = await Promise.allSettled(attempts);
  const feeds = results.filter(result => result.status === "fulfilled").map(result => result.value);
  if (!feeds.length) {
    return Response.json({
      error: "news_sources_unavailable",
      feeds: [],
      checkedAt: new Date().toISOString()
    }, {
      status: 502,
      headers: { "Cache-Control": "no-store" }
    });
  }

  const response = Response.json({ feeds, fetchedAt: new Date().toISOString() }, {
    headers: { "Cache-Control": "public, max-age=180, s-maxage=180" }
  });
  if (cache) await cache.put(cacheKey, response.clone());
  return response;
}

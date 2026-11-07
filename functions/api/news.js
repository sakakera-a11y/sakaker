const SOURCES = [
  { name: "عاجل", url: "https://ajel.sa/rss.xml", category: "saudi" },
  { name: "BBC News · World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "world" }
];

export async function onRequestGet({ request }) {
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const cacheKey = new Request(new URL("/api/news", request.url).toString(), { method: "GET" });
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  const attempts = SOURCES.map(async source => {
    const response = await fetch(source.url, {
      headers: { "Accept": "application/rss+xml, application/xml, text/xml;q=0.9" },
      signal: AbortSignal.timeout(4500)
    });
    if (!response.ok) throw new Error(source.name + " returned HTTP " + response.status);
    const xml = await response.text();
    if (!/<(?:rss|feed|rdf:RDF)\\b/i.test(xml.slice(0, 2500)) || !/<(?:item|entry)\\b/i.test(xml)) {
      throw new Error(source.name + " returned an invalid RSS document");
    }
    return { name: source.name, url: source.url, category: source.category, xml };
  });

  let feeds;
  try {
    // First valid source wins; the other is a real fallback, not a proxy chain.
    feeds = [await Promise.any(attempts)];
  } catch {
    return Response.json({ error: "news_sources_unavailable", feeds: [] }, {
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

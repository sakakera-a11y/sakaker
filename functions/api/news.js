function googleNewsUrl(query) { const url = new URL("https://news.google.com/rss/search"); url.search = new URLSearchParams({ q: query, hl: "ar", gl: "SA", ceid: "SA:ar" }).toString(); return url.toString(); }

const SOURCES = [
  { name: "عاجل", url: "https://ajel.sa/rss.xml", category: "saudi" },
  { name: "BBC News · World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "world" },
  { name: "BBC عربي · الشرق الأوسط", url: "https://feeds.bbci.co.uk/arabic/middleeast/rss.xml", category: "saudi" },
  { name: "أخبار السعودية · Google News", url: googleNewsUrl("السعودية"), category: "saudi" },
  { name: "أخبار العالم · Google News", url: googleNewsUrl("العالم"), category: "world" },
  { name: "التقنية · Google News", url: googleNewsUrl("التقنية"), category: "tech" },
  { name: "الرياضة · Google News", url: googleNewsUrl("الرياضة"), category: "sports" },
  { name: "الاقتصاد · Google News", url: googleNewsUrl("الاقتصاد"), category: "economy" }
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

  // Fetch sources independently: one slow or blocked provider must not hide the others.
  const results = await Promise.all(SOURCES.map(async source => {
    try {
      const response = await fetch(source.url, {
        headers: {
          "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9",
          "User-Agent": "Mozilla/5.0 (compatible; SakakerCastleNews/1.1; +https://sakaker.co/)"
        },
        signal: AbortSignal.timeout(15000),
        redirect: "follow"
      });
      if (!response.ok) {
        return { ok: false, name: source.name, category: source.category, error: "HTTP " + response.status };
      }
      const xml = await response.text();
      const hasFeedRoot = /<(?:[\w.-]+:)?(?:rss|feed|RDF)\b/i.test(xml.slice(0, 12000));
      const hasEntries = /<(?:[\w.-]+:)?(?:item|entry)\b/i.test(xml);
      if (!hasFeedRoot || !hasEntries) {
        return { ok: false, name: source.name, category: source.category, error: "Invalid RSS/Atom response" };
      }
      return { ok: true, feed: { name: source.name, url: source.url, category: source.category, xml } };
    } catch (error) {
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      return { ok: false, name: source.name, category: source.category, error: timedOut ? "Request timed out" : "Fetch failed" };
    }
  }));

  const feeds = results.filter(result => result.ok).map(result => result.feed);
  const sourceStatus = results.map(({ ok, name, category, error }) => ({
    name, category, ok, ...(error ? { error } : {})
  }));
  if (!feeds.length) {
    return Response.json({
      error: "news_sources_unavailable",
      feeds: [],
      sourceStatus,
      checkedAt: new Date().toISOString()
    }, {
      status: 502,
      headers: { "Cache-Control": "no-store" }
    });
  }

  const response = Response.json({ feeds, sourceStatus, fetchedAt: new Date().toISOString() }, {
    headers: { "Cache-Control": "public, max-age=180, s-maxage=180" }
  });
  if (cache) await cache.put(cacheKey, response.clone());
  return response;
}

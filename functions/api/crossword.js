const MIN_WORD = 3;
const MAX_WORD = 9;

function cleanAnswer(value, lang) {
  let word = String(value || "").normalize("NFC").toLowerCase();
  if (lang === "ar") {
    word = word
      .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي");
  }
  return word.replace(/[^\p{L}]/gu, "");
}

function makeClue(extract, title, lang) {
  let clue = String(extract || "").replace(/\s+/g, " ").trim();
  if (title && clue.toLowerCase().startsWith(title.toLowerCase())) {
    clue = clue.slice(title.length).replace(/^\s*[,،:؛–—.-]+\s*/, "");
  }
  if (clue.length < 24) {
    return lang === "ar"
      ? "مصطلح ومعرفة من مقالة موسوعية في ويكيبيديا."
      : "A topic described in an article in Wikipedia.";
  }
  return clue.slice(0, 230);
}

function choosePuzzle(pages, lang) {
  const candidates = Object.values(pages || {})
    .filter(page => page && page.title && page.extract)
    .map(page => ({
      title: page.title,
      answer: cleanAnswer(page.title, lang),
      clue: makeClue(page.extract, page.title, lang),
      url: "https://" + (lang === "ar" ? "ar" : "en") + ".wikipedia.org/wiki/" + encodeURIComponent(page.title.replace(/ /g, "_"))
    }))
    .filter(item => item.answer.length >= MIN_WORD && item.answer.length <= MAX_WORD)
    .filter(item => lang === "ar"
      ? /^[\u0600-\u06FF]+$/.test(item.answer)
      : /^[a-z]+$/.test(item.answer));

  let best = null;
  let bestScore = -1;
  for (let i = 0; i < candidates.length; i++) {
    for (let j = 0; j < candidates.length; j++) {
      if (i === j || candidates[i].answer === candidates[j].answer) continue;
      const a = candidates[i].answer;
      const d = candidates[j].answer;
      for (let ai = 0; ai < a.length; ai++) {
        const di = d.indexOf(a[ai]);
        if (di < 0) continue;
        const score = Math.min(a.length, d.length) * 10
          + (candidates[i].clue.length > 70 ? 3 : 0)
          + (candidates[j].clue.length > 70 ? 3 : 0)
          - Math.abs(ai - Math.floor(a.length / 2))
          - Math.abs(di - Math.floor(d.length / 2));
        if (score > bestScore) {
          bestScore = score;
          best = { across: candidates[i], down: candidates[j], crossing: { acrossIndex: ai, downIndex: di } };
        }
      }
    }
  }
  return best;
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "ar";
  const day = url.searchParams.get("day") || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return Response.json({ error: "invalid_day" }, { status: 400 });
  }

  const cache = typeof caches !== "undefined" ? caches.default : null;
  const cacheUrl = new URL("/api/crossword?lang=" + lang + "&day=" + day, url.origin);
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  if (cache) {
    const saved = await cache.match(cacheKey);
    if (saved) return saved;
  }

  const apiUrl = new URL("https://" + lang + ".wikipedia.org/w/api.php");
  apiUrl.search = new URLSearchParams({
    action: "query",
    generator: "random",
    grnnamespace: "0",
    grnlimit: "40",
    prop: "extracts",
    exintro: "1",
    explaintext: "1",
    exchars: "650",
    format: "json",
    origin: "*"
  }).toString();

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: {
        "Accept": "application/json",
        "User-Agent": "SakakerCastleCrossword/1.0 (https://sakaker.co/)"
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error("Wikipedia HTTP " + response.status);
    const data = await response.json();
    const puzzle = choosePuzzle(data?.query?.pages, lang);
    if (!puzzle) throw new Error("No suitable crossword words found");

    const payload = {
      date: day,
      language: lang,
      source: lang === "ar" ? "ويكيبيديا العربية" : "English Wikipedia",
      sourceUrl: "https://" + lang + ".wikipedia.org/",
      across: puzzle.across,
      down: puzzle.down,
      crossing: puzzle.crossing,
      generatedAt: new Date().toISOString()
    };
    const result = Response.json(payload, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=86400" }
    });
    if (cache) await cache.put(cacheKey, result.clone());
    return result;
  } catch (error) {
    return Response.json({
      error: "wikipedia_unavailable",
      language: lang,
      date: day
    }, {
      status: 503,
      headers: { "Cache-Control": "no-store" }
    });
  }
}

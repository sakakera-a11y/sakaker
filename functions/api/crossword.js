const MIN_WORD = 3;
const MAX_WORD = 9;
const TIME_ZONE = "Asia/Riyadh";
const CACHE_SECONDS = 86400;

const AR_WORDS = [
  ["كتاب", "مؤلَّف يضم صفحات مكتوبة أو مطبوعة."],
  ["مدرسة", "مكان يتلقى فيه الطلاب العلم والمعرفة."],
  ["مدينة", "تجمع سكاني كبير يضم أحياء ومرافق."],
  ["بحر", "مسطح مائي واسع ومالح."],
  ["نهر", "مجرى مائي طبيعي يجري بين ضفتين."],
  ["قمر", "جرم سماوي يدور حول الأرض ويضيء ليلًا."],
  ["شمس", "النجم الذي يمد الأرض بالضوء والحرارة."],
  ["نجمة", "جسم سماوي مضيء في الفضاء."],
  ["طائر", "حيوان له جناحان ويضع البيض."],
  ["زهرة", "جزء ملون من النبات يساعد على التكاثر."],
  ["حديقة", "مساحة مزروعة بالأشجار والورود."],
  ["سيارة", "مركبة تسير على الطرق وتنقل الأشخاص."],
  ["نافذة", "فتحة في الجدار يدخل منها الضوء والهواء."],
  ["مفتاح", "أداة تستخدم لفتح قفل أو تشغيل جهاز."],
  ["ساعة", "أداة لمعرفة الوقت."],
  ["سفينة", "مركبة كبيرة تبحر فوق الماء."],
  ["جبل", "كتلة مرتفعة من الأرض."],
  ["سحابة", "تجمع من قطرات الماء أو البلورات في السماء."],
  ["مطر", "ماء ينزل من السحب إلى الأرض."],
  ["رياح", "هواء يتحرك من مكان إلى آخر."],
  ["طريق", "مسار مخصص لانتقال الناس والمركبات."],
  ["مصباح", "أداة تصدر الضوء عند تشغيلها."],
  ["حاسوب", "جهاز إلكتروني لمعالجة المعلومات."],
  ["هاتف", "جهاز يستخدم للاتصال والتواصل."],
  ["قلم", "أداة للكتابة أو الرسم."],
  ["دفتر", "مجموعة أوراق مجلدة لتدوين الملاحظات."],
  ["شجرة", "نبات كبير له جذع وأغصان."],
  ["تفاحة", "ثمرة مستديرة تؤكل ولها أنواع متعددة."],
  ["فراشة", "حشرة لها أجنحة ملونة."],
  ["حصان", "حيوان قوي يستخدم للركوب والجر."]
];

const EN_WORDS = [
  ["apple", "A round fruit that commonly has red, green, or yellow skin."],
  ["river", "A natural stream of water flowing toward a sea or lake."],
  ["planet", "A large celestial body that orbits a star."],
  ["garden", "A place where flowers, trees, or vegetables are grown."],
  ["window", "An opening in a wall fitted with glass to let in light."],
  ["candle", "A wax stick with a wick that gives light when burning."],
  ["bridge", "A structure built to cross a river, road, or gap."],
  ["forest", "A large area covered mainly with trees."],
  ["flower", "The colorful part of a plant that produces seeds."],
  ["camera", "A device used to take photographs or record video."],
  ["silver", "A shiny precious metal with a pale gray color."],
  ["orange", "A citrus fruit with a tough skin and juicy segments."],
  ["rabbit", "A small mammal with long ears and strong hind legs."],
  ["island", "An area of land surrounded by water."],
  ["pencil", "A writing tool with a graphite core."],
  ["bottle", "A container, usually with a narrow neck, for liquids."],
  ["castle", "A large fortified building from earlier times."],
  ["market", "A place where people buy and sell goods."],
  ["cloud", "A visible mass of tiny water droplets in the sky."],
  ["train", "A series of connected vehicles that travel on rails."],
  ["music", "The art of arranging sounds in time."],
  ["school", "A place where people go to learn."],
  ["ocean", "A very large body of salt water."],
  ["desert", "A very dry region that receives little rainfall."],
  ["mirror", "A surface that reflects an image."],
  ["stone", "A small piece of rock."],
  ["clock", "A device that measures and displays time."],
  ["planet", "A celestial body moving in an orbit around a star."],
  ["pillow", "A soft support for the head while sleeping."],
  ["basket", "A container woven from strips of material."]
];

function normalizeAnswer(value, lang) {
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

function riyadhDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return values.year + "-" + values.month + "-" + values.day;
}

function isValidDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(day + "T00:00:00.000Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

function nextDay(day) {
  const date = new Date(day + "T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function hashText(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makePairs(words, lang) {
  const prepared = words.map(([title, clue]) => ({
    title,
    answer: normalizeAnswer(title, lang),
    clue
  })).filter(item =>
    item.answer.length >= MIN_WORD &&
    item.answer.length <= MAX_WORD &&
    (lang === "ar" ? /^[\u0600-\u06FF]+$/.test(item.answer) : /^[a-z]+$/.test(item.answer))
  );

  const pairs = [];
  for (let i = 0; i < prepared.length; i++) {
    for (let j = i + 1; j < prepared.length; j++) {
      if (prepared[i].answer === prepared[j].answer) continue;
      let crossing = null;
      for (let ai = 0; ai < prepared[i].answer.length && !crossing; ai++) {
        const di = prepared[j].answer.indexOf(prepared[i].answer[ai]);
        if (di >= 0) crossing = { acrossIndex: ai, downIndex: di };
      }
      if (crossing) {
        pairs.push({ across: prepared[i], down: prepared[j], crossing });
      }
    }
  }
  return pairs;
}

function pickDailyPair(day, lang, words) {
  const pairs = makePairs(words, lang);
  if (!pairs.length) throw new Error("No valid crossing pair in local word bank");
  return pairs[hashText(lang + ":" + day) % pairs.length];
}

async function fetchEnglishClue(word, fallback) {
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2500)
    });
    if (!response.ok) return fallback;
    const data = await response.json();
    const meanings = Array.isArray(data) ? data[0]?.meanings : null;
    for (const meaning of meanings || []) {
      const definition = meaning?.definitions?.find(item => item?.definition)?.definition;
      if (definition) return String(definition).replace(/\s+/g, " ").trim().slice(0, 230);
    }
  } catch (_) {
    // The built-in daily word bank remains available when the dictionary is offline.
  }
  return fallback;
}

async function createPuzzle(day, lang) {
  const pair = pickDailyPair(day, lang, lang === "ar" ? AR_WORDS : EN_WORDS);
  let acrossClue = pair.across.clue;
  let downClue = pair.down.clue;
  if (lang === "en") {
    const clues = await Promise.all([
      fetchEnglishClue(pair.across.title, acrossClue),
      fetchEnglishClue(pair.down.title, downClue)
    ]);
    acrossClue = clues[0];
    downClue = clues[1];
  }

  return {
    date: day,
    language: lang,
    across: { title: pair.across.title, answer: pair.across.answer, clue: acrossClue },
    down: { title: pair.down.title, answer: pair.down.answer, clue: downClue },
    crossing: pair.crossing,
    solutionAvailableOn: nextDay(day),
    generatedAt: new Date().toISOString()
  };
}

function responseFor(core, day, today, cached) {
  const payload = {
    ...core,
    solutionAvailable: today > day,
    solutionMessage: today > day
      ? (core.language === "ar" ? "أصبح حل لغز هذا اليوم السابق متاحًا." : "The solution for this previous day's puzzle is now available.")
      : (core.language === "ar" ? "سيظهر الحل في اليوم التالي." : "The solution will be available the next day."),
    cache: cached ? "daily-cache" : "generated"
  };
  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=" + CACHE_SECONDS
    }
  });
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "ar";
  const day = url.searchParams.get("day") || riyadhDate();
  if (!isValidDay(day)) {
    return Response.json({ error: "invalid_day", message: "Use a valid YYYY-MM-DD date." }, { status: 400 });
  }

  const today = riyadhDate();
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const cacheUrl = new URL("/api/crossword?lang=" + lang + "&day=" + day, url.origin);
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });

  if (cache) {
    try {
      const saved = await cache.match(cacheKey);
      if (saved) {
        const core = await saved.json();
        return responseFor(core, day, today, true);
      }
    } catch (_) {
      // Cache failures must not prevent a fresh deterministic puzzle.
    }
  }

  try {
    const core = await createPuzzle(day, lang);
    if (cache) {
      try {
        await cache.put(cacheKey, Response.json(core, {
          headers: { "Cache-Control": "public, max-age=0, s-maxage=" + CACHE_SECONDS }
        }));
      } catch (_) {
        // The same date and language always generate the same local puzzle without cache.
      }
    }
    return responseFor(core, day, today, false);
  } catch (_) {
    return Response.json({
      error: "crossword_generation_failed",
      language: lang,
      date: day,
      message: lang === "ar"
        ? "تعذر إنشاء اللغز حاليًا. حاول تحديث النافذة."
        : "The puzzle could not be generated. Please retry."
    }, {
      status: 503,
      headers: { "Cache-Control": "no-store" }
    });
  }
}

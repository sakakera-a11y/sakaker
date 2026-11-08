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
  ["حصان", "حيوان قوي يستخدم للركوب والجر."],
  ["مكتبة", "مكان يضم الكتب ويتيح قراءتها أو استعارتها."],
  ["قرية", "تجمع سكاني أصغر من المدينة."],
  ["صحراء", "أرض واسعة قليلة الأمطار والنبات."],
  ["واحة", "موضع أخضر في الصحراء تتوافر فيه المياه."],
  ["جزيرة", "قطعة من اليابسة تحيط بها المياه."],
  ["شاطئ", "أرض تمتد بمحاذاة البحر أو النهر."],
  ["محيط", "مسطح مائي مالح بالغ الاتساع."],
  ["وادي", "منخفض بين الجبال أو التلال."],
  ["هضبة", "أرض مرتفعة سطحها شبه مستو."],
  ["بركان", "فتحة في القشرة الأرضية تخرج منها الحمم."],
  ["زلزال", "اهتزاز مفاجئ يصيب سطح الأرض."],
  ["ثلج", "ماء متجمد يتساقط أحيانًا من السحب."],
  ["ضباب", "قطرات ماء دقيقة تقلل وضوح الرؤية قرب الأرض."],
  ["رعد", "صوت قوي يصاحب البرق أحيانًا."],
  ["برق", "وميض ضوئي يحدث في السحب أثناء العواصف."],
  ["نسيم", "هواء لطيف خفيف الحركة."],
  ["ربيع", "فصل من فصول السنة تزهر فيه النباتات."],
  ["خريف", "فصل تتساقط فيه أوراق كثير من الأشجار."],
  ["شتاء", "فصل يتميز غالبًا بانخفاض درجات الحرارة."],
  ["صيف", "فصل ترتفع فيه درجات الحرارة غالبًا."],
  ["وردة", "زهرة معروفة بجمالها ورائحتها."],
  ["نخلة", "شجرة طويلة تنتج التمر."],
  ["زيتون", "ثمار شجرة يستخرج منها زيت معروف."],
  ["عنب", "ثمار صغيرة تنمو في عناقيد."],
  ["موز", "فاكهة طويلة ذات قشرة صفراء غالبًا."],
  ["ليمون", "ثمرة حمضية ذات طعم حامض."],
  ["رمان", "فاكهة مليئة بحبوب حمراء أو وردية."],
  ["تمر", "ثمرة حلوة تنمو على النخيل."],
  ["عسل", "غذاء حلو يصنعه النحل من رحيق الأزهار."],
  ["نحلة", "حشرة تجمع الرحيق وتنتج العسل."],
  ["نملة", "حشرة صغيرة تعيش غالبًا في جماعات."],
  ["أسد", "حيوان مفترس يلقب بملك الغابة."],
  ["نمر", "حيوان مفترس يتميز بفرائه المخطط."],
  ["فيل", "حيوان ضخم له خرطوم طويل."],
  ["جمل", "حيوان صحراوي يتحمل العطش وله سنام."],
  ["غزال", "حيوان رشيق سريع ذو قرون غالبًا."],
  ["ذئب", "حيوان مفترس يعيش في البرية."],
  ["ثعلب", "حيوان معروف بالدهاء وله ذيل كثيف."],
  ["قطة", "حيوان أليف يحب مطاردة الفئران."],
  ["كلب", "حيوان أليف معروف بالوفاء."],
  ["سمكة", "حيوان مائي يتنفس بالخياشيم."],
  ["دلفين", "ثديي بحري ذكي يعيش في الماء."],
  ["حوت", "أكبر الثدييات ويعيش في البحار."],
  ["سلحفاة", "حيوان بطيء تحميه قوقعة صلبة."],
  ["نسر", "طائر جارح قوي البصر."],
  ["حمامة", "طائر أليف يرمز إلى السلام."],
  ["بومة", "طائر ينشط غالبًا في الليل."],
  ["صقر", "طائر جارح سريع يستخدم في الصيد."],
  ["جناح", "عضو يساعد الطيور على الطيران."],
  ["مطبخ", "مكان إعداد الطعام في المنزل."],
  ["نافورة", "منشأة يندفع منها الماء للزينة."],
  ["مرآة", "سطح يعكس صورة ما يقابله."],
  ["وسادة", "شيء لين يوضع تحت الرأس عند النوم."],
  ["سجادة", "غطاء منسوج يفرش على الأرض."],
  ["ستارة", "قطعة قماش تحجب النافذة أو تزينها."],
  ["مطرقة", "أداة تستخدم لدق المسامير."],
  ["مقص", "أداة ذات شفرتين لقص الورق أو القماش."],
  ["إبرة", "أداة رفيعة تستخدم في الخياطة."],
  ["ميزان", "أداة تستخدم لمعرفة الوزن."],
  ["خريطة", "رسم يوضح الأماكن والطرق والمعالم."],
  ["بوصلة", "أداة تحدد الاتجاهات."],
  ["منارة", "برج ضوئي يرشد السفن قرب السواحل."],
  ["متحف", "مكان تعرض فيه آثار وأعمال تاريخية أو فنية."],
  ["مسرح", "مكان تقدم فيه العروض والتمثيل."],
  ["ملعب", "مكان مخصص لممارسة الألعاب الرياضية."],
  ["فريق", "مجموعة أشخاص يعملون أو يلعبون معًا."],
  ["كرة", "جسم مستدير يستخدم في ألعاب رياضية كثيرة."],
  ["سباق", "منافسة لمعرفة الأسرع أو الأفضل."],
  ["جائزة", "مكافأة تمنح تقديرًا للإنجاز."],
  ["رحلة", "انتقال من مكان إلى آخر لغرض معين."],
  ["قطار", "وسيلة نقل تسير على قضبان."],
  ["طائرة", "مركبة تطير في الجو وتنقل المسافرين."],
  ["مطار", "مكان إقلاع الطائرات وهبوطها."],
  ["ميناء", "مكان ترسو فيه السفن لتحميل البضائع والركاب."],
  ["جسر", "منشأة لعبور نهر أو طريق أو واد."],
  ["نفق", "ممر محفور تحت الأرض أو الجبل."],
  ["مصعد", "وسيلة تنقل الأشخاص بين طوابق المبنى."],
  ["سوق", "مكان يلتقي فيه البائعون والمشترون."],
  ["متجر", "مكان تعرض فيه السلع للبيع."],
  ["مخبز", "مكان يصنع ويباع فيه الخبز."],
  ["مزرعة", "أرض تزرع أو تربى فيها الحيوانات."],
  ["بذرة", "جزء من النبات يمكن أن ينبت نباتًا جديدًا."],
  ["جذر", "جزء النبات الذي يثبته ويمتص الماء من التربة."],
  ["غصن", "فرع ينمو من جذع الشجرة."],
  ["ورقة", "جزء أخضر من النبات يساعده على صنع غذائه."],
  ["ثمرة", "جزء من النبات يحمل البذور غالبًا."],
  ["ماء", "سائل شفاف ضروري لحياة الكائنات."],
  ["هواء", "خليط من الغازات يحيط بالأرض."],
  ["نار", "ظاهرة تنتج حرارة وضوءًا عند الاحتراق."],
  ["حجر", "قطعة صلبة من الصخور."],
  ["رمل", "حبيبات دقيقة توجد بكثرة في الشواطئ والصحارى."],
  ["حديد", "معدن قوي يستخدم في البناء والصناعة."],
  ["ذهب", "معدن ثمين أصفر اللون."],
  ["فضة", "معدن ثمين لامع أبيض اللون."],
  ["زجاج", "مادة صلبة شفافة تصنع منها النوافذ."],
  ["ورق", "مادة رقيقة تكتب أو تطبع عليها الكلمات."],
  ["حبر", "سائل ملون يستخدم في الكتابة والطباعة."],
  ["رسالة", "نص يرسله شخص إلى آخر لنقل خبر أو فكرة."],
  ["قصة", "سرد لأحداث وشخصيات."],
  ["قصيدة", "كلام أدبي موزون أو ذو إيقاع شعري."],
  ["لغة", "نظام من الكلمات والرموز للتواصل."],
  ["كلمة", "وحدة لغوية تحمل معنى."],
  ["حرف", "رمز من رموز الكتابة."],
  ["جملة", "مجموعة كلمات تؤدي معنى تامًا."],
  ["معجم", "كتاب أو قاعدة تجمع الكلمات وتشرح معانيها."],
  ["علم", "معرفة منظمة تقوم على الملاحظة والدراسة."],
  ["فكرة", "تصور أو معنى يخطر في الذهن."],
  ["ذاكرة", "قدرة العقل على حفظ المعلومات واسترجاعها."],
  ["سؤال", "طلب معرفة أو استفسار عن أمر."],
  ["جواب", "رد يوضح ما سئل عنه."],
  ["لغز", "سؤال يحتاج إلى تفكير للوصول إلى حله."],
  ["حكمة", "قول موجز يحمل معنى عميقًا أو نصيحة."],
  ["صداقة", "علاقة مودة وثقة بين الأشخاص."],
  ["أمانة", "حفظ الحقوق وأداء الواجب بصدق."],
  ["شجاعة", "قوة القلب عند مواجهة الصعاب."],
  ["كرم", "جود وعطاء دون انتظار مقابل."],
  ["سلام", "حالة من الأمن وغياب النزاع."],
  ["فرح", "شعور بالسرور والسعادة."],
  ["أمل", "تطلع إلى حدوث أمر طيب في المستقبل."]
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

function createPuzzle(day, lang) {
  const pair = pickDailyPair(day, lang, lang === "ar" ? AR_WORDS : EN_WORDS);
  return {
    date: day,
    language: lang,
    across: { title: pair.across.title, answer: pair.across.answer, clue: pair.across.clue },
    down: { title: pair.down.title, answer: pair.down.answer, clue: pair.down.clue },
    crossing: pair.crossing,
    solutionAvailableOn: nextDay(day),
    generatedAt: new Date().toISOString()
  };
}

function stripSourceMetadata(value) {
  const blockedKeys = /^(source|sourceurl|sourcename|sourcelabel|attribution|credit|crediturl|provider|reference)$/i;
  if (Array.isArray(value)) return value.map(stripSourceMetadata);
  if (!value || typeof value !== "object") {
    if (typeof value === "string" &&
        (/^(?:المصدر|source)\s*[:：]/i.test(value.trim()) ||
         /Salah-Sal|arabic-wordnet-v4|بنك سكاكر العربي التحريري/i.test(value))) return "";
    return value;
  }
  const clean = {};
  for (const [key, item] of Object.entries(value)) {
    if (!blockedKeys.test(key)) clean[key] = stripSourceMetadata(item);
  }
  return clean;
}

function responseFor(core, day, today, cached) {
  // Never send today's answers to the browser. The answers are released only
  // when the requested puzzle date is earlier than the current Riyadh date.
  const available = today > day;
  const payload = {
    date: core.date,
    language: core.language,
    across: {
      clue: core.across.clue,
      length: Array.from(core.across.answer).length,
      ...(available ? { answer: core.across.answer } : {})
    },
    down: {
      clue: core.down.clue,
      length: Array.from(core.down.answer).length,
      ...(available ? { answer: core.down.answer } : {})
    },
    crossing: core.crossing,
    solutionAvailableOn: core.solutionAvailableOn,
    solutionAvailable: available,
    solutionMessage: available
      ? (core.language === "ar" ? "حل لغز هذا اليوم متاح الآن." : "This puzzle's solution is now available.")
      : (core.language === "ar" ? "ستجد الحل غدًا." : "Find the solution tomorrow."),
    cache: cached ? "daily-cache" : "generated"
  };
  return Response.json(stripSourceMetadata(payload), {
    headers: { "Cache-Control": "no-store" }
  });
}

export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const lang = body?.lang === "en" ? "en" : "ar";
    const day = String(body?.day || "");
    if (!isValidDay(day)) {
      return Response.json({ error: "invalid_day" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    if (day !== riyadhDate()) {
      return Response.json({ error: "puzzle_closed" }, { status: 409, headers: { "Cache-Control": "no-store" } });
    }
    const pair = pickDailyPair(day, lang, lang === "ar" ? AR_WORDS : EN_WORDS);
    const acrossGuess = normalizeAnswer(body?.across, lang);
    const downGuess = normalizeAnswer(body?.down, lang);
    if (acrossGuess.length > MAX_WORD || downGuess.length > MAX_WORD) {
      return Response.json({ error: "invalid_answer" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    const acrossCorrect = acrossGuess === pair.across.answer;
    const downCorrect = downGuess === pair.down.answer;
    return Response.json({
      acrossCorrect,
      downCorrect,
      complete: acrossCorrect && downCorrect,
      message: acrossCorrect && downCorrect
        ? (lang === "ar" ? "أحسنت! اكتملت الكلمات المتقاطعة." : "Excellent! The crossword is complete.")
        : (lang === "ar" ? "اقتربت! راجع الكلمات وحاول مرة أخرى." : "Almost there! Review the clues and try again.")
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (_) {
    return Response.json({ error: "invalid_request" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
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
  const cacheUrl = new URL("/api/crossword?lang=" + lang + "&day=" + day + "&cacheVersion=4", url.origin);
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
    const core = createPuzzle(day, lang);
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

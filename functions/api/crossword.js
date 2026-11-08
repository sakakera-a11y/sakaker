const TIME_ZONE = "Asia/Riyadh";
const SIZE = 4;
const WIDTH = 6;

// Two 3x3 word-crossing blocks fill the upper three rows; a six-letter answer fills row four.
// Every one of the 24 cells belongs to at least one across or down word.
const BANKS = {
  ar: [
    {
      blocks: [
        { top: ["قمر", "جرم سماوي يدور حول الأرض ويضيء ليلًا."], middle: ["ليس", "أداة نفي تدخل على الجملة الاسمية."], bottom: ["مهم", "صفة لما له قيمة أو ضرورة."], left: ["قلم", "أداة للكتابة أو الرسم."], right: ["رسم", "تعبير بصري بالخطوط والأشكال." ] },
        { top: ["بيت", "مسكن يعيش فيه الإنسان."], middle: ["ألم", "وجع يشعر به الإنسان."], bottom: ["بدر", "اكتمال القمر في منتصف الشهر."], left: ["باب", "مدخل يفتح ويغلق."], right: ["تمر", "ثمرة النخيل المعروفة." ] }
      ],
      bottomWord: ["مكتبات", "أماكن تضم الكتب وتتيح القراءة والبحث."], phrase: "النجاح", lesson: "الاستمرار بخطوات صغيرة يصنع فرقًا كبيرًا مع الوقت."
    },
    {
      blocks: [
        { top: ["نور", "ضياء يبدد الظلام."], middle: ["جري", "حركة سريعة على القدمين."], bottom: ["ملح", "مادة بيضاء تضاف إلى الطعام."], left: ["نجم", "جرم سماوي مضيء."], right: ["ريح", "هواء يتحرك من مكان إلى آخر." ] },
        { top: ["ورد", "زهر جميل معروف بألوانه ورائحته."], middle: ["عبر", "اجتاز من جهة إلى أخرى."], bottom: ["دبس", "شراب كثيف حلو يستخرج من التمر أو العنب."], left: ["وعد", "التزام يقطعه المرء على نفسه."], right: ["درس", "موضوع يتعلمه الطالب." ] }
      ],
      bottomWord: ["مهارات", "قدرات يكتسبها الإنسان بالتعلم والتدريب."], phrase: "الطموح", lesson: "التعلّم المستمر يفتح أبوابًا جديدة للفهم والعمل."
    },
    {
      blocks: [
        { top: ["نار", "لهب ينتج حرارة وضوءًا."], middle: ["همم", "عزائم عالية تدفع إلى الإنجاز."], bottom: ["رمل", "حبيبات دقيقة تنتشر في الشواطئ والصحارى."], left: ["نهر", "مجرى مائي طبيعي."], right: ["رمل", "حبيبات دقيقة من الصخور." ] },
        { top: ["بيت", "مكان للسكن والإقامة."], middle: ["ألم", "وجع يشعر به الإنسان."], bottom: ["بدر", "القمر حين يكتمل."], left: ["باب", "مدخل المنزل أو الغرفة."], right: ["تمر", "فاكهة تنمو على النخيل." ] }
      ],
      bottomWord: ["مبادرة", "خطوة يبدأ بها الإنسان عملاً نافعاً."], phrase: "التفوق", lesson: "التخطيط والمثابرة يساعدان على تحويل الهدف إلى إنجاز."
    },
    {
      blocks: [
        { top: ["قمر", "جرم يرافق الأرض في دورانها."], middle: ["ليس", "أداة نفي تدخل على الجملة الاسمية."], bottom: ["مهم", "أمر يستحق العناية."], left: ["قلم", "أداة تدوين الكلمات."], right: ["رسم", "فن تصوير الأشياء بالخطوط." ] },
        { top: ["نور", "ما يكشف الأشياء ويضيء المكان."], middle: ["جري", "حركة سريعة على القدمين."], bottom: ["ملح", "منكّه شائع للطعام."], left: ["نجم", "جسم مضيء في السماء."], right: ["ريح", "نسيم أو هواء متحرك." ] }
      ],
      bottomWord: ["مفاتيح", "أدوات تفتح الأقفال، وتأتي بمعنى وسائل الحل."], phrase: "السلام", lesson: "الكلمة الطيبة والإنصات الصادق يقويان روابط الناس."
    }
  ],
  en: [
    {
      blocks: [
        { top: ["cat", "A small domestic animal that often purrs."], middle: ["are", "A present-tense form of the verb “be”."], bottom: ["run", "To move quickly on foot."], left: ["car", "A road vehicle with an engine."], right: ["ten", "The number after nine." ] },
        { top: ["sun", "The star at the center of our solar system."], middle: ["ego", "A person’s sense of self or identity."], bottom: ["and", "A word used to join words or phrases."], left: ["sea", "A large body of salt water."], right: ["nod", "To move your head up and down." ] }
      ],
      bottomWord: ["GARDEN", "A place where flowers and plants grow."], phrase: "BRIGHT", lesson: "Small, steady steps can lead to meaningful progress."
    },
    {
      blocks: [
        { top: ["map", "A drawing that shows places and roads."], middle: ["are", "A present-tense form of the verb “be”."], bottom: ["nun", "A woman who belongs to a religious order."], left: ["man", "An adult male person."], right: ["pen", "A tool used for writing with ink." ] },
        { top: ["ear", "The body part used for hearing."], middle: ["aha", "An expression used when you understand something."], bottom: ["tot", "A very young child."], left: ["eat", "To take food into the mouth."], right: ["rat", "A small rodent with a long tail." ] }
      ],
      bottomWord: ["PLANET", "A large world that orbits a star."], phrase: "GROWTH", lesson: "Continuous learning helps us understand more and adapt."
    },
    {
      blocks: [
        { top: ["bed", "A piece of furniture used for sleeping."], middle: ["ago", "Before the present time."], bottom: ["tot", "A small child."], left: ["bat", "A flying mammal, or a sports club."], right: ["dot", "A small round mark." ] },
        { top: ["rug", "A small floor covering."], middle: ["any", "One or some, without choosing a particular one."], bottom: ["nun", "A woman in a religious community."], left: ["ran", "Moved quickly on foot; past tense of run."], right: ["gym", "A place for exercise and training." ] }
      ],
      bottomWord: ["SCHOOL", "A place where students learn."], phrase: "CREATE", lesson: "Planning and persistence turn ideas into achievements."
    },
    {
      blocks: [
        { top: ["cat", "A common household pet."], middle: ["are", "A present-tense form of the verb “be”."], bottom: ["run", "To move at a fast pace."], left: ["car", "A motor vehicle."], right: ["ten", "Five plus five." ] },
        { top: ["map", "A guide to locations."], middle: ["are", "A present-tense form of the verb “be”."], bottom: ["nun", "A member of a religious sisterhood."], left: ["man", "An adult human male."], right: ["pen", "An ink writing instrument." ] }
      ],
      bottomWord: ["FRIEND", "A person you know and like."], phrase: "PLANET", lesson: "Kind words and careful listening strengthen communities."
    }
  ]
};

function normalize(value, lang) {
  let text = String(value ?? "").normalize("NFC").toLowerCase();
  if (lang === "ar") {
    text = text.replace(/[\u064B-\u065F\u0670\u0640]/g, "")
      .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي")
      .replace(/ؤ/g, "و").replace(/ئ/g, "ي");
  }
  return Array.from(text.replace(/[^\p{L}]/gu, ""));
}

function riyadhDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

function dayAfter(day) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function hash(value) {
  let result = 2166136261;
  for (let i = 0; i < value.length; i++) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function puzzleFor(day, lang) {
  const bank = BANKS[lang];
  const template = bank[hash(`${lang}:${day}`) % bank.length];
  const entries = [];
  const grid = Array.from({ length: SIZE }, () => Array(WIDTH).fill(null));

  template.blocks.forEach((block, blockIndex) => {
    const offset = blockIndex * 3;
    const definitions = [
      { id: `a${blockIndex + 1}`, direction: "across", row: 0, col: offset, item: block.top },
      { id: `m${blockIndex + 1}`, direction: "across", row: 1, col: offset, item: block.middle },
      { id: `a${blockIndex + 3}`, direction: "across", row: 2, col: offset, item: block.bottom },
      { id: `d${blockIndex + 1}`, direction: "down", row: 0, col: offset, item: block.left },
      { id: `d${blockIndex + 3}`, direction: "down", row: 0, col: offset + 2, item: block.right }
    ];
    for (const definition of definitions) {
      const answer = normalize(definition.item[0], lang);
      if (answer.length !== 3) throw new Error(`Invalid ${lang} crossword word: ${definition.item[0]}`);
      const cells = answer.map((letter, index) => {
        const row = definition.row + (definition.direction === "down" ? index : 0);
        const col = definition.col + (definition.direction === "across" ? index : 0);
        if (grid[row][col] !== null && grid[row][col] !== letter) {
          throw new Error(`Crossing mismatch in ${definition.id}`);
        }
        grid[row][col] = letter;
        return [row, col];
      });
      entries.push({ id: definition.id, direction: definition.direction, clue: definition.item[1], cells, answer });
    }
  });

  // The fourth row is a complete six-letter across answer, so all 24 cells are playable.
  const bottomAnswer = normalize(template.bottomWord?.[0], lang);
  if (bottomAnswer.length !== WIDTH) throw new Error(`Invalid ${lang} bottom-row word: ${template.bottomWord?.[0]}`);
  const bottomCells = bottomAnswer.map((letter, col) => {
    grid[3][col] = letter;
    return [3, col];
  });
  entries.push({ id: "a5", direction: "across", clue: template.bottomWord[1], cells: bottomCells, answer: bottomAnswer });

  // Validate every crossing before returning a puzzle.
  for (const entry of entries) {
    const built = entry.cells.map(([r, c]) => grid[r][c]).join("");
    if (built !== entry.answer.join("")) throw new Error(`Invalid crossword entry ${entry.id}`);
  }
  const phrase = normalize(template.phrase, lang);
  if (phrase.length !== WIDTH) throw new Error(`Final phrase must contain ${WIDTH} letters`);

  return { date: day, language: lang, entries, grid, phrase, lesson: template.lesson, solutionAvailableOn: dayAfter(day) };
}

function publicPuzzle(puzzle, includeSolution) {
  const across = puzzle.entries.filter(entry => entry.direction === "across");
  const down = puzzle.entries.filter(entry => entry.direction === "down");
  const payload = {
    date: puzzle.date,
    language: puzzle.language,
    rows: SIZE,
    columns: WIDTH,
    across: across.map(({ id, clue, cells }) => ({ id, clue, cells, length: cells.length })),
    down: down.map(({ id, clue, cells }) => ({ id, clue, cells, length: cells.length })),
    solutionAvailable: includeSolution,
    solutionAvailableOn: puzzle.solutionAvailableOn
  };
  if (includeSolution) {
    payload.grid = puzzle.grid;
    payload.phrase = puzzle.phrase.join("");
    payload.lesson = puzzle.lesson;
    payload.answers = puzzle.entries.map(({ id, answer }) => ({ id, answer: answer.join("") }));
  }
  return payload;
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "ar";
  const day = url.searchParams.get("day") || riyadhDate();
  if (!validDay(day)) {
    return Response.json({ error: "invalid_day", message: "Use a valid YYYY-MM-DD date." }, {
      status: 400, headers: { "Cache-Control": "no-store" }
    });
  }
  try {
    const today = riyadhDate();
    if (day > today) {
      return Response.json({ error: "future_puzzle" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    const puzzle = puzzleFor(day, lang);
    return Response.json(publicPuzzle(puzzle, day < today), { headers: { "Cache-Control": "no-store" } });
  } catch (_) {
    return Response.json({ error: "crossword_generation_failed" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const lang = body?.lang === "en" ? "en" : "ar";
    const day = String(body?.day || "");
    if (!validDay(day)) {
      return Response.json({ error: "invalid_day" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    if (day !== riyadhDate()) {
      return Response.json({ error: "puzzle_closed" }, { status: 409, headers: { "Cache-Control": "no-store" } });
    }
    const puzzle = puzzleFor(day, lang);
    const submitted = body?.grid;
    if (!Array.isArray(submitted) || submitted.length !== SIZE || submitted.some(row => !Array.isArray(row) || row.length !== WIDTH)) {
      return Response.json({ error: "invalid_grid" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    const checks = puzzle.entries.map(entry => {
      const guess = entry.cells.map(([r, c]) => normalize(submitted[r][c], lang)[0] || "").join("");
      return { id: entry.id, correct: guess === entry.answer.join("") };
    });
    const complete = checks.every(check => check.correct);
    const response = {
      checks,
      complete,
      message: complete
        ? (lang === "ar" ? "أحسنت! اكتملت الكلمات، وظهرت العبارة المخفية." : "Excellent! The crossword is complete and the hidden phrase is revealed.")
        : (lang === "ar" ? "بعض الكلمات صحيحة. راجع التلميحات وحاول مرة أخرى." : "Some words are correct. Review the clues and try again.")
    };
    if (complete) {
      response.phrase = puzzle.phrase.join("");
      response.lesson = puzzle.lesson;
    }
    return Response.json(response, { headers: { "Cache-Control": "no-store" } });
  } catch (_) {
    return Response.json({ error: "invalid_request" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
}
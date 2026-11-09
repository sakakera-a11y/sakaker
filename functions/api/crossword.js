const TIME_ZONE = "Asia/Riyadh";
const SIZE = 6;
const WIDTH = 6;

// Each 3x3 block is a checked word square: its three rows and three columns
// are all valid answers. Two independent blocks form a 6x6 daily puzzle.
const BANKS = {
  ar: [{
    blocks: [
      {
        rows: [
          ["باب", "مدخل يفتح ويغلق."],
          ["أبي", "والدي."],
          ["بيد", "في يد الإنسان أو ممسوك بها."]
        ],
        columns: [
          ["باب", "مدخل المنزل أو الغرفة."],
          ["أبي", "والدي."],
          ["بيد", "تعبير يعني في يد."]
        ]
      },
      {
        rows: [
          ["نور", "ضياء يبدد الظلام."],
          ["ورد", "زهر جميل معروف برائحته."],
          ["ردم", "سدّ حفرة أو غطّاها بالتراب."]
        ],
        columns: [
          ["نور", "ما يضيء المكان."],
          ["ورد", "زهر معروف بألوانه."],
          ["ردم", "غطّى المكان بالتراب."]
        ]
      }
    ],
    phrase: "النجاح", lesson: "الاستمرار بخطوات صغيرة يصنع فرقًا كبيرًا مع الوقت."
  }],
  en: [{
    blocks: [
      {
        rows: [
          ["ape", "A large primate."],
          ["pea", "A small green vegetable."],
          ["ear", "The body part used for hearing."]
        ],
        columns: [
          ["ape", "A large primate."],
          ["pea", "A small green vegetable."],
          ["ear", "The body part used for hearing."]
        ]
      },
      {
        rows: [
          ["tea", "A drink made by steeping leaves."],
          ["ear", "The body part used for hearing."],
          ["art", "Creative work such as painting or sculpture."]
        ],
        columns: [
          ["tea", "A drink made from tea leaves."],
          ["ear", "The body part used for hearing."],
          ["art", "Creative expression."]
        ]
      }
    ],
    phrase: "BRIGHT", lesson: "Small, steady steps can lead to meaningful progress."
  }]
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
    for (let i = 0; i < 3; i++) {
      const rowAnswer = normalize(block.rows[i][0], lang);
      const colAnswer = normalize(block.columns[i][0], lang);
      if (rowAnswer.length !== 3 || colAnswer.length !== 3) {
        throw new Error("Every crossword answer must contain three letters");
      }
      const row = offset + i;
      const rowCells = rowAnswer.map((letter, j) => {
        const r = row, c = offset + j;
        if (grid[r][c] !== null && grid[r][c] !== letter) throw new Error("Across crossing mismatch");
        grid[r][c] = letter;
        return [r, c];
      });
      entries.push({ id: `a${offset + i + 1}`, direction: "across", clue: block.rows[i][1], cells: rowCells, answer: rowAnswer });

      const col = offset + i;
      const colCells = colAnswer.map((letter, j) => {
        const r = offset + j, c = col;
        if (grid[r][c] !== null && grid[r][c] !== letter) throw new Error("Down crossing mismatch");
        grid[r][c] = letter;
        return [r, c];
      });
      entries.push({ id: `d${offset + i + 1}`, direction: "down", clue: block.columns[i][1], cells: colCells, answer: colAnswer });
    }
  });

  for (const entry of entries) {
    const built = entry.cells.map(([r, c]) => grid[r][c]).join("");
    if (built !== entry.answer.join("")) throw new Error(`Invalid crossword entry ${entry.id}`);
  }
  const phrase = normalize(template.phrase, lang);
  if (phrase.length !== WIDTH) throw new Error("Final phrase must contain six letters");
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
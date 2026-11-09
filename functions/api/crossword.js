const TIME_ZONE = "Asia/Riyadh";
const SIZE = 6;
const WIDTH = 6;

// Each 3x3 block is a checked word square. Four independently selected
// blocks form a 6x6 puzzle with 12 across and 12 down clues.
const BANKS = {
  ar: {
    // Valid 3x3 Arabic word squares. Every row is also a valid vertical answer.
    blocks: [
      { rows: [["باب","مدخل يفتح ويغلق."],["أبي","والدي."],["بيد","في يد الإنسان."]], columns: [["باب","مدخل المنزل."],["أبي","والدي."],["بيد","في يد."]] },
      { rows: [["نور","ضياء يبدد الظلام."],["ورد","زهر جميل معروف."],["ردم","سدّ حفرة بالتراب."]], columns: [["نور","ما يضيء المكان."],["ورد","زهر معروف."],["ردم","غطّى المكان بالتراب."]] },
      { rows: [["ليل","وقت الظلام بعد النهار."],["يلي","يأتي بعد غيره."],["ليل","ظلام الليل."]], columns: [["ليل","عكس النهار."],["يلي","يتبع في الترتيب."],["ليل","وقت السكون والظلام."]] },
      { rows: [["دار","منزل يسكنه الإنسان."],["أرى","أشاهد بعيني."],["ريم","اسم عربي يُطلق على الغزال."]], columns: [["دار","بيت أو منزل."],["أرى","أبصر وأشاهد."],["ريم","اسم عربي معروف."]] },
      { rows: [["جمل","حيوان معروف بالصبر."],["ملك","حاكم البلاد."],["لكن","أداة استدراك."]], columns: [["جمل","حيوان الصحراء."],["ملك","صاحب الحكم."],["لكن","تفيد الاستدراك."]] },
      { rows: [["حسن","جمال وبهاء."],["سنا","ضوء ولمعان."],["نار","لهب وحرارة."]], columns: [["حسن","جمال."],["سنا","بريق الضوء."],["نار","مصدر اللهب والحرارة."]] }
    ],
    phrases: ["النجاح","التحدي","التفوق","التعلم","الطموح","التميز"],
    lessons: [
      "الاستمرار بخطوات صغيرة يصنع فرقًا كبيرًا مع الوقت.",
      "التحدي فرصة لاكتشاف القوة التي بداخلك.",
      "التفوق ثمرة الاجتهاد والصبر.",
      "التعلم يفتح أبوابًا جديدة كل يوم.",
      "الطموح يبدأ بفكرة ويكبر بالعمل.",
      "التميز أن تواصل المحاولة بثبات."
    ]
  },
  en: {
    // Four checked English word squares, rotated across the four grid blocks.
    blocks: [
      { rows: [["ape","A large primate."],["pea","A small green vegetable."],["ear","The body part used for hearing."]], columns: [["ape","A large primate."],["pea","A small green vegetable."],["ear","The body part used for hearing."]] },
      { rows: [["tea","A drink made by steeping leaves."],["ear","The body part used for hearing."],["art","Creative work such as painting."]], columns: [["tea","A drink made from tea leaves."],["ear","The body part used for hearing."],["art","Creative expression."]] },
      { rows: [["cat","A common household pet."],["are","A plural form of the verb be."],["ten","One more than nine."]], columns: [["cat","A feline pet."],["are","Plural form of “is”."],["ten","The number after nine."]] },
      { rows: [["dog","A loyal domestic animal."],["owl","A bird that is often active at night."],["gum","Something you chew."]], columns: [["dog","A domestic canine."],["owl","A nocturnal bird."],["gum","Chewing candy."]] },
      { rows: [["new","Not old; recently made."],["eye","The organ used for seeing."],["wet","Covered with water."]], columns: [["new","Recently made."],["eye","Used for sight."],["wet","Not dry."]] },
      { rows: [["top","The highest part."],["one","The number after zero."],["pen","A tool for writing."]], columns: [["top","Highest point."],["one","A single unit."],["pen","An ink writing tool."]] },
      { rows: [["fun","Enjoyment or amusement."],["use","To put something to work."],["net","A mesh used to catch things."]], columns: [["fun","Enjoyment."],["use","Make practical use of."],["net","Mesh for catching."]] },
      { rows: [["row","A line of things."],["one","The number after zero."],["web","A network of connected pages."]], columns: [["row","A line or series."],["one","A single unit."],["web","The World Wide Web."]] },
      { rows: [["car","A road vehicle."],["are","Plural form of the verb be."],["red","The color of a ripe tomato."]], columns: [["car","A motor vehicle."],["are","Plural form of “is”."],["red","A primary color."]] },
      { rows: [["mad","Very angry."],["ape","A large primate."],["den","An animal's lair."]], columns: [["mad","Angry."],["ape","A large primate."],["den","A wild animal's home."]] }
    ],
    phrases: ["BRIGHT","PUZZLE","CREATE","GROWTH","FUTURE","FRIEND","PLANET","DREAMS","KINDLY","LISTEN"],
    lessons: [
      "Small, steady steps can lead to meaningful progress.",
      "A good puzzle rewards patience and careful thought.",
      "Creativity grows when curiosity stays alive.",
      "Growth comes from practice and persistence.",
      "Build the future with the choices you make today.",
      "Friendship grows through kindness and trust.",
      "Our planet deserves care in every small action.",
      "Dreams become goals when you take the first step.",
      "Kindness makes everyday life better.",
      "Listening carefully is the beginning of understanding."
    ]
  }
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

function scheduledPuzzleDay(day) {
  const date = new Date(`${day}T00:00:00.000Z`);
  const weekday = date.getUTCDay();
  const daysSinceRelease = weekday === 0 ? 0 : weekday <= 3 ? weekday : weekday - 4;
  date.setUTCDate(date.getUTCDate() - daysSinceRelease);
  return date.toISOString().slice(0, 10);
}

function previousPuzzleDay(day) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() === 0 ? 3 : 4));
  return date.toISOString().slice(0, 10);
}

function nextPuzzleDay(day) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + (date.getUTCDay() === 0 ? 4 : 3));
  return date.toISOString().slice(0, 10);
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

function releaseIndex(day) {
  // 2026-01-04 was a Sunday release; count each Sunday/Thursday challenge once.
  const anchor = Date.parse("2026-01-04T00:00:00Z");
  const current = Date.parse(`${day}T00:00:00Z`);
  const elapsedDays = Math.floor((current - anchor) / 86400000);
  const weeks = Math.floor(elapsedDays / 7);
  const dayInWeek = elapsedDays % 7;
  return weeks * 2 + (dayInWeek >= 4 ? 1 : 0);
}

function blockOrderForPuzzle(count, puzzleIndex) {
  // Enumerate unique ordered selections of four different word squares.
  const total = count * (count - 1) * (count - 2) * (count - 3);
  let rank = puzzleIndex % total;
  const available = Array.from({ length: count }, (_, index) => index);
  const order = [];
  for (let position = 0; position < 4; position++) {
    let divisor = 1;
    for (let step = 1; step < 4 - position; step++) divisor *= count - position - step;
    const choice = Math.floor(rank / divisor);
    rank %= divisor;
    order.push(available.splice(choice, 1)[0]);
  }
  return order;
}

function puzzleFor(day, lang) {
  const bank = BANKS[lang];
  const puzzleIndex = releaseIndex(day);
  const blockOrder = blockOrderForPuzzle(bank.blocks.length, puzzleIndex);
  const entries = [];
  const grid = Array.from({ length: SIZE }, () => Array(WIDTH).fill(null));

  for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
    const source = bank.blocks[blockOrder[blockIndex]];
    const block = {
      ...source,
      rowOffset: Math.floor(blockIndex / 2) * 3,
      colOffset: (blockIndex % 2) * 3
    };
    const rowOffset = block.rowOffset;
    const colOffset = block.colOffset;
    for (let i = 0; i < 3; i++) {
      const rowAnswer = normalize(block.rows[i][0], lang);
      const colAnswer = normalize(block.columns[i][0], lang);
      if (rowAnswer.length !== 3 || colAnswer.length !== 3) {
        throw new Error("Every crossword answer must contain three letters");
      }
      const row = rowOffset + i;
      const rowCells = rowAnswer.map((letter, j) => {
        const r = row, c = colOffset + j;
        if (grid[r][c] !== null && grid[r][c] !== letter) throw new Error("Across crossing mismatch");
        grid[r][c] = letter;
        return [r, c];
      });
      entries.push({ id: `a${row + 1}_${colOffset + 1}`, direction: "across", clue: block.rows[i][1], cells: rowCells, answer: rowAnswer });

      const col = colOffset + i;
      const colCells = colAnswer.map((letter, j) => {
        const r = rowOffset + j, c = col;
        if (grid[r][c] !== null && grid[r][c] !== letter) throw new Error("Down crossing mismatch");
        grid[r][c] = letter;
        return [r, c];
      });
      entries.push({ id: `d${rowOffset + 1}_${col + 1}`, direction: "down", clue: block.columns[i][1], cells: colCells, answer: colAnswer });
    }
  }

  if (grid.some(row => row.some(cell => cell === null))) throw new Error("Crossword grid contains empty squares");
  for (const entry of entries) {
    const built = entry.cells.map(([r, c]) => grid[r][c]).join("");
    if (built !== entry.answer.join("")) throw new Error(`Invalid crossword entry ${entry.id}`);
  }
  const phrase = normalize(bank.phrases[puzzleIndex % bank.phrases.length], lang);
  if (phrase.length !== WIDTH) throw new Error("Final phrase must contain six letters");
  const lesson = bank.lessons[puzzleIndex % bank.lessons.length];
  return { date: day, language: lang, entries, grid, phrase, lesson, solutionAvailableOn: nextPuzzleDay(day) };
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
    const puzzleDay = scheduledPuzzleDay(day);
    const currentPuzzleDay = scheduledPuzzleDay(today);
    const puzzle = puzzleFor(puzzleDay, lang);
    return Response.json(publicPuzzle(puzzle, puzzleDay < currentPuzzleDay), { headers: { "Cache-Control": "no-store" } });
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
    const currentPuzzleDay = scheduledPuzzleDay(riyadhDate());
    if (day !== currentPuzzleDay) {
      return Response.json({ error: "puzzle_closed" }, { status: 409, headers: { "Cache-Control": "no-store" } });
    }
    const puzzle = puzzleFor(currentPuzzleDay, lang);
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
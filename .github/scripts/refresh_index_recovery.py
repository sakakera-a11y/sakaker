from pathlib import Path
import sys

SOURCE = Path("index.html")
RECOVERY_COPIES = (
    Path("archive/index_safety.html"),
    Path("archive/index_emergency_2026-10-08.html"),
    Path("archive/index_stable_2026-10-31.html"),
)
REQUIRED_MARKERS = (
    "<!DOCTYPE html",
    "<html",
    "</html>",
    "<body",
    "</body>",
    'id="loginOverlay"',
    'id="facebookVideoPopup"',
    'id="shipPopup_new"',
)

if not SOURCE.is_file():
    raise SystemExit("index.html is missing; refusing to replace recovery copies")

source_text = SOURCE.read_text(encoding="utf-8", errors="replace")
missing = [marker for marker in REQUIRED_MARKERS if marker not in source_text]
if missing:
    raise SystemExit("index.html failed structural validation: " + ", ".join(missing))
if source_text.count("<html") != 1 or source_text.count("</html>") != 1:
    raise SystemExit("index.html must contain exactly one html root")

for target in RECOVERY_COPIES:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(source_text, encoding="utf-8")
    print(f"Refreshed recovery baseline from index.html: {target}")

# Retain the unrelated book/PDF checks previously performed by the workflow.
book_page = Path("abwalqmrzmrd-book.html")
if not book_page.is_file():
    raise SystemExit("book page is missing: abwalqmrzmrd-book.html")
book_text = book_page.read_text(encoding="utf-8", errors="replace")
for marker in ("كتاب أبوالقمر زمرد", "روايات وقصص حديثة", "1W5AskSaukXdyo8iLOXm7YyqHznxVqaUf"):
    if marker not in book_text:
        raise SystemExit("missing book-page marker: " + marker)
if "1B-vS6hT8gWeL0NhVLXLUGbdYk1BhdmKv" in book_text:
    raise SystemExit("stale book Drive ID remains in the book page")

for story_file in (Path("ebooks/stories/01-story-bilingual.pdf"), Path("ebooks/stories/11-story-bilingual.pdf")):
    if not story_file.is_file() or story_file.stat().st_size == 0:
        raise SystemExit("required story PDF is missing or empty: " + str(story_file))

print("Current index and emergency recovery copies passed validation")

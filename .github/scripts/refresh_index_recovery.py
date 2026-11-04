from pathlib import Path
import sys

SOURCE = Path("index.html")
RECOVERY_COPIES = (
    Path("archive/index_safety.html"),
    Path("archive/index_emergency_2026-10-08.html"),
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


def read_valid_page(path):
    if not path.is_file():
        return None
    content = path.read_text(encoding="utf-8", errors="replace")
    missing = [marker for marker in REQUIRED_MARKERS if marker not in content]
    if missing or content.count("<html") != 1 or content.count("</html>") != 1:
        return None
    return content


source_text = read_valid_page(SOURCE)
if source_text is None:
    raise SystemExit("index.html failed structural validation; recovery copies were not changed")

for target in RECOVERY_COPIES:
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.is_file() or target.read_text(encoding="utf-8", errors="replace") != source_text:
        target.write_text(source_text, encoding="utf-8")
        print(f"Updated recovery baseline from index.html: {target}")
    else:
        print(f"Recovery baseline already matches index.html: {target}")

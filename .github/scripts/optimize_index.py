from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
text = path.read_text(encoding='utf-8', errors='strict')
low = text.lower()
if '<html' not in low or '</html>' not in low:
    raise SystemExit('index.html is not a complete HTML document')

# Intentionally no global HTML/CSS/JS rewriting here.
# The site contains interactive Firebase/chat/video/game components whose
# behavior and visual layers must remain untouched during Drive sync.
print(path.stat().st_size)

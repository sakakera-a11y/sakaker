from pathlib import Path
import re
import sys

INDEX = Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
STYLE_ID = 'sak-hide-facebook-ship-launchers'
STYLE_HREF = '/assets/hide-facebook-ship-launchers.css?v=20261104-global2'
STYLE_LINK = f'<link id="{STYLE_ID}" rel="stylesheet" href="{STYLE_HREF}">'

if not INDEX.is_file():
    raise SystemExit(f'{INDEX} is missing; refusing to continue')

text = INDEX.read_text(encoding='utf-8')
if '<html' not in text.lower() or '</html>' not in text.lower():
    raise SystemExit(f'{INDEX} is not a complete HTML document')

# Replace any existing reference to the global launcher-hiding stylesheet so
# deployments always fetch the current cache-busted CSS version.
text = re.sub(
    r'\s*<link\b[^>]*(?:id=["\']sak-hide-facebook-ship-launchers["\']|href=["\'][^"\']*assets/hide-facebook-ship-launchers\.css[^"\']*["\'])[^>]*>\s*',
    '\n', text, flags=re.IGNORECASE
)
head_close = re.search(r'</head\s*>', text, re.IGNORECASE)
if not head_close:
    raise SystemExit(f'{INDEX} has no closing head tag')
text = text[:head_close.start()] + '\n' + STYLE_LINK + '\n' + text[head_close.start():]
INDEX.write_text(text, encoding='utf-8')
print(f'Ensured launcher visibility stylesheet is loaded by {INDEX}')

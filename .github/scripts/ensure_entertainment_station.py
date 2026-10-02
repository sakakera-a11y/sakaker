from pathlib import Path
import re
import sys

page = Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
text = page.read_text(encoding='utf-8')

if '<html' not in text.lower() or '</html>' not in text.lower():
    raise SystemExit('Refusing to patch incomplete index.html')

TITLE = 'abwalqmrzmrd castle'
STYLE = '<link id="sak-compact-main-icons" rel="stylesheet" href="/assets/compact-main-icons.css?v=20261002-1">'
LOADER = '<script id="sak-entertainment-runtime-loader" src="/assets/entertainment-station.js?v=20261002-2" defer></script>'

# Replace the old site name anywhere it remains in visible/page metadata text.
legacy_names = [
    r'موسوعة\s*ابوالقمرزمرد\s*\|\s*abwalqmrzmrd\s*enc(?:y|i)lopedia',
    r'موسوعة\s*أبوالقمرزمرد\s*\|\s*abwalqmrzmrd\s*enc(?:y|i)lopedia',
    r'abwalqmrzmrd\s*enc(?:y|i)lopedia',
    r'موسوعة\s*ابوالقمرزمرد',
    r'موسوعة\s*أبوالقمرزمرد',
]
for pattern in legacy_names:
    text = re.sub(pattern, TITLE, text, flags=re.IGNORECASE)

title_re = re.compile(r'<title\b[^>]*>.*?</title>', re.IGNORECASE | re.DOTALL)
if title_re.search(text):
    text = title_re.sub(f'<title>{TITLE}</title>', text, count=1)
else:
    head_open = re.search(r'<head\b[^>]*>', text, re.IGNORECASE)
    if head_open:
        text = text[:head_open.end()] + f'\n<title>{TITLE}</title>' + text[head_open.end():]
    else:
        raise SystemExit('No <head> element found')

# Keep one authoritative compact-icons stylesheet.
text = re.sub(r'\s*<link\b[^>]*(?:id=["\']sak-compact-main-icons["\']|href=["\'][^"\']*assets/compact-main-icons\.css[^"\']*["\'])[^>]*>\s*', '\n', text, flags=re.IGNORECASE)
head_close = re.search(r'</head\s*>', text, re.IGNORECASE)
if not head_close:
    raise SystemExit('No closing </head> found')
text = text[:head_close.start()] + '\n' + STYLE + '\n' + text[head_close.start():]

# Remove any older runtime loader, then add one cache-busted authoritative loader.
text = re.sub(
    r'\s*<script\b[^>]*(?:id=["\']sak-entertainment-runtime-loader["\']|src=["\'][^"\']*assets/entertainment-station\.js[^"\']*["\'])[^>]*>\s*</script>\s*',
    '\n',
    text,
    flags=re.IGNORECASE,
)

body_close = re.search(r'</body\s*>', text, re.IGNORECASE)
if body_close:
    text = text[:body_close.start()] + '\n' + LOADER + '\n' + text[body_close.start():]
else:
    html_close = re.search(r'</html\s*>', text, re.IGNORECASE)
    if not html_close:
        raise SystemExit('No closing </body> or </html> found')
    text = text[:html_close.start()] + '\n' + LOADER + '\n' + text[html_close.start():]

page.write_text(text, encoding='utf-8')

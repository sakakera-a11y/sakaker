from pathlib import Path
import sys

page = Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
asset = Path('.github/assets/responsive-dialog-layer.html')
text = page.read_text(encoding='utf-8')
full = asset.read_text(encoding='utf-8')
first = 'id="sakaker-responsive-dialog-layer"'
second = '<!-- SAKAKER MOBILE DIALOG CORRECTION 2026-09-29 -->'
if '<html' not in text.lower() or '</html>' not in text.lower():
    raise SystemExit('Refusing to patch incomplete index.html')
if first not in text:
    addition = full
elif second not in text:
    addition = full[full.index(second):]
else:
    addition = ''
if addition:
    page.write_text(text.rstrip() + '\n\n' + addition, encoding='utf-8')

from pathlib import Path
import sys

page = Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
asset = Path('.github/assets/responsive-dialog-layer.html')
text = page.read_text(encoding='utf-8')
marker = 'id="sakaker-responsive-dialog-layer"'
if marker not in text:
    if '<html' not in text.lower() or '</html>' not in text.lower():
        raise SystemExit('Refusing to patch incomplete index.html')
    page.write_text(text.rstrip() + '\n\n' + asset.read_text(encoding='utf-8'), encoding='utf-8')

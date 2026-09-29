from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
text = path.read_text(encoding='utf-8')
marker = 'sakaker-text-library-top-layer-fix'
if marker not in text and 'sakTextLibraryModal' in text:
    css = '''
<style id="sakaker-text-library-top-layer-fix">
html body .modal,
html body #folderModal,
html body #quizModal,
html body #puzzleModal {
  position:fixed !important;
  inset:0 !important;
  z-index:2147483646 !important;
  isolation:isolate !important;
}
html body .modal .panel,
html body #folderModal .panel,
html body #quizModal .panel,
html body #puzzleModal .panel {
  position:relative !important;
  z-index:2147483647 !important;
}
html body #sakTextLibraryModal {
  position:fixed !important;
  inset:0 !important;
  z-index:2147483645 !important;
}
</style>
'''
    head_end = text.lower().rfind('</head>')
    if head_end < 0:
        raise SystemExit('Cannot add library layer: missing </head>')
    path.write_text(text[:head_end] + css + text[head_end:], encoding='utf-8')

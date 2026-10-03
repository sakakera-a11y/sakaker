from pathlib import Path
import re

# ---- index.html: load final safe runtime helpers and correct favicon ----
p=Path('index.html')
s=p.read_text(encoding='utf-8')

# Remove older/duplicate injected references so only one final copy remains.
s=re.sub(r'\s*<script[^>]*src=["\'][^"\']*video-modal-fix\.js[^"\']*["\'][^>]*></script>\s*','\n',s,flags=re.I)
s=re.sub(r'\s*<script[^>]*src=["\'][^"\']*final-ui-cleanup\.js[^"\']*["\'][^>]*></script>\s*','\n',s,flags=re.I)

# Replace missing favicon reference, preserving any other icon links.
s=s.replace('href="/favicon.ico"','href="/favicon.svg"').replace("href='/favicon.ico'","href='/favicon.svg'")
s=s.replace('href="favicon.ico"','href="/favicon.svg"').replace("href='favicon.ico'","href='/favicon.svg'")

inject='''\n<script id="sak-video-modal-fix" src="/assets/video-modal-fix.js?v=20261003-video2" defer></script>\n<script id="sak-final-ui-cleanup" src="/assets/final-ui-cleanup.js?v=20261003-polish1" defer></script>\n'''
if '</body>' not in s.lower():
    raise SystemExit('index.html has no closing body tag')
pos=s.lower().rfind('</body>')
s=s[:pos]+inject+s[pos:]
p.write_text(s,encoding='utf-8')

# ---- videos.html: repair malformed emerald library launcher + final video fix ----
p=Path('videos.html')
v=p.read_text(encoding='utf-8')
# Known malformed fragment: closing home button followed by bare id attribute.
v=v.replace('</button>id="emeraldLibraryButton">','</button><div id="emeraldLibraryButton">')
v=v.replace("</button>id='emeraldLibraryButton'>","</button><div id='emeraldLibraryButton'>")
# Generic safety for whitespace between tokens.
v=re.sub(r'(</button>)\s*id=(["\'])emeraldLibraryButton\2>',r'\1<div id="emeraldLibraryButton">',v,count=1,flags=re.I)
# Normalize video fix reference to one current copy.
v=re.sub(r'\s*<script[^>]*src=["\'][^"\']*video-modal-fix\.js[^"\']*["\'][^>]*></script>\s*','\n',v,flags=re.I)
vinject='\n<script id="sak-video-modal-fix" src="/assets/video-modal-fix.js?v=20261003-video2" defer></script>\n'
pos=v.lower().rfind('</body>')
if pos<0: raise SystemExit('videos.html has no closing body tag')
v=v[:pos]+vinject+v[pos:]
p.write_text(v,encoding='utf-8')

# ---- verify only intended final markers ----
idx=Path('index.html').read_text(encoding='utf-8')
vid=Path('videos.html').read_text(encoding='utf-8')
assert idx.count('video-modal-fix.js?v=20261003-video2')==1
assert idx.count('final-ui-cleanup.js?v=20261003-polish1')==1
assert '/favicon.svg' in idx
assert 'video-modal-fix.js?v=20261003-video2' in vid
assert '</button>id="emeraldLibraryButton">' not in vid
assert Path('manifest.json').exists()
assert Path('favicon.svg').exists()
print('Final polish patch verified.')

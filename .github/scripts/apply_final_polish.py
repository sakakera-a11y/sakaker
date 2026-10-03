from pathlib import Path
import re

# ---- index.html: load final safe runtime helpers and correct favicon ----
p=Path('index.html')
s=p.read_text(encoding='utf-8')

# Remove older/duplicate injected references so only one final copy remains.
s=re.sub(r'\s*<script[^>]*src=["\'][^"\']*video-modal-fix\.js[^"\']*["\'][^>]*></script>\s*','\n',s,flags=re.I)
s=re.sub(r'\s*<script[^>]*src=["\'][^"\']*final-ui-cleanup\.js[^"\']*["\'][^>]*></script>\s*','\n',s,flags=re.I)

# Normalize any old favicon reference; if none exists, add the SVG explicitly.
s=re.sub(r'<link([^>]*?)href=["\']/?favicon\.ico["\']([^>]*)>',r'<link\1href="/favicon.svg"\2>',s,flags=re.I)
if '/favicon.svg' not in s:
    headpos=s.lower().find('</head>')
    if headpos<0: raise SystemExit('index.html has no closing head tag')
    s=s[:headpos]+'\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'+s[headpos:]

# Ensure manifest reference exists as well.
if 'manifest.json' not in s:
    headpos=s.lower().find('</head>')
    s=s[:headpos]+'\n<link rel="manifest" href="/manifest.json">\n'+s[headpos:]

inject='''\n<script id="sak-video-modal-fix" src="/assets/video-modal-fix.js?v=20261003-video2" defer></script>\n<script id="sak-final-ui-cleanup" src="/assets/final-ui-cleanup.js?v=20261003-polish1" defer></script>\n'''
if '</body>' not in s.lower():
    raise SystemExit('index.html has no closing body tag')
pos=s.lower().rfind('</body>')
s=s[:pos]+inject+s[pos:]
p.write_text(s,encoding='utf-8')

# ---- videos.html: repair malformed emerald library launcher + final video fix ----
p=Path('videos.html')
v=p.read_text(encoding='utf-8')
v=v.replace('</button>id="emeraldLibraryButton">','</button><div id="emeraldLibraryButton">')
v=v.replace("</button>id='emeraldLibraryButton'>","</button><div id='emeraldLibraryButton'>")
v=re.sub(r'(</button>)\s*id=(["\'])emeraldLibraryButton\2>',r'\1<div id="emeraldLibraryButton">',v,count=1,flags=re.I)
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
assert 'manifest.json' in idx
assert 'video-modal-fix.js?v=20261003-video2' in vid
assert '</button>id="emeraldLibraryButton">' not in vid
assert Path('manifest.json').exists()
assert Path('favicon.svg').exists()
print('Final polish patch verified.')

# retrigger final-polish workflow after workflow file exists on main

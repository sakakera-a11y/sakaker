from pathlib import Path

TAG='<script id="sak-video-modal-fix" src="/assets/video-modal-fix.js?v=20261003-1" defer></script>'

for name in ('index.html','videos.html'):
    p=Path(name)
    s=p.read_text(encoding='utf-8')
    if 'id="sak-video-modal-fix"' in s:
        continue
    if '</body>' in s:
        s=s.replace('</body>', TAG+'\n</body>', 1)
    else:
        s += '\n'+TAG+'\n'
    p.write_text(s,encoding='utf-8')

for name in ('index.html','videos.html'):
    s=Path(name).read_text(encoding='utf-8')
    assert 'id="sak-video-modal-fix"' in s
print('video modal fix installed')

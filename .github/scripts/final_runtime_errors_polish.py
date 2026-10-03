from pathlib import Path

# ---- index.html ----
p=Path('index.html')
s=p.read_text(encoding='utf-8')

# Deleted legacy login video must never be requested again.
for old in ['/sakaker-video%20(2).mp4','sakaker-video%20(2).mp4','/sakaker-video (2).mp4','sakaker-video (2).mp4']:
    s=s.replace(old,'/gemini_video_birds_login.mp4')

# Guard Pong translation calls when the game translator has not been initialized yet.
s=s.replace('translatePongUI();',"if(typeof translatePongUI==='function')translatePongUI();")
p.write_text(s,encoding='utf-8')

# ---- books.html ----
p=Path('books.html')
b=p.read_text(encoding='utf-8')
old="document.getElementById('year').textContent=\nnew Date().getFullYear();"
new="const sakYearEl=document.getElementById('year');\nif(sakYearEl) sakYearEl.textContent=new Date().getFullYear();"
if old in b:
    b=b.replace(old,new,1)
p.write_text(b,encoding='utf-8')

# ---- verification ----
idx=Path('index.html').read_text(encoding='utf-8')
books=Path('books.html').read_text(encoding='utf-8')
assert 'sakaker-video%20(2).mp4' not in idx
assert 'sakaker-video (2).mp4' not in idx
assert "if(typeof translatePongUI==='function')translatePongUI();" in idx
assert "if(sakYearEl) sakYearEl.textContent" in books
assert 'video-modal-fix.js?v=20261003-video2' in idx
assert 'final-ui-cleanup.js?v=20261003-polish1' in idx
print('Runtime error polish verified.')

# retrigger after workflow is present on main

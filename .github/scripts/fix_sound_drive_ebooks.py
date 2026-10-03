from pathlib import Path
import re

# 1) Main site background sound must start muted and only turn on after the user presses the sound button.
p = Path('assets/final-three-icons.js')
s = p.read_text(encoding='utf-8')
s2 = s.replace('let siteSoundUserMuted=false;', 'let siteSoundUserMuted=true;', 1)
if s2 == s:
    raise SystemExit('siteSoundUserMuted marker not found')
p.write_text(s2, encoding='utf-8')

# 2) E-books bridge must call the original shelf renderer which already contains the Google Drive book IDs.
p = Path('assets/main-runtime-locks.js')
s = p.read_text(encoding='utf-8')
start = s.find('function openMainEbooks(){')
end = s.find("window.addEventListener('message'", start)
if start < 0 or end < 0:
    raise SystemExit('openMainEbooks block not found')
new = r'''function openMainEbooks(){
  const lib=document.getElementById(OVERLAY_ID);
  if(lib)lib.classList.remove('show');
  document.body.classList.remove('modal-open');

  /* Use the site's original e-book shelf function. It renders the book cards,
     wires close controls, and opens the Google Drive preview/download URLs. */
  if(typeof window.openSakakerEbooks==='function'){
    try{window.openSakakerEbooks();return true;}catch(_){ }
  }

  return false;
}

'''
s = s[:start] + new + s[end:]
p.write_text(s, encoding='utf-8')

# 3) Cache bust only these two scripts in index.html. Do not touch any backgrounds/design.
p = Path('index.html')
idx = p.read_text(encoding='utf-8')
idx = re.sub(r'(/assets/final-three-icons\.js)(\?v=[^"\']+)?', r'\1?v=20261003-sound2', idx, count=1)
idx = re.sub(r'(/assets/main-runtime-locks\.js\?v=)[^"\']+', r'\g<1>20261003-final6', idx, count=1)
p.write_text(idx, encoding='utf-8')

# verification
final_icons = Path('assets/final-three-icons.js').read_text(encoding='utf-8')
runtime = Path('assets/main-runtime-locks.js').read_text(encoding='utf-8')
index = Path('index.html').read_text(encoding='utf-8')
assert 'let siteSoundUserMuted=true;' in final_icons
assert "typeof window.openSakakerEbooks==='function'" in runtime
assert 'modal.style.setProperty(\'display\',\'flex\'' not in runtime
assert 'final-three-icons.js?v=20261003-sound2' in index
assert 'main-runtime-locks.js?v=20261003-final6' in index
assert '/gemini_generated_video_34118154.mp4' in final_icons
assert '/gemini_video_birds_login.mp4' in runtime
print('Sound default-off and Google Drive e-books bridge ready')

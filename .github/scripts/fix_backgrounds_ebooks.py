from pathlib import Path
import re

# ---------- main runtime ----------
p = Path('assets/main-runtime-locks.js')
s = p.read_text(encoding='utf-8')
s = s.replace("const LIB_URL='/books.html?v=20261003-final3';", "const LIB_URL='/books.html?v=20261003-final4';")

needle = "  const overlay=document.getElementById('loginOverlay');\n  if(!overlay)return;\n"
if 'hidden <video> can continue fetching' not in s and needle in s:
    insert = """  const overlay=document.getElementById('loginOverlay');
  if(!overlay)return;

  /* Remove legacy login video completely. Hiding it is not enough because a
     hidden <video> can continue fetching its old source in the background. */
  const legacyLogin=document.getElementById('sakLoginBackgroundVideo');
  if(legacyLogin){
    try{legacyLogin.pause();}catch(_){}
    legacyLogin.querySelectorAll('source').forEach(n=>n.remove());
    legacyLogin.removeAttribute('src');
    legacyLogin.remove();
  }

  /* Remove the known old duplicate of the main-site background, while keeping
     sakSiteBackgroundVideo which is the current main background. */
  const legacyMain=document.getElementById('sakakerMainVideoBackground');
  if(legacyMain){
    try{legacyMain.pause();}catch(_){}
    legacyMain.querySelectorAll('source').forEach(n=>n.remove());
    legacyMain.removeAttribute('src');
    legacyMain.remove();
  }
"""
    s = s.replace(needle, insert, 1)

if 'function openMainEbooks()' not in s:
    marker = 'function installLibraryBridge(){'
    bridge = r'''function openMainEbooks(){
  const lib=document.getElementById(OVERLAY_ID);
  if(lib)lib.classList.remove('show');
  document.body.classList.remove('modal-open');

  const modal=document.getElementById('sakEbooksShelfModal');
  if(modal){
    modal.classList.add('show','active');
    modal.style.setProperty('display','flex','important');
    modal.style.setProperty('visibility','visible','important');
    modal.style.setProperty('opacity','1','important');
    modal.removeAttribute('aria-hidden');
    document.body.classList.add('sak-ebook-layer-open');
    return true;
  }

  const candidates=[...document.querySelectorAll('button,a,[role="button"],[title],[aria-label]')];
  const launcher=candidates.find(el=>{
    if(el.closest('#'+OVERLAY_ID))return false;
    const meta=((el.id||'')+' '+(el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /كتب\s*إلكترونية|الكتب\s*الالكترونية|E-?Books?/i.test(meta);
  });
  if(launcher){launcher.click();return true;}
  return false;
}

window.addEventListener('message',e=>{
  if(e.origin!==location.origin)return;
  if(e.data&&e.data.type==='sak-open-ebooks')openMainEbooks();
});

'''
    s = s.replace(marker, bridge + marker, 1)

p.write_text(s, encoding='utf-8')

# ---------- text library order ----------
p = Path('assets/text-library-order.js')
t = p.read_text(encoding='utf-8')

if "const EBOOK_ID='sakEbooksLibraryBtn';" not in t:
    t = t.replace("const SHIP_ID='sakShipStoryLibraryBtn';", "const SHIP_ID='sakShipStoryLibraryBtn';\nconst EBOOK_ID='sakEbooksLibraryBtn';")

if 'function ensureEbooksButton()' not in t:
    marker = 'function arrange(){'
    fn = r'''function ensureEbooksButton(){
  const main=document.querySelector('main');
  if(!main)return null;
  let b=document.getElementById(EBOOK_ID);
  if(!b){
    b=document.createElement('button');
    b.id=EBOOK_ID;
    b.type='button';
    b.dataset.sakSection='ebooks';
  }
  const en=document.documentElement.lang==='en';
  b.textContent=en?'📚 E-Books':'📚 الكتب الإلكترونية';
  b.title=en?'Open E-Books':'فتح الكتب الإلكترونية';
  b.setAttribute('aria-label',b.title);
  b.onclick=()=>{
    if(window.parent&&window.parent!==window){
      window.parent.postMessage({type:'sak-open-ebooks'},location.origin);
    }
  };
  return b;
}

'''
    t = t.replace(marker, fn + marker, 1)

old = "  let host=document.getElementById(HOST_ID);\n"
new = "  const ebookBtn=ensureEbooksButton();\n  let host=document.getElementById(HOST_ID);\n"
if old in t and 'const ebookBtn=ensureEbooksButton();' not in t:
    t = t.replace(old, new, 1)

old2 = "  const buttons=[...main.querySelectorAll('button')].filter(b=>b.id!=='back'&&!b.closest('.modal'));\n"
new2 = "  if(ebookBtn&&!ebookBtn.isConnected)host.appendChild(ebookBtn);\n  const buttons=[...main.querySelectorAll('button')].filter(b=>b.id!=='back'&&!b.closest('.modal'));\n"
if old2 in t and 'if(ebookBtn&&!ebookBtn.isConnected)' not in t:
    t = t.replace(old2, new2, 1)

p.write_text(t, encoding='utf-8')

# ---------- cache bust references ----------
p = Path('books.html')
b = p.read_text(encoding='utf-8')
b = re.sub(r'/assets/text-library-order\.js\?v=[^"\']+', '/assets/text-library-order.js?v=20261003-3', b)
p.write_text(b, encoding='utf-8')

p = Path('index.html')
i = p.read_text(encoding='utf-8')
i = re.sub(r'(/assets/main-runtime-locks\.js\?v=)[^"\']+', r'\g<1>20261003-final4', i, count=1)
p.write_text(i, encoding='utf-8')

# ---------- verify ----------
assert 'legacyLogin.remove()' in Path('assets/main-runtime-locks.js').read_text(encoding='utf-8')
assert 'legacyMain.remove()' in Path('assets/main-runtime-locks.js').read_text(encoding='utf-8')
assert 'sak-open-ebooks' in Path('assets/main-runtime-locks.js').read_text(encoding='utf-8')
assert 'ensureEbooksButton' in Path('assets/text-library-order.js').read_text(encoding='utf-8')
assert 'text-library-order.js?v=20261003-3' in Path('books.html').read_text(encoding='utf-8')
assert 'main-runtime-locks.js?v=20261003-final4' in Path('index.html').read_text(encoding='utf-8')
assert Path('gemini_generated_video_34118154.mp4').exists()
assert Path('gemini_video_birds_login.mp4').exists()
print('background and ebooks patch ready')

from pathlib import Path

p=Path('assets/main-runtime-locks.js')
s=p.read_text(encoding='utf-8')
s=s.replace("const LIB_URL='/books.html?v=20261003-final4';", "const LIB_URL='/books.html?v=20261003-final5';")
start=s.find('function openMainEbooks(){')
end=s.find("window.addEventListener('message'", start)
if start<0 or end<0:
    raise SystemExit('openMainEbooks block not found')
new=r'''function closeMainEbooks(){
  ['sakEbooksShelfModal','sakEbookReaderModal'].forEach(id=>{
    const m=document.getElementById(id);
    if(!m)return;
    m.classList.remove('show','active','open');
    m.style.setProperty('display','none','important');
    m.style.setProperty('visibility','hidden','important');
    m.style.setProperty('opacity','0','important');
    m.setAttribute('aria-hidden','true');
  });
  document.body.classList.remove('sak-ebook-layer-open');
}

function findOriginalEbooksLauncher(){
  const candidates=[...document.querySelectorAll('button,a,[role="button"],[title],[aria-label]')];
  return candidates.find(el=>{
    if(el.closest('#'+OVERLAY_ID))return false;
    if(el.closest('#sakEbooksShelfModal,#sakEbookReaderModal'))return false;
    const meta=((el.id||'')+' '+(el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('onclick')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /كتب\s*إلكترونية|الكتب\s*الالكترونية|E-?Books?|ebook|sakebooks/i.test(meta);
  })||null;
}

function openMainEbooks(){
  const lib=document.getElementById(OVERLAY_ID);
  if(lib)lib.classList.remove('show');
  document.body.classList.remove('modal-open');

  /* Use the original launcher first. It is responsible for rendering the
     shelf content and wiring the original close controls. */
  const launcher=findOriginalEbooksLauncher();
  if(launcher){
    try{launcher.click();return true;}catch(_){ }
  }

  /* Fallback only if the original launcher cannot be found. */
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
  return false;
}

function installEbooksCloseSafety(){
  document.addEventListener('click',e=>{
    const m=e.target?.closest?.('#sakEbooksShelfModal,#sakEbookReaderModal');
    if(!m)return;
    const close=e.target.closest?.('.close,[data-close],[data-dismiss],[aria-label],[title],button');
    if(close){
      const meta=((close.getAttribute('aria-label')||'')+' '+(close.getAttribute('title')||'')+' '+(close.textContent||'')).trim();
      if(/إغلاق|اغلاق|close|^×$|^✕$|^✖$/i.test(meta)){
        e.preventDefault();
        closeMainEbooks();
        return;
      }
    }
    if(e.target===m)closeMainEbooks();
  },true);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&(document.getElementById('sakEbooksShelfModal')||document.getElementById('sakEbookReaderModal'))){
      closeMainEbooks();
    }
  });
}

'''
s=s[:start]+new+s[end:]
s=s.replace('function init(){installStableLoginVideo();installLibraryBridge();}', 'function init(){installStableLoginVideo();installLibraryBridge();installEbooksCloseSafety();}')
p.write_text(s,encoding='utf-8')

# Bump runtime URL in index directly.
p=Path('index.html')
idx=p.read_text(encoding='utf-8')
idx=idx.replace('main-runtime-locks.js?v=20261003-final4','main-runtime-locks.js?v=20261003-final5')
p.write_text(idx,encoding='utf-8')
print('E-books modal opening/closing fix applied')

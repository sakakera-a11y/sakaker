(()=>{
'use strict';
const LOGIN_VIDEO='/gemini_video_birds_login.mp4';
const LIB_URL='/books.html?v=20261003-final4';
const OVERLAY_ID='sakStableTextLibraryOverlay';

function installStableLoginVideo(){
  const overlay=document.getElementById('loginOverlay');
  if(!overlay)return;

  const legacyLogin=document.getElementById('sakLoginBackgroundVideo');
  if(!legacyLogin)return;

  /* Remove the known old duplicate of the main-site background, while keeping
     sakSiteBackgroundVideo which is the current main background. */
  const legacyMain=document.getElementById('sakakerMainVideoBackground');
  if(legacyMain){
    try{legacyMain.pause();}catch(_){}
    legacyMain.querySelectorAll('source').forEach(n=>n.remove());
    legacyMain.removeAttribute('src');
    legacyMain.remove();
  }

  let style=document.getElementById('sakStableLoginVideoStyle');
  if(!style){
    style=document.createElement('style');
    style.id='sakStableLoginVideoStyle';
    style.textContent=`
      /* Keep the authored login video and its own sound button. Replacing it
         late in startup caused a black screen whenever the replacement was
         still buffering or a browser cancelled its second media request. */
      #loginOverlay{isolation:isolate!important;background:transparent!important}
    `;
    document.head.appendChild(style);
  }

  const v=legacyLogin;
  if(!v.getAttribute('src'))v.src=LOGIN_VIDEO;
  v.autoplay=true;
  v.loop=true;
  v.playsInline=true;
  v.preload='metadata';

  /* The login background always starts muted. Ordinary clicks/touches on the
     login page must never unmute it. Sound is controlled only by the button. */
  v.muted=true;
  v.defaultMuted=true;
  const playMuted=()=>{
    v.muted=true;
    const p=v.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{});
  };

  if(v.readyState>=2) playMuted();
  else {
    v.addEventListener('loadeddata',playMuted,{once:true});
    v.addEventListener('canplay',playMuted,{once:true});
  }

}

function ensureLibraryOverlay(){
  let o=document.getElementById(OVERLAY_ID);
  if(o)return o;
  const st=document.createElement('style');
  st.id='sakStableTextLibraryStyle';
  st.textContent=`
  #${OVERLAY_ID}{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none;align-items:center!important;justify-content:center!important;padding:10px!important;box-sizing:border-box!important;background:rgba(0,0,0,.82)!important;backdrop-filter:blur(8px)!important}
  #${OVERLAY_ID}.show{display:flex!important}
  #${OVERLAY_ID} .sak-lib-shell{position:relative!important;width:min(1100px,98vw)!important;height:min(94dvh,980px)!important;border:1px solid rgba(70,255,215,.72)!important;border-radius:22px!important;overflow:hidden!important;background:#031218!important;box-shadow:0 0 35px rgba(0,255,210,.25)!important}
  #${OVERLAY_ID} iframe{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#031218!important}
  #${OVERLAY_ID} .sak-lib-close{position:absolute!important;z-index:5!important;left:50%!important;bottom:10px!important;transform:translateX(-50%)!important;width:52px!important;height:52px!important;border-radius:50%!important;border:1px solid #8fffe8!important;background:rgba(2,22,22,.95)!important;color:#fff!important;font-size:27px!important;font-weight:900!important;cursor:pointer!important;box-shadow:0 0 18px rgba(0,255,210,.5)!important}
  @media(max-width:600px){#${OVERLAY_ID}{padding:0!important}#${OVERLAY_ID} .sak-lib-shell{width:100vw!important;height:100dvh!important;border-radius:0!important;border:0!important}}
  `;
  document.head.appendChild(st);
  o=document.createElement('div');
  o.id=OVERLAY_ID;
  o.setAttribute('role','dialog');
  o.setAttribute('aria-modal','true');
  o.innerHTML=`<div class="sak-lib-shell"><iframe title="المكتبة النصية / Text Library" src="${LIB_URL}"></iframe><button class="sak-lib-close" type="button" aria-label="إغلاق">×</button></div>`;
  document.body.appendChild(o);
  const close=()=>{o.classList.remove('show');document.body.classList.remove('modal-open')};
  o.querySelector('.sak-lib-close').addEventListener('click',close);
  o.addEventListener('click',e=>{if(e.target===o)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&o.classList.contains('show'))close()});
  return o;
}

function openLibrary(){
  const old=document.getElementById('sakTextLibraryModal');
  if(old){old.classList.remove('show','active');old.style.setProperty('display','none','important')}
  const o=ensureLibraryOverlay();
  const f=o.querySelector('iframe');
  if(f && !f.src.includes('books.html')) f.src=LIB_URL;
  o.classList.add('show');
  document.body.classList.add('modal-open');
}

function isLibraryLauncher(el){
  const n=el?.closest?.('button,[role="button"],a,.launcher,[title],[aria-label]');
  if(!n||n.closest('#'+OVERLAY_ID)||n.closest('#sakTextLibraryModal'))return false;
  const s=((n.getAttribute('title')||'')+' '+(n.getAttribute('aria-label')||'')+' '+(n.textContent||'')).replace(/\s+/g,' ').trim();
  return /المكتبة\s*النصية|Text\s*Library/i.test(s);
}

function openMainEbooks(){
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

window.addEventListener('message',e=>{
  if(e.origin!==location.origin)return;
  if(e.data&&e.data.type==='sak-open-ebooks')openMainEbooks();
});

function installLibraryBridge(){
  ensureLibraryOverlay();
  document.addEventListener('click',e=>{
    if(!isLibraryLauncher(e.target))return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openLibrary();
  },true);
}

function init(){installStableLoginVideo();installLibraryBridge();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

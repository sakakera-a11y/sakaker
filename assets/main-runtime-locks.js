(()=>{
'use strict';
const LOGIN_VIDEO='/gemini_video_birds_login.mp4';
const LIB_URL='/books.html?v=20261003-final2';
const OVERLAY_ID='sakStableTextLibraryOverlay';

function normalizePath(src){
  try{return new URL(src||'',location.href).pathname}catch(_){return src||''}
}

function lockLoginVideo(){
  const v=document.getElementById('sakLoginBackgroundVideo');
  if(!v||v.dataset.sakLoginLocked==='1')return;
  v.dataset.sakLoginLocked='1';

  const setCorrectSource=(shouldPlay=true)=>{
    const attr=normalizePath(v.getAttribute('src'));
    if(attr!==LOGIN_VIDEO){
      v.setAttribute('src',LOGIN_VIDEO);
    }

    /* Direct src wins over nested <source> elements. Remove them once so
       legacy code cannot keep causing source-selection/reload loops. */
    v.querySelectorAll('source').forEach(s=>s.remove());

    v.loop=true;
    v.playsInline=true;
    v.setAttribute('playsinline','');
    v.preload='auto';

    if(shouldPlay){
      const p=v.play();
      if(p&&typeof p.catch==='function')p.catch(()=>{});
    }
  };

  /* Set the source once. Do not call load(): assigning src already starts
     loading and repeated load() calls were causing the black-screen loop. */
  setCorrectSource(false);

  const start=()=>{
    if(v.readyState>=2){
      const p=v.play();
      if(p&&typeof p.catch==='function')p.catch(()=>{});
    }
  };
  v.addEventListener('loadeddata',start,{once:true});
  v.addEventListener('canplay',start,{once:true});

  /* Watch only real src-attribute changes from legacy scripts. We compare the
     attribute itself, not currentSrc, because currentSrc can temporarily point
     to the previous file while the new one is loading. */
  const mo=new MutationObserver(records=>{
    for(const r of records){
      if(r.type==='attributes'&&r.attributeName==='src'){
        if(normalizePath(v.getAttribute('src'))!==LOGIN_VIDEO){
          v.setAttribute('src',LOGIN_VIDEO);
          v.querySelectorAll('source').forEach(s=>s.remove());
          const p=v.play();
          if(p&&typeof p.catch==='function')p.catch(()=>{});
        }
      }
    }
  });
  mo.observe(v,{attributes:true,attributeFilter:['src']});
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

function init(){lockLoginVideo();installLibraryBridge();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

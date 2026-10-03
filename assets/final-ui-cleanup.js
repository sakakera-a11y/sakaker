(()=>{'use strict';
if(window.__sakakerFinalUiCleanup)return;
window.__sakakerFinalUiCleanup=true;

function textOf(el){return ((el?.textContent||'')+' '+(el?.getAttribute?.('aria-label')||'')+' '+(el?.getAttribute?.('title')||'')).replace(/\s+/g,' ').trim();}

function cleanLoginProviders(){
  const overlay=document.getElementById('loginOverlay');
  if(!overlay)return;
  overlay.querySelectorAll('button,a,[role="button"]').forEach(el=>{
    if(el.id==='googleButton'||el.id==='loginLanguageButton')return;
    const t=textOf(el);
    if(/Microsoft|الدخول\s+بواسطة\s+Microsoft/i.test(t) || /الدخول\s+بواسطة\s+Facebook|Sign\s*in\s*with\s*Facebook|Continue\s*with\s*Facebook/i.test(t)){
      el.style.setProperty('display','none','important');
      el.setAttribute('aria-hidden','true');
      el.tabIndex=-1;
    }
  });
}

function stopAndHide(el){
  if(!el)return;
  try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){}
  try{el.removeAttribute('autoplay');}catch(_){}
  el.style?.setProperty?.('display','none','important');
  el.setAttribute?.('aria-hidden','true');
}

function cleanLegacySeaSound(){
  ['sakSeaSoundButton','sakSeaAudio','bird-sound-btn','sakakerBirdSoundBtn','sakakerBirdAudio'].forEach(id=>stopAndHide(document.getElementById(id)));
  document.querySelectorAll('button,[role="button"],[title],[aria-label]').forEach(el=>{
    if(el.id==='sakSiteSoundBtn'||el.closest('#loginOverlay'))return;
    const t=textOf(el);
    if(/تشغيل\s*صوت\s*البحر|إيقاف\s*صوت\s*البحر|Sea\s*Sound|Ocean\s*Sound/i.test(t))stopAndHide(el);
  });
}

function ensureVideoFix(){
  if(window.__sakVideoModalFixLoaded)return;
  if(document.querySelector('script[src*="video-modal-fix.js"]'))return;
  const s=document.createElement('script');
  s.src='/assets/video-modal-fix.js?v=20261003-video2';
  s.defer=true;
  s.id='sak-video-modal-fix-final-loader';
  document.head.appendChild(s);
}

function run(){cleanLoginProviders();cleanLegacySeaSound();ensureVideoFix();}

// Run immediately at parser completion, then one short retry for legacy late-created controls.
run();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
setTimeout(run,500);
})();

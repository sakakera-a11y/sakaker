(()=>{'use strict';
if(window.__sakakerFinalUiCleanup)return;
window.__sakakerFinalUiCleanup=true;

function textOf(el){return ((el?.textContent||'')+' '+(el?.getAttribute?.('aria-label')||'')+' '+(el?.getAttribute?.('title')||'')).replace(/\s+/g,' ').trim();}

function cleanLoginProviders(){
  const overlay=document.getElementById('loginOverlay');
  if(!overlay)return;
  [...overlay.querySelectorAll('button,a,[role="button"]')].forEach(el=>{
    if(el.id==='googleButton'||el.id==='loginLanguageButton')return;
    const t=textOf(el);
    if(/Microsoft|الدخول\s+بواسطة\s+Microsoft/i.test(t) || /الدخول\s+بواسطة\s+Facebook|Sign\s*in\s*with\s*Facebook|Continue\s*with\s*Facebook/i.test(t)){
      try{el.remove();}catch(_){el.style.display='none';}
    }
  });
}

function stopAndRemove(el){
  if(!el)return;
  try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){}
  try{el.removeAttribute('autoplay');}catch(_){}
  try{el.remove();}catch(_){el.style.display='none';}
}

function cleanLegacySeaSound(){
  ['sakSeaSoundButton','sakSeaAudio','bird-sound-btn','sakakerBirdSoundBtn','sakakerBirdAudio'].forEach(id=>stopAndRemove(document.getElementById(id)));
  [...document.querySelectorAll('button,[role="button"],[title],[aria-label]')].forEach(el=>{
    if(el.id==='sakSiteSoundBtn'||el.closest('#loginOverlay'))return;
    const t=textOf(el);
    if(/تشغيل\s*صوت\s*البحر|إيقاف\s*صوت\s*البحر|Sea\s*Sound|Ocean\s*Sound/i.test(t))stopAndRemove(el);
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
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();

// A few delayed passes catch legacy code that creates old controls after load.
[300,900,1800,3500].forEach(ms=>setTimeout(()=>{cleanLoginProviders();cleanLegacySeaSound();},ms));

const mo=new MutationObserver(()=>{cleanLoginProviders();cleanLegacySeaSound();});
if(document.documentElement)mo.observe(document.documentElement,{childList:true,subtree:true});
})();

(()=>{'use strict';
if(window.__sakakerFinalUiCleanup)return;
window.__sakakerFinalUiCleanup=true;

const LEGACY_SOUND_IDS=['sakSeaAudio','sakSeaSoundButton','sakakerBirdAudio','sakakerBirdSoundBtn','bird-sound-btn'];

function textOf(el){
  return ((el?.textContent||'')+' '+(el?.getAttribute?.('aria-label')||'')+' '+(el?.getAttribute?.('title')||'')).replace(/\s+/g,' ').trim();
}
function stopAndRemove(el){
  if(!el)return;
  if(el.closest?.('#loginOverlay'))return;
  try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){}
  try{el.removeAttribute('autoplay');}catch(_){}
  el.remove();
}
function purgeLegacyIndependentSounds(){
  LEGACY_SOUND_IDS.forEach(id=>stopAndRemove(document.getElementById(id)));
  document.querySelectorAll('audio').forEach(el=>{
    if(el.closest('#loginOverlay'))return;
    const meta=((el.id||'')+' '+(typeof el.className==='string'?el.className:'')+' '+(el.getAttribute('src')||'')).toLowerCase();
    if(/bird|sea|ocean|wave|طيور|بحر/.test(meta))stopAndRemove(el);
  });
}
function keepAuthProvidersVisible(){
  const overlay=document.getElementById('loginOverlay');
  if(!overlay)return;
  ['googleButton','facebookButton','microsoftButton','loginLanguageButton'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.style.removeProperty('display');
    el.style.removeProperty('visibility');
    el.style.removeProperty('opacity');
    el.removeAttribute('aria-hidden');
    if(el.tagName==='BUTTON')el.tabIndex=0;
  });
}
function cleanLegacySeaSound(){
  LEGACY_SOUND_IDS.forEach(id=>stopAndRemove(document.getElementById(id)));
  document.querySelectorAll('button,[role="button"],[title],[aria-label]').forEach(el=>{
    if(el.id==='sakSiteSoundBtn'||el.closest('#loginOverlay'))return;
    const t=textOf(el);
    if(/تشغيل\s*صوت\s*البحر|إيقاف\s*صوت\s*البحر|Sea\s*Sound|Ocean\s*Sound|Bird\s*Sound|صوت\s*الطيور/i.test(t))stopAndRemove(el);
  });
}
function ensureVideoFix(){
  const wanted='20261003-video4';
  if(window.__sakVideoModalFixVersion===wanted)return;
  document.querySelectorAll('script[src*="video-modal-fix.js"]').forEach(s=>{
    if(!String(s.src).includes(wanted))s.remove();
  });
  const s=document.createElement('script');
  s.src='/assets/video-modal-fix.js?v='+wanted;
  s.defer=true;
  s.id='sak-video-modal-fix-final-loader-v4';
  document.head.appendChild(s);
}
function run(){
  purgeLegacyIndependentSounds();
  keepAuthProvidersVisible();
  cleanLegacySeaSound();
  ensureVideoFix();
}
run();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
setTimeout(run,500);
setTimeout(run,1800);
})();

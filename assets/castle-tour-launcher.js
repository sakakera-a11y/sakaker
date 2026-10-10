/* SAKAKER — standalone Castle Tour launcher.
   Intentionally independent of the horizontally scrollable icon dock. */
(()=>{'use strict';
const ID='sakCastleTourBtn', STYLE='sakCastleTourButtonStyle', OVERLAY='sakCastleTourOverlay';
const english=()=>String(document.documentElement.lang||'ar').toLowerCase().startsWith('en');
function installStyle(){
  if(document.getElementById(STYLE))return;
  const style=document.createElement('style');
  style.id=STYLE;
  style.textContent=[
    'body:not(.locked) #sakCastleTourBtn{position:fixed!important;top:auto!important;right:auto!important;left:50%!important;bottom:max(78px,calc(70px + env(safe-area-inset-bottom)))!important;transform:translateX(-50%)!important;display:flex!important;flex-flow:column nowrap!important;align-items:center!important;justify-content:center!important;gap:3px!important;width:74px!important;height:86px!important;min-width:74px!important;min-height:86px!important;margin:0!important;padding:5px 3px!important;box-sizing:border-box!important;border:2px solid #ffe6a2!important;border-radius:23px!important;background:linear-gradient(145deg,rgba(7,80,84,.98),rgba(3,22,43,.98) 53%,rgba(124,81,18,.98))!important;color:#fff5d2!important;-webkit-text-fill-color:#fff5d2!important;box-shadow:0 0 0 2px rgba(0,0,0,.55),0 0 15px rgba(255,210,100,.72),0 0 28px rgba(37,243,210,.4)!important;filter:none!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;cursor:pointer!important;isolation:isolate!important;white-space:normal!important;overflow:visible!important;clip-path:none!important;z-index:2147482550!important;touch-action:manipulation!important;animation:none!important;}',
    '#sakCastleTourBtn::before,#sakCastleTourBtn::after{display:none!important;content:none!important;}',
    '#sakCastleTourBtn .sak-castle-glyph{display:block!important;position:static!important;width:auto!important;height:auto!important;line-height:1!important;font:normal 38px/1 sans-serif!important;transform:none!important;animation:none!important;filter:drop-shadow(0 0 6px #ffe99a)!important;pointer-events:none!important;}',
    '#sakCastleTourBtn .sak-castle-label{display:block!important;position:static!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font:800 10px/1.2 Tahoma,Arial,sans-serif!important;text-align:center!important;text-shadow:0 1px 3px #000,0 0 6px #000!important;white-space:nowrap!important;max-width:100%!important;overflow:visible!important;transform:none!important;pointer-events:none!important;}',
    'body.locked #sakCastleTourBtn,body.sak-ebook-layer-open #sakCastleTourBtn,body.sakaker-fb-popup-open #sakCastleTourBtn{display:none!important;visibility:hidden!important;pointer-events:none!important;}',
    'body:not(.locked) #sakCastleTourBtn:hover,body:not(.locked) #sakCastleTourBtn:focus-visible{outline:2px solid #ffffff!important;outline-offset:2px!important;box-shadow:0 0 0 2px #051923,0 0 24px #ffe083,0 0 34px #44ffe0!important;}',
    '@media(max-width:500px){body:not(.locked) #sakCastleTourBtn{width:66px!important;min-width:66px!important;height:80px!important;min-height:80px!important;right:auto!important;left:50%!important;bottom:max(76px,calc(68px + env(safe-area-inset-bottom)))!important;}#sakCastleTourBtn .sak-castle-glyph{font-size:34px!important;}#sakCastleTourBtn .sak-castle-label{font-size:9px!important;}}',
    '@media(orientation:landscape) and (max-height:510px){body:not(.locked) #sakCastleTourBtn{top:auto!important;bottom:max(62px,calc(56px + env(safe-area-inset-bottom)))!important;height:64px!important;min-height:64px!important;width:63px!important;min-width:63px!important;}#sakCastleTourBtn .sak-castle-glyph{font-size:27px!important;}}',
    '@media(prefers-reduced-motion:reduce){#sakCastleTourBtn{animation:none!important;transition:none!important;}}'
  ].join('\n');
  document.head.appendChild(style);
}
function sanitizeName(name){
  return String(name||'').replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,70);
}
function openTour(){
  if(document.body?.classList.contains('locked')||document.getElementById(OVERLAY))return;
  const previousFocus=document.activeElement;
  const previousHtmlOverflow=document.documentElement.style.overflow;
  const previousBodyOverflow=document.body.style.overflow;
  const mainVideo=document.getElementById('sakSiteBackgroundVideo');
  const mainWasPlaying=!!mainVideo&&!mainVideo.paused;
  if(mainWasPlaying)mainVideo.pause();
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';
  const host=document.createElement('section');
  host.id=OVERLAY;
  host.setAttribute('role','dialog');
  host.setAttribute('aria-modal','true');
  host.setAttribute('aria-label',english()?'Castle Tour':'جولة القلعة');
  host.style.cssText='position:fixed!important;inset:0!important;display:block!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;z-index:2147483646!important;background:#06151c!important;overflow:hidden!important;';
  const frame=document.createElement('iframe');
  frame.src='/castle-tour.html?v=20261010-museum2';
  frame.title='جولة القلعة / Castle Tour';
  frame.allow='autoplay';
  frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#06151c;';
  host.appendChild(frame);
  document.body.appendChild(host);
  let finished=false;
  const sendGreeting=()=>{
    if(finished||!frame.contentWindow)return;
    const user=window.firebaseAuth?.currentUser;
    const name=sanitizeName(user?.displayName||user?.providerData?.find(p=>p?.displayName)?.displayName||'');
    frame.contentWindow.postMessage({type:'sak-castle-greeting',name,lang:english()?'en':'ar'},location.origin);
  };
  const close=()=>{
    if(finished)return;
    finished=true;
    window.removeEventListener('message',onMessage);
    document.removeEventListener('keydown',onKey);
    host.remove();
    document.documentElement.style.overflow=previousHtmlOverflow;
    document.body.style.overflow=previousBodyOverflow;
    if(mainWasPlaying&&mainVideo&&!document.body.classList.contains('locked'))mainVideo.play().catch(()=>{});
    if(previousFocus?.isConnected&&typeof previousFocus.focus==='function')previousFocus.focus();
  };
  const onMessage=e=>{
    if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data)return;
    if(e.data.type==='sak-castle-ready')sendGreeting();
    if(e.data.type==='sak-castle-close')close();

    if(e.data.type==='sak-castle-open-section'){
      const key=String(e.data.section||'');
      const selectors={
        books:'#sakTextLibraryButton,#sakTextLibraryBtn',
        videos:'#emeraldLibraryButton',
        live:'#liveFlasher',
        games:'#sakEntertainmentStationBtn,#pongGame-btn',
        creative:'#sakCreativeIcon',
        maps:'#mapIcon,.launcher[data-map]',
        visitors:'#visitorPostsCard',
        shopping:'#sakShoppingIcon'
      };
      const route={books:'/books.html',videos:'/videos.html',live:'/live.html',games:'/pong.html',creative:'/draw.html'};
      if(!['books','videos','live','games','creative','maps','visitors','shopping','stories'].includes(key))return;
      let target=selectors[key]?document.querySelector(selectors[key]):null;
      if(!target){
        const phrases={books:/المكتبة النصية|Text Library/i,stories:/خواطر|قصص|Stories/i,maps:/الخرائط|Maps/i,visitors:/مشاركات الزوار|Visitor Posts/i,shopping:/التسوق والعروض|Shopping/i};
        if(phrases[key])target=[...document.querySelectorAll('button,a,.icon-card,[role="button"]')].find(el=>!el.closest('#sakCastleTourOverlay')&&phrases[key].test((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')));
      }
      if(target){close();setTimeout(()=>target.isConnected?target.click():route[key]&&location.assign(route[key]),110)}
      else if(route[key]){close();location.assign(route[key])}
      else frame.contentWindow.postMessage({type:'sak-castle-open-error'},location.origin);
    }
  };
  const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close();}};
  window.addEventListener('message',onMessage);
  document.addEventListener('keydown',onKey);
  frame.addEventListener('load',sendGreeting,{once:true});
  frame.focus();
}
function ensure(){
  if(!document.body)return;
  installStyle();
  let button=document.getElementById(ID);
  if(!button){
    button=document.createElement('button');
    button.id=ID;
    button.type='button';
  }
  // Remove dock styles and detach from overflowing horizontal containers.
  button.classList.remove('sak-ostrich-icon','sakaker-dock-entry','sak-cycle-hidden');
  if(button.parentElement!==document.body)document.body.appendChild(button);
  if(!button.querySelector('.sak-castle-glyph')){
    const glyph=document.createElement('span');
    glyph.className='sak-castle-glyph';
    glyph.textContent='🏰';
    const title=document.createElement('span');
    title.className='sak-castle-label';
    button.replaceChildren(glyph,title);
  }
  const title=english()?'Castle Tour':'جولة القلعة';
  button.querySelector('.sak-castle-label').textContent=title;
  button.title=title;
  button.setAttribute('aria-label',title);
  if(button.dataset.sakCastleBound!=='1'){
    button.addEventListener('click',openTour);
    button.dataset.sakCastleBound='1';
  }
}
function init(){
  ensure();
  new MutationObserver(ensure).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if(document.body){
    new MutationObserver(ensure).observe(document.body,{attributes:true,attributeFilter:['class'],childList:true});
  }
  window.addEventListener('pageshow',ensure);
  setTimeout(ensure,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
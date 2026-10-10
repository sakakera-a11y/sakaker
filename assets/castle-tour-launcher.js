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
    'html body #sakakerAllIconsDock #sakCastleTourBtn{position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;translate:none!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important;}',
    'html body #sakakerAllIconsDock [data-sakaker-util="castleTour"]{display:block!important;visibility:visible!important;opacity:1!important;}',
    'html body #sakakerAllIconsDock #sakCastleTourBtn .sak-ostrich-art{filter:drop-shadow(0 0 5px #ffeeb2) drop-shadow(0 0 12px #ffc42b)!important;}',
    'body.locked #sakCastleTourBtn,body.sak-ebook-layer-open #sakCastleTourBtn,body.sakaker-fb-popup-open #sakCastleTourBtn{visibility:hidden!important;pointer-events:none!important;}',
    '#sakCastleTourBtn:focus-visible{outline:2px solid #ffe68a!important;outline-offset:3px!important;}',
    '@media(prefers-reduced-motion:reduce){#sakCastleTourBtn .sak-ostrich-art{animation:none!important;}}'
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
  host.style.cssText='position:fixed!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:clamp(6px,2vw,22px)!important;margin:0!important;z-index:2147483646!important;background:rgba(1,10,18,.83)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;overflow:hidden!important;';
  const frame=document.createElement('iframe');
  frame.src='/castle-tour.html?v=20261010-gull1';
  frame.title='جولة القلعة / Castle Tour';
  frame.allow='autoplay';
  frame.style.cssText='display:block;flex:0 1 auto;width:min(1120px,100%)!important;height:min(92dvh,880px)!important;max-height:calc(100dvh - 12px)!important;min-height:0!important;border:2px solid rgba(255,223,147,.78)!important;border-radius:clamp(14px,2.5vw,24px)!important;background:#06151c!important;box-shadow:0 24px 85px #000d,0 0 26px rgba(65,222,204,.22)!important;overflow:hidden!important;';
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
  host.addEventListener('click',e=>{if(e.target===host)close()});
  frame.focus();
}
function buildGull(){
  const ns='http://www.w3.org/2000/svg';
  const el=(tag,attrs={})=>{const x=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))x.setAttribute(k,v);return x};
  const svg=el('svg',{class:'sak-ostrich-svg',viewBox:'0 0 120 112','aria-hidden':'true',focusable:'false'});
  const defs=el('defs'),g=el('linearGradient',{id:'sakCastleYellowGull',x1:'0',y1:'0',x2:'0',y2:'1'});
  [['0%','#fff9c4'],['46%','#ffe629'],['100%','#f6a700']].forEach(([offset,color])=>g.appendChild(el('stop',{offset,'stop-color':color})));
  defs.appendChild(g);svg.appendChild(defs);
  const wing={fill:'url(#sakCastleYellowGull)',stroke:'#fff3ac','stroke-width':'2.2','stroke-linejoin':'round'};
  svg.appendChild(el('path',{d:'M60 53 C39 27 19 17 3 29 C23 28 35 39 47 58 C30 49 15 56 9 69 C33 60 45 69 57 75 Z',...wing}));
  svg.appendChild(el('path',{d:'M60 53 C81 27 101 17 117 29 C97 28 85 39 73 58 C90 49 105 56 111 69 C87 60 75 69 63 75 Z',...wing}));
  svg.appendChild(el('path',{d:'M52 54 Q60 43 68 54 Q71 69 63 92 L60 102 L57 92 Q49 69 52 54Z',...wing}));
  svg.appendChild(el('circle',{cx:'60',cy:'49',r:'7',fill:'#fff4b5',stroke:'#ffc82c','stroke-width':'2'}));
  svg.appendChild(el('path',{d:'M60 50 L66 59 L60 64 L54 59Z',fill:'#ffc027'}));
  svg.appendChild(el('circle',{cx:'57',cy:'48',r:'1.1',fill:'#3b320e'}));
  return svg;
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
  button.classList.add('sak-ostrich-icon','sakaker-dock-entry');
  button.classList.remove('sak-cycle-hidden');
  button.dataset.sakakerDockKey='castleTour';
  let art=button.querySelector(':scope > .sak-ostrich-art');
  if(!art){
    art=document.createElement('span');
    art.className='sak-ostrich-art';
    button.prepend(art);
  }
  if(!art.querySelector('svg'))art.replaceChildren(buildGull());
  let label=button.querySelector(':scope > .sak-ostrich-name');
  if(!label){
    label=document.createElement('span');
    label.className='sak-ostrich-name';
    button.appendChild(label);
  }
  const title=english()?'Castle Tour':'جولة القلعة';
  if(label.textContent!==title)label.textContent=title;
  if(button.title!==title)button.title=title;
  if(button.getAttribute('aria-label')!==title)button.setAttribute('aria-label',title);
  if(button.dataset.sakCastleBound!=='1'){
    button.addEventListener('click',openTour);
    button.dataset.sakCastleBound='1';
  }
  const dock=document.getElementById('sakakerAllIconsDock');
  if(dock&&!document.body.classList.contains('locked')){
    let utility=dock.querySelector('#sakakerUtilityDock');
    if(!utility){
      utility=document.createElement('nav');
      utility.id='sakakerUtilityDock';
      utility.setAttribute('aria-label','أدوات وخدمات الموقع');
      dock.appendChild(utility);
    }
    let slot=utility.querySelector('[data-sakaker-util="castleTour"]');
    if(!slot){
      slot=document.createElement('div');
      slot.className='sakaker-utility-slot';
      slot.dataset.sakakerUtil='castleTour';
    }
    const textSlot=utility.querySelector('[data-sakaker-util="textLibrary"]');
    if(textSlot){
      if(slot.previousElementSibling!==textSlot)textSlot.after(slot);
    }else if(slot.parentElement!==utility){
      utility.prepend(slot);
    }
    if(button.parentElement!==slot)slot.appendChild(button);
  }else if(button.parentElement!==document.body){
    document.body.appendChild(button);
  }
}
function init(){
  ensure();
  new MutationObserver(ensure).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if(document.body){
    new MutationObserver(ensure).observe(document.body,{attributes:true,attributeFilter:['class'],childList:true});
  }
  window.addEventListener('pageshow',ensure);
  [600,1300,2500,5000].forEach(ms=>setTimeout(ensure,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
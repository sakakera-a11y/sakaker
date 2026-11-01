(()=>{
'use strict';
const BUSINESS_URL='https://business.sakaker.co/';
const LAUNCHER_ID='sakYachtPaymentLauncher';
const IMAGE_ID='sakYachtPaymentImage';

function installStyle(){
  if(document.getElementById('sakYachtPaymentStyle')) return;
  const st=document.createElement('style');
  st.id='sakYachtPaymentStyle';
  st.textContent=`
  #shipIcon_new,#sakakerBusinessAd,#sakakerBusinessIcon,
  .sakaker-utility-slot[data-sakaker-util="ship"],
  .sakaker-utility-slot[data-sakaker-util="business"],
  #sakakerAllIconsDock .sak-hide-legacy-ship{
    display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
  }
  #${LAUNCHER_ID}{
    position:fixed!important;inset:auto!important;
    width:82px!important;height:58px!important;min-width:82px!important;min-height:58px!important;
    max-width:82px!important;max-height:58px!important;margin:0!important;padding:0!important;
    display:grid!important;place-items:center!important;
    visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    border:0!important;border-radius:0!important;background:transparent!important;
    background-image:none!important;box-shadow:none!important;backdrop-filter:none!important;
    overflow:visible!important;z-index:2147483005!important;cursor:pointer!important;
    touch-action:manipulation!important;box-sizing:border-box!important;
  }
  #${LAUNCHER_ID} svg{display:block!important;width:100%!important;height:100%!important;overflow:visible!important;background:transparent!important;filter:drop-shadow(0 2px 3px rgba(0,0,0,.75)) drop-shadow(0 0 5px rgba(255,213,105,.6))!important;pointer-events:none!important}
  #${LAUNCHER_ID}::after{
    content:'abwalqmrzmrd'!important;position:absolute!important;left:50%!important;bottom:-9px!important;
    transform:translateX(-50%)!important;color:#ffe56b!important;-webkit-text-fill-color:#ffe56b!important;
    font:700 7px/1 Tajawal,Arial,sans-serif!important;white-space:nowrap!important;
    text-shadow:0 1px 2px #000,0 0 5px #000!important;pointer-events:none!important;
  }
  @media(max-width:600px){
    #${LAUNCHER_ID}{width:76px!important;height:52px!important;min-width:76px!important;min-height:52px!important;max-width:76px!important;max-height:52px!important}
    #${LAUNCHER_ID}::after{font-size:6px!important;bottom:-8px!important}
  }`;
  document.head.appendChild(st);
}
function visibleRect(el){
  if(!el) return null;
  const cs=getComputedStyle(el);
  if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0) return null;
  const r=el.getBoundingClientRect();
  return r.width>0&&r.height>0?r:null;
}

function meta(el){
  return [el.id,el.className,el.getAttribute('aria-label'),el.title,el.textContent].filter(Boolean).join(' ');
}

function removeDuplicateBusinessStar(){
  document.querySelectorAll('#sakakerBusinessAd,#sakakerBusinessIcon,.sakaker-utility-slot[data-sakaker-util="business"]').forEach(el=>{
    if(el && el.id!==LAUNCHER_ID) el.remove();
  });
}

function hideReturnedLegacyShip(){
  const dock=document.getElementById('sakakerAllIconsDock');
  if(!dock) return;
  dock.querySelectorAll('button,a,[role="button"],.icon-card,.launcher,.sakaker-utility-slot').forEach(el=>{
    if(el.id===LAUNCHER_ID) return;
    if(/(^|\s)(السفينة|سفينة|ship)(\s|$)/i.test(meta(el))) el.classList.add('sak-hide-legacy-ship');
  });
  dock.querySelector('.sakaker-utility-slot[data-sakaker-util="ship"]')?.classList.add('sak-hide-legacy-ship');
}

function ensureLauncher(){
  let btn=document.getElementById(LAUNCHER_ID);
  if(!btn){
    btn=document.createElement('button');
    btn.id=LAUNCHER_ID;btn.type='button';
    btn.addEventListener('click',()=>{window.location.href=BUSINESS_URL;});
    document.body.appendChild(btn);
  }
  // Remove the old Facebook-blue circular PNG and use a clean, transparent ocean-liner emblem.
  btn.querySelectorAll('img').forEach(img=>img.remove());
  if(!btn.querySelector('svg.sak-titanic-liner')){
    btn.innerHTML='<svg class="sak-titanic-liner" viewBox="0 0 180 110" role="img" aria-label="Luxury ocean liner"><defs><linearGradient id="sakYachtHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#31495d"/><stop offset=".6" stop-color="#0b1b2a"/><stop offset="1" stop-color="#02080e"/></linearGradient><linearGradient id="sakYachtDeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf0"/><stop offset="1" stop-color="#c5b58f"/></linearGradient></defs><g stroke-linejoin="round"><path d="M8 65H171L153 88Q145 96 123 97H48Q22 93 8 65Z" fill="url(#sakYachtHull)" stroke="#e7c36f" stroke-width="2.5"/><path d="M15 67Q88 74 165 67" fill="none" stroke="#fff0b3" stroke-width="1.5"/><path d="M24 61L37 43H140L158 64Z" fill="url(#sakYachtDeck)" stroke="#d6b15e" stroke-width="1.6"/><path d="M39 43L49 33H132L142 43Z" fill="#fff8e8" stroke="#c49a4d"/><path d="M53 33L61 25H119L130 33Z" fill="#fff9e9" stroke="#c49a4d"/><path d="M42 41V28M137 42V29" stroke="#b28d4e" stroke-width="1.3"/><g fill="#bd7e39" stroke="#f5d98f" stroke-width="1.3"><path d="M53 27V12H65V27Z"/><path d="M76 25V9H88V25Z"/><path d="M99 25V9H111V25Z"/><path d="M122 27V12H134V27Z"/></g><g fill="#172638"><path d="M51 11H67V15H51Z"/><path d="M74 8H90V12H74Z"/><path d="M97 8H113V12H97Z"/><path d="M120 11H136V15H120Z"/></g><path d="M19 61H151M32 43H145" stroke="#927545" stroke-width="1"/><g fill="#f4dc9d" stroke="#9d783b" stroke-width=".5">'+Array.from({length:15},(_,i)=>'<circle cx="'+(31+i*8)+'" cy="81" r="1.8"/>').join('')+'</g><path d="M11 100Q42 94 73 100T135 100T171 100" fill="none" stroke="#e5c16b" stroke-width="2" stroke-linecap="round"/><path d="M30 106Q61 101 91 106T151 106" fill="none" stroke="#8ed8d2" stroke-width="1.4" stroke-linecap="round"/></g></svg>';
  }
  const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
  btn.setAttribute('aria-label',en?'Open Sakaker Business':'فتح موقع Sakaker Business');
  btn.title=en?'Open Sakaker Business':'فتح موقع Sakaker Business';
  return btn;
}
function placeAbovePayment(){
  const btn=document.getElementById(LAUNCHER_ID);
  const payment=document.getElementById('sakGlobalPayment');
  if(!btn) return;
  const pr=visibleRect(payment);
  if(!pr){
    btn.style.setProperty('visibility','hidden','important');
    btn.style.setProperty('pointer-events','none','important');
    return;
  }
  const w=btn.offsetWidth||54, h=btn.offsetHeight||54;
  let left=pr.left+(pr.width-w)/2;
  let top=pr.top-h-8;
  left=Math.max(8,Math.min(innerWidth-w-8,left));
  top=Math.max(8,Math.min(innerHeight-h-8,top));
  btn.style.setProperty('left',Math.round(left)+'px','important');
  btn.style.setProperty('top',Math.round(top)+'px','important');
  btn.style.setProperty('visibility','visible','important');
  btn.style.setProperty('pointer-events','auto','important');
}

function run(){
  installStyle();
  removeDuplicateBusinessStar();
  hideReturnedLegacyShip();
  ensureLauncher();
  placeAbovePayment();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
window.addEventListener('resize',placeAbovePayment,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(placeAbovePayment,180),{passive:true});
[250,700,1500,3000].forEach(ms=>setTimeout(run,ms));
new MutationObserver(()=>{hideReturnedLegacyShip();removeDuplicateBusinessStar();placeAbovePayment();}).observe(document.documentElement,{childList:true,subtree:true});
})();

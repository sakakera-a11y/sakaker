(()=>{
'use strict';
const IMG='/file_00000000e530821086e1b6135c3db20e.png';
const LAUNCHER_ID='sakYachtPaymentLauncher';
const IMAGE_ID='sakYachtPaymentImage';

function installStyle(){
  if(document.getElementById('sakYachtPaymentStyle')) return;
  const st=document.createElement('style');
  st.id='sakYachtPaymentStyle';
  st.textContent=`
  #shipIcon_new,
  .sakaker-utility-slot[data-sakaker-util="ship"]{
    display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
  }
  #sakakerAllIconsDock .sak-hide-legacy-ship{
    display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
  }
  #${LAUNCHER_ID}{
    position:fixed!important;inset:auto!important;
    width:62px!important;height:62px!important;min-width:62px!important;min-height:62px!important;max-width:62px!important;max-height:62px!important;
    margin:0!important;padding:2px!important;
    display:block!important;visibility:hidden!important;opacity:1!important;pointer-events:none!important;
    border-radius:50%!important;border:1.5px solid rgba(255,226,105,.98)!important;
    background:radial-gradient(circle at 50% 45%,rgba(255,245,185,.18),rgba(5,20,25,.56) 58%,rgba(0,0,0,.80))!important;
    box-shadow:0 0 7px rgba(255,255,220,.9),0 0 15px rgba(255,218,70,.82),0 0 24px rgba(0,255,220,.38)!important;
    overflow:visible!important;z-index:2147483005!important;cursor:pointer!important;touch-action:manipulation!important;
    box-sizing:border-box!important;
  }
  #${IMAGE_ID}{
    display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;
    object-fit:cover!important;object-position:center!important;border-radius:50%!important;
    filter:brightness(1.14) saturate(1.12) drop-shadow(0 0 3px rgba(255,232,120,.72))!important;
    pointer-events:none!important;background:#071315!important;
  }
  #${LAUNCHER_ID}::after{
    content:'abwalqmrzmrd'!important;position:absolute!important;left:50%!important;bottom:-13px!important;transform:translateX(-50%)!important;
    color:#ffe56b!important;-webkit-text-fill-color:#ffe56b!important;font:700 7px/1 Tajawal,Arial,sans-serif!important;white-space:nowrap!important;
    text-shadow:0 1px 2px #000,0 0 5px #000,0 0 7px rgba(255,199,45,.85)!important;pointer-events:none!important;
  }
  @media(max-width:600px){
    #${LAUNCHER_ID}{width:54px!important;height:54px!important;min-width:54px!important;min-height:54px!important;max-width:54px!important;max-height:54px!important}
    #${LAUNCHER_ID}::after{font-size:6px!important;bottom:-11px!important}
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

function hideReturnedLegacyShip(){
  const dock=document.getElementById('sakakerAllIconsDock');
  if(!dock) return;
  dock.querySelectorAll('button,a,[role="button"],.icon-card,.launcher,.sakaker-utility-slot').forEach(el=>{
    if(el.id===LAUNCHER_ID || el.id==='sakakerBusinessAd' || el.id==='sakakerBusinessIcon') return;
    if(/(^|\s)(السفينة|سفينة|ship)(\s|$)/i.test(meta(el))) el.classList.add('sak-hide-legacy-ship');
  });
  dock.querySelector('.sakaker-utility-slot[data-sakaker-util="ship"]')?.classList.add('sak-hide-legacy-ship');
}

function findTextLibraryLauncher(){
  const direct=document.querySelector('[data-open="sakTextLibraryModal"],#sakTextLibraryBtn,#openTextLibrary');
  if(direct) return direct;
  return [...document.querySelectorAll('button,a,[role="button"]')].find(el=>/المكتبة النصية|text library/i.test(meta(el)))||null;
}

function ensureLauncher(){
  let btn=document.getElementById(LAUNCHER_ID);
  if(!btn){
    btn=document.createElement('button');
    btn.id=LAUNCHER_ID;
    btn.type='button';
    btn.addEventListener('click',()=>{
      const lib=findTextLibraryLauncher();
      if(lib){ lib.click(); return; }
      location.href='/books.html';
    });
    document.body.appendChild(btn);
  }
  let img=btn.querySelector('#'+IMAGE_ID);
  if(!img){
    img=document.createElement('img');
    img.id=IMAGE_ID;
    img.alt='';
    img.setAttribute('aria-hidden','true');
    btn.prepend(img);
  }
  if(img.getAttribute('src')!==IMG) img.src=IMG;
  const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
  btn.setAttribute('aria-label',en?'Abwalqmrzmrd yacht – text library':'يخت أبوالقمر زمرد — المكتبة النصية');
  btn.title=en?'Abwalqmrzmrd yacht – text library':'يخت أبوالقمر زمرد — المكتبة النصية';
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
  btn.style.setProperty('right','auto','important');
  btn.style.setProperty('bottom','auto','important');
  btn.style.setProperty('visibility','visible','important');
  btn.style.setProperty('pointer-events','auto','important');
}

let raf=0;
function apply(){
  installStyle();
  ensureLauncher();
  hideReturnedLegacyShip();
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(placeAbovePayment);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
window.addEventListener('load',apply,{once:true});
window.addEventListener('resize',()=>requestAnimationFrame(placeAbovePayment),{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(placeAbovePayment,120),{passive:true});
new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
new MutationObserver(()=>{hideReturnedLegacyShip();requestAnimationFrame(placeAbovePayment);}).observe(document.body,{childList:true,subtree:true});
[500,1600,3800,7200].forEach(ms=>setTimeout(apply,ms));
})();

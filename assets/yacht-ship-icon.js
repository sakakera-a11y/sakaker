(()=>{
'use strict';
const IMG='/file_00000000e530821086e1b6135c3db20e.png';
const LAUNCHER_ID='sakYachtPaymentLauncher';

function installStyle(){
  if(document.getElementById('sakYachtPaymentStyle')) return;
  const st=document.createElement('style');
  st.id='sakYachtPaymentStyle';
  st.textContent=`
  #shipIcon_new,
  .sakaker-utility-slot[data-sakaker-util="ship"]{
    display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
  }
  #sakakerAllIconsDock .sak-hide-legacy-icon{
    display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
  }
  #${LAUNCHER_ID}{
    position:fixed!important;inset:auto!important;
    width:62px!important;height:62px!important;min-width:62px!important;min-height:62px!important;max-width:62px!important;max-height:62px!important;
    margin:0!important;padding:0!important;
    display:block!important;visibility:hidden!important;opacity:1!important;pointer-events:none!important;
    border-radius:50%!important;border:1.5px solid rgba(255,226,105,.98)!important;
    background:radial-gradient(circle at 50% 45%,rgba(255,245,185,.18),rgba(5,20,25,.56) 58%,rgba(0,0,0,.80))!important;
    box-shadow:0 0 7px rgba(255,255,220,.9),0 0 15px rgba(255,218,70,.82),0 0 24px rgba(0,255,220,.38)!important;
    overflow:visible!important;z-index:2147483005!important;cursor:pointer!important;touch-action:manipulation!important;
  }
  #${LAUNCHER_ID}::before{
    content:''!important;position:absolute!important;inset:2px!important;border-radius:50%!important;
    background:url('${IMG}') center/96% 96% no-repeat!important;
    filter:brightness(1.16) saturate(1.12) drop-shadow(0 0 3px rgba(255,232,120,.75))!important;
    pointer-events:none!important;
  }
  #${LAUNCHER_ID}::after{
    content:'abwalqmrzmrd'!important;position:absolute!important;left:50%!important;bottom:-13px!important;transform:translateX(-50%)!important;
    color:#ffe56b!important;-webkit-text-fill-color:#ffe56b!important;font:700 7px/1 Tajawal,Arial,sans-serif!important;white-space:nowrap!important;
    text-shadow:0 1px 2px #000,0 0 5px #000,0 0 7px rgba(255,199,45,.85)!important;pointer-events:none!important;
  }
  @media(max-width:600px){
    #${LAUNCHER_ID}{width:54px!important;height:54px!important;min-width:54px!important;min-height:54px!important;max-width:54px!important;max-height:54px!important}
    #${LAUNCHER_ID}::after{font-size:6px!important;bottom:-11px!important}
  }
  `;
  document.head.appendChild(st);
}

function meta(el){
  return [el.id||'',typeof el.className==='string'?el.className:'',el.getAttribute?.('title')||'',el.getAttribute?.('aria-label')||'',el.textContent||'']
    .join(' ').replace(/\s+/g,' ').trim();
}

function cleanupOldYachtPatches(){
  document.getElementById('sakYachtDirectStyle')?.remove();
  document.getElementById('sakShipMovedStyle')?.remove();
  const business=document.getElementById('sakakerBusinessAd');
  if(business){
    business.classList.remove('sak-business-yacht');
    delete business.dataset.sakBusinessLabel;
  }
}

function hideReturnedLegacyIcons(){
  const dock=document.getElementById('sakakerAllIconsDock');
  if(!dock) return;
  dock.querySelectorAll('button,a,[role="button"],.icon-card,.launcher,.sakaker-utility-slot').forEach(el=>{
    if(el.id===LAUNCHER_ID) return;
    const s=meta(el);
    if(/(^|\s)(السفينة|سفينة|ship|النجمة|نجمة|star)(\s|$)/i.test(s)) el.classList.add('sak-hide-legacy-icon');
  });
  dock.querySelector('.sakaker-utility-slot[data-sakaker-util="ship"]')?.classList.add('sak-hide-legacy-icon');
}

function visibleRect(el){
  if(!el) return null;
  const cs=getComputedStyle(el);
  if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0) return null;
  const r=el.getBoundingClientRect();
  return (r.width>2&&r.height>2)?r:null;
}

function findTextLibraryLauncher(){
  const nodes=[...document.querySelectorAll('button,[role="button"],a,.launcher,[title],[aria-label]')];
  return nodes.find(el=>{
    if(el.id===LAUNCHER_ID) return false;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /المكتبة\s*النصية|Text\s*Library/i.test(s);
  })||null;
}

function ensureLauncher(){
  let btn=document.getElementById(LAUNCHER_ID);
  if(!btn){
    btn=document.createElement('button');
    btn.id=LAUNCHER_ID;
    btn.type='button';
    document.body.appendChild(btn);
    btn.addEventListener('click',()=>{
      const lib=findTextLibraryLauncher();
      if(lib){ lib.click(); return; }
      location.href='/books.html';
    });
  }
  const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
  const label=en?'Text library yacht':'يخت المكتبة النصية';
  btn.setAttribute('aria-label',label);
  btn.title=label;
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
  const w=btn.offsetWidth||54;
  const h=btn.offsetHeight||54;
  let left=pr.left+(pr.width-w)/2;
  let top=pr.top-h-8;
  left=Math.max(8,Math.min(window.innerWidth-w-8,left));
  top=Math.max(8,Math.min(window.innerHeight-h-8,top));
  btn.style.setProperty('left',Math.round(left)+'px','important');
  btn.style.setProperty('top',Math.round(top)+'px','important');
  btn.style.setProperty('right','auto','important');
  btn.style.setProperty('bottom','auto','important');
  btn.style.setProperty('visibility','visible','important');
  btn.style.setProperty('pointer-events','auto','important');
}

function apply(){
  installStyle();
  cleanupOldYachtPatches();
  const old=document.getElementById('shipIcon_new');
  if(old){
    old.style.setProperty('display','none','important');
    old.style.setProperty('visibility','hidden','important');
    old.style.setProperty('pointer-events','none','important');
    old.setAttribute('aria-hidden','true');
    old.tabIndex=-1;
  }
  ensureLauncher();
  hideReturnedLegacyIcons();
  requestAnimationFrame(placeAbovePayment);
}

let queued=false;
function scheduleApply(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
window.addEventListener('load',apply,{once:true});
window.addEventListener('resize',()=>requestAnimationFrame(placeAbovePayment),{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(placeAbovePayment,120),{passive:true});
new MutationObserver(scheduleApply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

const bodyObserver=new MutationObserver(records=>{
  if(records.some(r=>r.addedNodes.length)) scheduleApply();
});
if(document.body) bodyObserver.observe(document.body,{childList:true,subtree:true});
else document.addEventListener('DOMContentLoaded',()=>bodyObserver.observe(document.body,{childList:true,subtree:true}),{once:true});

const paymentObserver=new MutationObserver(()=>requestAnimationFrame(placeAbovePayment));
function watchPayment(){
  const payment=document.getElementById('sakGlobalPayment');
  if(payment) paymentObserver.observe(payment,{attributes:true,attributeFilter:['class','style','hidden']});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watchPayment,{once:true}); else watchPayment();
[500,1200,2500,5000].forEach(ms=>setTimeout(apply,ms));
})();

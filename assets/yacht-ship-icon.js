(()=>{
'use strict';
const IMG='/file_00000000e530821086e1b6135c3db20e.png';

function installStyle(){
 if(document.getElementById('sakYachtAbovePaymentStyle')) return;
 const st=document.createElement('style');
 st.id='sakYachtAbovePaymentStyle';
 st.textContent=`
 .sakaker-utility-slot[data-sakaker-slot="ship"]{display:none!important}
 #shipIcon_new.sak-yacht-above-payment{
   position:fixed!important;
   inset:auto!important;
   width:84px!important;
   height:84px!important;
   min-width:84px!important;
   min-height:84px!important;
   max-width:84px!important;
   max-height:84px!important;
   margin:0!important;
   padding:0!important;
   display:block!important;
   visibility:visible!important;
   opacity:1!important;
   pointer-events:auto!important;
   border-radius:50%!important;
   border:2px solid rgba(255,226,105,.98)!important;
   background:radial-gradient(circle at 50% 45%,rgba(255,245,185,.20),rgba(5,20,25,.50) 58%,rgba(0,0,0,.74))!important;
   background-image:none!important;
   color:transparent!important;
   -webkit-text-fill-color:transparent!important;
   box-shadow:0 0 8px rgba(255,255,220,.95),0 0 18px rgba(255,218,70,.90),0 0 32px rgba(0,255,220,.48)!important;
   overflow:visible!important;
   transform:none!important;
   z-index:2147483002!important;
   cursor:pointer!important;
   touch-action:manipulation!important;
 }
 #shipIcon_new.sak-yacht-above-payment>*{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
 #shipIcon_new.sak-yacht-above-payment::before{
   content:''!important;
   position:absolute!important;
   inset:3px!important;
   border-radius:50%!important;
   background:url('${IMG}') center/94% 94% no-repeat!important;
   filter:brightness(1.18) saturate(1.14) drop-shadow(0 0 4px rgba(255,232,120,.82))!important;
   pointer-events:none!important;
   z-index:2!important;
 }
 #shipIcon_new.sak-yacht-above-payment::after{
   content:'abwalqmrzmrd'!important;
   position:absolute!important;
   left:50%!important;
   bottom:-17px!important;
   transform:translateX(-50%)!important;
   color:#ffe56b!important;
   -webkit-text-fill-color:#ffe56b!important;
   font:700 9px/1.05 Tajawal,Arial,sans-serif!important;
   white-space:nowrap!important;
   text-shadow:0 1px 2px #000,0 0 6px #000,0 0 9px rgba(255,199,45,.9)!important;
   pointer-events:none!important;
   z-index:3!important;
 }
 @media(max-width:600px){
   #shipIcon_new.sak-yacht-above-payment{
     width:76px!important;height:76px!important;
     min-width:76px!important;min-height:76px!important;
     max-width:76px!important;max-height:76px!important;
   }
   #shipIcon_new.sak-yacht-above-payment::after{font-size:8px!important;bottom:-15px!important}
 }
 `;
 document.head.appendChild(st);
}

function visibleRect(el){
 if(!el) return null;
 const cs=getComputedStyle(el);
 if(cs.display==='none'||cs.visibility==='hidden'||cs.opacity==='0') return null;
 const r=el.getBoundingClientRect();
 return (r.width>2&&r.height>2)?r:null;
}

function placeAbovePayment(){
 const ship=document.getElementById('shipIcon_new');
 const payment=document.getElementById('sakGlobalPayment');
 if(!ship||!payment) return;
 const pr=visibleRect(payment);
 if(!pr) return;
 const sr=ship.getBoundingClientRect();
 const w=sr.width||76;
 const h=sr.height||76;
 let left=pr.left+(pr.width-w)/2;
 let top=pr.top-h-14;
 left=Math.max(8,Math.min(window.innerWidth-w-8,left));
 top=Math.max(8,top);
 ship.style.setProperty('left',Math.round(left)+'px','important');
 ship.style.setProperty('top',Math.round(top)+'px','important');
 ship.style.setProperty('right','auto','important');
 ship.style.setProperty('bottom','auto','important');
}

function apply(){
 installStyle();
 const ship=document.getElementById('shipIcon_new');
 if(!ship) return;
 if(ship.parentElement!==document.body) document.body.appendChild(ship);
 ship.classList.add('sak-yacht-above-payment');
 ship.removeAttribute('aria-hidden');
 if(ship.tabIndex<0) ship.tabIndex=0;
 ship.setAttribute('aria-label',document.documentElement.lang==='en'?'Abwalqmrzmrd yacht':'يخت أبوالقمر زمرد');
 ship.title=document.documentElement.lang==='en'?'Abwalqmrzmrd yacht':'يخت أبوالقمر زمرد';
 requestAnimationFrame(placeAbovePayment);
}

let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
window.addEventListener('resize',placeAbovePayment,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(placeAbovePayment,120),{passive:true});
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['lang','class','style']});
})();

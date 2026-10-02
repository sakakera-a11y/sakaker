(()=>{
'use strict';
const IMG='/file_00000000e530821086e1b6135c3db20e.png';
function installStyle(){
 if(document.getElementById('sakYachtShipIconStyle')) return;
 const st=document.createElement('style');
 st.id='sakYachtShipIconStyle';
 st.textContent=`
#shipIcon_new.sak-yacht-ship-icon{
 position:relative!important;
 overflow:visible!important;
 border-radius:50%!important;
 border:2px solid rgba(255,220,90,.98)!important;
 background:rgba(0,0,0,.18)!important;
 color:transparent!important;
 -webkit-text-fill-color:transparent!important;
 box-shadow:0 0 8px #fff7b0,0 0 18px #ffd84d,0 0 34px rgba(255,170,0,.95),inset 0 0 10px rgba(255,245,180,.8)!important;
 animation:sakYachtGlow 2.1s ease-in-out infinite alternate!important;
 isolation:isolate!important;
}
#shipIcon_new.sak-yacht-ship-icon>*{opacity:0!important;visibility:hidden!important}
#shipIcon_new.sak-yacht-ship-icon::before{
 content:''!important;
 position:absolute!important;
 inset:3px!important;
 z-index:2147483646!important;
 border-radius:50%!important;
 background-image:url('${IMG}')!important;
 background-size:contain!important;
 background-position:center!important;
 background-repeat:no-repeat!important;
 filter:brightness(1.18) saturate(1.16)!important;
 pointer-events:none!important;
}
#shipIcon_new.sak-yacht-ship-icon::after{
 content:'abwalqmrzmrd'!important;
 position:absolute!important;
 left:50%!important;
 bottom:-18px!important;
 transform:translateX(-50%)!important;
 z-index:2147483647!important;
 color:#ffe36b!important;
 -webkit-text-fill-color:#ffe36b!important;
 font:700 10px/1.1 Arial,sans-serif!important;
 white-space:nowrap!important;
 text-shadow:0 0 4px #000,0 0 8px #ffd84d,0 0 13px rgba(255,170,0,.95)!important;
 pointer-events:none!important;
}
#shipIcon_new.sak-yacht-ship-icon:hover::before,#shipIcon_new.sak-yacht-ship-icon:focus-visible::before{filter:brightness(1.35) saturate(1.25)!important}
@keyframes sakYachtGlow{
 from{box-shadow:0 0 7px #fff7b0,0 0 16px #ffd84d,0 0 28px rgba(255,170,0,.78),inset 0 0 8px rgba(255,245,180,.72)}
 to{box-shadow:0 0 11px #fff,0 0 25px #ffe46b,0 0 44px rgba(255,170,0,1),inset 0 0 14px rgba(255,250,200,.96)}
}
@media(prefers-reduced-motion:reduce){#shipIcon_new.sak-yacht-ship-icon{animation:none!important}}
`;
 document.head.appendChild(st);
}
function apply(){
 installStyle();
 const el=document.getElementById('shipIcon_new');
 if(!el) return;
 el.classList.add('sak-yacht-ship-icon');
 el.setAttribute('aria-label',document.documentElement.lang==='en'?'Abwalqmrzmrd yacht':'يخت أبوالقمر زمرد');
 el.title=document.documentElement.lang==='en'?'Abwalqmrzmrd yacht':'يخت أبوالقمر زمرد';
}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();

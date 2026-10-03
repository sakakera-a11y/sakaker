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
 border:1.5px solid rgba(255,226,105,.98)!important;
 background:radial-gradient(circle at 50% 42%,rgba(255,245,184,.20) 0%,rgba(12,16,20,.38) 52%,rgba(0,0,0,.58) 100%)!important;
 color:transparent!important;
 -webkit-text-fill-color:transparent!important;
 box-shadow:0 0 7px rgba(255,255,220,.96),0 0 17px rgba(255,218,70,.92),0 0 31px rgba(255,164,0,.72),inset 0 0 11px rgba(255,239,150,.48)!important;
 animation:sakYachtGlow 2.35s ease-in-out infinite alternate!important;
 isolation:isolate!important;
 transform:translateZ(0)!important;
}
#shipIcon_new.sak-yacht-ship-icon>*{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
#shipIcon_new.sak-yacht-ship-icon::before{
 content:''!important;
 position:absolute!important;
 inset:2px!important;
 z-index:2!important;
 border-radius:50%!important;
 background-image:url('${IMG}')!important;
 background-size:92% 92%!important;
 background-position:center!important;
 background-repeat:no-repeat!important;
 filter:brightness(1.22) saturate(1.18) contrast(1.05) drop-shadow(0 0 4px rgba(255,238,145,.85))!important;
 pointer-events:none!important;
 transition:filter .22s ease,transform .22s ease!important;
}
#shipIcon_new.sak-yacht-ship-icon::after{
 content:'abwalqmrzmrd'!important;
 position:absolute!important;
 left:50%!important;
 bottom:-17px!important;
 transform:translateX(-50%)!important;
 z-index:3!important;
 color:#ffe66f!important;
 -webkit-text-fill-color:#ffe66f!important;
 font:700 10px/1.05 Arial,sans-serif!important;
 letter-spacing:.15px!important;
 white-space:nowrap!important;
 text-shadow:0 1px 2px #000,0 0 5px #000,0 0 8px #ffd84d,0 0 13px rgba(255,166,0,.92)!important;
 pointer-events:none!important;
}
#shipIcon_new.sak-yacht-ship-icon:hover::before,#shipIcon_new.sak-yacht-ship-icon:focus-visible::before{
 filter:brightness(1.36) saturate(1.28) contrast(1.06) drop-shadow(0 0 6px rgba(255,239,150,1))!important;
 transform:scale(1.035)!important;
}
#shipIcon_new.sak-yacht-ship-icon:focus-visible{outline:2px solid rgba(255,238,130,.95)!important;outline-offset:4px!important}
@keyframes sakYachtGlow{
 from{box-shadow:0 0 7px rgba(255,255,220,.92),0 0 15px rgba(255,216,65,.82),0 0 27px rgba(255,162,0,.62),inset 0 0 9px rgba(255,239,150,.42)}
 to{box-shadow:0 0 11px #fff,0 0 24px rgba(255,229,105,.98),0 0 40px rgba(255,166,0,.88),inset 0 0 14px rgba(255,248,190,.70)}
}
@media(max-width:600px){
 #shipIcon_new.sak-yacht-ship-icon::before{background-size:90% 90%!important}
 #shipIcon_new.sak-yacht-ship-icon::after{bottom:-15px!important;font-size:9px!important}
}
@media(prefers-reduced-motion:reduce){
 #shipIcon_new.sak-yacht-ship-icon{animation:none!important}
 #shipIcon_new.sak-yacht-ship-icon::before{transition:none!important}
}
`;
 document.head.appendChild(st);
}
function apply(){
 installStyle();
 const el=document.getElementById('shipIcon_new');
 if(!el) return;
 el.classList.add('sak-yacht-ship-icon');
 const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
 el.setAttribute('aria-label',en?'Abwalqmrzmrd yacht':'يخت أبوالقمر زمرد');
 el.title=en?'Abwalqmrzmrd yacht':'يخت أبوالقمر زمرد';
}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();

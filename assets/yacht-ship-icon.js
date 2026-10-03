(()=>{
'use strict';
const IMG='/file_00000000e530821086e1b6135c3db20e.png';
function findTextLibrary(){
 const nodes=[...document.querySelectorAll('button,[role="button"],a,.launcher,[title],[aria-label]')];
 return nodes.find(el=>{
  if(el.closest('#sakTextLibraryModal')) return false;
  const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
  return /المكتبة\s*النصية|Text\s*Library/i.test(s);
 })||null;
}
function installStyle(){
 if(document.getElementById('sakShipMovedStyle')) return;
 const st=document.createElement('style');
 st.id='sakShipMovedStyle';
 st.textContent=`
 #shipIcon_new{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
 .sakaker-utility-slot[data-sakaker-slot="ship"]{display:none!important}
 #sakakerBusinessAd.sak-business-yacht{position:relative!important;color:transparent!important;-webkit-text-fill-color:transparent!important;background:radial-gradient(circle at 50% 45%,rgba(255,245,185,.22),rgba(5,20,25,.48) 58%,rgba(0,0,0,.72))!important;border-radius:50%!important;border:1.5px solid rgba(255,226,105,.96)!important;box-shadow:0 0 8px rgba(255,255,220,.9),0 0 18px rgba(255,218,70,.82),0 0 30px rgba(0,255,220,.42)!important;overflow:visible!important}
 #sakakerBusinessAd.sak-business-yacht>*{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
 #sakakerBusinessAd.sak-business-yacht::before{content:''!important;position:absolute!important;inset:2px!important;border-radius:50%!important;background:url('${IMG}') center/92% 92% no-repeat!important;filter:brightness(1.2) saturate(1.16) drop-shadow(0 0 4px rgba(255,232,120,.82))!important;pointer-events:none!important;z-index:2!important}
 #sakakerBusinessAd.sak-business-yacht::after{content:attr(data-sak-business-label)!important;position:absolute!important;left:50%!important;bottom:-17px!important;transform:translateX(-50%)!important;color:#ffe56b!important;-webkit-text-fill-color:#ffe56b!important;font:700 9px/1.05 Tajawal,Arial,sans-serif!important;white-space:nowrap!important;text-shadow:0 1px 2px #000,0 0 6px #000,0 0 9px rgba(255,199,45,.9)!important;pointer-events:none!important;z-index:3!important}
 `;
 document.head.appendChild(st);
}
function openTextLibrary(){
 const modal=document.getElementById('sakTextLibraryModal');
 if(modal){modal.style.setProperty('display','flex','important');modal.style.setProperty('visibility','visible','important');modal.style.setProperty('opacity','1','important');modal.setAttribute('aria-hidden','false');return true}
 return false;
}
function apply(){
 installStyle();
 const ship=document.getElementById('shipIcon_new');
 if(ship){ship.style.setProperty('display','none','important');ship.setAttribute('aria-hidden','true');ship.tabIndex=-1}
 const lib=findTextLibrary();
 if(lib&&lib.dataset.sakShipLibraryBound!=='1'){
  lib.dataset.sakShipLibraryBound='1';
  lib.addEventListener('click',()=>setTimeout(()=>{const modal=document.getElementById('sakTextLibraryModal');if(modal){const cs=getComputedStyle(modal);if(cs.display==='none'||cs.visibility==='hidden')openTextLibrary()}},0),false);
 }
 const business=document.getElementById('sakakerBusinessAd');
 if(business){
  const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
  business.classList.add('sak-business-yacht');
  business.dataset.sakBusinessLabel=en?'Sakaker Business':'سكاكر بزنس';
  business.setAttribute('aria-label',business.dataset.sakBusinessLabel);
  business.title=business.dataset.sakBusinessLabel;
 }
}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['lang']});
})();

(()=>{
'use strict';
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
 `;
 document.head.appendChild(st);
}
function openTextLibrary(){
 const modal=document.getElementById('sakTextLibraryModal');
 if(modal){
  modal.style.setProperty('display','flex','important');
  modal.style.setProperty('visibility','visible','important');
  modal.style.setProperty('opacity','1','important');
  modal.setAttribute('aria-hidden','false');
  return true;
 }
 return false;
}
function apply(){
 installStyle();
 const ship=document.getElementById('shipIcon_new');
 if(ship){
  ship.style.setProperty('display','none','important');
  ship.setAttribute('aria-hidden','true');
  ship.tabIndex=-1;
 }
 const lib=findTextLibrary();
 if(!lib||lib.dataset.sakShipLibraryBound==='1') return;
 lib.dataset.sakShipLibraryBound='1';
 const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
 lib.title=en?'Text Library':'المكتبة النصية';
 lib.setAttribute('aria-label',lib.title);
 // The text-library icon remains the single launcher on the interface.
 // Preserve its original click behavior; if no handler opens the library,
 // provide a safe modal fallback without exposing a second Ship icon.
 lib.addEventListener('click',()=>setTimeout(()=>{
  const modal=document.getElementById('sakTextLibraryModal');
  if(modal){
   const cs=getComputedStyle(modal);
   if(cs.display==='none'||cs.visibility==='hidden') openTextLibrary();
  }
 },0),false);
}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();

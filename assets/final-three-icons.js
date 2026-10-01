(()=>{'use strict';
function removeVisitorCounters(){
  const selectors=[
    '#sakakerVisitorCounter','#sakakerRightStats','#visitorCounter','#visitCounter',
    '[id*="VisitorCounter"]','[id*="visitorCounter"]',
    '[class*="visitor-counter"]','[class*="visitorCounter"]'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el=>el.remove());
}
function findTextLibrary(){
  const nodes=[...document.querySelectorAll('button,[role="button"],.launcher,[title],[aria-label]')];
  return nodes.find(el=>{
    if(el.closest('#sakTextLibraryModal'))return false;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /المكتبة\s*النصية|Text\s*Library/i.test(s);
  })||null;
}
function keepTextLibraryStar(){
  const el=findTextLibrary();
  if(!el)return;
  el.classList.add('sak-text-library-gold-star');
  let star=el.querySelector(':scope > .sak-text-star-art');
  if(!star){
    star=document.createElement('span');
    star.className='sak-text-star-art';
    star.textContent='★';
    el.prepend(star);
  }
}
function run(){
  removeVisitorCounters();
  keepTextLibraryStar();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
new MutationObserver(keepTextLibraryStar).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
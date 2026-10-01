(()=>{'use strict';
const $=id=>document.getElementById(id);
let dock=null;
function textOf(el){return ((el.getAttribute?.('title')||'')+' '+(el.getAttribute?.('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim()}
function findBusiness(){return $('sakakerBusinessIcon')}
function findMusic(){return $('sakMusicIcon')}
function findMap(){
  const all=[...document.querySelectorAll('.launcher,button,[role="button"],[title],[aria-label]')];
  return all.find(el=>el.id!=='sakMusicIcon'&&el.id!=='sakakerBusinessIcon'&&!el.closest('#sakakerMapOverlay')&&/(^|\s)(خرائط|الخريطة|Maps?)(\s|$)/i.test(textOf(el)))
    ||document.querySelector('.launcher:not(#sakMusicIcon)');
}
function ensureDock(){
  if(!dock)dock=$('sakFinalTrioDock');
  if(!dock){
    dock=document.createElement('nav');
    dock.id='sakFinalTrioDock';
    dock.setAttribute('aria-label','سكاكر بزنس والخرائط وتحويل الصوت');
    document.body.appendChild(dock);
  }
  return dock;
}
function removeGenerated(el){
  el?.querySelectorAll(':scope > .sak-ostrich-art,:scope > .sak-final-label,:scope > .sak-final-symbol,:scope > .sak-business-shape').forEach(n=>n.remove());
  el?.classList.remove('sak-final-ostrich','sak-ostrich-business','sak-ostrich-map','sak-ostrich-music','sak-final-moon','sak-final-sun','sak-final-star','sak-business-copy','sak-copy-silver','sak-copy-dark');
}
function restoreBusiness(el){
  if(!el)return;
  removeGenerated(el);
  ['position','inset','left','right','top','bottom','margin','width','height','min-width','min-height','max-width','max-height','overflow','pointer-events','z-index','background','background-image','box-shadow','border','border-radius','clip-path','filter','transform'].forEach(p=>el.style.removeProperty(p));
  const core=el.querySelector('.sbIconCore');if(core)core.style.removeProperty('display');
}
function cleanClone(node){
  if(!node)return null;
  const c=node.cloneNode(true);
  c.removeAttribute?.('id');c.removeAttribute?.('onclick');c.removeAttribute?.('href');c.removeAttribute?.('tabindex');
  c.querySelectorAll?.('[id],[onclick],[href],[tabindex]').forEach(n=>{n.removeAttribute('id');n.removeAttribute('onclick');n.removeAttribute('href');n.removeAttribute('tabindex')});
  return c;
}
function businessShape(business){
  const src=business.querySelector('.sbIconCore')||business.querySelector(':scope > span,:scope > div,:scope > svg')||business.firstElementChild;
  return cleanClone(src);
}
function labelFor(el,text){
  let lab=el.querySelector(':scope > .sak-final-label');
  if(!lab){lab=document.createElement('span');lab.className='sak-final-label';el.appendChild(lab)}
  lab.textContent=text;
}
function copyBusinessShape(el,business,tone){
  removeGenerated(el);
  el.classList.add('sak-business-copy',tone==='silver'?'sak-copy-silver':'sak-copy-dark');
  const host=document.createElement('span');host.className='sak-business-shape';
  const shape=businessShape(business);
  if(shape)host.appendChild(shape);else host.textContent='◆';
  el.prepend(host);
}
function removeExtraStar(){
  document.querySelectorAll('.sak-text-star-art').forEach(n=>n.remove());
  document.querySelectorAll('.sak-text-library-gold-star').forEach(el=>el.classList.remove('sak-text-library-gold-star'));
  [...document.querySelectorAll('body *')].forEach(el=>{
    if(el.closest('#sakFinalTrioDock,.sak-shore-gull,#sakakerBusinessIcon'))return;
    const t=(el.textContent||'').trim();
    if(!/^(?:★|⭐|✦)$/.test(t))return;
    if(el.matches('button,a,input,[role="button"]')||el.closest('button,a,[role="button"]'))return;
    if(el.querySelector('button,a,input,video,iframe,img,canvas,svg'))return;
    const cs=getComputedStyle(el);
    if(cs.position==='fixed'||cs.position==='absolute')el.remove();
  });
}
function removeEmptyGreenBoxes(){
  [...document.body.children].forEach(el=>{
    if(el.id==='sakFinalTrioDock'||el.id==='loginOverlay'||el.id==='sakakerAllIconsDock')return;
    if((el.textContent||'').trim())return;
    if(el.querySelector('button,a,input,textarea,select,video,audio,iframe,img,canvas,svg'))return;
    const r=el.getBoundingClientRect();
    if(r.width<18||r.height<18||r.width>180||r.height>180)return;
    const cs=getComputedStyle(el);
    if(cs.position!=='fixed'&&cs.position!=='absolute')return;
    const m=cs.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if(!m)return;
    const rr=+m[1],gg=+m[2],bb=+m[3];
    const greenish=gg>90&&gg>rr*1.25&&gg>bb*1.08;
    if(greenish)el.remove();
  });
}
function placeBelowGulls(){
  const d=ensureDock();
  const gulls=[...document.querySelectorAll('.sak-shore-gull')].filter(el=>{
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>8&&r.height>8;
  });
  if(!gulls.length){
    d.classList.remove('sak-under-gulls');
    return;
  }
  const rects=gulls.map(el=>el.getBoundingClientRect());
  const left=Math.min(...rects.map(r=>r.left));
  const right=Math.max(...rects.map(r=>r.right));
  const bottom=Math.max(...rects.map(r=>r.bottom));
  const center=Math.max(110,Math.min(innerWidth-110,(left+right)/2));
  const top=Math.min(innerHeight-92,bottom+8);
  d.classList.add('sak-under-gulls');
  d.style.setProperty('--sak-trio-left',`${center}px`);
  d.style.setProperty('--sak-trio-top',`${top}px`);
}
function decorate(){
  if(document.body.classList.contains('locked'))return false;
  const business=findBusiness(),map=findMap(),music=findMusic();
  if(!business||!map||!music||map===business||music===business||map===music)return false;
  restoreBusiness(business);
  copyBusinessShape(map,business,'silver');
  copyBusinessShape(music,business,'dark');
  const en=document.documentElement.lang==='en';
  labelFor(map,en?'Maps':'خرائط');
  labelFor(music,en?'Audio to Video':'تحويل الصوت لفيديو');
  map.title=en?'Maps':'الخرائط';map.setAttribute('aria-label',map.title);
  music.title=en?'Audio to Video':'تحويل الصوت لفيديو';music.setAttribute('aria-label',music.title);
  business.title=en?'Open Sakaker Business':'فتح سكاكر بزنس';business.setAttribute('aria-label',business.title);
  const d=ensureDock();d.replaceChildren(business,map,music);
  removeExtraStar();
  removeEmptyGreenBoxes();
  requestAnimationFrame(placeBelowGulls);
  return true;
}
function run(){decorate()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
[250,700,1500,3000,6000].forEach(ms=>setTimeout(run,ms));
addEventListener('resize',()=>requestAnimationFrame(placeBelowGulls),{passive:true});
addEventListener('orientationchange',()=>setTimeout(placeBelowGulls,180),{passive:true});
new MutationObserver(()=>{if(!document.body.classList.contains('locked'))decorate()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
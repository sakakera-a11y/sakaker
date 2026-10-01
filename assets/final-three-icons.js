(()=>{'use strict';
const $=id=>document.getElementById(id);
let dock=null;
function findMap(){return document.querySelector('.launcher:not(#sakMusicIcon)')}
function findMusic(){return $('sakMusicIcon')}
function findBusiness(){return $('sakakerBusinessIcon')}
function ensureDock(){
  if(!dock){dock=$('sakFinalTrioDock')}
  if(!dock){dock=document.createElement('nav');dock.id='sakFinalTrioDock';dock.setAttribute('aria-label','سكاكر بزنس والخرائط وتحويل الصوت');document.body.appendChild(dock)}
  return dock;
}
function symbolFor(el,kind){
  let sym=el.querySelector(':scope > .sak-final-symbol');
  if(!sym){sym=document.createElement('span');sym.className='sak-final-symbol';el.prepend(sym)}
  sym.textContent=kind==='map'?'🌙':kind==='music'?'☀️':'⭐';
}
function labelFor(el,text){
  let lab=el.querySelector(':scope > .sak-final-label');
  if(!lab){lab=document.createElement('span');lab.className='sak-final-label';el.appendChild(lab)}
  lab.textContent=text;
}
function styleBase(el){
  el.style.setProperty('position','relative','important');
  el.style.setProperty('inset','auto','important');
  el.style.setProperty('left','auto','important');
  el.style.setProperty('right','auto','important');
  el.style.setProperty('top','auto','important');
  el.style.setProperty('bottom','auto','important');
  el.style.setProperty('margin','0','important');
  el.style.setProperty('width','76px','important');
  el.style.setProperty('height','76px','important');
  el.style.setProperty('min-width','76px','important');
  el.style.setProperty('min-height','76px','important');
  el.style.setProperty('max-width','76px','important');
  el.style.setProperty('max-height','76px','important');
  el.style.setProperty('overflow','visible','important');
  el.style.setProperty('pointer-events','auto','important');
  el.style.setProperty('z-index','2','important');
}
function decorate(){
  const d=ensureDock(),business=findBusiness(),map=findMap(),music=findMusic();
  if(!business||!map||!music)return false;
  [business,map,music].forEach(styleBase);
  business.classList.add('sak-final-star');
  map.classList.add('sak-final-moon');
  music.classList.add('sak-final-sun');
  const en=document.documentElement.lang==='en';
  symbolFor(map,'map');symbolFor(music,'music');
  labelFor(map,en?'Maps':'خرائط');
  labelFor(music,en?'Audio to Video':'تحويل الصوت لفيديو');
  const core=business.querySelector('.sbIconCore');if(core)core.textContent=en?'Business':'بزنس';
  map.title=en?'Maps':'الخرائط';map.setAttribute('aria-label',map.title);
  music.title=en?'Audio to Video':'تحويل الصوت لفيديو';music.setAttribute('aria-label',music.title);
  business.title=en?'Open Sakaker Business':'فتح سكاكر بزنس';business.setAttribute('aria-label',business.title);
  d.append(business,map,music);
  return true;
}
function run(){if(document.body.classList.contains('locked'))return;decorate()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
[250,700,1500,3000,6000,10000].forEach(ms=>setTimeout(run,ms));
setInterval(run,5000);
new MutationObserver(run).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

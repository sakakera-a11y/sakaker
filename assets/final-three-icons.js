(()=>{'use strict';
const $=id=>document.getElementById(id);
let dock=null;
const NS='http://www.w3.org/2000/svg';
function findMap(){return document.querySelector('.launcher:not(#sakMusicIcon)')}
function findMusic(){return $('sakMusicIcon')}
function findBusiness(){return $('sakakerBusinessIcon')}
function findTextLibrary(){
  const nodes=[...document.querySelectorAll('button,[role="button"],.launcher,[title],[aria-label]')];
  return nodes.find(el=>{
    if(el.closest('#sakTextLibraryModal'))return false;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /المكتبة\s*النصية|Text\s*Library/i.test(s);
  })||null;
}
function removeVisitorCounters(){
  const selectors=[
    '#sakakerVisitorCounter','#sakakerRightStats','#visitorCounter','#visitCounter',
    '[id*="VisitorCounter"]','[id*="visitorCounter"]',
    '[class*="visitor-counter"]','[class*="visitorCounter"]'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el=>el.remove());
}
function ensureDock(){
  if(!dock)dock=$('sakFinalTrioDock');
  if(!dock){dock=document.createElement('nav');dock.id='sakFinalTrioDock';dock.setAttribute('aria-label','سكاكر بزنس والخرائط وتحويل الصوت');document.body.appendChild(dock)}
  return dock;
}
function make(tag,attrs={}){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n}
function ostrichSVG(kind){
  const svg=make('svg',{viewBox:'0 0 100 120','aria-hidden':'true',focusable:'false',class:'sak-ostrich-svg'});
  const defs=make('defs');
  const grad=make('linearGradient',{id:'ostrichGold'+kind,x1:'0',y1:'0',x2:'1',y2:'1'});
  grad.append(make('stop',{offset:'0','stop-color':'#fff8c8'}),make('stop',{offset:'.36','stop-color':kind==='map'?'#d8fbff':'#ffe56a'}),make('stop',{offset:'1','stop-color':kind==='map'?'#62dfff':'#ff9d00'}));
  defs.appendChild(grad);svg.appendChild(defs);
  const g=make('g',{class:'sak-ostrich-body'});
  g.append(
    make('ellipse',{cx:'49',cy:'68',rx:'27',ry:'21',fill:`url(#ostrichGold${kind})`,stroke:'#fff7cf','stroke-width':'2'}),
    make('path',{d:'M60 58 C70 45 70 28 67 18 C66 12 70 8 75 9 C81 10 84 16 82 22 C79 32 77 44 78 55',fill:'none',stroke:`url(#ostrichGold${kind})`,'stroke-width':'7','stroke-linecap':'round'}),
    make('circle',{cx:'77',cy:'15',r:'8',fill:`url(#ostrichGold${kind})`,stroke:'#fff','stroke-width':'1.5'}),
    make('circle',{cx:'79',cy:'13',r:'1.6',fill:'#07131b'}),
    make('path',{d:'M84 16 L94 19 L84 22 Z',fill:'#ffbc42'}),
    make('path',{d:'M28 64 Q11 52 18 42 Q33 48 41 59',fill:`url(#ostrichGold${kind})`,opacity:'.95'}),
    make('path',{d:'M42 84 L39 109 M59 84 L63 109',stroke:'#fff5ba','stroke-width':'4','stroke-linecap':'round'}),
    make('path',{d:'M35 110 L45 110 M58 110 L69 110',stroke:'#ffe06a','stroke-width':'4','stroke-linecap':'round'})
  );
  const badge=make('g',{class:'sak-ostrich-badge'});
  if(kind==='map'){
    badge.append(make('path',{d:'M42 53 A12 12 0 1 0 55 39 A9 9 0 1 1 42 53Z',fill:'#eaffff',stroke:'#7fe8ff','stroke-width':'1.5'}));
  }else if(kind==='music'){
    badge.append(make('circle',{cx:'49',cy:'49',r:'10',fill:'#ffd21f',stroke:'#fff6a8','stroke-width':'2'}));
    for(let i=0;i<8;i++){const a=i*Math.PI/4,x1=49+14*Math.cos(a),y1=49+14*Math.sin(a),x2=49+20*Math.cos(a),y2=49+20*Math.sin(a);badge.append(make('line',{x1,y1,x2,y2,stroke:'#ffd21f','stroke-width':'3','stroke-linecap':'round'}))}
  }else{
    badge.append(make('path',{d:'M49 35 L53 44 L63 45 L56 52 L58 62 L49 57 L40 62 L42 52 L35 45 L45 44 Z',fill:'#ffd700',stroke:'#fff8bb','stroke-width':'1.6'}));
  }
  svg.append(g,badge);return svg;
}
function ensureOstrich(el,kind){
  let host=el.querySelector(':scope > .sak-ostrich-art');
  if(!host){host=document.createElement('span');host.className='sak-ostrich-art';el.prepend(host)}
  if(host.dataset.kind!==kind){host.replaceChildren(ostrichSVG(kind));host.dataset.kind=kind}
}
function labelFor(el,text){let lab=el.querySelector(':scope > .sak-final-label');if(!lab){lab=document.createElement('span');lab.className='sak-final-label';el.appendChild(lab)}lab.textContent=text}
function styleBase(el){
  el.classList.remove('sak-final-star','sak-final-moon','sak-final-sun','sak-music-icon-face','sak-music-icon-label');
  const reset={
    position:'relative',inset:'auto',left:'auto',right:'auto',top:'auto',bottom:'auto',margin:'0',
    width:'72px',height:'86px','min-width':'72px','min-height':'86px','max-width':'72px','max-height':'86px',
    overflow:'visible','pointer-events':'auto','z-index':'2',background:'transparent','background-image':'none',
    'border-radius':'0',border:'0','box-shadow':'none','clip-path':'none',filter:'none',padding:'0'
  };
  for(const [p,v] of Object.entries(reset))el.style.setProperty(p,v,'important');
}
function decorateTextLibrary(){
  const el=findTextLibrary();if(!el)return;
  el.classList.add('sak-text-library-gold-star');
  let star=el.querySelector(':scope > .sak-text-star-art');
  if(!star){star=document.createElement('span');star.className='sak-text-star-art';star.textContent='★';el.prepend(star)}
}
function decorate(){
  removeVisitorCounters();
  const d=ensureDock(),business=findBusiness(),map=findMap(),music=findMusic();
  if(!business||!map||!music)return false;
  [business,map,music].forEach(styleBase);
  business.classList.add('sak-final-ostrich','sak-ostrich-business');
  map.classList.add('sak-final-ostrich','sak-ostrich-map');
  music.classList.add('sak-final-ostrich','sak-ostrich-music');
  const en=document.documentElement.lang==='en';
  ensureOstrich(business,'business');ensureOstrich(map,'map');ensureOstrich(music,'music');
  labelFor(business,en?'Sakaker Business':'سكاكر بزنس');labelFor(map,en?'Maps':'خرائط');labelFor(music,en?'Audio to Video':'تحويل الصوت لفيديو');
  const core=business.querySelector('.sbIconCore');if(core)core.style.setProperty('display','none','important');
  [...business.querySelectorAll(':scope > .sak-final-symbol'),...map.querySelectorAll(':scope > .sak-final-symbol'),...music.querySelectorAll(':scope > .sak-final-symbol')].forEach(n=>n.remove());
  map.title=en?'Maps':'الخرائط';map.setAttribute('aria-label',map.title);music.title=en?'Audio to Video':'تحويل الصوت لفيديو';music.setAttribute('aria-label',music.title);business.title=en?'Open Sakaker Business':'فتح سكاكر بزنس';business.setAttribute('aria-label',business.title);
  d.append(business,map,music);decorateTextLibrary();return true;
}
function run(){removeVisitorCounters();if(document.body.classList.contains('locked'))return;decorate()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
[300,900,1800,3500,7000].forEach(ms=>setTimeout(run,ms));
new MutationObserver(()=>{removeVisitorCounters();if(!document.body.classList.contains('locked'))decorate()}).observe(document.documentElement,{attributes:true,childList:true,subtree:true,attributeFilter:['lang']});
})();
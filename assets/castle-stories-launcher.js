/* SAKAKER — Castle Stories launcher.
   Opens the original complete bilingual Abwalqmrzmrd book. */
(()=>{'use strict';
const ID='sakCastleStoriesBtn';
const LOGO='https://raw.githubusercontent.com/sakakera-a11y/sakaker/refs/heads/main/file_000000007f288208bce7556015d427f9.png';
const BOOK='/abwalqmrzmrd-book.html';
const isEn=()=>String(document.documentElement.lang||'ar').toLowerCase().startsWith('en');
function installStyle(){
  if(document.getElementById('sakCastleStoriesStyle'))return;
  const style=document.createElement('style');
  style.id='sakCastleStoriesStyle';
  style.textContent=`
    html body #sakakerAllIconsDock #${ID}{cursor:pointer!important;touch-action:manipulation!important}
    html body #sakakerAllIconsDock #${ID} .sak-ostrich-art{
      display:flex!important;align-items:center!important;justify-content:center!important;
      width:var(--sak-ostrich-art)!important;height:var(--sak-ostrich-art)!important;
      min-height:var(--sak-ostrich-art)!important;max-height:var(--sak-ostrich-art)!important;
      top:2px!important;border-radius:50%!important;overflow:hidden!important;
      background:radial-gradient(circle at 32% 24%,#fff8d6 0,#ffe66b 30%,#d88a16 72%,#633b0b 100%)!important;
      border:1px solid rgba(255,244,184,.98)!important;
      box-shadow:inset 0 0 8px #fff8,0 0 10px #ffc83d,0 0 20px #f0a91f!important;
      padding:4px!important;filter:drop-shadow(0 0 4px #ffdf70)!important;
    }
    html body #sakakerAllIconsDock #${ID} .sak-ostrich-art img{
      display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;
      border-radius:50%!important;filter:drop-shadow(0 1px 2px #452b00)!important;
    }
    html body #sakakerAllIconsDock #${ID} .sak-ostrich-name{
      color:#fff4bf!important;-webkit-text-fill-color:#fff4bf!important;
      text-shadow:0 1px 3px #000,0 0 7px #a66b09,0 0 10px #ffc83d!important;
    }
    html body #sakakerAllIconsDock [data-sakaker-util="castleStories"]{display:block!important;visibility:visible!important;opacity:1!important}
    html body #sakakerAllIconsDock #${ID}:focus-visible{outline:2px solid #ffe88a!important;outline-offset:3px!important}
    @media(prefers-reduced-motion:reduce){html body #sakakerAllIconsDock #${ID} .sak-ostrich-art{animation:none!important}}
  `;
  document.head.appendChild(style);
}
function ensure(){
  if(!document.body||document.body.classList.contains('locked'))return;
  installStyle();
  let button=document.getElementById(ID);
  if(!button){
    button=document.createElement('button');
    button.id=ID;button.type='button';
    button.className='sak-ostrich-icon sakaker-dock-entry';
    button.dataset.sakakerDockKey='castleStories';
    const art=document.createElement('span');art.className='sak-ostrich-art';
    const img=document.createElement('img');img.src=LOGO;img.alt='';img.loading='lazy';img.decoding='async';
    art.appendChild(img);button.appendChild(art);
    const label=document.createElement('span');label.className='sak-ostrich-name';button.appendChild(label);
    button.addEventListener('click',()=>{if(!document.body.classList.contains('locked'))location.assign(BOOK)});
  }
  const en=isEn();
  const name=en?'Castle Stories':'حكايات القلعة';
  const description=en
    ?'The complete bilingual Abwalqmrzmrd book, including the author’s introduction and story in Arabic and English.'
    :'كتاب أبوالقمر زمرد الكامل باللغتين، ويضم مقدمة المؤلف والحكاية بالعربية والإنجليزية.';
  button.title=name+' — '+description;
  button.setAttribute('aria-label',button.title);
  button.setAttribute('aria-describedby','sakCastleStoriesDescription');
  let desc=document.getElementById('sakCastleStoriesDescription');
  if(!desc){desc=document.createElement('span');desc.id='sakCastleStoriesDescription';desc.hidden=true;document.body.appendChild(desc)}
  desc.textContent=description;
  const dock=document.getElementById('sakakerAllIconsDock');
  if(dock){
    let utility=dock.querySelector('#sakakerUtilityDock');
    if(!utility){utility=document.createElement('nav');utility.id='sakakerUtilityDock';utility.setAttribute('aria-label',en?'Site tools':'أدوات الموقع');dock.appendChild(utility)}
    let slot=utility.querySelector('[data-sakaker-util="castleStories"]');
    if(!slot){slot=document.createElement('div');slot.className='sakaker-utility-slot';slot.dataset.sakakerUtil='castleStories'}
    const library=utility.querySelector('[data-sakaker-util="textLibrary"]');
    const live=utility.querySelector('[data-sakaker-util="live"]');
    if(library&&slot.parentElement!==utility)library.after(slot);
    else if(live&&slot.parentElement!==utility)live.before(slot);
    else if(slot.parentElement!==utility)utility.appendChild(slot);
    if(button.parentElement!==slot)slot.appendChild(button);
  }
}
function init(){
  ensure();
  new MutationObserver(ensure).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  new MutationObserver(ensure).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('pageshow',ensure);
  [500,1400,3000,6000].forEach(ms=>setTimeout(ensure,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
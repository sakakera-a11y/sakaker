/* SAKAKER — Castle Stories launcher.
   Opens the original complete bilingual Abwalqmrzmrd book. */
(()=>{'use strict';
const ID='sakCastleStoriesBtn';
const LOGO='https://raw.githubusercontent.com/sakakera-a11y/sakaker/refs/heads/main/file_000000007f288208bce7556015d427f9.png';
const BOOK='/abwalqmrzmrd-book.html';
const isEn=()=>String(document.documentElement.lang||'ar').toLowerCase().startsWith('en');
function showBookLoading(){
  if(document.getElementById('sakCastleBookLoading'))return;
  const styleId='sakCastleBookLoadingStyle';
  if(!document.getElementById(styleId)){
    const style=document.createElement('style');style.id=styleId;
    style.textContent='#sakCastleBookLoading{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:rgba(2,12,19,.88);backdrop-filter:blur(9px);color:#fff4c2;font:800 17px/1.7 Tahoma,Arial,sans-serif;text-align:center}#sakCastleBookLoading .sak-book-spinner{width:42px;height:42px;margin:0 auto 12px;border:4px solid rgba(255,232,160,.25);border-top-color:#ffe27a;border-radius:50%;animation:sakBookSpin .8s linear infinite}@keyframes sakBookSpin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){#sakCastleBookLoading .sak-book-spinner{animation:none;border-top-color:#ffe27a}}';
    document.head.appendChild(style);
  }
  const overlay=document.createElement('div');overlay.id='sakCastleBookLoading';overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
  const en=isEn();overlay.innerHTML='<div><div class="sak-book-spinner" aria-hidden="true"></div>'+(en?'Opening the castle book…':'جارٍ فتح كتاب القلعة…')+'</div>';
  document.body.appendChild(overlay);
}
function installStyle(){
  if(document.getElementById('sakCastleStoriesStyle'))return;
  const style=document.createElement('style');
  style.id='sakCastleStoriesStyle';
  style.textContent=`
    html body #sakCastleStoriesBtn{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;width:min(170px,42vw)!important;min-width:120px!important;min-height:86px!important;margin:5px auto 8px!important;padding:5px 10px!important;z-index:45!important;cursor:pointer!important;touch-action:manipulation!important;background:transparent!important;border:0!important;box-shadow:none!important;color:#fff4bf!important;font:800 13px/1.3 Tahoma,Arial,sans-serif!important;text-align:center!important}
    html body #sakCastleStoriesBtn .sak-ostrich-art{width:52px!important;height:52px!important;min-height:52px!important;max-height:52px!important}
    html body #sakCastleStoriesBtn .sak-ostrich-name{display:block!important;visibility:visible!important;opacity:1!important;color:#fff4bf!important;-webkit-text-fill-color:#fff4bf!important;text-shadow:0 1px 3px #000,0 0 8px #a66b09,0 0 10px #ffc83d!important;white-space:nowrap!important}
    @media(max-width:600px){html body #sakCastleStoriesBtn{min-height:78px!important;margin:4px auto 6px!important;font-size:12px!important}html body #sakCastleStoriesBtn .sak-ostrich-art{width:44px!important;height:44px!important;min-height:44px!important;max-height:44px!important}}
    html body #${ID} .sak-ostrich-art{
      display:flex!important;align-items:center!important;justify-content:center!important;
      width:var(--sak-ostrich-art)!important;height:var(--sak-ostrich-art)!important;
      min-height:var(--sak-ostrich-art)!important;max-height:var(--sak-ostrich-art)!important;
      top:2px!important;border-radius:50%!important;overflow:hidden!important;
      background:radial-gradient(circle at 32% 24%,#fff8d6 0,#ffe66b 30%,#d88a16 72%,#633b0b 100%)!important;
      border:1px solid rgba(255,244,184,.98)!important;
      box-shadow:inset 0 0 8px #fff8,0 0 10px #ffc83d,0 0 20px #f0a91f!important;
      padding:4px!important;filter:drop-shadow(0 0 4px #ffdf70)!important;
    }
    html body #${ID} .sak-ostrich-art img{
      display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;
      border-radius:50%!important;filter:drop-shadow(0 1px 2px #452b00)!important;
    }
    html body #${ID} .sak-ostrich-name{
      color:#fff4bf!important;-webkit-text-fill-color:#fff4bf!important;
      text-shadow:0 1px 3px #000,0 0 7px #a66b09,0 0 10px #ffc83d!important;
    }
    html body #sakakerAllIconsDock [data-sakaker-util="castleStories"]{display:block!important;visibility:visible!important;opacity:1!important}
    html body #${ID}:focus-visible{outline:2px solid #ffe88a!important;outline-offset:3px!important}
    @media(prefers-reduced-motion:reduce){html body #${ID} .sak-ostrich-art{animation:none!important}}
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
    button.addEventListener('click',()=>{
      if(document.body.classList.contains('locked')||button.dataset.sakBookNavigating==='1')return;
      button.dataset.sakBookNavigating='1';
      showBookLoading();
      location.assign(BOOK);
    });
  }
  const en=isEn();
  const name=en?'Castle Book':'كتاب القلعة';
  const visibleLabel=button.querySelector(':scope > .sak-ostrich-name');
  if(visibleLabel)visibleLabel.textContent=name;
  const description=en
    ?'The complete bilingual Abwalqmrzmrd book, including the author’s introduction and story in Arabic and English.'
    :'كتاب أبوالقمر زمرد الكامل باللغتين، ويضم مقدمة المؤلف والحكاية بالعربية والإنجليزية.';
  button.title=name+' — '+description;
  button.setAttribute('aria-label',button.title);
  button.setAttribute('aria-describedby','sakCastleStoriesDescription');
  let desc=document.getElementById('sakCastleStoriesDescription');
  if(!desc){desc=document.createElement('span');desc.id='sakCastleStoriesDescription';desc.hidden=true;document.body.appendChild(desc)}
  desc.textContent=description;
  /* Put the book first, centered above the tour button and all visitor/festive counters. */
  const tour=document.getElementById('sakCastleTourBtn');
  const festiveHeader=document.getElementById('sakFestiveHeader');
  const anchor=tour||festiveHeader;
  if(anchor&&anchor.parentElement){
    if(button.parentElement!==anchor.parentElement||button.nextElementSibling!==anchor){
      anchor.parentElement.insertBefore(button,anchor);
    }
  }else if(button.parentElement!==document.body||document.body.firstElementChild!==button){
    document.body.prepend(button);
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
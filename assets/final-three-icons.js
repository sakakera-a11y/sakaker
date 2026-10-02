(()=>{'use strict';

const EXCLUDED='#facebookVideoPopup,#livePopup,#shipPopup_new,#sakakerBusinessPopup,#emeraldLibraryContent,#sakMusicPlayer,#sakTextLibraryModal,#loginOverlay';
const utilityItems=[
  {key:'facebook',selector:'#facebookVideoIcon'},
  {key:'live',selector:'#liveFlasher'},
  {key:'library',selector:'#emeraldLibraryButton'},
  {key:'pong',selector:'#pongGame-btn'},
  {key:'ship',selector:'#shipIcon_new'},
  {key:'music',selector:'#emeraldMusicHost'},
  {key:'map',selector:'.launcher'},
  {key:'business',selector:'#sakakerBusinessAd'}
];

function removeVisitorCounters(){
  const selectors=['#sakakerVisitorCounter','#sakakerRightStats','#visitorCounter','#visitCounter','[id*="VisitorCounter"]','[id*="visitorCounter"]','[class*="visitor-counter"]','[class*="visitorCounter"]'];
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

function removeEmptyTextLibrary(){
  const el=findTextLibrary();
  if(el)el.remove();
}

function installFacebookEmbeds(){
  const popup=document.getElementById('facebookVideoPopup');
  const box=popup?.querySelector('.fbVideoBox');
  if(!box||box.querySelector('#sakFacebookEmbeddedMedia'))return;

  const items=[
    {type:'post',url:'https://www.facebook.com/100082898274465/posts/1089659210474011/?app=fbl'},
    {type:'video',url:'https://www.facebook.com/share/r/1BQxaJUuP5/'},
    {type:'post',url:'https://www.facebook.com/61556336314377/posts/122326658408211210/'}
  ];

  const wrap=document.createElement('section');
  wrap.id='sakFacebookEmbeddedMedia';
  wrap.style.cssText='display:grid;grid-template-columns:1fr;gap:12px;margin:12px 0 6px;max-width:100%;overflow:hidden';

  items.forEach(item=>{
    const iframe=document.createElement('iframe');
    const plugin=item.type==='video'?'video.php':'post.php';
    const extra=item.type==='video'?'&show_text=false&width=500':'&show_text=true&width=500';
    iframe.src='https://www.facebook.com/plugins/'+plugin+'?href='+encodeURIComponent(item.url)+extra;
    iframe.width='500';
    iframe.height=item.type==='video'?'520':'620';
    iframe.style.cssText='border:none;overflow:hidden;width:100%;max-width:500px;min-height:500px;margin:auto';
    iframe.scrolling='no';
    iframe.frameBorder='0';
    iframe.allowFullscreen=true;
    iframe.loading='lazy';
    iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    wrap.appendChild(iframe);
  });

  const comments=box.querySelector('.fbCommentsBox,.fbComments,.fbCommentWrite');
  if(comments)box.insertBefore(wrap,comments);else box.appendChild(wrap);
}

function validCandidate(el){
  return !!el&&!el.closest(EXCLUDED)&&!el.closest('dialog');
}

function firstCandidate(selector){
  return [...document.querySelectorAll(selector)].find(validCandidate)||null;
}

/*
  Consolidate only when necessary. There is intentionally NO MutationObserver
  and NO permanent position watchdog here. Older scripts are therefore not
  continuously fighting this file for the same bottom-right coordinates.
*/
function consolidateIconsOnce(){
  const dock=document.getElementById('sakakerAllIconsDock');
  if(!dock)return;

  const cards=[...document.querySelectorAll('.cards')]
    .find(el=>!el.closest(EXCLUDED)&&el.querySelector('.icon-card'));
  if(cards&&cards.parentElement!==dock)dock.appendChild(cards);

  let utility=document.getElementById('sakakerUtilityDock');
  if(!utility){
    utility=document.createElement('nav');
    utility.id='sakakerUtilityDock';
    utility.setAttribute('aria-label','أدوات وخدمات الموقع');
  }
  if(utility.parentElement!==dock)dock.appendChild(utility);

  const center=document.getElementById('sakakerCenterFeatureDock');
  if(center&&center.parentElement!==dock)dock.appendChild(center);

  utilityItems.forEach(info=>{
    const item=firstCandidate(info.selector);
    if(!item||item.closest('#sakakerAllIconsDock'))return;

    let slot=utility.querySelector('[data-sakaker-util="'+info.key+'"]');
    if(!slot){
      slot=document.createElement('div');
      slot.className='sakaker-utility-slot';
      slot.dataset.sakakerUtil=info.key;
      utility.appendChild(slot);
    }
    slot.appendChild(item);
  });

  dock.querySelectorAll('.sak-cycle-hidden').forEach(el=>el.classList.remove('sak-cycle-hidden'));

  dock.dataset.sakakerStableDock='1';
}

function settle(){
  removeVisitorCounters();
  removeEmptyTextLibrary();
  installFacebookEmbeds();
  consolidateIconsOnce();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',settle,{once:true});
}else{
  settle();
}

window.addEventListener('load',settle,{once:true});

/* A few bounded late passes catch delayed widgets, then stop permanently. */
[500,1500,3500,6000].forEach(ms=>setTimeout(settle,ms));

/* Language changes may recreate labels; one pass is enough and does not watch positions. */
new MutationObserver(()=>{
  removeEmptyTextLibrary();
  installFacebookEmbeds();
}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

})();

(()=>{'use strict';

const EXCLUDED='#facebookVideoPopup,#livePopup,#shipPopup_new,#sakakerBusinessPopup,#emeraldLibraryContent,#sakMusicPlayer,#sakTextLibraryModal,#loginOverlay';

const utilityItems=[
  {key:'facebook',selectors:['#facebookVideoIcon']},
  {key:'live',selectors:['#liveFlasher']},
  {key:'library',selectors:['#emeraldLibraryButton']},
  {key:'pong',selectors:['#pongGame-btn']},
  {key:'ship',selectors:['#shipIcon_new']},
  {key:'music',selectors:['#emOpenBtn','#emeraldMusicHost #emOpenBtn','#emeraldMusicHost button','#emeraldMusicHost [role="button"]']},
  {key:'map',selectors:['#mapIcon','.launcher[data-map]','.launcher[aria-label*="خريطة"]','.launcher[title*="خريطة"]','.launcher']},
  {key:'business',selectors:['#sakakerBusinessAd']}
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

function firstCandidate(selectors){
  for(const selector of selectors){
    const found=[...document.querySelectorAll(selector)].find(validCandidate);
    if(found)return found;
  }
  return null;
}

function ensureUtilityDock(dock){
  let utility=document.getElementById('sakakerUtilityDock');
  if(!utility){
    utility=document.createElement('nav');
    utility.id='sakakerUtilityDock';
    utility.setAttribute('aria-label','أدوات وخدمات الموقع');
  }
  if(utility.parentElement!==dock)dock.appendChild(utility);
  return utility;
}

function ensureSlot(utility,key){
  let slot=utility.querySelector('[data-sakaker-util="'+key+'"]');
  if(!slot){
    slot=document.createElement('div');
    slot.className='sakaker-utility-slot sakaker-dock-entry';
    slot.dataset.sakakerUtil=key;
    utility.appendChild(slot);
  }else{
    slot.classList.add('sakaker-dock-entry');
  }
  return slot;
}

function normalizeMainCards(cards){
  if(!cards)return;
  cards.querySelectorAll('.icon-card').forEach(card=>{
    card.classList.add('sakaker-dock-entry','sakaker-main-dock-item');
  });
}

function normalizeUtilityItem(item,key){
  item.classList.add('sakaker-dock-item');
  item.dataset.sakakerDockKey=key;
  /* Intentionally do not alter hidden/display/visibility/opacity.
     The icon keeps its own real state; CSS only unifies the transition. */
}

function consolidateIconsOnce(){
  const dock=document.getElementById('sakakerAllIconsDock');
  if(!dock)return;

  const cards=[...document.querySelectorAll('.cards')]
    .find(el=>!el.closest(EXCLUDED)&&el.querySelector('.icon-card'));

  if(cards){
    normalizeMainCards(cards);
    if(cards.parentElement!==dock)dock.appendChild(cards);
  }

  const utility=ensureUtilityDock(dock);

  const center=document.getElementById('sakakerCenterFeatureDock');
  if(center&&center.parentElement!==dock)dock.appendChild(center);

  utilityItems.forEach(info=>{
    const item=firstCandidate(info.selectors);
    if(!item)return;

    const slot=ensureSlot(utility,info.key);
    normalizeUtilityItem(item,info.key);

    if(item.parentElement!==slot)slot.appendChild(item);
  });

  /* Remove truly obsolete empty slots only. Expected slots are kept so an icon
     may disappear/reappear without shifting every other icon or causing overlap. */
  utility.querySelectorAll('.sakaker-utility-slot').forEach(slot=>{
    const key=slot.dataset.sakakerUtil;
    const expected=utilityItems.some(info=>info.key===key);
    if(!expected&&!slot.firstElementChild)slot.remove();
  });

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

/* Only a short bounded collection window for delayed launchers. No permanent
   position/visibility watchdog and no code that forces an icon to appear. */
[300,900,1800,3500,6000,10000].forEach(ms=>setTimeout(settle,ms));

new MutationObserver(()=>{
  removeEmptyTextLibrary();
  installFacebookEmbeds();
}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

})();

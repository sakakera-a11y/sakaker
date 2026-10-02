(()=>{'use strict';

const NS='http://www.w3.org/2000/svg';
const EXCLUDED='#facebookVideoPopup,#livePopup,#shipPopup_new,#sakakerBusinessPopup,#emeraldLibraryContent,#sakMusicPlayer,#sakTextLibraryModal,#loginOverlay';
const SITE_BG_SRC='/gemini_generated_video_34118154.mp4';

/* Requested row order first, then the remaining site tools. */
const utilityItems=[
  {key:'facebook',selectors:['#facebookVideoIcon']},
  {key:'textLibrary',finder:findTextLibrary},
  {key:'videoLibrary',selectors:['#emeraldLibraryButton']},
  {key:'live',selectors:['#liveFlasher']},
  {key:'pong',selectors:['#pongGame-btn']},
  {key:'siteBackground',selectors:['#sakSiteBackgroundBtn']},
  {key:'ship',selectors:['#shipIcon_new']},
  {key:'music',selectors:['#emOpenBtn','#emeraldMusicHost #emOpenBtn','#emeraldMusicHost button','#emeraldMusicHost [role="button"]']},
  {key:'map',selectors:['#mapIcon','.launcher[data-map]','.launcher[aria-label*="خريطة"]','.launcher[title*="خريطة"]','.launcher']},
  {key:'business',selectors:['#sakakerBusinessAd']}
];

const labels={
  facebook:{ar:'فيس بوك',en:'Facebook'},
  textLibrary:{ar:'المكتبة النصية',en:'Text Library'},
  videoLibrary:{ar:'مكتبة الفيديو',en:'Video Library'},
  live:{ar:'قنوات مباشرة',en:'Live Channels'},
  pong:{ar:'لعبة البونج',en:'Pong'},
  siteBackground:{ar:'خلفية الصفحة',en:'Page Background'},
  ship:{ar:'أبوالقمر زمرد',en:'Abwalqmrzmrd'},
  music:{ar:'تحويل الصوت',en:'Audio'},
  map:{ar:'الخرائط',en:'Maps'},
  business:{ar:'سكاكر بزنس',en:'Business'}
};

function removeVisitorCounters(){
  const selectors=['#sakakerVisitorCounter','#sakakerRightStats','#visitorCounter','#visitCounter','[id*="VisitorCounter"]','[id*="visitorCounter"]','[class*="visitor-counter"]','[class*="visitorCounter"]'];
  document.querySelectorAll(selectors.join(',')).forEach(el=>el.remove());
}

function findTextLibrary(){
  const nodes=[...document.querySelectorAll('button,[role="button"],a,.launcher,[title],[aria-label]')];
  return nodes.find(el=>{
    if(el.closest('#sakTextLibraryModal'))return false;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /المكتبة\s*النصية|Text\s*Library/i.test(s);
  })||null;
}

/* Add only the requested reel. Existing Facebook media in the popup is left
   exactly as-is and stays after this new first item. */
function installFacebookEmbeds(){
  const popup=document.getElementById('facebookVideoPopup');
  const box=popup?.querySelector('.fbVideoBox');
  if(!box)return;

  const reelId='1713298586438007';
  if(box.querySelector('iframe[data-sak-facebook-reel="'+reelId+'"]'))return;

  const iframe=document.createElement('iframe');
  iframe.dataset.sakFacebookReel=reelId;
  iframe.src='https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1713298586438007%2F&show_text=true&width=267&t=0';
  iframe.width='267';
  iframe.height='591';
  iframe.style.cssText='display:block;border:none;overflow:hidden;width:267px;max-width:100%;height:591px;min-height:591px;margin:0 auto 12px';
  iframe.scrolling='no';
  iframe.frameBorder='0';
  iframe.allowFullscreen=true;
  iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
  iframe.setAttribute('allowfullscreen','true');
  iframe.setAttribute('title','Facebook Reel');

  box.insertBefore(iframe,box.firstChild);
}

function isLocked(){return document.body?.classList.contains('locked');}

function installSiteBackgroundStyle(){
  if(document.getElementById('sakSiteBackgroundStyle'))return;
  const style=document.createElement('style');
  style.id='sakSiteBackgroundStyle';
  style.textContent=`
    body:not(.locked){
      background-image:none!important;
      background-color:#02090b!important;
      isolation:isolate!important;
    }
    #sakSiteBackgroundVideo{
      position:fixed!important;
      inset:0!important;
      width:100vw!important;
      height:100dvh!important;
      object-fit:cover!important;
      object-position:center center!important;
      z-index:-1!important;
      pointer-events:none!important;
      background:#02090b!important;
    }
    body.locked #sakSiteBackgroundVideo{
      display:none!important;
    }
    #sakSiteBackgroundBtn{
      cursor:pointer!important;
      touch-action:manipulation!important;
    }
  `;
  document.head.appendChild(style);
}

function removeOldSeaSoundControl(){
  const direct=document.getElementById('sakakerBirdSoundBtn');
  if(direct&&!direct.closest('#loginOverlay'))direct.remove();

  const audio=document.getElementById('sakakerBirdAudio');
  if(audio&&!audio.closest('#loginOverlay')){
    try{audio.pause();audio.currentTime=0;}catch(_){ }
    audio.remove();
  }

  const nodes=[...document.querySelectorAll('button,[role="button"],[title],[aria-label]')];
  nodes.forEach(el=>{
    if(el.closest('#loginOverlay'))return;
    if(el.id==='sakSiteBackgroundBtn')return;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    if(/صوت\s*البحر|Sea\s*Sound|Ocean\s*Sound/i.test(s))el.remove();
  });
}

function updateSiteBackgroundButton(){
  const btn=document.getElementById('sakSiteBackgroundBtn');
  const video=document.getElementById('sakSiteBackgroundVideo');
  if(!btn||!video)return;
  const en=document.documentElement.lang==='en';
  const playing=!video.paused&&!video.muted;
  const label=en?'Page Background':'خلفية الصفحة';
  btn.setAttribute('aria-label',label);
  btn.title=label;
  btn.dataset.sound=playing?'on':'off';
  if(!btn.classList.contains('sak-ostrich-icon'))btn.textContent=playing?'🔊':'🎬';
}

async function startSiteBackgroundSound(){
  const video=document.getElementById('sakSiteBackgroundVideo');
  if(!video||isLocked())return false;
  video.muted=false;
  video.volume=1;
  try{
    await video.play();
    updateSiteBackgroundButton();
    return true;
  }catch(_){
    updateSiteBackgroundButton();
    return false;
  }
}

function ensureSiteBackground(){
  if(!document.body)return;
  installSiteBackgroundStyle();
  removeOldSeaSoundControl();

  let video=document.getElementById('sakSiteBackgroundVideo');
  if(!video){
    video=document.createElement('video');
    video.id='sakSiteBackgroundVideo';
    video.src=SITE_BG_SRC;
    video.autoplay=true;
    video.loop=true;
    video.playsInline=true;
    video.preload='auto';
    video.muted=false;
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.setAttribute('aria-hidden','true');
    document.body.prepend(video);
    video.addEventListener('play',updateSiteBackgroundButton);
    video.addEventListener('pause',updateSiteBackgroundButton);
    video.addEventListener('volumechange',updateSiteBackgroundButton);
  }

  let btn=document.getElementById('sakSiteBackgroundBtn');
  if(!btn){
    btn=document.createElement('button');
    btn.id='sakSiteBackgroundBtn';
    btn.type='button';
    btn.textContent='🎬';
    btn.setAttribute('aria-label','خلفية الصفحة');
    btn.title='خلفية الصفحة';
    btn.addEventListener('click',async e=>{
      e.preventDefault();
      e.stopPropagation();
      if(video.paused){
        await startSiteBackgroundSound();
      }else{
        video.muted=!video.muted;
        if(!video.muted)await video.play().catch(()=>{});
        updateSiteBackgroundButton();
      }
    });
    document.body.appendChild(btn);
  }

  if(isLocked()){
    video.pause();
  }else{
    startSiteBackgroundSound();
  }
  updateSiteBackgroundButton();
}

function syncSiteBackgroundLock(){
  const video=document.getElementById('sakSiteBackgroundVideo');
  if(!video)return;
  if(isLocked()){
    video.pause();
  }else{
    startSiteBackgroundSound();
  }
  updateSiteBackgroundButton();
}

function validCandidate(el){return !!el&&!el.closest(EXCLUDED)&&!el.closest('dialog');}
function firstCandidate(selectors){
  for(const selector of selectors||[]){
    const found=[...document.querySelectorAll(selector)].find(validCandidate);
    if(found)return found;
  }
  return null;
}

function findUtilityItem(info){
  const item=typeof info.finder==='function'?info.finder():firstCandidate(info.selectors);
  return validCandidate(item)?item:null;
}

function make(tag,attrs={}){
  const n=document.createElementNS(NS,tag);
  for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);
  return n;
}

function safeKey(value){return String(value||'icon').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,36)||'icon';}

function ostrichSVG(key){
  const k=safeKey(key);
  const gid='sakOstrichGold_'+k;
  const svg=make('svg',{viewBox:'0 0 100 120','aria-hidden':'true',focusable:'false',class:'sak-ostrich-svg'});
  const defs=make('defs');
  const gold=make('linearGradient',{id:gid,x1:'0',y1:'0',x2:'1',y2:'1'});
  gold.append(
    make('stop',{offset:'0','stop-color':'#fffbdc'}),
    make('stop',{offset:'.42','stop-color':'#ffe47a'}),
    make('stop',{offset:'1','stop-color':'#ff9f1a'})
  );
  defs.append(gold);svg.appendChild(defs);

  const body=make('g',{class:'sak-ostrich-body'});
  body.append(
    make('ellipse',{cx:'48',cy:'68',rx:'27',ry:'21',fill:`url(#${gid})`,stroke:'#fff8d4','stroke-width':'2'}),
    make('path',{d:'M59 58 C70 46 70 29 67 19 C65 12 69 8 75 9 C81 10 84 16 82 23 C79 34 77 45 78 56',fill:'none',stroke:`url(#${gid})`,'stroke-width':'7','stroke-linecap':'round'}),
    make('circle',{cx:'77',cy:'15',r:'8',fill:`url(#${gid})`,stroke:'#fff','stroke-width':'1.5'}),
    make('circle',{cx:'79.2',cy:'13',r:'1.6',fill:'#07131b'}),
    make('path',{d:'M84 16 L94 19 L84 22 Z',fill:'#ffb52e'}),
    make('path',{d:'M29 63 Q11 52 18 42 Q34 48 41 59',fill:`url(#${gid})`,opacity:'.96'}),
    make('path',{d:'M42 84 L39 109 M59 84 L63 109',stroke:'#fff2b5','stroke-width':'4','stroke-linecap':'round'}),
    make('path',{d:'M35 110 L45 110 M58 110 L69 110',stroke:'#ffd85a','stroke-width':'4','stroke-linecap':'round'})
  );

  svg.append(body);
  return svg;
}

function deriveLabel(el,key){
  const en=document.documentElement.lang==='en';
  const mapped=labels[key];
  if(mapped)return en?mapped.en:mapped.ar;
  const old=el.querySelector('.icon-label,.sak-final-label,.label,.title');
  const text=(old?.textContent||el.getAttribute('aria-label')||el.getAttribute('title')||'').replace(/\s+/g,' ').trim();
  if(text)return text.slice(0,28);
  return en?'Icon':'أيقونة';
}

function decorateAsOstrich(el,key){
  if(!el)return;
  const stableKey=safeKey(key||el.id||el.dataset.sakakerDockKey||'icon');
  el.classList.add('sak-ostrich-icon','sakaker-dock-entry');
  el.dataset.sakakerDockKey=stableKey;

  let art=el.querySelector(':scope > .sak-ostrich-art');
  if(!art){
    art=document.createElement('span');
    art.className='sak-ostrich-art';
    el.prepend(art);
  }
  art.replaceChildren(ostrichSVG(stableKey));
  art.dataset.key=stableKey;

  let name=el.querySelector(':scope > .sak-ostrich-name');
  if(!name){
    name=document.createElement('span');
    name.className='sak-ostrich-name';
    el.appendChild(name);
  }
  name.textContent=deriveLabel(el,key);
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
    slot.className='sakaker-utility-slot';
    slot.dataset.sakakerUtil=key;
    utility.appendChild(slot);
  }
  return slot;
}

function rebuildIconAppearance(){
  const dock=document.getElementById('sakakerAllIconsDock');
  if(!dock)return;

  const cards=[...document.querySelectorAll('.cards')].find(el=>!el.closest(EXCLUDED)&&el.querySelector('.icon-card'));
  if(cards){
    if(cards.parentElement!==dock)dock.appendChild(cards);
    [...cards.querySelectorAll('.icon-card')].forEach((card,index)=>decorateAsOstrich(card,card.id||('main'+index)));
  }

  const utility=ensureUtilityDock(dock);
  utilityItems.forEach(info=>{
    const item=findUtilityItem(info);
    if(!item)return;
    const slot=ensureSlot(utility,info.key);
    if(item.parentElement!==slot)slot.appendChild(item);
    decorateAsOstrich(item,info.key);
  });

  utility.querySelectorAll('.sakaker-utility-slot').forEach(slot=>{
    if(!slot.firstElementChild)slot.remove();
  });
  utilityItems.forEach(info=>{
    const slot=utility.querySelector('[data-sakaker-util="'+info.key+'"]');
    if(slot&&slot.firstElementChild)utility.appendChild(slot);
  });

  dock.dataset.sakakerOstrichLayout='1';
  updateSiteBackgroundButton();
}

function settle(){
  removeVisitorCounters();
  installFacebookEmbeds();
  ensureSiteBackground();
  rebuildIconAppearance();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
window.addEventListener('load',settle,{once:true});
[250,700,1500,3000,5500,9000].forEach(ms=>setTimeout(settle,ms));
new MutationObserver(()=>{installFacebookEmbeds();ensureSiteBackground();rebuildIconAppearance();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

if(document.body){
  new MutationObserver(syncSiteBackgroundLock).observe(document.body,{attributes:true,attributeFilter:['class']});
}else{
  document.addEventListener('DOMContentLoaded',()=>{
    new MutationObserver(syncSiteBackgroundLock).observe(document.body,{attributes:true,attributeFilter:['class']});
  },{once:true});
}

document.addEventListener('pointerdown',()=>{
  if(!isLocked())startSiteBackgroundSound();
},{capture:true});

})();

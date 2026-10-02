(()=>{'use strict';

const NS='http://www.w3.org/2000/svg';
const EXCLUDED='#facebookVideoPopup,#livePopup,#shipPopup_new,#sakakerBusinessPopup,#emeraldLibraryContent,#sakMusicPlayer,#sakTextLibraryModal,#loginOverlay';
const SITE_BG_SRC='/gemini_generated_video_34118154.mp4';
let siteSoundUserMuted=false;

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
    #sakSiteSoundBtn{
      position:fixed!important;
      top:auto!important;
      left:auto!important;
      right:max(12px,env(safe-area-inset-right))!important;
      bottom:max(12px,env(safe-area-inset-bottom))!important;
      transform:none!important;
      z-index:2147483647!important;
      min-width:150px!important;
      min-height:44px!important;
      max-width:calc(100vw - 24px)!important;
      padding:9px 18px!important;
      border:1px solid rgba(255,238,153,.96)!important;
      border-radius:999px!important;
      background:linear-gradient(135deg,rgba(0,112,95,.97),rgba(6,42,55,.97) 58%,rgba(151,104,15,.96))!important;
      color:#fff!important;
      -webkit-text-fill-color:#fff!important;
      box-shadow:0 0 0 2px rgba(0,0,0,.36),0 0 12px rgba(95,255,220,.88),0 0 25px rgba(255,210,72,.58)!important;
      text-shadow:0 1px 2px #000,0 0 8px rgba(255,255,255,.45)!important;
      font:800 14px/1.2 Tajawal,Tahoma,Arial,sans-serif!important;
      letter-spacing:.1px!important;
      cursor:pointer!important;
      touch-action:manipulation!important;
      pointer-events:auto!important;
      opacity:1!important;
      visibility:visible!important;
      white-space:nowrap!important;
      transition:transform .18s ease,filter .18s ease,box-shadow .18s ease!important;
      isolation:isolate!important;
    }
    #sakSiteSoundBtn:hover,
    #sakSiteSoundBtn:focus-visible{
      transform:translateY(-1px) scale(1.03)!important;
      filter:brightness(1.14)!important;
      box-shadow:0 0 0 2px rgba(0,0,0,.4),0 0 16px rgba(95,255,220,1),0 0 32px rgba(255,210,72,.78)!important;
      outline:2px solid #fff6bd!important;
      outline-offset:2px!important;
    }
    #sakSiteSoundBtn[data-sound="off"]{
      background:linear-gradient(135deg,rgba(111,25,44,.97),rgba(45,21,37,.97) 56%,rgba(177,92,13,.96))!important;
      border-color:#ffd27b!important;
      box-shadow:0 0 0 2px rgba(0,0,0,.36),0 0 12px rgba(255,103,125,.66),0 0 22px rgba(255,184,71,.52)!important;
    }
    body.locked #sakSiteSoundBtn{
      display:none!important;
    }
    html body:not(.locked) #sakSeaSoundButton,
    html body:not(.locked) #bird-sound-btn,
    html body:not(.locked) #sakakerBirdSoundBtn{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
      pointer-events:none!important;
    }
    @media(max-width:600px){
      #sakSiteSoundBtn{
        min-width:132px!important;
        min-height:40px!important;
        padding:8px 14px!important;
        font-size:12px!important;
      }
    }
    @media(prefers-reduced-motion:reduce){
      #sakSiteSoundBtn{transition:none!important}
    }
  `;
  document.head.appendChild(style);
}

function removeLegacySoundNode(id){
  const el=document.getElementById(id);
  if(!el||el.closest('#loginOverlay'))return;
  try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){ }
  el.remove();
}

function removeOldSeaSoundControl(){
  ['sakSeaSoundButton','sakSeaAudio','bird-sound-btn','sakakerBirdSoundBtn','sakakerBirdAudio'].forEach(removeLegacySoundNode);

  const nodes=[...document.querySelectorAll('button,[role="button"],[title],[aria-label]')];
  nodes.forEach(el=>{
    if(el.closest('#loginOverlay'))return;
    if(el.id==='sakSiteBackgroundBtn'||el.id==='sakSiteSoundBtn')return;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    if(/صوت\s*البحر|Sea\s*Sound|Ocean\s*Sound/i.test(s))el.remove();
  });

  const circleRoots=document.querySelectorAll('.video-top-container-fixed,#sakSecondStreamCorner,#sakakerVideoSlot');
  circleRoots.forEach(root=>{
    root.querySelectorAll('button,[role="button"],span,[title],[aria-label],[id],[class]').forEach(el=>{
      if(el.closest('#loginOverlay'))return;
      if(el.id==='sakSiteSoundBtn'||el.id==='sakSiteBackgroundBtn')return;
      if(el.matches('video,iframe'))return;
      const meta=((el.id||'')+' '+(el.className||'')+' '+(el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
      if(/sound|audio|mute|volume|speaker|صوت|🔊|🔇|🔈|🔉|🎵|🎶|🌊/i.test(meta))el.remove();
    });
  });
}

function visibleRect(el){
  if(!el)return null;
  const style=getComputedStyle(el);
  if(style.display==='none'||style.visibility==='hidden'||style.opacity==='0')return null;
  const r=el.getBoundingClientRect();
  if(r.width<2||r.height<2)return null;
  return r;
}

function findClockAnchor(){
  const selectors=['#clock','.clock-box','#sakakerClockSlot','.sakaker-news-clock','.news-ticker'];
  for(const selector of selectors){
    for(const el of document.querySelectorAll(selector)){
      if(el.closest('#loginOverlay'))continue;
      if(visibleRect(el))return el;
    }
  }
  return null;
}

function placeSiteSoundAboveClock(){
  if(isLocked())return;
  const btn=document.getElementById('sakSiteSoundBtn');
  if(!btn)return;

  let bottom=12;
  const dock=document.getElementById('sakakerAllIconsDock');
  const dockRect=visibleRect(dock);
  if(dockRect&&dockRect.top<window.innerHeight&&dockRect.bottom>0){
    bottom=Math.max(bottom,window.innerHeight-dockRect.top+8);
  }

  btn.style.setProperty('position','fixed','important');
  btn.style.setProperty('left','auto','important');
  btn.style.setProperty('right','max(10px, env(safe-area-inset-right))','important');
  btn.style.setProperty('top','auto','important');
  btn.style.setProperty('bottom','calc('+Math.round(bottom)+'px + env(safe-area-inset-bottom))','important');
  btn.style.setProperty('transform','none','important');
}

function updateSiteBackgroundButton(){
  const btn=document.getElementById('sakSiteBackgroundBtn');
  const soundBtn=document.getElementById('sakSiteSoundBtn');
  const video=document.getElementById('sakSiteBackgroundVideo');
  if(!video)return;

  const en=document.documentElement.lang==='en';
  const playing=!video.paused&&!video.muted;

  if(btn){
    const label=en?'Page Background':'خلفية الصفحة';
    btn.setAttribute('aria-label',label);
    btn.title=label;
    btn.dataset.sound=playing?'on':'off';
    if(!btn.classList.contains('sak-ostrich-icon'))btn.textContent=playing?'🔊':'🎬';
  }

  if(soundBtn){
    soundBtn.dataset.sound=playing?'on':'off';
    soundBtn.setAttribute('aria-pressed',playing?'true':'false');
    const label=playing
      ?(en?'Background sound is on':'صوت الخلفية يعمل')
      :(en?'Turn on background sound':'تشغيل صوت الخلفية');
    soundBtn.setAttribute('aria-label',label);
    soundBtn.title=label;
    soundBtn.textContent=playing
      ?(en?'🔊 Background sound':'🔊 صوت الخلفية')
      :(en?'🔇 Turn on sound':'🔇 تشغيل الصوت');
    requestAnimationFrame(placeSiteSoundAboveClock);
  }
}

async function startSiteBackgroundSound(force=false){
  const video=document.getElementById('sakSiteBackgroundVideo');
  if(!video||isLocked())return false;

  video.volume=1;

  if(siteSoundUserMuted&&!force){
    video.muted=true;
    try{await video.play();}catch(_){ }
    updateSiteBackgroundButton();
    return false;
  }

  video.muted=false;
  try{
    await video.play();
    updateSiteBackgroundButton();
    return true;
  }catch(_){
    video.muted=true;
    try{await video.play();}catch(__){ }
    updateSiteBackgroundButton();
    return false;
  }
}

function ensureSiteSoundButton(video){
  let soundBtn=document.getElementById('sakSiteSoundBtn');
  if(soundBtn)return soundBtn;

  soundBtn=document.createElement('button');
  soundBtn.id='sakSiteSoundBtn';
  soundBtn.type='button';
  soundBtn.dataset.sound='off';
  soundBtn.setAttribute('aria-pressed','false');
  soundBtn.addEventListener('click',async e=>{
    e.preventDefault();
    e.stopPropagation();
    if(isLocked())return;

    const currentlyOn=!video.paused&&!video.muted;
    if(currentlyOn){
      siteSoundUserMuted=true;
      video.muted=true;
      try{await video.play();}catch(_){ }
    }else{
      siteSoundUserMuted=false;
      await startSiteBackgroundSound(true);
    }
    updateSiteBackgroundButton();
  });
  document.body.appendChild(soundBtn);
  requestAnimationFrame(placeSiteSoundAboveClock);
  return soundBtn;
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

  ensureSiteSoundButton(video);

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
        siteSoundUserMuted=false;
        await startSiteBackgroundSound(true);
      }else if(video.muted){
        siteSoundUserMuted=false;
        await startSiteBackgroundSound(true);
      }else{
        siteSoundUserMuted=true;
        video.muted=true;
        try{await video.play();}catch(_){ }
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
  requestAnimationFrame(placeSiteSoundAboveClock);
}

function syncSiteBackgroundLock(){
  const video=document.getElementById('sakSiteBackgroundVideo');
  if(!video)return;
  if(isLocked()){
    video.pause();
  }else{
    startSiteBackgroundSound();
    removeOldSeaSoundControl();
    requestAnimationFrame(placeSiteSoundAboveClock);
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
  removeOldSeaSoundControl();
  requestAnimationFrame(placeSiteSoundAboveClock);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
window.addEventListener('load',settle,{once:true});
[250,700,1500,3000,5500,9000].forEach(ms=>setTimeout(settle,ms));
new MutationObserver(()=>{installFacebookEmbeds();ensureSiteBackground();rebuildIconAppearance();removeOldSeaSoundControl();requestAnimationFrame(placeSiteSoundAboveClock);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

if(document.body){
  new MutationObserver(syncSiteBackgroundLock).observe(document.body,{attributes:true,attributeFilter:['class']});
}else{
  document.addEventListener('DOMContentLoaded',()=>{
    new MutationObserver(syncSiteBackgroundLock).observe(document.body,{attributes:true,attributeFilter:['class']});
  },{once:true});
}

/* Legacy sea-sound scripts may try to reinsert their old button. Also clean
   sound badges re-added below either circular video. */
const legacySoundObserver=new MutationObserver(records=>{
  let touched=false;
  for(const record of records){
    for(const node of record.addedNodes){
      if(!(node instanceof Element))continue;
      const known=node.matches?.('#sakSeaSoundButton,#sakSeaAudio,#bird-sound-btn,#sakakerBirdSoundBtn,#sakakerBirdAudio')||node.querySelector?.('#sakSeaSoundButton,#sakSeaAudio,#bird-sound-btn,#sakakerBirdSoundBtn,#sakakerBirdAudio');
      const inCircle=!!node.closest?.('.video-top-container-fixed,#sakSecondStreamCorner,#sakakerVideoSlot');
      if(known||inCircle){
        touched=true;
        break;
      }
    }
    if(touched)break;
  }
  if(touched)removeOldSeaSoundControl();
});
if(document.body)legacySoundObserver.observe(document.body,{childList:true,subtree:true});
else document.addEventListener('DOMContentLoaded',()=>legacySoundObserver.observe(document.body,{childList:true,subtree:true}),{once:true});

window.addEventListener('resize',()=>requestAnimationFrame(placeSiteSoundAboveClock),{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(placeSiteSoundAboveClock,120),{passive:true});

document.addEventListener('pointerdown',()=>{
  if(!isLocked()&&!siteSoundUserMuted)startSiteBackgroundSound();
},{capture:true});

})();
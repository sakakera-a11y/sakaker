(()=>{'use strict';

const NS='http://www.w3.org/2000/svg';
const EXCLUDED='#facebookVideoPopup,#livePopup,#shipPopup_new,#sakakerBusinessPopup,#emeraldLibraryContent,#sakMusicPlayer,#sakTextLibraryModal,#loginOverlay';
const SITE_BG_SRC='/gemini_generated_video_34118154.mp4';
let siteSoundUserMuted=true;

/* Requested row order first, then the remaining site tools. */
const utilityItems=[
  /* Castle Tour is positioned independently at the top-center of the page. */
  {key:'pong',selectors:['#pongGame-btn']},
  {key:'music',selectors:['#emOpenBtn','#emeraldMusicHost #emOpenBtn','#emeraldMusicHost button','#emeraldMusicHost [role="button"]']},
  {key:'map',selectors:['#mapIcon','.launcher[data-map]','.launcher[aria-label*="خريطة"]','.launcher[title*="خريطة"]','.launcher']},
  {key:'business',selectors:['#sakakerBusinessAd']},
  /* Keep the hidden launchers registered without affecting the visible order. */
  {key:'textLibrary',finder:findTextLibrary},
  {key:'videoLibrary',selectors:['#emeraldLibraryButton']},
  {key:'live',selectors:['#liveFlasher']},
  {key:'siteBackground',selectors:['#sakSiteBackgroundBtn']}
];

const labels={
  facebook:{ar:'فيس بوك',en:'Facebook'},
  textLibrary:{ar:'المكتبة النصية',en:'Text Library'},
  videoLibrary:{ar:'مكتبة الفيديو',en:'Video Library'},
  live:{ar:'قنوات مباشرة',en:'Live Channels'},
  castleTour:{ar:'تجول بالقلعة',en:'Castle Tour'},
  pong:{ar:'لعبة البونج',en:'Pong'},
  siteBackground:{ar:'خلفية الصفحة',en:'Page Background'},
  ship:{ar:'أبوالقمر زمرد',en:'Abwalqmrzmrd'},
  music:{ar:'تحويل الصوت',en:'Audio'},
  map:{ar:'الخرائط',en:'Maps'},
  business:{ar:'سكاكر بزنس',en:'Business'}
};

function findTextLibrary(){
  const nodes=[...document.querySelectorAll('button,[role="button"],a,.launcher,[title],[aria-label]')];
  return nodes.find(el=>{
    if(el.closest('#sakTextLibraryModal'))return false;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /المكتبة\s*النصية|Text\s*Library/i.test(s);
  })||null;
}

/* Preserve every reel already in the popup, restore the original reel, and add the newly requested reel. */
function installFacebookEmbeds(){
  const popup=document.getElementById('facebookVideoPopup');
  const box=popup?.querySelector('.fbVideoBox');
  const frame=box?.querySelector('.fbVideoFrame');
  if(!box||!frame)return;

  /* The requested featured post always leads the existing Facebook content.
     The Facebook plugin itself renders the post text beneath the post media. */
  let featured=box.querySelector('.sakFeaturedFacebookPost');
  if(!featured){
    featured=document.createElement('section');
    featured.className='sakFeaturedFacebookPost fbPostSection';
    featured.setAttribute('aria-label','Featured Facebook post');
    featured.innerHTML='<div class="fbPostFrame sakFeaturedFacebookPostFrame"></div>';
    box.insertBefore(featured,frame);
  }
  const postFrame=featured.querySelector('.fbPostFrame');
  if(postFrame){
    let iframe=postFrame.querySelector('iframe[data-sak-featured-facebook-post="1"]');
    if(!iframe){
      iframe=document.createElement('iframe');
      iframe.dataset.sakFeaturedFacebookPost='1';
      iframe.scrolling='no';
      iframe.frameBorder='0';
      iframe.allowFullscreen=true;
      iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
      iframe.setAttribute('allowfullscreen','true');
      iframe.setAttribute('title','منشور أبو القمر زمرد على فيسبوك');
      postFrame.appendChild(iframe);
    }
    /* Facebook's post plugin renders at its URL width; a 500px internal
       canvas inside a narrow phone iframe gets clipped. Match plugin width
       to the actual visible dialog width (Facebook minimum: 350px). */
    const availableWidth=postFrame.clientWidth||box.clientWidth||window.innerWidth;
    const postWidth=Math.max(350,Math.min(500,Math.floor(availableWidth-16)));
    const postUrl='https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FAbwAlqmrZmrd%2Fposts%2Fpfbid02BHiNmDHAJCzDNmiTq6DbdPsDfsiJ4f6KwFyHL1mRSucNKYgUD3pjfe6B3DQb5wJdl&show_text=true&width='+postWidth;
    iframe.width=String(postWidth);
    iframe.height='520';
    iframe.style.cssText='display:block;width:100%;max-width:500px;min-width:0;height:clamp(420px,65dvh,600px);border:0;overflow:hidden;margin:0 auto';
    if(iframe.dataset.sakPostWidth!==String(postWidth)){
      iframe.dataset.sakPostWidth=String(postWidth);
      iframe.src=postUrl;
    }
  }

  const reels=[
    {id:'1713298586438007',title:'Facebook Reel'},
    {id:'1028563299794826',title:'Facebook Reel (restored)'},
    {id:'2073566429948129',title:'Facebook Reel'}
  ];

  reels.forEach(({id,title})=>{
    if(box.querySelector('iframe[data-sak-facebook-reel="'+id+'"]'))return;
    const iframe=document.createElement('iframe');
    iframe.dataset.sakFacebookReel=id;
    iframe.src='https://www.facebook.com/plugins/video.php?height=476&href='+encodeURIComponent('https://www.facebook.com/reel/'+id+'/')+'&show_text=true&width=267&t=0';
    iframe.width='267';
    iframe.height='591';
    iframe.style.cssText='display:block;border:none;overflow:hidden;width:267px;max-width:100%;height:591px;min-height:591px;margin:0 auto 12px';
    iframe.scrolling='no';
    iframe.frameBorder='0';
    iframe.allowFullscreen=true;
    iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    iframe.setAttribute('allowfullscreen','true');
    iframe.setAttribute('title',title);
    frame.appendChild(iframe);
  });
}

function watchFacebookEmbeds(){
  const popup=document.getElementById('facebookVideoPopup');
  if(!popup||popup.dataset.sakFacebookWatcherInstalled==='1')return;
  popup.dataset.sakFacebookWatcherInstalled='1';
  let observer;
  const loadWhenVisible=()=>{
    const style=getComputedStyle(popup);
    const rect=popup.getBoundingClientRect();
    if(style.display==='none'||style.visibility==='hidden'||rect.width<2||rect.height<2)return;
    observer?.disconnect();
    document.removeEventListener('click',checkAfterClick,true);
    installFacebookEmbeds();
  };
  const checkAfterClick=()=>requestAnimationFrame(loadWhenVisible);
  observer=new MutationObserver(loadWhenVisible);
  observer.observe(popup,{attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
  document.addEventListener('click',checkAfterClick,true);
  if(popup.dataset.sakFacebookResizeInstalled!=='1'){
    popup.dataset.sakFacebookResizeInstalled='1';
    window.addEventListener('resize',()=>requestAnimationFrame(loadWhenVisible),{passive:true});
  }
  loadWhenVisible();
}

function isLocked(){return document.body?.classList.contains('locked');}

function hideFacebookLaunchers(){
  const candidates=document.querySelectorAll(
    '#facebookVideoIcon,.facebookVideoIcon,[data-sakaker-util="facebook"],[data-sakaker-dock-key="facebook"],' +
    'button[aria-label*="Facebook" i],a[aria-label*="Facebook" i],button[title*="Facebook" i],a[title*="Facebook" i],' +
    'button[aria-label*="فيس بوك"],a[aria-label*="فيس بوك"],button[title*="فيس بوك"],a[title*="فيس بوك"]'
  );
  candidates.forEach(el=>{
    if(el.closest('#facebookVideoPopup,.sak-gull-hub'))return;
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('opacity','0','important');
    el.style.setProperty('pointer-events','none','important');
    if(el.matches('.sakaker-utility-slot')&&!el.querySelector(':scope > *'))el.remove();
  });
}

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
      left:max(8px,env(safe-area-inset-left))!important;
      right:auto!important;
      bottom:max(10px,env(safe-area-inset-bottom))!important;
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
    html body:not(.locked) #sakakerBirdSoundBtn,
    html body:not(.locked) #sakSeaAudio,
    html body:not(.locked) #sakakerBirdAudio{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
      pointer-events:none!important;
    }
    .video-top-container-fixed :is([id*="sound" i],[class*="sound" i],[id*="audio" i],[class*="audio" i],[id*="mute" i],[class*="mute" i],[id*="volume" i],[class*="volume" i]),
    #sakSecondStreamCorner :is([id*="sound" i],[class*="sound" i],[id*="audio" i],[class*="audio" i],[id*="mute" i],[class*="mute" i],[id*="volume" i],[class*="volume" i]),
    #sakakerVideoSlot :is([id*="sound" i],[class*="sound" i],[id*="audio" i],[class*="audio" i],[id*="mute" i],[class*="mute" i],[id*="volume" i],[class*="volume" i]){
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
      const ownText=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent||'').join(' ').trim();
      const meta=((el.id||'')+' '+(typeof el.className==='string'?el.className:'')+' '+(el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+ownText).replace(/\s+/g,' ').trim();
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

/* Place the background-sound control beside the visible language switch.
   If no language switch can be identified, retain the safe legacy placement. */
function placeSiteSoundAboveClock(){
  if(isLocked())return;
  const btn=document.getElementById('sakSiteSoundBtn');
  if(!btn)return;

  const controls=[...document.querySelectorAll('button,[role="button"],a,[tabindex]')]
    .filter(el=>el!==btn&&!el.closest('#loginOverlay')&&!el.closest('#sakakerAllIconsDock')&&
      !el.closest('[role="dialog"],dialog')&&visibleRect(el));
  const languageControl=controls.find(el=>{
    const meta=((el.id||'')+' '+(el.className&&typeof el.className==='string'?el.className:'')+' '+
      (el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')+' '+(el.textContent||''))
      .replace(/\s+/g,' ').trim();
    return /language|switch language|تبديل اللغة|تغيير اللغة|التبديل إلى|switch to english|\benglish\b|\barabic\b|العربية|^\s*EN\s*$/i.test(meta);
  });

  const btnWidth=Math.max(btn.offsetWidth||150,120);
  const btnHeight=Math.max(btn.offsetHeight||44,38);
  let left=Math.max(8,Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-left')||'0')||8);
  let top=window.innerHeight-btnHeight-10;

  const languageRect=languageControl&&visibleRect(languageControl);
  if(languageRect){
    const gap=8;
    const centerY=languageRect.top+languageRect.height/2;
    // Put the sound control immediately beside the language control, toward
    // the center of the screen, and keep both controls inside the viewport.
    left=languageRect.left>window.innerWidth/2
      ? languageRect.left-btnWidth-gap
      : languageRect.right+gap;
    top=centerY-btnHeight/2;
  }else{
    const paymentRect=visibleRect(document.getElementById('sakGlobalPayment'));
    if(paymentRect){
      left=paymentRect.right+10;
      top=paymentRect.top-btnHeight-17;
    }
  }

  left=Math.max(8,Math.min(window.innerWidth-btnWidth-8,left));
  top=Math.max(8,Math.min(window.innerHeight-btnHeight-8,top));
  btn.style.setProperty('position','fixed','important');
  btn.style.setProperty('left',Math.round(left)+'px','important');
  btn.style.setProperty('right','auto','important');
  btn.style.setProperty('top',Math.round(top)+'px','important');
  btn.style.setProperty('bottom','auto','important');
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
      ?(en?'Background sound':'صوت الخلفية')
      :(en?'Turn on sound':'تشغيل الصوت');
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

  /* Performance: never create/download the heavy main-site background video
     while the Google login gate is still visible. It is created only after
     authentication unlocks the page. */
  if(isLocked())return;

  removeOldSeaSoundControl();
  let video=document.getElementById('sakSiteBackgroundVideo');
  if(!video){
    video=document.createElement('video');
    video.id='sakSiteBackgroundVideo';
    video.src=SITE_BG_SRC;
    video.autoplay=true;
    video.loop=true;
    video.playsInline=true;
    /* Metadata is enough before playback begins; play() will stream the
       actual video once the authenticated site is visible. */
    video.preload='none';
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

  /* لا تبدأ تنزيل/تشغيل فيديو خلفية الموقع تلقائيًا بعد الدخول.
     يبقى متاحًا من زر الخلفية عند طلب المستخدم فقط. */
  video.muted=true;
  video.pause();
  updateSiteBackgroundButton();
  requestAnimationFrame(placeSiteSoundAboveClock);
}

function syncSiteBackgroundLock(){
  let video=document.getElementById('sakSiteBackgroundVideo');

  if(isLocked()){
    if(video)video.pause();
    return;
  }

  /* A login may complete after settle()'s startup retries have finished. */
  loadVisitorCounterModule();

  /* Load the clock after login, but defer heavy Facebook embeds until requested. */
  loadPaymentClock();
  watchFacebookEmbeds();

  /* The video is intentionally absent during login. Create it now, once,
     immediately after Firebase unlocks the page. */
  if(!video){
    ensureSiteBackground();
    video=document.getElementById('sakSiteBackgroundVideo');
    if(!video)return;
  }

  /* إبقاء الخلفية متوقفة حتى يضغط المستخدم زر تشغيل الخلفية. */
  video.muted=true;
  video.pause();
  updateSiteBackgroundButton();
  ensureCastleTourLauncher();
  ensureCastleStoriesLauncher();
  ensureTitanicShipLauncher();
  hideFacebookLaunchers();
  rebuildIconAppearance();
  removeOldSeaSoundControl();
  requestAnimationFrame(placeSiteSoundAboveClock);
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

  // The ship is an original, transparent side-profile ocean-liner emblem.
  // It deliberately has no circle, plate, badge, or background fill.
  if(k==='ship'){
    const svg=make('svg',{viewBox:'0 0 160 100','aria-hidden':'true',focusable:'false',class:'sak-ostrich-svg sak-titanic-ship-svg'});
    const defs=make('defs');
    const hull=make('linearGradient',{id:'sakShipHullGradient',x1:'0',y1:'0',x2:'0',y2:'1'});
    hull.append(
      make('stop',{offset:'0','stop-color':'#263c50'}),
      make('stop',{offset:'.55','stop-color':'#0b1b2b'}),
      make('stop',{offset:'1','stop-color':'#030b13'})
    );
    const ivory=make('linearGradient',{id:'sakShipIvoryGradient',x1:'0',y1:'0',x2:'0',y2:'1'});
    ivory.append(
      make('stop',{offset:'0','stop-color':'#fffef0'}),
      make('stop',{offset:'.58','stop-color':'#e9e0c5'}),
      make('stop',{offset:'1','stop-color':'#b7a77f'})
    );
    const gold=make('linearGradient',{id:'sakShipGoldGradient',x1:'0',y1:'0',x2:'1',y2:'1'});
    gold.append(
      make('stop',{offset:'0','stop-color':'#fff5b5'}),
      make('stop',{offset:'.48','stop-color':'#e7bd55'}),
      make('stop',{offset:'1','stop-color':'#9a6822'})
    );
    defs.append(hull,ivory,gold);
    svg.appendChild(defs);

    const liner=make('g',{class:'sak-titanic-ship'});
    liner.append(
      // Long, tapered black-and-gold hull.
      make('path',{d:'M8 62 L151 62 L139 79 Q133 87 116 88 L43 88 Q23 85 8 62Z',fill:'url(#sakShipHullGradient)',stroke:'#e4bd62','stroke-width':'2.2','stroke-linejoin':'round'}),
      make('path',{d:'M12 64 Q75 70 148 64',fill:'none',stroke:'#fff0ae','stroke-width':'1.4',opacity:'.9'}),
      // Main white superstructure and promenade decks.
      make('path',{d:'M20 58 L30 43 L123 43 L139 60Z',fill:'url(#sakShipIvoryGradient)',stroke:'#d7b45e','stroke-width':'1.5','stroke-linejoin':'round'}),
      make('path',{d:'M31 43 L39 34 L116 34 L126 43Z',fill:'#f8f1dc',stroke:'#b88b3e','stroke-width':'1.2'}),
      make('path',{d:'M43 34 L49 26 L107 26 L116 34Z',fill:'#fff8e5',stroke:'#c49a4d','stroke-width':'1.1'}),
      make('path',{d:'M112 26 L122 19 L132 26 L132 43 L116 43Z',fill:'url(#sakShipIvoryGradient)',stroke:'#c49a4d','stroke-width':'1.1'}),
      // Four classic ocean-liner funnels with dark caps and warm ochre bands.
      ...[37,59,81,103].flatMap((x,i)=>[
        make('rect',{x:String(x),y:String(i===3?12:14),width:'10',height:String(i===3?17:20),rx:'1.6',fill:'#c78b43',stroke:'#f5d68a','stroke-width':'1'}),
        make('rect',{x:String(x-1),y:String(i===3?11:13),width:'12',height:'4',rx:'1',fill:'#172536',stroke:'#d8b15a','stroke-width':'.8'}),
        make('path',{d:`M${x+1} ${i===3?19:21} L${x+9} ${i===3?19:21}`,stroke:'#f5e0a1','stroke-width':'1',opacity:'.85'})
      ]),
      // Fine deck rails and mast.
      make('path',{d:'M25 41 L122 41 M35 32 L113 32 M49 25 L108 25',fill:'none',stroke:'#8c713f','stroke-width':'1'}),
      make('path',{d:'M25 41 L25 35 M44 32 L44 27 M110 32 L110 27 M130 43 L130 35',fill:'none',stroke:'#a98a4d','stroke-width':'1'}),
      make('path',{d:'M22 43 L22 22 M22 22 L31 27 M22 28 L16 33',fill:'none',stroke:'#d9b96b','stroke-width':'1.3','stroke-linecap':'round'}),
      // Rows of dark portholes and lit cabin windows.
      ...Array.from({length:13},(_,i)=>make('circle',{cx:String(29+i*8.1),cy:'75',r:'1.55',fill:i%3===0?'#ffe9a0':'#b8c7cb',stroke:'#e5c16b','stroke-width':'.35'})),
      ...[36,48,60,72,84,96,108,120].map(x=>make('rect',{x:String(x),y:'49',width:'5',height:'4',rx:'.7',fill:'#253b4a',stroke:'#b99a59','stroke-width':'.5'})),
      // Gold wake and two restrained sea lines under the hull.
      make('path',{d:'M10 91 Q34 87 57 91 T105 91 T151 91',fill:'none',stroke:'#e5c16b','stroke-width':'1.8','stroke-linecap':'round',opacity:'.95'}),
      make('path',{d:'M24 96 Q48 93 70 96 T119 96 T145 96',fill:'none',stroke:'#8ed8d2','stroke-width':'1.2','stroke-linecap':'round',opacity:'.75'})
    );
    svg.appendChild(liner);
    return svg;
  }

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

function titanicShipSVG(){
  return '<svg class="sak-titanic-liner" viewBox="0 0 180 110" role="img" aria-label="Titanic style ocean liner" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sakTitanicHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43596b"/><stop offset=".55" stop-color="#142638"/><stop offset="1" stop-color="#050b12"/></linearGradient><linearGradient id="sakTitanicDeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf0"/><stop offset="1" stop-color="#c8b58c"/></linearGradient><linearGradient id="sakTitanicGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0a8"/><stop offset=".5" stop-color="#c99b42"/><stop offset="1" stop-color="#fff0a8"/></linearGradient></defs><g stroke-linejoin="round"><path d="M7 65H173L154 88Q145 97 121 99H48Q20 94 7 65Z" fill="url(#sakTitanicHull)" stroke="url(#sakTitanicGold)" stroke-width="2.7"/><path d="M14 68Q87 76 166 68" fill="none" stroke="#f7e4ad" stroke-width="1.7"/><path d="M23 62L37 43H143L159 65Z" fill="url(#sakTitanicDeck)" stroke="#c69c51" stroke-width="1.6"/><path d="M39 43L49 33H133L144 43Z" fill="#fff9e9" stroke="#c69c51" stroke-width="1.4"/><path d="M53 33L62 25H119L130 33Z" fill="#fffdf3" stroke="#c69c51" stroke-width="1.2"/><path d="M67 25L73 19H111L119 25Z" fill="#f7edcf" stroke="#b58b46"/><g fill="#b86e32" stroke="url(#sakTitanicGold)" stroke-width="1.5"><path d="M51 27V9H65V27Z"/><path d="M75 25V6H89V25Z"/><path d="M99 25V6H113V25Z"/><path d="M123 27V9H137V27Z"/></g><g fill="#152536"><path d="M49 8H67V13H49Z"/><path d="M73 5H91V10H73Z"/><path d="M97 5H115V10H97Z"/><path d="M121 8H139V13H121Z"/></g><path d="M19 61H154M34 44H146" stroke="#9e7b42" stroke-width="1"/><g fill="#f5dfa4" stroke="#a67d3c" stroke-width=".5">'+Array.from({length:16},(_,i)=>'<circle cx="'+(29+i*8)+'" cy="81" r="1.7"/>').join('')+'</g><path d="M10 101Q42 95 73 101T136 101T173 101" fill="none" stroke="#e8c875" stroke-width="2" stroke-linecap="round"/><path d="M27 107Q59 102 91 107T153 107" fill="none" stroke="#8edbd3" stroke-width="1.4" stroke-linecap="round"/></g></svg>';
}

function ensureTitanicShipLauncher(){
  /* Retire duplicate standalone ship launchers; the ship action now lives
     beside the Facebook videos inside the existing shared gull icon. */
  document.querySelectorAll('#sakTitanicShipLauncher,#shipIcon_new,[data-sakaker-dock-key="ship"]').forEach(el=>{
    if(!el.closest('.sak-gull-hub'))el.remove();
  });
  document.querySelectorAll('#sakakerAllIconsDock [data-sakaker-util="ship"]').forEach(slot=>{
    if(!slot.querySelector(':scope > *'))slot.remove();
  });
  return null;
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
  if(stableKey==='castleStories'){
    // Always show the approved Castle Stories image, never the generic gull SVG.
    const img=document.createElement('img');
    img.src='https://raw.githubusercontent.com/sakakera-a11y/sakaker/refs/heads/main/file_000000007f288208bce7556015d427f9.png';
    img.alt='حكايات القلعة';
    img.loading='eager';
    img.decoding='async';
    img.style.cssText='display:block;width:100%;height:100%;object-fit:contain;border-radius:50%;';
    art.replaceChildren(img);
  }else if(stableKey==='ship'){
    art.innerHTML=titanicShipSVG();
  }else if(stableKey==='castleTour'){
    // The launcher owns the yellow gull illustration; keep it intact.
    if(!art.querySelector('svg'))art.replaceChildren(ostrichSVG(stableKey));
  }else art.replaceChildren(ostrichSVG(stableKey));
  art.dataset.key=stableKey;

  let name=el.querySelector(':scope > .sak-ostrich-name');
  if(!name){
    name=document.createElement('span');
    name.className='sak-ostrich-name';
    el.appendChild(name);
  }
  name.textContent=stableKey==='castleTour'?'':deriveLabel(el,key);
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

function openSakPopup(popup){
  if(!popup)return;
  popup.hidden=false;
  popup.removeAttribute('aria-hidden');
  popup.classList.add('active','open','show');
  popup.style.setProperty('display','flex','important');
  popup.style.setProperty('visibility','visible','important');
  popup.style.setProperty('opacity','1','important');
  popup.style.setProperty('pointer-events','auto','important');
}
function ensureSeagullHub(utility){
  if(!utility)return;
  let hub=utility.querySelector(':scope > .sak-gull-hub');
  if(!hub){
    hub=document.createElement('div');
    hub.className='sak-gull-hub';
    hub.setAttribute('role','group');
    hub.setAttribute('aria-label','فيسبوك والسفينة');
    const bird=document.createElement('span');
    bird.className='sak-gull-hub-art';
    bird.innerHTML=ostrichSVG('facebook').outerHTML;
    const actions=document.createElement('div');
    actions.className='sak-gull-hub-actions';
    const facebook=document.createElement('button');
    facebook.type='button';facebook.className='sak-gull-action sak-gull-facebook';
    facebook.textContent='Facebook';facebook.setAttribute('aria-label','عرض مقاطع الفيديو');
    facebook.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const popup=document.getElementById('facebookVideoPopup');
      if(popup){openSakPopup(popup);watchFacebookEmbeds();installFacebookEmbeds();}
    });
    const ship=document.createElement('button');
    ship.type='button';ship.className='sak-gull-action sak-gull-ship';
    ship.textContent='السفينة';ship.setAttribute('aria-label','فتح نافذة السفينة');
    ship.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      openSakPopup(document.getElementById('shipPopup_new'));
    });
    actions.append(facebook,ship);
    hub.append(bird,actions);
    utility.appendChild(hub);
  }
}
function rebuildIconAppearance(){
  const docks=[...document.querySelectorAll('#sakakerAllIconsDock')];
  const dock=docks[0]||null;
  if(!dock)return;

  /* If a legacy script produced a second dock, collapse it into the primary
     dock without duplicating entries that already exist. */
  docks.slice(1).forEach(extra=>{
    [...extra.children].forEach(child=>{
      const id=child.id;
      const key=child.dataset?.sakakerDockKey;
      const duplicate=(id&&dock.querySelector('#'+CSS.escape(id)))||
        (key&&dock.querySelector('[data-sakaker-dock-key="'+key+'"]'));
      if(duplicate){child.remove();return;}
      dock.appendChild(child);
    });
    extra.remove();
  });

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

  ensureSeagullHub(utility);

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

let visitorCounterModuleRequested=false;
function loadVisitorCounterModule(){
  if(visitorCounterModuleRequested)return;
  visitorCounterModuleRequested=true;
  const script=document.createElement('script');
  script.type='module';
  script.src='/assets/visitor-counter.js?v=20261014-d1-v2';
  script.onerror=()=>{visitorCounterModuleRequested=false;};
  document.head.appendChild(script);
}



function ensureCastleStoriesLauncher(){
  if(document.getElementById('sakCastleStoriesLauncherScript'))return;
  const script=document.createElement('script');
  script.id='sakCastleStoriesLauncherScript';
  script.src='/assets/castle-stories-launcher.js?v=20261030-2';
  script.async=true;
  document.head.appendChild(script);
}

function ensureCastleTourLauncher(){
  // A dedicated independent launcher is required: the original horizontal
  // dock clips/scrolls buttons out of view on many phones.
  if(document.getElementById('sakCastleTourLauncherScript'))return;
  const script=document.createElement('script');
  script.id='sakCastleTourLauncherScript';
  script.src='/assets/castle-tour-launcher.js?v=20261030-loading1';
  script.async=true;
  document.head.appendChild(script);
}

let sitePaymentClockRequested=false;
function loadPaymentClock(){
  if(sitePaymentClockRequested||document.getElementById('sakPaymentClockScript'))return;
  sitePaymentClockRequested=true;
  const script=document.createElement('script');
  script.id='sakPaymentClockScript';
  script.src='/assets/payment-clock.js?v=20261011-bottomreadable3';
  script.async=true;
  script.onerror=()=>{sitePaymentClockRequested=false;script.remove()};
  document.head.appendChild(script);
}

function settle(){
  installSiteBackgroundStyle();

  /* Keep login lightweight: do not start visitor tracking or rebuild launchers
     until the authenticated page is visible. */
  if(isLocked())return;

  ensureTitanicShipLauncher();
  hideFacebookLaunchers();
  loadVisitorCounterModule();
  watchFacebookEmbeds();
  loadPaymentClock();
  ensureCastleTourLauncher();
  ensureCastleStoriesLauncher();
  ensureSiteBackground();
  rebuildIconAppearance();
  removeOldSeaSoundControl();
  requestAnimationFrame(placeSiteSoundAboveClock);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
window.addEventListener('load',settle,{once:true});
[500,1500,3500,7000].forEach(ms=>setTimeout(settle,ms));
new MutationObserver(()=>{
  if(isLocked())return;
  hideFacebookLaunchers();
  ensureTitanicShipLauncher();
  watchFacebookEmbeds();
  loadPaymentClock();
  ensureCastleTourLauncher();
  ensureSiteBackground();
  rebuildIconAppearance();
  removeOldSeaSoundControl();
  requestAnimationFrame(placeSiteSoundAboveClock);
}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

/* Run the expensive icon/layout reconciliation only when the login
   lock actually changes. Other body class updates must not rebuild every icon. */
let lastObservedLoginLock=isLocked();
function handleLoginLockChange(){
  const locked=isLocked();
  if(locked===lastObservedLoginLock)return;
  lastObservedLoginLock=locked;
  syncSiteBackgroundLock();
}

if(document.body){
  new MutationObserver(handleLoginLockChange).observe(document.body,{attributes:true,attributeFilter:['class']});
}else{
  document.addEventListener('DOMContentLoaded',()=>{
    lastObservedLoginLock=isLocked();
    new MutationObserver(handleLoginLockChange).observe(document.body,{attributes:true,attributeFilter:['class']});
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

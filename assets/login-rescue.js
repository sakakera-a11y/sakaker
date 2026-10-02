(()=>{'use strict';
if(window.__sakakerLoginRescueLoaded)return;
window.__sakakerLoginRescueLoaded=true;

/* Keep the browser-tab name English only, regardless of the site language. */
const SITE_TAB_TITLE='Emerald Moon Castle';
function keepSiteTabTitle(){
  if(document.title!==SITE_TAB_TITLE)document.title=SITE_TAB_TITLE;
}
keepSiteTabTitle();
const titleElement=document.querySelector('title');
if(titleElement){
  new MutationObserver(keepSiteTabTitle).observe(titleElement,{childList:true,characterData:true,subtree:true});
}
new MutationObserver(keepSiteTabTitle).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

const CONFIG={
  apiKey:'AIzaSyCZw747d_KJa85KTDSOVI8EeX_J9Grpqrk',
  authDomain:'sakaker-9247f.firebaseapp.com',
  projectId:'sakaker-9247f',
  databaseURL:'https://sakaker-9247f-default-rtdb.asia-southeast1.firebasedatabase.app',
  storageBucket:'sakaker-9247f.firebasestorage.app',
  messagingSenderId:'689588937441',
  appId:'1:689588937441:web:4d17a1d02e72189bbfcda0',
  measurementId:'G-RB0V6GTVER'
};

const $=id=>document.getElementById(id);
const overlay=$('loginOverlay');
const google=$('googleButton');
const errorEl=$('loginError');
const profile=$('userProfile');

function langEn(){return document.documentElement.lang==='en'}
function setError(msgAr,msgEn){if(errorEl)errorEl.textContent=langEn()?msgEn:msgAr}
function setBusy(busy){
  if(!google)return;
  google.disabled=!!busy;
  google.setAttribute('aria-busy',busy?'true':'false');
}

/* Main-site sound control only: keep login page untouched. */
function installPostLoginSoundStyle(){
  if(document.getElementById('sakPostLoginSoundStyle'))return;
  const style=document.createElement('style');
  style.id='sakPostLoginSoundStyle';
  style.textContent=`
    body:not(.locked) #bird-sound-btn,
    body:not(.locked) #sakakerBirdSoundBtn,
    body:not(.locked) #sakSeaSoundButton,
    body:not(.locked) #sakSeaAudio,
    body:not(.locked) #sakakerBirdAudio{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
      pointer-events:none!important;
    }
  `;
  document.head.appendChild(style);
}

function visibleRect(el){
  if(!el)return null;
  const style=getComputedStyle(el);
  if(style.display==='none'||style.visibility==='hidden'||style.opacity==='0')return null;
  const r=el.getBoundingClientRect();
  return r.width>1&&r.height>1?r:null;
}

function placePostLoginSoundButton(){
  if(!document.body||document.body.classList.contains('locked'))return;
  const btn=$('sakSiteSoundBtn');
  if(!btn)return;

  const payment=$('sakGlobalPayment');
  const paymentRect=visibleRect(payment);
  const width=Math.max(btn.offsetWidth||150,120);
  const height=Math.max(btn.offsetHeight||44,38);
  let left=8;
  let top=window.innerHeight-height-10;

  if(paymentRect){
    left=paymentRect.left+(paymentRect.width-width)/2;
    top=paymentRect.bottom+8;
  }

  left=Math.max(8,Math.min(window.innerWidth-width-8,left));
  top=Math.max(8,Math.min(window.innerHeight-height-8,top));

  btn.style.setProperty('position','fixed','important');
  btn.style.setProperty('left',Math.round(left)+'px','important');
  btn.style.setProperty('right','auto','important');
  btn.style.setProperty('top',Math.round(top)+'px','important');
  btn.style.setProperty('bottom','auto','important');
  btn.style.setProperty('transform','none','important');
}

function syncPostLoginSoundUi(){
  installPostLoginSoundStyle();
  placePostLoginSoundButton();
}

/* Entertainment Station: activate it from a file that index.html already loads,
   so it works immediately even when an older embedded chess launcher is cached. */
function installEntertainmentStyle(){
  if(document.getElementById('sakEntertainmentRuntimeStyle'))return;
  const style=document.createElement('style');
  style.id='sakEntertainmentRuntimeStyle';
  style.textContent=`
    body:not(.locked) [data-sak-entertainment-source="1"],
    body:not(.locked) .sakaker-utility-slot[data-sak-entertainment-empty="1"]{
      display:none!important;visibility:hidden!important;pointer-events:none!important;
    }
    #sakEntertainmentStationRuntime[hidden]{display:none!important}
    #sakEntertainmentStationRuntime{
      position:fixed!important;inset:0!important;z-index:2147483647!important;
      display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;
      background:rgba(0,9,15,.8);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      font-family:Tajawal,Tahoma,Arial,sans-serif;color:#effff8;
    }
    #sakEntertainmentStationRuntime .sak-ent-panel{
      width:min(640px,calc(100vw - 22px));max-height:calc(100dvh - 24px);overflow:auto;
      padding:18px;border:1px solid rgba(164,255,222,.78);border-radius:24px;
      background:linear-gradient(145deg,rgba(4,40,45,.97),rgba(4,15,29,.98) 62%,rgba(66,43,11,.95));
      box-shadow:0 0 18px rgba(84,255,216,.58),0 0 42px rgba(255,211,84,.2);box-sizing:border-box;
    }
    #sakEntertainmentStationRuntime .sak-ent-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
    #sakEntertainmentStationRuntime h2{margin:0;color:#eafff6;font-size:clamp(18px,4vw,26px);text-shadow:0 0 10px rgba(101,255,220,.72)}
    #sakEntertainmentRuntimeClose{flex:0 0 auto;width:44px;height:44px;border-radius:50%;border:1px solid #ffe28a;background:rgba(35,15,11,.86);color:#fff;font-size:25px;cursor:pointer}
    #sakEntertainmentRuntimeGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    #sakEntertainmentRuntimeGrid button{min-height:92px;border:1px solid rgba(152,255,225,.6);border-radius:18px;background:linear-gradient(145deg,rgba(0,82,77,.78),rgba(7,29,45,.92));color:#fff;cursor:pointer;padding:12px;display:flex;align-items:center;justify-content:center;gap:9px;flex-direction:column;text-align:center;font:800 15px/1.3 Tajawal,Tahoma,Arial,sans-serif;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 0 13px rgba(63,255,217,.22)}
    #sakEntertainmentRuntimeGrid button:hover,#sakEntertainmentRuntimeGrid button:focus-visible{filter:brightness(1.12);outline:2px solid #ffe99e;outline-offset:2px}
    #sakEntertainmentRuntimeGrid .sak-ent-symbol{font-size:32px;line-height:1}
    @media(max-width:600px){
      #sakEntertainmentStationRuntime{padding:7px}
      #sakEntertainmentStationRuntime .sak-ent-panel{padding:13px;border-radius:18px}
      #sakEntertainmentRuntimeGrid{grid-template-columns:1fr;gap:9px}
      #sakEntertainmentRuntimeGrid button{min-height:68px;flex-direction:row;justify-content:flex-start;text-align:start}
    }
  `;
  document.head.appendChild(style);
}

function entertainmentSource(action){
  const ids={music:['emOpenBtn'],creative:['sakCreativeIcon'],pong:['pongGame-btn'],chat:['sakChatIcon','chatIcon','chatBtn','openChatBtn','chatToggle','sakakerChatIcon']};
  for(const id of ids[action]||[]){const el=$(id);if(el)return el;}
  if(action==='chat'){
    const nodes=[...document.querySelectorAll('#sakakerAllIconsDock button,#sakakerAllIconsDock [role="button"],#sakakerAllIconsDock a,.cards .icon-card')];
    return nodes.find(el=>{
      if(el.closest('#sakEntertainmentStationRuntime'))return false;
      const s=((el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
      return /(^|\s)(الشات|الدردشة|chat)(\s|$)/i.test(s);
    })||null;
  }
  return null;
}

function groupEntertainmentSources(){
  ['music','creative','pong','chat'].forEach(action=>{
    const el=entertainmentSource(action);if(!el)return;
    el.dataset.sakEntertainmentSource='1';
    const slot=el.closest('.sakaker-utility-slot');if(slot)slot.dataset.sakEntertainmentEmpty='1';
  });
}

function updateEntertainmentLanguage(){
  const gull=$('sakEmeraldChessIcon');
  const label=langEn()?'Entertainment Station':'المحطة الترفيهية';
  if(gull){
    gull.setAttribute('aria-label',label);gull.title=label;
    const small=gull.querySelector('small');if(small&&small.textContent!==label)small.textContent=label;
  }
  const modal=$('sakEntertainmentStationRuntime');if(!modal)return;
  modal.dir=langEn()?'ltr':'rtl';
  const title=$('sakEntertainmentRuntimeTitle');if(title)title.textContent=label;
  const close=$('sakEntertainmentRuntimeClose');if(close){close.title=langEn()?'Close':'إغلاق';close.setAttribute('aria-label',close.title)}
  const names={music:langEn()?'Music Studio':'استديو الموسيقى',creative:langEn()?'Creative Studio':'الاستديو الإبداعي',pong:langEn()?'Pong Game':'لعبة البونج',chess:langEn()?'Chess Game':'لعبة الشطرنج',chat:langEn()?'Chat':'الشات'};
  modal.querySelectorAll('[data-ent-action]').forEach(btn=>{const text=btn.querySelector('.sak-ent-text');if(text)text.textContent=names[btn.dataset.entAction]||'';btn.title=names[btn.dataset.entAction]||'';btn.setAttribute('aria-label',btn.title)});
}

function entertainmentPanel(){
  let modal=$('sakEntertainmentStationRuntime');if(modal)return modal;
  modal=document.createElement('div');
  modal.id='sakEntertainmentStationRuntime';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  modal.innerHTML='<div class="sak-ent-panel"><div class="sak-ent-head"><h2 id="sakEntertainmentRuntimeTitle"></h2><button id="sakEntertainmentRuntimeClose" type="button">×</button></div><div id="sakEntertainmentRuntimeGrid"><button type="button" data-ent-action="music"><span class="sak-ent-symbol">🎹</span><span class="sak-ent-text"></span></button><button type="button" data-ent-action="creative"><span class="sak-ent-symbol">🎨</span><span class="sak-ent-text"></span></button><button type="button" data-ent-action="pong"><span class="sak-ent-symbol">🏓</span><span class="sak-ent-text"></span></button><button type="button" data-ent-action="chess"><span class="sak-ent-symbol">♞</span><span class="sak-ent-text"></span></button><button type="button" data-ent-action="chat"><span class="sak-ent-symbol">💬</span><span class="sak-ent-text"></span></button></div></div>';
  document.body.appendChild(modal);
  $('sakEntertainmentRuntimeClose').addEventListener('click',closeEntertainmentPanel);
  modal.addEventListener('click',e=>{if(e.target===modal)closeEntertainmentPanel()});
  $('sakEntertainmentRuntimeGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-ent-action]');if(btn)launchEntertainment(btn.dataset.entAction)});
  updateEntertainmentLanguage();
  return modal;
}

function openEntertainmentPanel(){
  const modal=entertainmentPanel();modal.hidden=false;document.body.dataset.sakEntertainmentOpen='1';
  setTimeout(()=>$('sakEntertainmentRuntimeClose')?.focus(),0);
}
function closeEntertainmentPanel(){
  const modal=$('sakEntertainmentStationRuntime');if(modal)modal.hidden=true;
  if(document.body)delete document.body.dataset.sakEntertainmentOpen;
  $('sakEmeraldChessIcon')?.focus();
}
async function openEntertainmentChess(){
  try{const module=await import('/assets/chess/chess-app.js?v=20260930-5');await module.openChess()}
  catch(_){alert(langEn()?'Chess could not load. Please check your connection and retry.':'تعذر تحميل الشطرنج. تحقق من الاتصال ثم أعد المحاولة.')}
}
function launchEntertainment(action){
  closeEntertainmentPanel();
  if(action==='chess'){openEntertainmentChess();return;}
  const target=entertainmentSource(action);
  if(target){target.click();return;}
  const names={music:['استديو الموسيقى','Music Studio'],creative:['الاستديو الإبداعي','Creative Studio'],pong:['لعبة البونج','Pong'],chat:['الشات','Chat']};
  const name=names[action]||['الخدمة','Service'];
  alert(langEn()?name[1]+' is still loading. Try again in a moment.':name[0]+' لم يكتمل تحميله بعد. أعد المحاولة بعد لحظة.');
}

function mountEntertainmentStation(){
  if(!document.body)return;
  installEntertainmentStyle();
  entertainmentPanel();
  groupEntertainmentSources();
  const gull=$('sakEmeraldChessIcon');
  if(!gull)return;
  if(!gull.dataset.sakEntertainmentBound){
    gull.dataset.sakEntertainmentBound='1';
    gull.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openEntertainmentPanel()},true);
  }
  updateEntertainmentLanguage();
}

function applyUser(user){
  if(user){
    document.body.classList.remove('locked');
    if(overlay){overlay.style.setProperty('display','none','important');overlay.setAttribute('aria-hidden','true')}
    if(profile)profile.style.display='flex';
    const n=$('userName');if(n)n.textContent=user.displayName||user.email||(langEn()?'User':'المستخدم');
    const p=$('userPhoto');if(p&&user.photoURL)p.src=user.photoURL;
    if(errorEl)errorEl.textContent='';
    setTimeout(syncPostLoginSoundUi,0);
    setTimeout(mountEntertainmentStation,0);
  }else{
    document.body.classList.add('locked');
    if(overlay){overlay.style.setProperty('display','flex','important');overlay.removeAttribute('aria-hidden')}
    if(profile)profile.style.display='none';
  }
}

function lightenLoginVideo(){
  const v=$('sakLoginBackgroundVideo');
  if(!v)return;
  try{
    v.removeAttribute('fetchpriority');
    v.preload='metadata';
    const src=v.getAttribute('src')||'';
    if(!src||src.includes('raw.githubusercontent.com')){
      v.src='/gemini_generated_video_be58b3bc.mp4';
      v.load();
    }
    v.muted=true;
    const p=v.play();if(p&&p.catch)p.catch(()=>{});
  }catch(_){}
}
lightenLoginVideo();
installPostLoginSoundStyle();
installEntertainmentStyle();
[0,250,700,1500,3000,5500,9000].forEach(ms=>setTimeout(()=>{syncPostLoginSoundUi();mountEntertainmentStation()},ms));
window.addEventListener('resize',()=>requestAnimationFrame(placePostLoginSoundButton),{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(placePostLoginSoundButton,120),{passive:true});
new MutationObserver(()=>setTimeout(()=>{keepSiteTabTitle();mountEntertainmentStation();updateEntertainmentLanguage()},0)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
if(document.body){
  new MutationObserver(records=>{
    if(records.some(r=>[...r.addedNodes].some(n=>n instanceof Element&&(n.id==='sakEmeraldChessIcon'||n.querySelector?.('#sakEmeraldChessIcon')||n.id==='emOpenBtn'||n.id==='sakCreativeIcon'||n.id==='pongGame-btn'))))mountEntertainmentStation();
  }).observe(document.body,{childList:true,subtree:true});
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('sakEntertainmentStationRuntime')?.hidden)closeEntertainmentPanel()});

(async()=>{
  try{
    const [appMod,authMod]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js')
    ]);
    const app=appMod.getApps().length?appMod.getApp():appMod.initializeApp(window.sakakerFirebaseConfig||CONFIG);
    const auth=window.firebaseAuth||authMod.getAuth(app);
    window.firebaseApp=window.firebaseApp||app;
    window.firebaseAuth=auth;
    try{await authMod.setPersistence(auth,authMod.browserLocalPersistence)}catch(_){}
    authMod.onAuthStateChanged(auth,applyUser,()=>setError('❌ تعذر التحقق من جلسة الدخول. حاول تحديث الصفحة.','❌ Could not verify the sign-in session. Refresh and try again.'));
    if(typeof auth.authStateReady==='function'){
      Promise.race([auth.authStateReady(),new Promise(r=>setTimeout(r,4500))]).then(()=>applyUser(auth.currentUser)).catch(()=>{});
    }else{
      setTimeout(()=>applyUser(auth.currentUser),500);
    }
    if(google){
      google.disabled=false;
      google.setAttribute('aria-busy','false');
      google.addEventListener('click',async e=>{
        e.preventDefault();e.stopImmediatePropagation();
        if(google.disabled)return;
        setBusy(true);if(errorEl)errorEl.textContent='';
        try{
          const provider=new authMod.GoogleAuthProvider();
          provider.setCustomParameters({prompt:'select_account'});
          await authMod.signInWithPopup(auth,provider);
        }catch(err){
          const code=String(err&&err.code||'');
          if(code==='auth/popup-blocked')setError('❌ المتصفح منع نافذة Google. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.','❌ The browser blocked the Google window. Allow pop-ups and try again.');
          else if(code==='auth/unauthorized-domain')setError('❌ نطاق sakaker.co غير مصرح به في Firebase Authentication.','❌ sakaker.co is not authorized in Firebase Authentication.');
          else if(code==='auth/network-request-failed')setError('❌ تعذر الاتصال بخدمة تسجيل الدخول. تحقق من الشبكة ثم حاول مرة أخرى.','❌ Could not reach the sign-in service. Check the network and try again.');
          else if(code==='auth/popup-closed-by-user'||code==='auth/cancelled-popup-request')setError('تم إلغاء تسجيل الدخول.','Sign-in was cancelled.');
          else setError('❌ فشل تسجيل الدخول عبر Google'+(code?' ('+code+')':''),'❌ Google sign-in failed'+(code?' ('+code+')':'') );
          console.error('SAKAKER login rescue:',err);
        }finally{setBusy(false)}
      },true);
    }
    console.log('SAKAKER lightweight login ready');
  }catch(err){
    console.error('SAKAKER lightweight login failed:',err);
    setBusy(false);
    setError('❌ تعذر تحميل نظام تسجيل الدخول. تحقق من الاتصال ثم حدّث الصفحة.','❌ Could not load the sign-in system. Check the connection and refresh.');
  }
})();
})();

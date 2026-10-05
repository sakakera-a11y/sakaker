(()=>{'use strict';
if(window.__sakakerLoginRescueLoaded)return;
window.__sakakerLoginRescueLoaded=true;

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
let facebook=null;
let microsoft=null;

function langEn(){return document.documentElement.lang==='en'}
function setError(msgAr,msgEn){if(errorEl)errorEl.textContent=langEn()?msgEn:msgAr}
function authButtons(){return [google,facebook,microsoft].filter(Boolean)}
function setBusy(busy,active){
  authButtons().forEach(btn=>{
    btn.disabled=!!busy;
    if(busy&&btn===active)btn.setAttribute('aria-busy','true');
    else btn.removeAttribute('aria-busy');
  });
}
function buttonText(kind){
  const en=langEn();
  if(kind==='facebook')return en?'Continue with Facebook':'الدخول بواسطة Facebook';
  if(kind==='microsoft')return en?'Continue with Microsoft':'الدخول بواسطة Microsoft';
  return en?'Continue with Google':'الدخول بواسطة Google';
}
function makeProviderButton(id,kind){
  if(!overlay||!google)return null;
  let btn=$(id);
  if(btn)return btn;
  btn=google.cloneNode(false);
  btn.id=id;
  btn.removeAttribute('onclick');
  btn.removeAttribute('aria-busy');
  btn.type='button';
  btn.dataset.authProvider=kind;
  btn.textContent=buttonText(kind);
  btn.setAttribute('aria-label',buttonText(kind));
  btn.style.marginTop='10px';
  if(kind==='facebook'){
    btn.style.background='#1877f2';btn.style.color='#fff';
  }else{
    btn.style.background='#fff';btn.style.color='#111';btn.style.borderColor='rgba(0,0,0,.2)';
  }
  google.insertAdjacentElement('afterend',btn);
  return btn;
}
function installSocialButtons(){
  facebook=makeProviderButton('facebookButton','facebook');
  microsoft=makeProviderButton('microsoftButton','microsoft');
  if(facebook&&microsoft&&facebook.nextElementSibling!==microsoft)facebook.insertAdjacentElement('afterend',microsoft);
}
function refreshProviderLabels(){
  if(google)google.setAttribute('aria-label',buttonText('google'));
  if(facebook){facebook.textContent=buttonText('facebook');facebook.setAttribute('aria-label',buttonText('facebook'))}
  if(microsoft){microsoft.textContent=buttonText('microsoft');microsoft.setAttribute('aria-label',buttonText('microsoft'))}
}

const LEGACY_SOUND_IDS=['sakSeaAudio','sakSeaSoundButton','bird-sound-btn','sakakerBirdSoundBtn','sakakerBirdAudio'];
function removeExtraSounds(){
  LEGACY_SOUND_IDS.forEach(id=>{
    const el=$(id);if(!el||el.closest?.('#loginOverlay'))return;
    try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){}
    el.remove();
  });
  document.querySelectorAll('audio').forEach(el=>{
    if(el.closest('#loginOverlay')||el.id==='sakSiteBackgroundVideo')return;
    const meta=((el.id||'')+' '+(el.className||'')+' '+(el.getAttribute('src')||'')).toLowerCase();
    if(/bird|sea|ocean|wave|طيور|بحر/.test(meta)){
      try{el.pause();el.currentTime=0;}catch(_){}
      el.remove();
    }
  });
}
function installPostLoginSoundStyle(){
  if(document.getElementById('sakPostLoginSoundStyle'))return;
  const style=document.createElement('style');
  style.id='sakPostLoginSoundStyle';
  style.textContent=`body:not(.locked) #bird-sound-btn,body:not(.locked) #sakakerBirdSoundBtn,body:not(.locked) #sakSeaSoundButton,body:not(.locked) #sakSeaAudio,body:not(.locked) #sakakerBirdAudio{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}`;
  document.head.appendChild(style);
}
function visibleRect(el){
  if(!el)return null;const style=getComputedStyle(el);
  if(style.display==='none'||style.visibility==='hidden'||style.opacity==='0')return null;
  const r=el.getBoundingClientRect();return r.width>1&&r.height>1?r:null;
}
function placePostLoginSoundButton(){
  if(!document.body||document.body.classList.contains('locked'))return;
  const btn=$('sakSiteSoundBtn');if(!btn)return;
  const paymentRect=visibleRect($('sakGlobalPayment'));
  const width=Math.max(btn.offsetWidth||150,120),height=Math.max(btn.offsetHeight||44,38);
  let left=8,top=window.innerHeight-height-10;
  if(paymentRect){left=paymentRect.left+(paymentRect.width-width)/2;top=paymentRect.bottom+8}
  left=Math.max(8,Math.min(window.innerWidth-width-8,left));
  top=Math.max(8,Math.min(window.innerHeight-height-8,top));
  btn.style.setProperty('position','fixed','important');
  btn.style.setProperty('left',Math.round(left)+'px','important');
  btn.style.setProperty('right','auto','important');
  btn.style.setProperty('top',Math.round(top)+'px','important');
  btn.style.setProperty('bottom','auto','important');
  btn.style.setProperty('transform','none','important');
}
function syncPostLoginSoundUi(){installPostLoginSoundStyle();removeExtraSounds();placePostLoginSoundButton()}
function applyUser(user){
  setBusy(false,null);
  if(user){
    document.body.classList.remove('locked');
    if(overlay){overlay.style.setProperty('display','none','important');overlay.setAttribute('aria-hidden','true')}
    if(profile)profile.style.display='flex';
    const n=$('userName');if(n)n.textContent=user.displayName||user.email||(langEn()?'User':'المستخدم');
    const p=$('userPhoto');if(p&&user.photoURL)p.src=user.photoURL;
    if(errorEl)errorEl.textContent='';
    requestAnimationFrame(syncPostLoginSoundUi);
  }else{
    document.body.classList.add('locked');
    if(overlay){overlay.style.setProperty('display','flex','important');overlay.removeAttribute('aria-hidden')}
    if(profile)profile.style.display='none';
  }
}
function lightenLoginVideo(){
  const v=$('sakLoginBackgroundVideo');if(!v)return;
  try{
    v.removeAttribute('fetchpriority');
    v.preload='metadata';
    const src=v.getAttribute('src')||'';
    if(!src||src.includes('raw.githubusercontent.com')){v.src='/gemini_video_birds_login.mp4';v.load()}
    v.muted=true;
    const p=v.play();if(p&&p.catch)p.catch(()=>{});
  }catch(_){}
}
function providerError(err,label){
  const code=String(err&&err.code||'');
  if(code==='auth/popup-blocked')setError(`❌ المتصفح منع نافذة ${label}. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.`,`❌ The browser blocked the ${label} window. Allow pop-ups and try again.`);
  else if(code==='auth/unauthorized-domain')setError('❌ نطاق sakaker.co غير مصرح به في Firebase Authentication.','❌ sakaker.co is not authorized in Firebase Authentication.');
  else if(code==='auth/operation-not-allowed')setError(`❌ تسجيل الدخول عبر ${label} يحتاج تفعيل مزود الخدمة في Firebase Authentication.`,`❌ ${label} sign-in must be enabled in Firebase Authentication.`);
  else if(code==='auth/network-request-failed')setError('❌ تعذر الاتصال بخدمة تسجيل الدخول. تحقق من الشبكة ثم حاول مرة أخرى.','❌ Could not reach the sign-in service. Check the network and try again.');
  else if(code==='auth/popup-closed-by-user'||code==='auth/cancelled-popup-request')setError('تم إلغاء تسجيل الدخول.','Sign-in was cancelled.');
  else setError(`❌ فشل تسجيل الدخول عبر ${label}${code?' ('+code+')':''}`,`❌ ${label} sign-in failed${code?' ('+code+')':''}`);
}
function bindProvider(btn,label,makeProvider,auth,authMod){
  if(!btn||btn.dataset.sakAuthBound==='1')return;
  btn.dataset.sakAuthBound='1';btn.disabled=false;
  btn.addEventListener('click',async e=>{
    e.preventDefault();e.stopImmediatePropagation();if(btn.disabled)return;
    setBusy(true,btn);if(errorEl)errorEl.textContent='';
    try{await authMod.signInWithPopup(auth,makeProvider())}
    catch(err){providerError(err,label);console.error('SAKAKER '+label+' sign-in:',err)}
    finally{setBusy(false,null)}
  },true);
}

lightenLoginVideo();
installSocialButtons();
refreshProviderLabels();
installPostLoginSoundStyle();
removeExtraSounds();
window.addEventListener('resize',()=>requestAnimationFrame(placePostLoginSoundButton),{passive:true});
window.addEventListener('orientationchange',()=>requestAnimationFrame(placePostLoginSoundButton),{passive:true});

(async()=>{
  try{
    const [appMod,authMod]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js')
    ]);
    const app=appMod.getApps().length?appMod.getApp():appMod.initializeApp(window.sakakerFirebaseConfig||CONFIG);
    const auth=window.firebaseAuth||authMod.getAuth(app);
    window.firebaseApp=window.firebaseApp||app;window.firebaseAuth=auth;
    try{await authMod.setPersistence(auth,authMod.browserLocalPersistence)}catch(_){}

    let settled=false;
    const settle=user=>{if(settled)return;settled=true;applyUser(user)};
    const stop=authMod.onAuthStateChanged(auth,user=>{settle(user);try{stop()}catch(_){}},()=>{settle(null);setError('❌ تعذر التحقق من جلسة الدخول. حاول تحديث الصفحة.','❌ Could not verify the sign-in session. Refresh and try again.')});
    setTimeout(()=>settle(auth.currentUser||null),3500);

    installSocialButtons();refreshProviderLabels();
    bindProvider(google,'Google',()=>{const p=new authMod.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return p},auth,authMod);
    bindProvider(facebook,'Facebook',()=>{const p=new authMod.FacebookAuthProvider();p.addScope('email');return p},auth,authMod);
    bindProvider(microsoft,'Microsoft',()=>{const p=new authMod.OAuthProvider('microsoft.com');p.setCustomParameters({prompt:'select_account'});return p},auth,authMod);
  }catch(err){
    console.error('SAKAKER lightweight login failed:',err);
    setBusy(false,null);
    setError('❌ تعذر تحميل نظام تسجيل الدخول. تحقق من الاتصال ثم حدّث الصفحة.','❌ Could not load the sign-in system. Check the connection and refresh.');
  }
})();
})();

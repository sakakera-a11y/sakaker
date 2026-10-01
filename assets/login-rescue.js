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

function langEn(){return document.documentElement.lang==='en'}
function setError(msgAr,msgEn){if(errorEl)errorEl.textContent=langEn()?msgEn:msgAr}
function setBusy(busy){
  if(!google)return;
  google.disabled=!!busy;
  google.setAttribute('aria-busy',busy?'true':'false');
}
function applyUser(user){
  if(user){
    document.body.classList.remove('locked');
    if(overlay){overlay.style.setProperty('display','none','important');overlay.setAttribute('aria-hidden','true')}
    if(profile)profile.style.display='flex';
    const n=$('userName');if(n)n.textContent=user.displayName||user.email||(langEn()?'User':'المستخدم');
    const p=$('userPhoto');if(p&&user.photoURL)p.src=user.photoURL;
    if(errorEl)errorEl.textContent='';
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

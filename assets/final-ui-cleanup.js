(()=>{'use strict';
if(window.__sakakerFinalUiCleanup)return;
window.__sakakerFinalUiCleanup=true;

const LEGACY_SOUND_IDS=['sakSeaAudio','sakSeaSoundButton','sakakerBirdAudio','sakakerBirdSoundBtn','bird-sound-btn'];
const TEXT_LIB_URL='/books.html?v=20261003-final5';
const TEXT_LIB_OVERLAY='sakStableTextLibraryOverlay';
const SITE_NEWS_MODAL='sakakerSiteNewsModal';
const SITE_NEWS_BUTTON='sakakerSiteNewsButton';

function textOf(el){
  return ((el?.textContent||'')+' '+(el?.getAttribute?.('aria-label')||'')+' '+(el?.getAttribute?.('title')||'')).replace(/\s+/g,' ').trim();
}
function stopAndRemove(el){
  if(!el)return;
  if(el.closest?.('#loginOverlay'))return;
  try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){}
  try{el.removeAttribute('autoplay');}catch(_){}
  el.remove();
}
function purgeLegacyIndependentSounds(){
  LEGACY_SOUND_IDS.forEach(id=>stopAndRemove(document.getElementById(id)));
  document.querySelectorAll('audio').forEach(el=>{
    if(el.closest('#loginOverlay'))return;
    const meta=((el.id||'')+' '+(typeof el.className==='string'?el.className:'')+' '+(el.getAttribute('src')||'')).toLowerCase();
    if(/bird|sea|ocean|wave|طيور|بحر/.test(meta))stopAndRemove(el);
  });
}
function keepAuthProvidersVisible(){
  const overlay=document.getElementById('loginOverlay');
  if(!overlay)return;
  ['googleButton','facebookButton','microsoftButton','loginLanguageButton'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.style.removeProperty('display');
    el.style.removeProperty('visibility');
    el.style.removeProperty('opacity');
    el.removeAttribute('aria-hidden');
    if(el.tagName==='BUTTON')el.tabIndex=0;
  });
}
function cleanLegacySeaSound(){
  LEGACY_SOUND_IDS.forEach(id=>stopAndRemove(document.getElementById(id)));
  document.querySelectorAll('button,[role="button"],[title],[aria-label]').forEach(el=>{
    if(el.id==='sakSiteSoundBtn'||el.closest('#loginOverlay'))return;
    const t=textOf(el);
    if(/تشغيل\s*صوت\s*البحر|إيقاف\s*صوت\s*البحر|Sea\s*Sound|Ocean\s*Sound|Bird\s*Sound|صوت\s*الطيور/i.test(t))stopAndRemove(el);
  });
}
function ensureVideoFix(){
  const wanted='20261003-video4';
  if(window.__sakVideoModalFixVersion===wanted)return;
  document.querySelectorAll('script[src*="video-modal-fix.js"]').forEach(s=>{
    if(!String(s.src).includes(wanted))s.remove();
  });
  const s=document.createElement('script');
  s.src='/assets/video-modal-fix.js?v='+wanted;
  s.defer=true;
  s.id='sak-video-modal-fix-final-loader-v4';
  document.head.appendChild(s);
}

function ensureLibraryStyle(){
  if(document.getElementById('sakTextLibraryRuntimeStyle'))return;
  const st=document.createElement('style');
  st.id='sakTextLibraryRuntimeStyle';
  st.textContent=`
  #${TEXT_LIB_OVERLAY}{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none;align-items:center!important;justify-content:center!important;padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom))!important;box-sizing:border-box!important;background:rgba(0,5,8,.9)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important}
  #${TEXT_LIB_OVERLAY}.show{display:flex!important}
  #${TEXT_LIB_OVERLAY} .sak-lib-shell{position:relative!important;width:min(1120px,98vw)!important;height:min(94dvh,980px)!important;border:1px solid rgba(110,255,232,.82)!important;border-radius:22px!important;overflow:hidden!important;background:#031218!important;box-shadow:0 0 32px rgba(0,255,220,.38)!important}
  #${TEXT_LIB_OVERLAY} iframe{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#031218!important}
  #${TEXT_LIB_OVERLAY} .sak-lib-close{position:absolute!important;left:50%!important;bottom:10px!important;transform:translateX(-50%)!important;z-index:8!important;min-width:116px!important;min-height:42px!important;padding:8px 18px!important;border:1px solid #8fffe8!important;border-radius:999px!important;background:rgba(2,28,31,.97)!important;color:#fff!important;font-weight:900!important;cursor:pointer!important;box-shadow:0 0 18px rgba(0,255,220,.5)!important}
  @media(max-width:600px){#${TEXT_LIB_OVERLAY}{padding:0!important}#${TEXT_LIB_OVERLAY} .sak-lib-shell{width:100vw!important;height:100dvh!important;border-radius:0!important;border:0!important}}
  `;
  document.head.appendChild(st);
}
function ensureTextLibraryOverlay(){
  ensureLibraryStyle();
  let o=document.getElementById(TEXT_LIB_OVERLAY);
  if(o)return o;
  o=document.createElement('div');
  o.id=TEXT_LIB_OVERLAY;
  o.setAttribute('role','dialog');
  o.setAttribute('aria-modal','true');
  o.innerHTML='<div class="sak-lib-shell"><iframe title="المكتبة النصية / Text Library" src="'+TEXT_LIB_URL+'"></iframe><button class="sak-lib-close" type="button">إغلاق ✕</button></div>';
  document.body.appendChild(o);
  const close=()=>{o.classList.remove('show');document.body.classList.remove('modal-open')};
  o.querySelector('.sak-lib-close').addEventListener('click',close);
  o.addEventListener('click',e=>{if(e.target===o)close()});
  return o;
}
function openTextLibrary(){
  const old=document.getElementById('sakTextLibraryModal');
  if(old){old.classList.remove('show','active');old.style.setProperty('display','none','important')}
  const o=ensureTextLibraryOverlay();
  const f=o.querySelector('iframe');
  if(f&&!String(f.src).includes('books.html'))f.src=TEXT_LIB_URL;
  const close=o.querySelector('.sak-lib-close');
  if(close)close.textContent=document.documentElement.lang==='en'?'Close ✕':'إغلاق ✕';
  o.classList.add('show');
  document.body.classList.add('modal-open');
}
function isTextLibraryTarget(el){
  const n=el?.closest?.('a,button,[role="button"],.launcher,[title],[aria-label]');
  if(!n||n.closest('#'+TEXT_LIB_OVERLAY)||n.closest('#sakTextLibraryModal'))return false;
  const href=(n.getAttribute?.('href')||'').toLowerCase();
  const txt=textOf(n);
  return href.includes('books.html')||/المكتبة\s*النصية|Text\s*Library/i.test(txt);
}

function newsContent(){
  const en=document.documentElement.lang==='en';
  if(en)return `
    <h2>📰 Site News</h2>
    <article><h3>Video Library</h3><p>The video library was rebuilt for better speed and mobile use. Each non-religious section now contains 100 video entries, while the Islamic section remains unchanged.</p></article>
    <article><h3>Text Library</h3><p>The text library now opens inside the website in a responsive glass window instead of taking over the whole browser page.</p></article>
    <article><h3>Login Background Sound</h3><p>Background sound no longer starts from an ordinary page click. It is controlled only by its sound button.</p></article>
    <small>Latest site maintenance: October 3, 2026</small>`;
  return `
    <h2>📰 أخبار الموقع</h2>
    <article><h3>مكتبة الفيديو</h3><p>تمت إعادة بناء مكتبة الفيديو لتكون أسرع ومتوافقة مع الجوال. أصبح كل قسم غير ديني يحتوي على 100 فيديو، مع إبقاء القسم الديني كما هو.</p></article>
    <article><h3>المكتبة النصية</h3><p>تم تثبيت فتح المكتبة النصية داخل الموقع في نافذة زجاجية متجاوبة بدل فتح صفحة المتصفح كاملة.</p></article>
    <article><h3>صوت خلفية الدخول</h3><p>لم يعد صوت الخلفية يبدأ بمجرد النقر العادي على الصفحة، وأصبح تشغيله وإيقافه من زر الصوت فقط.</p></article>
    <small>آخر صيانة للموقع: 3 أكتوبر 2026</small>`;
}
function ensureNewsStyle(){
  if(document.getElementById('sakSiteNewsRuntimeStyle'))return;
  const st=document.createElement('style');
  st.id='sakSiteNewsRuntimeStyle';
  st.textContent=`
  #${SITE_NEWS_MODAL}{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none;align-items:center!important;justify-content:center!important;padding:12px!important;background:rgba(0,5,8,.9)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important}
  #${SITE_NEWS_MODAL}.show{display:flex!important}
  #${SITE_NEWS_MODAL} .sak-news-shell{position:relative!important;width:min(760px,96vw)!important;max-height:90dvh!important;overflow:auto!important;padding:28px 20px 76px!important;border-radius:24px!important;border:1px solid rgba(115,255,233,.82)!important;background:linear-gradient(145deg,rgba(4,34,39,.97),rgba(1,12,17,.98))!important;box-shadow:0 0 38px rgba(0,255,220,.35)!important;color:#fff!important}
  #${SITE_NEWS_MODAL} h2{text-align:center!important;color:#bafff4!important;margin:0 0 16px!important}#${SITE_NEWS_MODAL} article{padding:14px!important;margin:10px 0!important;border-radius:16px!important;background:rgba(255,255,255,.055)!important;border:1px solid rgba(115,255,233,.18)!important}#${SITE_NEWS_MODAL} h3{margin:0 0 7px!important;color:#8fffe8!important}#${SITE_NEWS_MODAL} p{margin:0!important;line-height:1.8!important}#${SITE_NEWS_MODAL} small{display:block!important;text-align:center!important;margin-top:14px!important;color:#a9cfca!important}
  #${SITE_NEWS_MODAL} .sak-news-close{position:absolute!important;left:50%!important;bottom:14px!important;transform:translateX(-50%)!important;min-width:116px!important;min-height:42px!important;border-radius:999px!important;border:1px solid #8fffe8!important;background:#06282c!important;color:#fff!important;font-weight:900!important;cursor:pointer!important}
  #${SITE_NEWS_BUTTON}{border:1px solid rgba(99,255,230,.7)!important;background:radial-gradient(circle at 35% 25%,rgba(27,92,99,.96),rgba(1,17,22,.98))!important;color:#fff!important;border-radius:50%!important;width:88px!important;height:88px!important;min-width:88px!important;min-height:88px!important;padding:7px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;text-align:center!important;cursor:pointer!important;box-shadow:0 0 18px rgba(0,255,220,.34)!important;font:800 11px/1.2 Tajawal,Tahoma,Arial,sans-serif!important}
  #${SITE_NEWS_BUTTON} .sak-news-icon{font-size:27px!important;line-height:1!important}#${SITE_NEWS_BUTTON}:hover{box-shadow:0 0 28px rgba(0,255,220,.58)!important;transform:translateY(-2px)!important}
  body.locked #${SITE_NEWS_BUTTON}{display:none!important}
  `;
  document.head.appendChild(st);
}
function ensureNewsModal(){
  ensureNewsStyle();
  let m=document.getElementById(SITE_NEWS_MODAL);
  if(m)return m;
  m=document.createElement('div');
  m.id=SITE_NEWS_MODAL;
  m.setAttribute('role','dialog');
  m.setAttribute('aria-modal','true');
  m.innerHTML='<div class="sak-news-shell"><div class="sak-news-body"></div><button class="sak-news-close" type="button">إغلاق ✕</button></div>';
  document.body.appendChild(m);
  const close=()=>m.classList.remove('show');
  m.querySelector('.sak-news-close').addEventListener('click',close);
  m.addEventListener('click',e=>{if(e.target===m)close()});
  return m;
}
function openNews(){
  const m=ensureNewsModal();
  const en=document.documentElement.lang==='en';
  m.querySelector('.sak-news-body').innerHTML=newsContent();
  m.querySelector('.sak-news-close').textContent=en?'Close ✕':'إغلاق ✕';
  m.classList.add('show');
}
function ensureNewsButton(){
  if(document.body?.classList.contains('locked'))return;
  ensureNewsStyle();
  let b=document.getElementById(SITE_NEWS_BUTTON);
  if(!b){
    b=document.createElement('button');
    b.id=SITE_NEWS_BUTTON;
    b.type='button';
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openNews()});
  }
  const en=document.documentElement.lang==='en';
  b.innerHTML='<span class="sak-news-icon">📰</span><span>'+(en?'Site News':'أخبار الموقع')+'</span>';
  b.setAttribute('aria-label',en?'Site News':'أخبار الموقع');
  b.title=en?'Site News':'أخبار الموقع';
  const dock=document.getElementById('sakakerUtilityDock');
  if(dock){
    let slot=dock.querySelector('[data-sakaker-util="siteNews"]');
    if(!slot){slot=document.createElement('div');slot.className='sakaker-utility-slot';slot.dataset.sakakerUtil='siteNews';dock.appendChild(slot)}
    if(b.parentElement!==slot)slot.appendChild(b);
  }else if(b.parentElement!==document.body){
    document.body.appendChild(b);
    b.style.position='fixed';b.style.right='14px';b.style.bottom='14px';b.style.zIndex='2147483000';
  }
}

function installNavigationFixes(){
  if(window.__sakTextLibraryNewsNavigationFix)return;
  window.__sakTextLibraryNewsNavigationFix=true;
  document.addEventListener('click',e=>{
    if(isTextLibraryTarget(e.target)){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openTextLibrary();return;
    }
    const n=e.target?.closest?.('button,[role="button"],a,[title],[aria-label]');
    if(n&&!n.closest('#'+SITE_NEWS_MODAL)&&/أخبار\s*الموقع|Site\s*News/i.test(textOf(n))){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openNews();
    }
  },true);
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    document.getElementById(TEXT_LIB_OVERLAY)?.classList.remove('show');
    document.getElementById(SITE_NEWS_MODAL)?.classList.remove('show');
    document.body?.classList.remove('modal-open');
  },true);
}

function run(){
  purgeLegacyIndependentSounds();
  keepAuthProvidersVisible();
  cleanLegacySeaSound();
  ensureVideoFix();
  if(document.body){
    ensureTextLibraryOverlay();
    ensureNewsModal();
    ensureNewsButton();
    installNavigationFixes();
  }
}
run();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
setTimeout(run,500);
setTimeout(run,1800);
setTimeout(run,4000);
new MutationObserver(()=>{if(!document.body?.classList.contains('locked'))ensureNewsButton()}).observe(document.documentElement,{attributes:true,subtree:false,attributeFilter:['lang']});
})();

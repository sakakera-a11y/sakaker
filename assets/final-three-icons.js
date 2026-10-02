(()=>{'use strict';
function removeVisitorCounters(){
  const selectors=[
    '#sakakerVisitorCounter','#sakakerRightStats','#visitorCounter','#visitCounter',
    '[id*="VisitorCounter"]','[id*="visitorCounter"]',
    '[class*="visitor-counter"]','[class*="visitorCounter"]'
  ];
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
function removeEmptyTextLibrary(){const el=findTextLibrary();if(el)el.remove()}
function ensureAllIconGroups(){
  let dock=document.getElementById('sakakerAllIconsDock');
  if(!dock){
    dock=document.createElement('nav');
    dock.id='sakakerAllIconsDock';
    dock.setAttribute('aria-label','جميع أيقونات الموقع');
    document.body.appendChild(dock);
  }
  const groups=[
    document.querySelector('.cards'),
    document.getElementById('sakakerUtilityDock'),
    document.getElementById('sakakerCenterFeatureDock')
  ];
  groups.forEach(group=>{
    if(!group)return;
    group.style.setProperty('display','flex','important');
    group.style.setProperty('visibility','visible','important');
    group.style.setProperty('opacity','1','important');
    if(group.parentElement!==dock)dock.appendChild(group);
  });
  dock.style.setProperty('display','flex','important');
  dock.style.setProperty('visibility','visible','important');
  dock.style.setProperty('opacity','1','important');
}
function installFinalLayoutFix(){
  let style=document.getElementById('sakPermanentMultiRowLayout');
  if(!style){
    style=document.createElement('style');
    style.id='sakPermanentMultiRowLayout';
    style.textContent=`
html body #sakakerAllIconsDock{
  position:fixed!important;left:50%!important;right:auto!important;
  bottom:max(8px,env(safe-area-inset-bottom))!important;top:auto!important;
  transform:translateX(-50%)!important;display:flex!important;flex-wrap:wrap!important;
  justify-content:center!important;align-items:flex-end!important;align-content:flex-end!important;
  width:min(680px,96vw)!important;max-width:96vw!important;height:auto!important;
  min-height:0!important;max-height:none!important;padding:5px 8px!important;
  gap:8px!important;row-gap:8px!important;column-gap:8px!important;
  overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important;
  scroll-snap-type:none!important;border:0!important;box-shadow:none!important;
}
html body #sakakerAllIconsDock .cards,
html body #sakakerAllIconsDock #sakakerUtilityDock,
html body #sakakerAllIconsDock #sakakerCenterFeatureDock{
  position:static!important;inset:auto!important;transform:none!important;
  display:flex!important;visibility:visible!important;opacity:1!important;
  flex-wrap:wrap!important;justify-content:center!important;align-items:flex-end!important;
  width:auto!important;max-width:100%!important;height:auto!important;max-height:none!important;
  overflow:visible!important;gap:8px!important;
}
html body #sakakerAllIconsDock .icon-card,
html body #sakakerAllIconsDock .sakaker-utility-slot,
html body #sakakerAllIconsDock #shipIcon_new,
html body #sakakerAllIconsDock #sakakerBusinessAd,
html body #sakakerAllIconsDock #facebookVideoIcon,
html body #sakakerAllIconsDock #liveFlasher,
html body #sakakerAllIconsDock #emeraldLibraryButton,
html body #sakakerAllIconsDock #pongGame-btn,
html body #sakakerAllIconsDock .launcher,
html body #sakakerAllIconsDock #emeraldMusicHost{
  visibility:visible!important;opacity:1!important;display:flex!important;
}
html body #sakakerAllIconsDock,
html body #sakakerAllIconsDock *,
html body #sakakerAllIconsDock *::before,
html body #sakakerAllIconsDock *::after{transition:none!important}
@media(max-width:700px){
  html body #sakakerAllIconsDock{width:96vw!important;max-width:96vw!important;gap:6px!important;row-gap:6px!important;column-gap:5px!important}
  html body #sakakerAllIconsDock .cards,
  html body #sakakerAllIconsDock #sakakerUtilityDock,
  html body #sakakerAllIconsDock #sakakerCenterFeatureDock{gap:5px!important}
}
html body #sakGlobalPayment,html body.locked #sakGlobalPayment{bottom:44vh!important}
`;
    (document.head||document.documentElement).appendChild(style);
  }
}
function installFacebookEmbeds(){
  const popup=document.getElementById('facebookVideoPopup');
  const box=popup?.querySelector('.fbVideoBox');
  if(!box)return;
  const legacy=box.querySelector('#sakFacebookExtraLinks');
  if(legacy)legacy.remove();
  if(box.querySelector('#sakFacebookEmbeddedMedia'))return;
  const items=[
    {type:'post',ar:'منشور فيسبوك 1',en:'Facebook Post 1',url:'https://www.facebook.com/100082898274465/posts/1089659210474011/?app=fbl'},
    {type:'video',ar:'ريلز فيسبوك',en:'Facebook Reel',url:'https://www.facebook.com/share/r/1BQxaJUuP5/'},
    {type:'post',ar:'منشور فيسبوك 2',en:'Facebook Post 2',url:'https://www.facebook.com/61556336314377/posts/122326658408211210/'}
  ];
  const wrap=document.createElement('section');
  wrap.id='sakFacebookEmbeddedMedia';
  wrap.setAttribute('aria-label','مقاطع ومنشورات فيسبوك المضمنة');
  wrap.style.cssText='display:grid;grid-template-columns:1fr;gap:14px;margin:12px 0 6px;padding:10px;border:1px solid rgba(0,255,204,.35);border-radius:14px;background:rgba(0,25,35,.45);max-width:100%;overflow:hidden';
  items.forEach(item=>{
    const card=document.createElement('article');
    card.style.cssText='display:grid;gap:8px;padding:8px;border:1px solid rgba(120,220,255,.25);border-radius:12px;background:rgba(0,0,0,.18);overflow:hidden';
    const title=document.createElement('div');
    title.className='sakFbEmbedTitle';title.dataset.ar=item.ar;title.dataset.en=item.en;
    title.style.cssText='font:800 13px Tajawal,Tahoma,Arial,sans-serif;color:#fff;text-align:center';
    const iframe=document.createElement('iframe');
    const plugin=item.type==='video'?'video.php':'post.php';
    const params=item.type==='video'?'&show_text=false&width=500':'&show_text=true&width=500';
    iframe.src='https://www.facebook.com/plugins/'+plugin+'?href='+encodeURIComponent(item.url)+params;
    iframe.width='500';iframe.height=item.type==='video'?'520':'620';
    iframe.style.cssText='border:none;overflow:hidden;width:100%;max-width:500px;min-height:500px;margin:auto;border-radius:10px;background:#fff';
    iframe.scrolling='no';iframe.frameBorder='0';iframe.allowFullscreen=true;iframe.loading='lazy';
    iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    const fallback=document.createElement('a');
    fallback.href=item.url;fallback.target='_blank';fallback.rel='noopener noreferrer';
    fallback.className='sakFbEmbedFallback';fallback.dataset.ar='فتح الأصل في فيسبوك';fallback.dataset.en='Open original on Facebook';
    fallback.style.cssText='display:flex;align-items:center;justify-content:center;min-height:38px;padding:7px 10px;border-radius:10px;border:1px solid rgba(24,119,242,.65);background:rgba(24,119,242,.2);color:#fff;text-decoration:none;font:700 12px Tajawal,Tahoma,Arial,sans-serif';
    card.append(title,iframe,fallback);wrap.appendChild(card);
  });
  const updateLanguage=()=>{
    const en=document.documentElement.lang==='en';
    wrap.querySelectorAll('.sakFbEmbedTitle,.sakFbEmbedFallback').forEach(el=>{el.textContent=en?el.dataset.en:el.dataset.ar});
  };
  updateLanguage();
  const comments=box.querySelector('.fbCommentsBox,.fbComments,.fbCommentWrite');
  if(comments)box.insertBefore(wrap,comments);else box.appendChild(wrap);
  new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
function run(){removeVisitorCounters();removeEmptyTextLibrary();ensureAllIconGroups();installFinalLayoutFix();installFacebookEmbeds()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
[300,900,1900,4300].forEach(ms=>setTimeout(run,ms));
new MutationObserver(()=>{removeEmptyTextLibrary();ensureAllIconGroups();installFinalLayoutFix();installFacebookEmbeds()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
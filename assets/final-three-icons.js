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
function installFacebookLinks(){
  const popup=document.getElementById('facebookVideoPopup');
  const box=popup?.querySelector('.fbVideoBox');
  if(!box||box.querySelector('#sakFacebookExtraLinks'))return;
  const links=[
    ['منشور فيسبوك 1','https://www.facebook.com/100082898274465/posts/1089659210474011/?app=fbl'],
    ['ريلز فيسبوك','https://www.facebook.com/share/r/1BQxaJUuP5/'],
    ['منشور فيسبوك 2','https://www.facebook.com/61556336314377/posts/122326658408211210/']
  ];
  const wrap=document.createElement('section');wrap.id='sakFacebookExtraLinks';wrap.setAttribute('aria-label','روابط فيسبوك');
  wrap.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin:12px 0 4px;padding:10px;border:1px solid rgba(0,255,204,.35);border-radius:14px;background:rgba(0,25,35,.45)';
  links.forEach(([label,url],i)=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.dataset.ar=label;a.dataset.en=i===1?'Facebook Reel':'Facebook Post '+(i===0?'1':'2');a.textContent='📘 '+label;a.style.cssText='display:flex;align-items:center;justify-content:center;min-height:42px;padding:8px 10px;border-radius:11px;border:1px solid rgba(120,220,255,.5);background:linear-gradient(135deg,rgba(24,119,242,.75),rgba(0,210,190,.35));color:#fff;text-decoration:none;font:700 12px Tajawal,Tahoma,Arial,sans-serif;text-align:center';wrap.appendChild(a)});
  const comments=box.querySelector('.fbCommentsBox,.fbComments,.fbCommentWrite');if(comments)box.insertBefore(wrap,comments);else box.appendChild(wrap);
  const updateLanguage=()=>{const en=document.documentElement.lang==='en';wrap.querySelectorAll('a').forEach(a=>a.textContent='📘 '+(en?a.dataset.en:a.dataset.ar))};updateLanguage();
  new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
function run(){removeVisitorCounters();removeEmptyTextLibrary();ensureAllIconGroups();installFinalLayoutFix();installFacebookLinks()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
[300,900,1900,4300].forEach(ms=>setTimeout(run,ms));
new MutationObserver(()=>{removeEmptyTextLibrary();ensureAllIconGroups();installFinalLayoutFix();installFacebookLinks()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
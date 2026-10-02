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
function installFinalLayoutAuthority(){
  const id='sak-final-runtime-layout-authority';
  let style=document.getElementById(id);
  if(!style){style=document.createElement('style');style.id=id;}
  style.textContent=`
html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{
  position:fixed!important;inset:auto!important;
  left:auto!important;right:max(8px,env(safe-area-inset-right))!important;
  top:auto!important;bottom:max(8px,env(safe-area-inset-bottom))!important;
  transform:none!important;translate:none!important;
  display:flex!important;flex-flow:row wrap!important;
  justify-content:flex-end!important;align-items:flex-end!important;align-content:flex-end!important;
  width:fit-content!important;max-width:min(620px,calc(100vw - 16px))!important;
  height:auto!important;min-height:0!important;max-height:44dvh!important;
  gap:7px!important;padding:5px!important;margin:0!important;
  overflow-x:hidden!important;overflow-y:auto!important;
  box-sizing:border-box!important;z-index:2147483000!important;
}
html body #sakakerAllIconsDock#sakakerAllIconsDock :is(.cards,#sakakerUtilityDock,#sakakerCenterFeatureDock){
  position:relative!important;inset:auto!important;transform:none!important;translate:none!important;
  display:flex!important;flex-flow:row wrap!important;justify-content:flex-end!important;
  align-items:flex-end!important;align-content:flex-end!important;
  width:auto!important;max-width:100%!important;margin:0!important;gap:7px!important;
}
html body:not(.locked) #sakGlobalPayment#sakGlobalPayment{
  position:fixed!important;left:max(8px,env(safe-area-inset-left))!important;right:auto!important;
  top:auto!important;bottom:max(86px,calc(86px + env(safe-area-inset-bottom)))!important;
  transform:none!important;translate:none!important;z-index:2147483001!important;
}
html body:not(.locked) .video-top-container-fixed,
html body:not(.locked) #sakSecondStreamCorner{
  top:clamp(105px,18dvh,165px)!important;bottom:auto!important;
  width:clamp(76px,8.2vw,108px)!important;height:clamp(76px,8.2vw,108px)!important;
  translate:none!important;transform:none!important;box-sizing:border-box!important;
}
html body:not(.locked) .video-top-container-fixed{
  left:max(8px,env(safe-area-inset-left))!important;right:auto!important;
}
html body:not(.locked) #sakSecondStreamCorner{
  right:max(8px,env(safe-area-inset-right))!important;left:auto!important;
}
@media(max-width:700px){
  html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{
    right:max(5px,env(safe-area-inset-right))!important;bottom:max(5px,env(safe-area-inset-bottom))!important;
    width:fit-content!important;max-width:95vw!important;max-height:42dvh!important;
    gap:5px!important;padding:3px!important;
  }
  html body #sakakerAllIconsDock#sakakerAllIconsDock :is(.cards,#sakakerUtilityDock,#sakakerCenterFeatureDock){gap:5px!important;}
  html body:not(.locked) #sakGlobalPayment#sakGlobalPayment{
    bottom:max(76px,calc(76px + env(safe-area-inset-bottom)))!important;
  }
  html body:not(.locked) .video-top-container-fixed,
  html body:not(.locked) #sakSecondStreamCorner{
    top:108px!important;width:68px!important;height:68px!important;
  }
}
@media(max-width:390px){
  html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{max-width:96vw!important;gap:4px!important;}
  html body:not(.locked) .video-top-container-fixed,
  html body:not(.locked) #sakSecondStreamCorner{width:62px!important;height:62px!important;top:102px!important;}
}
@media(orientation:landscape) and (max-height:650px){
  html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{max-width:78vw!important;max-height:56dvh!important;}
  html body:not(.locked) #sakGlobalPayment#sakGlobalPayment{bottom:max(68px,calc(68px + env(safe-area-inset-bottom)))!important;}
  html body:not(.locked) .video-top-container-fixed,
  html body:not(.locked) #sakSecondStreamCorner{top:58px!important;width:62px!important;height:62px!important;}
}
`;
  if(document.body){document.body.appendChild(style);}else{document.documentElement.appendChild(style);}
}
function run(){
  removeVisitorCounters();
  removeEmptyTextLibrary();
  installFacebookEmbeds();
  installFinalLayoutAuthority();
  [400,1200,3200].forEach(ms=>setTimeout(installFinalLayoutAuthority,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',()=>{installFacebookEmbeds();installFinalLayoutAuthority();},{once:true});
window.addEventListener('resize',installFinalLayoutAuthority,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(installFinalLayoutAuthority,120),{passive:true});
new MutationObserver(()=>{removeEmptyTextLibrary();installFacebookEmbeds();installFinalLayoutAuthority()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
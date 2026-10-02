(()=>{'use strict';
function removeVisitorCounters(){
  const selectors=['#sakakerVisitorCounter','#sakakerRightStats','#visitorCounter','#visitCounter','[id*="VisitorCounter"]','[id*="visitorCounter"]','[class*="visitor-counter"]','[class*="visitorCounter"]'];
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
function removeEmptyTextLibrary(){const el=findTextLibrary();if(el)el.remove();}
function installFacebookEmbeds(){
  const popup=document.getElementById('facebookVideoPopup');
  const box=popup?.querySelector('.fbVideoBox');
  if(!box||box.querySelector('#sakFacebookEmbeddedMedia'))return;
  const items=[
    {type:'post',url:'https://www.facebook.com/100082898274465/posts/1089659210474011/?app=fbl'},
    {type:'video',url:'https://www.facebook.com/share/r/1BQxaJUuP5/'},
    {type:'post',url:'https://www.facebook.com/61556336314377/posts/122326658408211210/'}
  ];
  const wrap=document.createElement('section');wrap.id='sakFacebookEmbeddedMedia';
  wrap.style.cssText='display:grid;grid-template-columns:1fr;gap:12px;margin:12px 0 6px;max-width:100%;overflow:hidden';
  items.forEach(item=>{
    const iframe=document.createElement('iframe');
    const plugin=item.type==='video'?'video.php':'post.php';
    const extra=item.type==='video'?'&show_text=false&width=500':'&show_text=true&width=500';
    iframe.src='https://www.facebook.com/plugins/'+plugin+'?href='+encodeURIComponent(item.url)+extra;
    iframe.width='500';iframe.height=item.type==='video'?'520':'620';
    iframe.style.cssText='border:none;overflow:hidden;width:100%;max-width:500px;min-height:500px;margin:auto';
    iframe.scrolling='no';iframe.frameBorder='0';iframe.allowFullscreen=true;iframe.loading='lazy';
    iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';wrap.appendChild(iframe);
  });
  const comments=box.querySelector('.fbCommentsBox,.fbComments,.fbCommentWrite');
  if(comments)box.insertBefore(wrap,comments);else box.appendChild(wrap);
}
function setImportant(el,prop,val){
  if(!el)return;
  if(el.style.getPropertyValue(prop)!==val||el.style.getPropertyPriority(prop)!=='important')el.style.setProperty(prop,val,'important');
}
function forceElementPositions(){
  const locked=document.body.classList.contains('locked');
  const dock=document.getElementById('sakakerAllIconsDock');
  if(dock){
    setImportant(dock,'position','fixed');setImportant(dock,'left','auto');setImportant(dock,'right','max(8px, env(safe-area-inset-right))');
    setImportant(dock,'top','auto');setImportant(dock,'bottom','max(8px, env(safe-area-inset-bottom))');setImportant(dock,'transform','none');setImportant(dock,'translate','none');
  }
  const payment=document.getElementById('sakGlobalPayment');
  if(payment){
    setImportant(payment,'position','fixed');setImportant(payment,'left','max(10px, env(safe-area-inset-left))');setImportant(payment,'right','auto');
    setImportant(payment,'top','auto');setImportant(payment,'transform','none');setImportant(payment,'translate','none');
    setImportant(payment,'bottom',locked?'max(74px, calc(74px + env(safe-area-inset-bottom)))':'max(86px, calc(86px + env(safe-area-inset-bottom)))');
  }
  const panel=document.getElementById('sakPaymentPanel');
  if(panel&&locked){setImportant(panel,'left','0');setImportant(panel,'right','auto');}
  const identity=document.getElementById('sakLoginIdentity');
  if(identity&&locked){
    setImportant(identity,'position','fixed');setImportant(identity,'left','max(10px, env(safe-area-inset-left))');setImportant(identity,'right','auto');
    setImportant(identity,'top','auto');setImportant(identity,'bottom','max(12px, env(safe-area-inset-bottom))');
    setImportant(identity,'transform','none');setImportant(identity,'translate','none');setImportant(identity,'margin','0');
  }
}
function installFinalLayoutAuthority(){
  const id='sak-final-runtime-layout-authority';
  let style=document.getElementById(id);if(!style){style=document.createElement('style');style.id=id;}
  style.textContent=`
:root{--sak-final-icon:54px;--sak-final-gap:6px}
/* No visible container: one clean icon row anchored to the lower-right. */
html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{
  position:fixed!important;inset:auto!important;left:auto!important;right:max(8px,env(safe-area-inset-right))!important;top:auto!important;bottom:max(8px,env(safe-area-inset-bottom))!important;
  transform:none!important;translate:none!important;display:flex!important;flex-flow:row nowrap!important;direction:rtl!important;
  justify-content:flex-start!important;align-items:flex-end!important;align-content:flex-end!important;
  width:auto!important;max-width:calc(100vw - 16px)!important;height:auto!important;min-height:0!important;max-height:none!important;
  gap:var(--sak-final-gap)!important;padding:0!important;margin:0!important;border:0!important;border-radius:0!important;
  background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
  overflow:visible!important;box-sizing:border-box!important;z-index:2147483000!important;scrollbar-width:none!important;
}
html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
html body #sakakerAllIconsDock#sakakerAllIconsDock :is(.cards,#sakakerUtilityDock,#sakakerCenterFeatureDock){display:contents!important}
html body #sakakerAllIconsDock#sakakerAllIconsDock :is(.cards,#sakakerUtilityDock,#sakakerCenterFeatureDock)>*,
html body #sakakerAllIconsDock#sakakerAllIconsDock>.icon-card,
html body #sakakerAllIconsDock#sakakerAllIconsDock>.sakaker-utility-slot{
  position:relative!important;inset:auto!important;transform:none!important;translate:none!important;margin:0!important;
  flex:0 0 var(--sak-final-icon)!important;width:var(--sak-final-icon)!important;min-width:var(--sak-final-icon)!important;max-width:var(--sak-final-icon)!important;
  height:var(--sak-final-icon)!important;min-height:var(--sak-final-icon)!important;max-height:var(--sak-final-icon)!important;
  box-sizing:border-box!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;
}
html body #sakakerAllIconsDock#sakakerAllIconsDock .sakaker-utility-slot>*{max-width:100%!important;max-height:100%!important}
html body #sakakerAllIconsDock#sakakerAllIconsDock .sak-icon-cycle.sak-cycle-hidden{visibility:visible!important;opacity:1!important;pointer-events:auto!important}

/* Payment and identity stay on the left. */
html body:not(.locked) #sakGlobalPayment#sakGlobalPayment{position:fixed!important;left:max(8px,env(safe-area-inset-left))!important;right:auto!important;top:auto!important;bottom:max(86px,calc(86px + env(safe-area-inset-bottom)))!important;transform:none!important;translate:none!important;z-index:2147483001!important}
html body.locked #loginOverlay #sakGlobalPayment#sakGlobalPayment,html body.locked #sakGlobalPayment#sakGlobalPayment{position:fixed!important;left:max(10px,env(safe-area-inset-left))!important;right:auto!important;top:auto!important;bottom:max(74px,calc(74px + env(safe-area-inset-bottom)))!important;transform:none!important;translate:none!important;z-index:2147483646!important}
html body.locked #loginOverlay #sakPaymentPanel#sakPaymentPanel,html body.locked #sakPaymentPanel#sakPaymentPanel{left:0!important;right:auto!important}
html body.locked #loginOverlay #sakLoginIdentity#sakLoginIdentity,html body.locked #sakLoginIdentity#sakLoginIdentity{position:fixed!important;left:max(10px,env(safe-area-inset-left))!important;right:auto!important;bottom:max(12px,env(safe-area-inset-bottom))!important;top:auto!important;transform:none!important;translate:none!important;margin:0!important;z-index:2147483645!important}

html body:not(.locked) .video-top-container-fixed,html body:not(.locked) #sakSecondStreamCorner{top:clamp(105px,18dvh,165px)!important;bottom:auto!important;width:clamp(76px,8.2vw,108px)!important;height:clamp(76px,8.2vw,108px)!important;translate:none!important;transform:none!important;box-sizing:border-box!important}
html body:not(.locked) .video-top-container-fixed{left:max(8px,env(safe-area-inset-left))!important;right:auto!important}
html body:not(.locked) #sakSecondStreamCorner{right:max(8px,env(safe-area-inset-right))!important;left:auto!important}

/* Desktop: all 14 icons remain in one row. */
@media(min-width:701px){
  html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{overflow:visible!important;white-space:nowrap!important}
}

/* Mobile/tablet: same single row, horizontal touch scrolling. */
@media(max-width:700px){
  :root{--sak-final-icon:48px;--sak-final-gap:5px}
  html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{
    right:max(5px,env(safe-area-inset-right))!important;bottom:max(5px,env(safe-area-inset-bottom))!important;
    width:calc(100vw - 10px)!important;max-width:calc(100vw - 10px)!important;
    overflow-x:auto!important;overflow-y:visible!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;
    touch-action:pan-x!important;scroll-snap-type:x proximity!important;padding:2px 0!important;
  }
  html body #sakakerAllIconsDock#sakakerAllIconsDock :is(.cards,#sakakerUtilityDock,#sakakerCenterFeatureDock)>*,
  html body #sakakerAllIconsDock#sakakerAllIconsDock>.icon-card,
  html body #sakakerAllIconsDock#sakakerAllIconsDock>.sakaker-utility-slot{scroll-snap-align:end!important}
  html body:not(.locked) #sakGlobalPayment#sakGlobalPayment{bottom:max(70px,calc(70px + env(safe-area-inset-bottom)))!important}
  html body.locked #loginOverlay #sakGlobalPayment#sakGlobalPayment,html body.locked #sakGlobalPayment#sakGlobalPayment{left:max(7px,env(safe-area-inset-left))!important;right:auto!important;bottom:max(68px,calc(68px + env(safe-area-inset-bottom)))!important}
  html body.locked #loginOverlay #sakLoginIdentity#sakLoginIdentity,html body.locked #sakLoginIdentity#sakLoginIdentity{left:max(7px,env(safe-area-inset-left))!important;right:auto!important;bottom:max(8px,env(safe-area-inset-bottom))!important;max-width:calc(100vw - 14px)!important}
  html body:not(.locked) .video-top-container-fixed,html body:not(.locked) #sakSecondStreamCorner{top:108px!important;width:68px!important;height:68px!important}
}
@media(max-width:390px){:root{--sak-final-icon:44px;--sak-final-gap:4px}html body:not(.locked) .video-top-container-fixed,html body:not(.locked) #sakSecondStreamCorner{width:62px!important;height:62px!important;top:102px!important}}
@media(orientation:landscape) and (max-height:650px){:root{--sak-final-icon:44px;--sak-final-gap:4px}html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock{width:auto!important;max-width:calc(100vw - 16px)!important;overflow-x:auto!important}html body:not(.locked) #sakGlobalPayment#sakGlobalPayment{bottom:max(62px,calc(62px + env(safe-area-inset-bottom)))!important}html body:not(.locked) .video-top-container-fixed,html body:not(.locked) #sakSecondStreamCorner{top:58px!important;width:62px!important;height:62px!important}}
`;
  if(style.parentNode!==document.body){style.remove();(document.body||document.documentElement).appendChild(style)}
  forceElementPositions();
}
let watched=new WeakSet();
function watchPositionElement(el){if(!el||watched.has(el))return;watched.add(el);new MutationObserver(()=>requestAnimationFrame(forceElementPositions)).observe(el,{attributes:true,attributeFilter:['style','class']});}
function bindPositionWatchers(){['sakGlobalPayment','sakPaymentPanel','sakLoginIdentity','sakakerAllIconsDock'].forEach(id=>watchPositionElement(document.getElementById(id)));forceElementPositions();}
function installPositionWatchdog(){
  bindPositionWatchers();
  new MutationObserver(()=>requestAnimationFrame(bindPositionWatchers)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  const until=Date.now()+15000;const timer=setInterval(()=>{bindPositionWatchers();if(Date.now()>until)clearInterval(timer)},250);
}
function run(){removeVisitorCounters();removeEmptyTextLibrary();installFacebookEmbeds();installFinalLayoutAuthority();installPositionWatchdog();[100,400,1200,3200,6000].forEach(ms=>setTimeout(()=>{installFinalLayoutAuthority();bindPositionWatchers()},ms));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',()=>{installFacebookEmbeds();installFinalLayoutAuthority();bindPositionWatchers()},{once:true});
window.addEventListener('resize',()=>{installFinalLayoutAuthority();bindPositionWatchers()},{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(()=>{installFinalLayoutAuthority();bindPositionWatchers()},120),{passive:true});
new MutationObserver(()=>{removeEmptyTextLibrary();installFacebookEmbeds();installFinalLayoutAuthority();bindPositionWatchers()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
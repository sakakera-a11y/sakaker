/* Correct the REAL time and date widget: visitorClockDock at the bottom
 * centre. The old #clock/#date nodes are hidden; never touch the festive header. */
(()=>{'use strict';
 const ID='sakVisitorBottomClockReadable';
 let target=null,styleObserver=null;
 function style(){
  if(document.getElementById(ID))return;
  const el=document.createElement('style');el.id=ID;
  el.textContent=[
   'html body #visitorClockDock{left:50%!important;right:auto!important;top:auto!important;transform:translateX(-50%)!important;bottom:max(3px,env(safe-area-inset-bottom))!important;min-height:50px!important;max-height:64px!important;overflow:visible!important;box-sizing:border-box!important;}',
   'html body #visitorClockDock .visitor-clock-dock-content{font:800 13px/1.35 Tahoma,Arial,sans-serif!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;max-height:none!important;color:#fff3bd!important;text-shadow:0 0 4px #fff,0 0 11px #ffb75c!important;}',
   'html body #visitorClockDock::before{font-size:20px!important;}',
   '@media(max-width:700px){html body #visitorClockDock{min-height:50px!important;max-height:64px!important;}html body #visitorClockDock .visitor-clock-dock-content{font-size:12px!important;line-height:1.35!important;white-space:normal!important;max-height:none!important;}}'
  ].join('\n');
  document.head.appendChild(el);
 }
 function fix(){
   const el=document.getElementById('visitorClockDock');
   if(!el)return false;
   if(target!==el){
     styleObserver?.disconnect();target=el;
     styleObserver=new MutationObserver(fix);
     styleObserver.observe(el,{attributes:true,attributeFilter:['style']});
   }
   if(el.style.getPropertyValue('bottom')!=='max(3px, env(safe-area-inset-bottom))')
     el.style.setProperty('bottom','max(3px, env(safe-area-inset-bottom))','important');
   if(el.style.getPropertyValue('height')!=='54px')el.style.setProperty('height','54px','important');
   return true;
 }
 function start(){
   style();
   if(fix())return;
   const observer=new MutationObserver(()=>{if(fix())observer.disconnect()});
   observer.observe(document.body,{childList:true,subtree:true});
   [500,1500,3200,7000].forEach(ms=>setTimeout(()=>{if(fix())observer.disconnect()},ms));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
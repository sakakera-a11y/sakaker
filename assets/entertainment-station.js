(()=>{'use strict';
if(window.__sakakerEntertainmentStationLoaded)return;
window.__sakakerEntertainmentStationLoaded=true;

const $=id=>document.getElementById(id);
let started=false;
let stationButton=null;
let chatTarget=null;
let chessLoading=false;
let settleTimer=0;

function en(){return document.documentElement.lang==='en'}
function unlocked(){return !!document.body&&!document.body.classList.contains('locked')}

function installStyle(){
  if($('sakEntertainmentRuntimeStyle'))return;
  const style=document.createElement('style');
  style.id='sakEntertainmentRuntimeStyle';
  style.textContent=`
    body:not(.locked) [data-sak-entertainment-grouped="1"],
    body:not(.locked) .sakaker-utility-slot[data-sak-entertainment-hidden="1"],
    body:not(.locked) #sakakerAllIconsDock .sakaker-utility-slot[data-sakaker-util="siteBackground"],
    body:not(.locked) #sakSiteBackgroundBtn,
    body:not(.locked) #sakSeaSoundButton,
    body:not(.locked) #bird-sound-btn,
    body:not(.locked) #sakakerBirdSoundBtn{
      display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    }
    body:not(.locked) #sakakerAllIconsDock .sakaker-utility-slot:empty{
      display:none!important;flex:0 0 0!important;width:0!important;min-width:0!important;max-width:0!important;
      height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;
    }
    body:not(.locked) #sakakerAllIconsDock .sakaker-utility-slot[data-sak-entertainment-hidden="1"],
    body:not(.locked) #sakakerAllIconsDock .sakaker-utility-slot[data-sakaker-util="siteBackground"]{
      flex:0 0 0!important;width:0!important;min-width:0!important;max-width:0!important;
      height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;
    }
    #sakEntertainmentStationRuntime[hidden]{display:none!important}
    #sakEntertainmentStationRuntime{
      position:fixed!important;inset:0!important;z-index:2147483647!important;
      display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;
      background:rgba(0,9,15,.80);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      font-family:Tajawal,Tahoma,Arial,sans-serif;color:#effff8;
    }
    #sakEntertainmentStationRuntime *{box-sizing:border-box}
    #sakEntertainmentStationRuntime .sak-ent-panel{
      width:min(650px,calc(100vw - 22px));max-height:calc(100dvh - 24px);overflow:auto;
      padding:18px;border:1px solid rgba(164,255,222,.78);border-radius:24px;
      background:linear-gradient(145deg,rgba(4,40,45,.97),rgba(4,15,29,.98) 62%,rgba(66,43,11,.95));
      box-shadow:0 0 18px rgba(84,255,216,.58),0 0 42px rgba(255,211,84,.20);
    }
    #sakEntertainmentStationRuntime .sak-ent-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
    #sakEntertainmentStationRuntime h2{margin:0;color:#eafff6;font-size:clamp(18px,4vw,26px);text-shadow:0 0 10px rgba(101,255,220,.72)}
    #sakEntertainmentCloseRuntime{flex:0 0 auto;width:44px;height:44px;border-radius:50%;border:1px solid #ffe28a;background:rgba(35,15,11,.88);color:#fff;font-size:25px;cursor:pointer}
    #sakEntertainmentGridRuntime{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    #sakEntertainmentGridRuntime .sak-ent-item{
      min-height:92px;border:1px solid rgba(152,255,225,.60);border-radius:18px;
      background:linear-gradient(145deg,rgba(0,82,77,.78),rgba(7,29,45,.92));color:#fff;
      cursor:pointer;padding:12px;display:flex;align-items:center;justify-content:center;gap:10px;
      flex-direction:column;text-align:center;font:800 15px/1.3 Tajawal,Tahoma,Arial,sans-serif;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 0 13px rgba(63,255,217,.22);
    }
    #sakEntertainmentGridRuntime .sak-ent-item:hover,#sakEntertainmentGridRuntime .sak-ent-item:focus-visible{filter:brightness(1.12);outline:2px solid #ffe99e;outline-offset:2px}
    #sakEntertainmentGridRuntime .sak-ent-symbol{font-size:32px;line-height:1}
    @media(max-width:700px){
      #sakEntertainmentStationRuntime{padding:7px}
      #sakEntertainmentStationRuntime .sak-ent-panel{padding:13px;border-radius:18px}
      #sakEntertainmentGridRuntime{grid-template-columns:1fr;gap:9px}
      #sakEntertainmentGridRuntime .sak-ent-item{min-height:68px;flex-direction:row;justify-content:flex-start;text-align:start}
    }
  `;
  document.head.appendChild(style);
}

function findChatLauncher(){
  const ids=['sakChatIcon','chatIcon','chatBtn','chatButton','openChatBtn','chatToggle','sakakerChatIcon','onlineChatIcon','onlineViewerIcon'];
  for(const id of ids){const el=$(id);if(el&&!el.closest('#sakEntertainmentStationRuntime,#loginOverlay'))return el;}
  const root=$('sakakerAllIconsDock')||document;
  return [...root.querySelectorAll('button,a,[role="button"],.launcher,.icon-card,[title],[aria-label]')].find(el=>{
    if(el===stationButton||el.closest('#sakEntertainmentStationRuntime,#loginOverlay'))return false;
    const meta=((el.id||'')+' '+(typeof el.className==='string'?el.className:'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /(^|\s|[-_])(chat|الشات|الدردشة|دردشة)(\s|$|[-_])/i.test(meta);
  })||null;
}

function groupOne(el){
  if(!el||el===stationButton||el.closest('#sakEntertainmentStationRuntime'))return;
  el.dataset.sakEntertainmentGrouped='1';
  const slot=el.closest('.sakaker-utility-slot');
  if(slot)slot.dataset.sakEntertainmentHidden='1';
}

function groupLaunchers(){
  if(!unlocked())return;
  ['emOpenBtn','sakCreativeIcon','pongGame-btn'].forEach(id=>groupOne($(id)));
  chatTarget=findChatLauncher()||chatTarget;
  groupOne(chatTarget);
}

function compactDock(){
  if(!unlocked())return;
  const dock=$('sakakerAllIconsDock');
  if(!dock)return;

  const backgroundSlot=dock.querySelector('.sakaker-utility-slot[data-sakaker-util="siteBackground"]');
  if(backgroundSlot)backgroundSlot.dataset.sakEntertainmentHidden='1';

  dock.querySelectorAll('.sakaker-utility-slot').forEach(slot=>{
    if(slot.querySelector('[data-sak-entertainment-grouped="1"]'))slot.dataset.sakEntertainmentHidden='1';
    if(!slot.firstElementChild)slot.remove();
  });

  const station=$('sakEmeraldChessIcon');
  const businessSlot=dock.querySelector('.sakaker-utility-slot[data-sakaker-util="business"]');
  if(station)station.style.setProperty('order','0','important');
  if(businessSlot)businessSlot.style.setProperty('order','1','important');
}

function ensurePanel(){
  let modal=$('sakEntertainmentStationRuntime');
  if(modal)return modal;
  modal=document.createElement('div');
  modal.id='sakEntertainmentStationRuntime';
  modal.hidden=true;
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.innerHTML='<div class="sak-ent-panel"><div class="sak-ent-head"><h2 id="sakEntertainmentTitleRuntime"></h2><button id="sakEntertainmentCloseRuntime" type="button">×</button></div><div id="sakEntertainmentGridRuntime"><button class="sak-ent-item" type="button" data-action="music"><span class="sak-ent-symbol">🎹</span><span></span></button><button class="sak-ent-item" type="button" data-action="creative"><span class="sak-ent-symbol">🎨</span><span></span></button><button class="sak-ent-item" type="button" data-action="pong"><span class="sak-ent-symbol">🏓</span><span></span></button><button class="sak-ent-item" type="button" data-action="chat"><span class="sak-ent-symbol">💬</span><span></span></button><button class="sak-ent-item" type="button" data-action="chess"><span class="sak-ent-symbol">♞</span><span></span></button></div></div>';
  document.body.appendChild(modal);
  $('sakEntertainmentCloseRuntime')?.addEventListener('click',closePanel);
  modal.addEventListener('click',e=>{if(e.target===modal)closePanel()});
  $('sakEntertainmentGridRuntime')?.addEventListener('click',e=>{const item=e.target.closest('.sak-ent-item');if(item)launch(item.dataset.action)});
  updateLanguage();
  return modal;
}

function updateLanguage(){
  const label=en()?'Entertainment Station':'المحطة الترفيهية';
  if(stationButton){
    stationButton.setAttribute('aria-label',label);stationButton.title=label;
    let small=stationButton.querySelector('small');
    if(!small){small=document.createElement('small');stationButton.appendChild(small)}
    small.textContent=label;
  }
  const modal=$('sakEntertainmentStationRuntime');if(!modal)return;
  modal.dir=en()?'ltr':'rtl';
  const title=$('sakEntertainmentTitleRuntime');if(title)title.textContent=label;
  const close=$('sakEntertainmentCloseRuntime');if(close){close.title=en()?'Close':'إغلاق';close.setAttribute('aria-label',close.title)}
  const names={music:en()?'Music Studio':'استديو الموسيقى',creative:en()?'Creative Studio':'الاستديو الإبداعي',pong:en()?'Pong Game':'لعبة البونج',chat:en()?'Chat':'الشات',chess:en()?'Chess Game':'لعبة الشطرنج'};
  modal.querySelectorAll('.sak-ent-item').forEach(item=>{const name=names[item.dataset.action]||'';const text=item.querySelector('span:last-child');if(text)text.textContent=name;item.title=name;item.setAttribute('aria-label',name)});
}

function fallbackGullMarkup(){
  return '<span aria-hidden="true" style="font-size:36px;line-height:1">🕊️</span><small></small>';
}

function ensureStationButton(){
  if(!unlocked())return null;
  const dock=$('sakakerAllIconsDock');if(!dock)return null;
  let current=$('sakEmeraldChessIcon');
  if(current&&current.dataset.sakRole!=='entertainment-station'){
    const replacement=current.cloneNode(true);
    current.replaceWith(replacement);
    current=replacement;
  }
  if(!current){
    current=document.createElement('button');current.id='sakEmeraldChessIcon';current.type='button';current.innerHTML=fallbackGullMarkup();dock.appendChild(current);
  }
  if(current.dataset.sakRole!=='entertainment-station'||!current.dataset.sakStationBound){
    current.dataset.sakRole='entertainment-station';
    current.dataset.sakStationBound='1';
    current.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openPanel()});
  }
  stationButton=current;
  updateLanguage();
  return current;
}

function openPanel(){if(!unlocked())return;ensurePanel().hidden=false;document.body.style.overflow='hidden';setTimeout(()=>$('sakEntertainmentCloseRuntime')?.focus(),0)}
function closePanel(){const modal=$('sakEntertainmentStationRuntime');if(modal)modal.hidden=true;if(document.body)document.body.style.overflow='';stationButton?.focus()}

function clickTarget(target,arMsg,enMsg){
  if(target&&document.contains(target)){target.click();return true}
  alert(en()?enMsg:arMsg);return false;
}
async function openChess(){
  if(chessLoading)return;chessLoading=true;
  try{const module=await import('/assets/chess/chess-app.js?v=20260930-5');await module.openChess()}
  catch(_){alert(en()?'Chess could not load. Please check your connection and retry.':'تعذر تحميل الشطرنج. تحقق من الاتصال ثم أعد المحاولة.')}
  finally{chessLoading=false}
}
function launch(action){
  closePanel();
  if(action==='chess'){openChess();return}
  if(action==='music'){clickTarget($('emOpenBtn'),'استديو الموسيقى لم يكتمل تحميله بعد. أعد المحاولة بعد لحظة.','Music Studio is still loading. Try again in a moment.');return}
  if(action==='creative'){clickTarget($('sakCreativeIcon'),'الاستديو الإبداعي لم يكتمل تحميله بعد. أعد المحاولة بعد لحظة.','Creative Studio is still loading. Try again in a moment.');return}
  if(action==='pong'){clickTarget($('pongGame-btn'),'لعبة البونج لم تكتمل بعد. أعد المحاولة بعد لحظة.','Pong is still loading. Try again in a moment.');return}
  if(action==='chat'){chatTarget=findChatLauncher()||chatTarget;clickTarget(chatTarget,'الشات لم يكتمل تحميله بعد. أعد المحاولة بعد لحظة.','Chat is still loading. Try again in a moment.')}
}

function settle(){
  if(!unlocked())return;
  installStyle();
  ensureStationButton();
  ensurePanel();
  groupLaunchers();
  compactDock();
  updateLanguage();
}

function scheduleSettle(){
  if(!unlocked())return;
  clearTimeout(settleTimer);
  settleTimer=setTimeout(settle,50);
}

function start(){
  if(started||!unlocked())return;
  started=true;
  settle();
  [200,600,1200,2500,5000,9000].forEach(ms=>setTimeout(()=>{if(unlocked())settle()},ms));
  const bodyObserver=new MutationObserver(records=>{if(unlocked()&&records.some(r=>r.addedNodes.length))scheduleSettle()});
  bodyObserver.observe(document.body,{childList:true,subtree:true});
  new MutationObserver(()=>{if(unlocked()){updateLanguage();scheduleSettle()}}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('sakEntertainmentStationRuntime')?.hidden)closePanel()});
}

function waitForLogin(){
  if(!document.body){document.addEventListener('DOMContentLoaded',waitForLogin,{once:true});return;}
  if(unlocked()){start();return;}
  const authGate=new MutationObserver(()=>{
    if(unlocked()){
      authGate.disconnect();
      start();
    }
  });
  authGate.observe(document.body,{attributes:true,attributeFilter:['class']});
}

waitForLogin();
})();
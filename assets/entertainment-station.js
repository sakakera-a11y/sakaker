(()=>{'use strict';
if(window.__sakakerEntertainmentStationLoaded)return;
window.__sakakerEntertainmentStationLoaded=true;

const SITE_TITLE='Emerald Moon Castle';
const $=id=>document.getElementById(id);
let stationButton=null;
let chatTarget=null;
let chessLoading=false;

function en(){return document.documentElement.lang==='en'}
function enforceTitle(){if(document.title!==SITE_TITLE)document.title=SITE_TITLE}

function installStyle(){
  if($('sakEntertainmentRuntimeStyle'))return;
  const style=document.createElement('style');
  style.id='sakEntertainmentRuntimeStyle';
  style.textContent=`
    body:not(.locked) [data-sak-entertainment-grouped="1"]{
      display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    }
    body:not(.locked) .sakaker-utility-slot[data-sak-entertainment-hidden="1"]{
      display:none!important;visibility:hidden!important;pointer-events:none!important;
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
    #sakEntertainmentCloseRuntime{flex:0 0 auto;width:44px;height:44px;border-radius:50%;border:1px solid #ffe28a;background:rgba(35,15,11,.88);color:#fff;font-size:25px;cursor:pointer;box-shadow:0 0 12px rgba(255,210,91,.4)}
    #sakEntertainmentGridRuntime{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    #sakEntertainmentGridRuntime .sak-ent-item{
      min-height:96px;border:1px solid rgba(152,255,225,.60);border-radius:18px;
      background:linear-gradient(145deg,rgba(0,82,77,.78),rgba(7,29,45,.92));color:#fff;
      cursor:pointer;padding:12px;display:flex;align-items:center;justify-content:center;gap:10px;
      flex-direction:column;text-align:center;font:800 15px/1.3 Tajawal,Tahoma,Arial,sans-serif;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 0 13px rgba(63,255,217,.22);
      transition:transform .18s ease,filter .18s ease,box-shadow .18s ease;
    }
    #sakEntertainmentGridRuntime .sak-ent-item:hover,#sakEntertainmentGridRuntime .sak-ent-item:focus-visible{
      transform:translateY(-2px);filter:brightness(1.12);box-shadow:0 0 18px rgba(81,255,222,.62);outline:2px solid #ffe99e;outline-offset:2px
    }
    #sakEntertainmentGridRuntime .sak-ent-symbol{font-size:34px;line-height:1}
    #sakEntertainmentGridRuntime .sak-ent-item[data-action="chess"]{grid-column:1/-1;background:linear-gradient(145deg,rgba(63,43,6,.88),rgba(4,62,58,.92))}
    @media(max-width:700px){
      #sakEntertainmentStationRuntime{padding:7px}
      #sakEntertainmentStationRuntime .sak-ent-panel{padding:13px;border-radius:18px}
      #sakEntertainmentGridRuntime{grid-template-columns:1fr;gap:9px}
      #sakEntertainmentGridRuntime .sak-ent-item{min-height:72px;flex-direction:row;justify-content:flex-start;text-align:start}
      #sakEntertainmentGridRuntime .sak-ent-item[data-action="chess"]{grid-column:auto}
      #sakEntertainmentGridRuntime .sak-ent-symbol{font-size:28px}
    }
    @media(prefers-reduced-motion:reduce){#sakEntertainmentGridRuntime .sak-ent-item{transition:none!important}}
  `;
  document.head.appendChild(style);
}

function findChatLauncher(){
  const explicit=['sakChatIcon','chatIcon','chatBtn','chatButton','onlineChatIcon','sakakerChatIcon','onlineViewerIcon'];
  for(const id of explicit){const el=$(id);if(el&&!el.closest('#sakEntertainmentStationRuntime,#loginOverlay'))return el;}
  const dock=$('sakakerAllIconsDock');
  const roots=dock?[dock]:[document];
  for(const root of roots){
    const nodes=[...root.querySelectorAll('button,a,[role="button"],.launcher,.icon-card,[title],[aria-label]')];
    const found=nodes.find(el=>{
      if(el===stationButton||el.closest('#sakEntertainmentStationRuntime,#loginOverlay'))return false;
      const meta=((el.id||'')+' '+(typeof el.className==='string'?el.className:'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
      return /(^|\s|[-_])(chat|الشات|الدردشة|دردشة)(\s|$|[-_])/i.test(meta);
    });
    if(found)return found;
  }
  return null;
}

function groupOne(el){
  if(!el||el===stationButton||el.closest('#sakEntertainmentStationRuntime'))return;
  el.dataset.sakEntertainmentGrouped='1';
  const slot=el.closest('.sakaker-utility-slot');
  if(slot)slot.dataset.sakEntertainmentHidden='1';
}

function groupLaunchers(){
  ['emOpenBtn','sakCreativeIcon','pongGame-btn'].forEach(id=>groupOne($(id)));
  chatTarget=findChatLauncher()||chatTarget;
  groupOne(chatTarget);
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
  $('sakEntertainmentCloseRuntime').addEventListener('click',closePanel);
  modal.addEventListener('click',e=>{if(e.target===modal)closePanel()});
  $('sakEntertainmentGridRuntime').addEventListener('click',e=>{const item=e.target.closest('.sak-ent-item');if(item)launch(item.dataset.action)});
  updateLanguage();
  return modal;
}

function updateLanguage(){
  const label=en()?'Entertainment Station':'المحطة الترفيهية';
  if(stationButton){
    stationButton.setAttribute('aria-label',label);stationButton.title=label;
    const small=stationButton.querySelector('small');if(small)small.textContent=label;
  }
  const modal=$('sakEntertainmentStationRuntime');if(!modal)return;
  modal.dir=en()?'ltr':'rtl';
  const title=$('sakEntertainmentTitleRuntime');if(title)title.textContent=label;
  const close=$('sakEntertainmentCloseRuntime');if(close){close.title=en()?'Close':'إغلاق';close.setAttribute('aria-label',close.title)}
  const names={music:en()?'Music Studio':'استديو الموسيقى',creative:en()?'Creative Studio':'الاستديو الإبداعي',pong:en()?'Pong Game':'لعبة البونج',chat:en()?'Chat':'الشات',chess:en()?'Chess Game':'لعبة الشطرنج'};
  modal.querySelectorAll('.sak-ent-item').forEach(item=>{const text=item.querySelector('span:last-child');const name=names[item.dataset.action]||'';if(text)text.textContent=name;item.title=name;item.setAttribute('aria-label',name)});
}

function gullMarkup(){
  return '<svg viewBox="0 0 88 68" aria-hidden="true"><defs><linearGradient id="sakStationBirdMetal" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#d1eee5"/><stop offset="1" stop-color="#639b94"/></linearGradient></defs><path d="M38 38 18 49 12 44 25 35Z" fill="#e3fff4" stroke="#254b4d" stroke-width="1.4"/><path class="sak-chess-wing" d="M38 37C25 25 10 22 3 8C20 12 34 17 45 32L43 38Z" fill="url(#sakStationBirdMetal)" stroke="#234c4d" stroke-width="1.3"/><path class="sak-chess-wing" d="M42 34C52 19 69 14 78 5C76 22 67 32 49 41Z" fill="url(#sakStationBirdMetal)" stroke="#234c4d" stroke-width="1.3"/><path d="M25 37C29 30 39 28 46 33C52 34 51 27 52 18C53 8 62 8 67 12L75 15 67 19C64 18 60 17 59 22C60 34 55 43 45 44C37 46 29 43 25 37Z" fill="url(#sakStationBirdMetal)" stroke="#254b4d" stroke-width="1.5"/><path d="m67 13 13 4-13 2Z" fill="#e7bb53" stroke="#8b5b26"/><circle cx="64" cy="13" r="1.7" fill="#102529"/><path d="m39 43-3 7m10-7-2 7" stroke="#d9b967" stroke-width="2"/></svg><small></small>';
}

function ensureStationButton(){
  const dock=$('sakakerAllIconsDock');if(!dock)return null;
  let current=$('sakEmeraldChessIcon');
  if(current&&current.dataset.sakRole!=='entertainment-station'){
    const replacement=current.cloneNode(true);
    current.replaceWith(replacement);
    current=replacement;
  }
  if(!current){
    current=document.createElement('button');current.id='sakEmeraldChessIcon';current.type='button';current.innerHTML=gullMarkup();dock.appendChild(current);
  }
  if(current.dataset.sakRole!=='entertainment-station'){
    current.dataset.sakRole='entertainment-station';
    current.addEventListener('click',openPanel);
  }else if(!current.dataset.sakStationBound){
    current.addEventListener('click',openPanel);
  }
  current.dataset.sakStationBound='1';
  stationButton=current;
  const small=current.querySelector('small');if(!small){const s=document.createElement('small');current.appendChild(s)}
  updateLanguage();
  return current;
}

function openPanel(){ensurePanel().hidden=false;document.body.style.overflow='hidden';setTimeout(()=>$('sakEntertainmentCloseRuntime')?.focus(),0)}
function closePanel(){const modal=$('sakEntertainmentStationRuntime');if(modal)modal.hidden=true;document.body.style.overflow='';stationButton?.focus()}

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
  if(action==='chat'){chatTarget=findChatLauncher()||chatTarget;clickTarget(chatTarget,'الشات لم يكتمل تحميله بعد. أعد المحاولة بعد لحظة.','Chat is still loading. Try again in a moment.');}
}

function settle(){
  enforceTitle();installStyle();ensureStationButton();ensurePanel();groupLaunchers();updateLanguage();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
window.addEventListener('load',settle,{once:true});
[150,400,800,1500,3000,5500,9000].forEach(ms=>setTimeout(settle,ms));
new MutationObserver(()=>{enforceTitle();updateLanguage();groupLaunchers();ensureStationButton()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
const bodyObserver=new MutationObserver(records=>{
  if(records.some(r=>r.addedNodes.length)){ensureStationButton();groupLaunchers();}
});
if(document.body)bodyObserver.observe(document.body,{childList:true,subtree:true});
else document.addEventListener('DOMContentLoaded',()=>bodyObserver.observe(document.body,{childList:true,subtree:true}),{once:true});
const headObserver=new MutationObserver(enforceTitle);if(document.head)headObserver.observe(document.head,{childList:true,subtree:true,characterData:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('sakEntertainmentStationRuntime')?.hidden)closePanel()});
})();
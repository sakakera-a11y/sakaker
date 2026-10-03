(()=>{'use strict';
const VERSION='20261003-video4';
if(window.__sakVideoModalFixVersion===VERSION)return;
window.__sakVideoModalFixVersion=VERSION;

let oldBodyOverflow='';
let oldHtmlOverflow='';

function unlockScroll(){
  if(document.body)document.body.style.overflow=oldBodyOverflow;
  document.documentElement.style.overflow=oldHtmlOverflow;
}

function closeEmeraldModal(){
  const modal=document.getElementById('emeraldModal');
  if(!modal){unlockScroll();return;}
  const frame=modal.querySelector('iframe');
  if(frame)frame.src='about:blank';
  modal.remove();
  unlockScroll();
}

function openFixedEmeraldVideo(url){
  if(!url)return;
  closeEmeraldModal();

  if(document.body){oldBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
  oldHtmlOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';

  const modal=document.createElement('div');
  modal.id='emeraldModal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;display:flex;align-items:center;justify-content:center;padding:max(58px,calc(env(safe-area-inset-top) + 48px)) 12px max(18px,env(safe-area-inset-bottom));box-sizing:border-box;background:rgba(0,7,12,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:2147483646;overflow:auto;overscroll-behavior:contain';

  const shell=document.createElement('div');
  shell.style.cssText='position:relative;width:min(1100px,96vw);aspect-ratio:16/9;max-height:calc(100dvh - 100px);border:1px solid rgba(120,255,235,.85);border-radius:22px;overflow:hidden;background:#000;box-shadow:0 0 28px rgba(0,255,220,.45),0 0 70px rgba(0,160,255,.22)';

  const frame=document.createElement('iframe');
  frame.src=url;
  frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.title=document.documentElement.lang==='en'?'Video player':'مشغل الفيديو';
  frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#000';

  const close=document.createElement('button');
  close.id='emeraldModalClose';
  close.type='button';
  close.textContent=document.documentElement.lang==='en'?'Close ✕':'إغلاق ✕';
  close.setAttribute('aria-label',document.documentElement.lang==='en'?'Close video':'إغلاق الفيديو');
  close.style.cssText='position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2147483647;min-width:110px;min-height:42px;padding:9px 18px;border:1px solid #7ffff0;border-radius:999px;background:rgba(2,35,39,.97);color:#fff;font:800 14px Tajawal,Tahoma,Arial,sans-serif;box-shadow:0 0 18px rgba(0,255,220,.7);cursor:pointer;touch-action:manipulation';
  close.addEventListener('click',closeEmeraldModal);

  shell.appendChild(frame);
  modal.append(shell,close);
  modal.addEventListener('click',e=>{if(e.target===modal)closeEmeraldModal();});
  document.body.appendChild(modal);
  requestAnimationFrame(()=>{try{close.focus({preventScroll:true});}catch(_){close.focus();}});
}

function extractUrl(el){
  const raw=el.getAttribute('onclick')||'';
  const m=raw.match(/openEmeraldVideo\((['"])(.*?)\1\)/i);
  return m?m[2]:'';
}

document.addEventListener('click',e=>{
  const item=e.target?.closest?.('.emeraldVideoCircle');
  if(!item)return;
  const url=extractUrl(item);
  if(!url)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  openFixedEmeraldVideo(url);
},true);

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.getElementById('emeraldModal')){
    e.preventDefault();
    closeEmeraldModal();
  }
},true);

window.openEmeraldVideo=openFixedEmeraldVideo;
window.closeEmeraldVideo=closeEmeraldModal;
})();

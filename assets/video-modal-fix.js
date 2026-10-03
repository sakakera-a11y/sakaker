(()=>{'use strict';
if(window.__sakVideoModalFixLoaded)return;
window.__sakVideoModalFixLoaded=true;

function closeEmeraldModal(){
  const modal=document.getElementById('emeraldModal');
  if(!modal)return;
  const frame=modal.querySelector('iframe');
  if(frame)frame.src='about:blank';
  modal.remove();
}

function openFixedEmeraldVideo(url){
  if(!url)return;
  closeEmeraldModal();

  const modal=document.createElement('div');
  modal.id='emeraldModal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.style.cssText='position:fixed;inset:0;width:100%;height:100dvh;display:flex;align-items:center;justify-content:center;padding:clamp(8px,3vw,20px);box-sizing:border-box;background:rgba(0,0,0,.90);backdrop-filter:blur(7px);z-index:2147483647';

  const frame=document.createElement('iframe');
  frame.src=url;
  frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.title='Video player';
  frame.style.cssText='display:block;width:min(1000px,94vw);height:min(76dvh,680px);border:0;border-radius:18px;background:#000;box-shadow:0 0 35px rgba(0,255,255,.55)';

  const close=document.createElement('button');
  close.id='emeraldModalClose';
  close.type='button';
  close.textContent=(document.documentElement.lang==='en'?'Close ✕':'إغلاق ✕');
  close.setAttribute('aria-label',document.documentElement.lang==='en'?'Close video':'إغلاق الفيديو');
  close.style.cssText='position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2147483647;padding:9px 15px;border:1px solid #7ffff0;border-radius:999px;background:rgba(2,35,39,.96);color:#fff;font:800 14px Tajawal,Tahoma,Arial,sans-serif;box-shadow:0 0 16px rgba(0,255,220,.55);cursor:pointer';
  close.addEventListener('click',closeEmeraldModal);

  modal.append(frame,close);
  modal.addEventListener('click',e=>{if(e.target===modal)closeEmeraldModal();});
  document.body.appendChild(modal);
  try{frame.focus({preventScroll:true});}catch(_){ }
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

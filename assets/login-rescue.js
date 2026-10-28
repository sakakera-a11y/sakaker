(()=>{'use strict';
if(window.__sakakerLoginRescueLoaded)return;
window.__sakakerLoginRescueLoaded=true;

const $=id=>document.getElementById(id);

function disableLoginVideo(){
  const v=$('sakLoginBackgroundVideo');
  if(!v)return;
  try{v.pause();}catch(_){}
  v.querySelectorAll('source').forEach(n=>n.remove());
  v.removeAttribute('src');
  v.remove();
}

function removeExtraSounds(){
  const legacy=['sakSeaAudio','sakSeaSoundButton','bird-sound-btn','sakakerBirdSoundBtn','sakakerBirdAudio'];
  legacy.forEach(id=>{
    const el=$(id);
    if(!el||el.closest?.('#loginOverlay'))return;
    try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){}
    el.remove();
  });
}

function installPostLoginSoundStyle(){
  if(document.getElementById('sakPostLoginSoundStyle'))return;
  const style=document.createElement('style');
  style.id='sakPostLoginSoundStyle';
  style.textContent=`body:not(.locked) #bird-sound-btn,body:not(.locked) #sakakerBirdSoundBtn,body:not(.locked) #sakSeaSoundButton,body:not(.locked) #sakSeaAudio,body:not(.locked) #sakakerBirdAudio{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}`;
  document.head.appendChild(style);
}

function placePostLoginSoundButton(){
  if(!document.body||document.body.classList.contains('locked'))return;
  const btn=$('sakSiteSoundBtn');
  if(!btn)return;
  btn.style.setProperty('position','fixed','important');
  btn.style.setProperty('left','8px','important');
  btn.style.setProperty('right','auto','important');
  btn.style.setProperty('bottom','10px','important');
  btn.style.setProperty('top','auto','important');
  btn.style.setProperty('transform','none','important');
}

function init(){
  disableLoginVideo();
  removeExtraSounds();
  installPostLoginSoundStyle();
  placePostLoginSoundButton();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();

window.addEventListener('resize',()=>requestAnimationFrame(placePostLoginSoundButton),{passive:true});
})();

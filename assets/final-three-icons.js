(()=>{'use strict';
const row=document.getElementById('sakUtilityRow');
if(!row)return;
const map=document.querySelector('.launcher:not(#sakMusicIcon)');
const music=document.getElementById('sakMusicIcon');
const host=document.getElementById('sakakerBusinessCenterHost')||document.getElementById('sakakerBusinessAd');
function arrange(){
  if(host&&host.parentElement!==row)row.append(host);
  if(map&&map.parentElement!==row)row.append(map);
  if(music&&music.parentElement!==row)row.append(music);
  if(host&&map&&music)row.append(host,map,music);
}
function labels(){
  const en=document.documentElement.lang==='en';
  if(map){const s=map.querySelector('span');if(s)s.textContent=en?'🌙 Maps':'🌙 خرائط';map.title=en?'Maps':'الخرائط';map.setAttribute('aria-label',map.title)}
  if(music){const s=music.querySelector('span');if(s)s.textContent=en?'☀️ Audio to Video':'☀️ تحويل الصوت لفيديو';music.title=en?'Audio to Video':'تحويل الصوت لفيديو';music.setAttribute('aria-label',music.title)}
}
arrange();labels();
[300,1200,3000,6000].forEach(ms=>setTimeout(()=>{arrange();labels()},ms));
new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

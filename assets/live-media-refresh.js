(()=>{'use strict';
const STATIONS=[
 {ar:'إذاعة القرآن الكريم',en:'Holy Quran Radio',url:'https://radioplus.sba.sa/ar/live/4'},
 {ar:'إذاعة الرياض',en:'Riyadh Radio',url:'https://radioplus.sba.sa/ar/live/2'},
 {ar:'إذاعة جدة',en:'Jeddah Radio',url:'https://radioplus.sba.sa/ar/live/3'},
 {ar:'نداء الإسلام',en:'Call of Islam',url:'https://radioplus.sba.sa/ar/live/1'}
];
const CAIRO='https://stream.radiojar.com/8s5u5tpdtwzuv';
function isEn(){return document.documentElement.lang==='en'}
function text(ar,en){return isEn()?en:ar}
function enhance(){
 const header=document.getElementById('sakRadioHeader');
 if(!header||document.getElementById('sakRadioFeatured'))return;
 const section=document.createElement('section');section.id='sakRadioFeatured';
 const title=document.createElement('div');title.className='sak-radio-featured-title';title.textContent=text('محطات مختارة','Featured stations');section.appendChild(title);
 const cairo=document.createElement('button');cairo.type='button';cairo.textContent=text('▶ إذاعة القرآن الكريم من القاهرة','▶ Cairo Quran Radio');cairo.addEventListener('click',async()=>{
   const audio=document.getElementById('sakRadioAudio');if(!audio)return;
   audio.src=CAIRO;audio.load();
   const name=document.getElementById('sakRadioNowName'),sub=document.getElementById('sakRadioNowSub');
   if(name)name.textContent=text('إذاعة القرآن الكريم من القاهرة','Cairo Quran Radio');
   if(sub)sub.textContent=text('بث مباشر · مصر','Live stream · Egypt');
   const external=document.getElementById('sakRadioOpenExternal');if(external){external.href='https://radioqurancairo.com/';external.style.display='inline-flex';external.textContent=text('الموقع','Station site')}
   try{await audio.play()}catch(_){}
 });section.appendChild(cairo);
 STATIONS.forEach(s=>{const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='↗ '+text(s.ar,s.en);section.appendChild(a)});
 const note=document.createElement('div');note.className='sak-radio-featured-note';note.textContent=text('محطات الهيئة السعودية للبث تُفتح من مصدرها الرسمي. ويمكنك البحث أدناه في دليل المحطات العالمي المتجدد.','Saudi Broadcasting Authority stations open at their official source. Search the refreshed worldwide directory below.');section.appendChild(note);
 const filters=document.getElementById('sakRadioFilterRow')||header.lastElementChild;
 (filters||header).insertAdjacentElement('afterend',section);
}
function pinRefreshStyles(){
 const link=[...document.querySelectorAll('link[rel="stylesheet"]')].find(node=>node.href.includes('live-media-refresh.css'));
 if(!link||document.getElementById('sakLiveMediaPinnedStyle'))return;
 const apply=()=>{
  let rules='';
  try{rules=[...link.sheet.cssRules].map(rule=>rule.cssText).join('\n')}catch(_){}
  if(!rules)return;
  const style=document.createElement('style');style.id='sakLiveMediaPinnedStyle';style.textContent=rules;
  (document.body||document.head).appendChild(style);
 };
 if(link.sheet)apply();else link.addEventListener('load',apply,{once:true});
}
function boot(){
 pinRefreshStyles();
 enhance();
 const root=document.getElementById('liveVideosContainer');
 if(root&&!root.dataset.sakSeaStyleObserver){
   root.dataset.sakSeaStyleObserver='1';
   new MutationObserver(()=>{if(document.documentElement.lang!==window.__sakLiveLastLang){window.__sakLiveLastLang=document.documentElement.lang;const node=document.getElementById('sakRadioFeatured');if(node)node.remove();enhance()}}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 }
}
new MutationObserver(boot).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
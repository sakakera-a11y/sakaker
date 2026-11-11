(()=>{
 'use strict';
 if(window.__sakakerNewsTickerBooted)return;
 window.__sakakerNewsTickerBooted=true;
 const ensure=()=>{
  let slot=document.getElementById('sakakerNewsSlot');
  if(!slot){
   slot=document.createElement('div');slot.id='sakakerNewsSlot';
   const header=document.getElementById('sakFestiveHeader');
   const countdowns=document.getElementById('sakHolidayCountdowns');
   if(header){if(countdowns&&countdowns.parentElement===header)countdowns.insertAdjacentElement('afterend',slot);else header.appendChild(slot);}
   else if(countdowns&&countdowns.parentElement)countdowns.insertAdjacentElement('afterend',slot);
   else{const anchor=document.getElementById('sakCastleTourBtn')||document.querySelector('.cards');if(anchor&&anchor.parentElement)anchor.insertAdjacentElement('afterend',slot);else document.body.insertBefore(slot,document.body.firstChild);}
  }
  slot.classList.add('news-ticker');
  slot.setAttribute('role','region');
  slot.setAttribute('aria-live','off');
  const en=String(document.documentElement.lang||'ar').toLowerCase().startsWith('en');
  slot.setAttribute('aria-label',en?'Latest news':'آخر الأخبار');
  if(!document.getElementById('sakakerNewsTickerStyle')){
   const style=document.createElement('style');style.id='sakakerNewsTickerStyle';
   style.textContent=`
    #sakakerNewsSlot.news-ticker{box-sizing:border-box!important;display:flex!important;align-items:center!important;width:100%!important;max-width:100%!important;height:42px!important;min-height:42px!important;max-height:42px!important;margin:7px 0!important;padding:0 10px!important;overflow:hidden!important;border:1px solid rgba(75,226,199,.55)!important;border-radius:13px!important;background:rgba(5,30,38,.28)!important;box-shadow:0 0 10px rgba(0,255,204,.10)!important;backdrop-filter:blur(3px)!important;-webkit-backdrop-filter:blur(3px)!important;position:relative!important;z-index:4!important;direction:rtl!important}
    #sakakerNewsSlot .sak-news-caption{flex:0 0 auto!important;color:#ffe08a!important;font:800 12px/1.4 Tahoma,Arial,sans-serif!important;margin-inline-end:10px!important}
    #sakakerNewsSlot .sak-news-window{flex:1 1 auto!important;min-width:0!important;overflow:hidden!important;white-space:nowrap!important}
    #sakakerNewsSlot .sak-news-track{display:inline-flex!important;align-items:center!important;gap:34px!important;width:max-content!important;white-space:nowrap!important;animation:sakNewsTickerMove 78s linear infinite!important}
    #sakakerNewsSlot .sak-news-item{display:inline-flex!important;align-items:center!important;gap:7px!important;color:#fff!important;text-decoration:none!important;font:700 12px/1.5 Tahoma,Arial,sans-serif!important;text-shadow:0 0 5px rgba(0,0,0,.7)!important}
    #sakakerNewsSlot .sak-news-item:before{content:"◆";color:#69e5c5!important;font-size:8px!important}
    #sakakerNewsSlot .sak-news-item:hover{text-decoration:underline!important}
    @keyframes sakNewsTickerMove{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    #sakakerNewsSlot:hover .sak-news-track{animation-play-state:paused!important}
    @media(prefers-reduced-motion:reduce){#sakakerNewsSlot .sak-news-track{animation:none!important}}
    @media(max-width:600px){#sakakerNewsSlot.news-ticker{height:40px!important;min-height:40px!important;max-height:40px!important;margin:5px 0!important;padding:0 7px!important}#sakakerNewsSlot .sak-news-caption{font-size:10px!important;margin-inline-end:6px!important}#sakakerNewsSlot .sak-news-item{font-size:11px!important}}
   `;
   document.head.appendChild(style);
  }
  if(slot.dataset.newsTickerLoaded==='1')return;
  slot.dataset.newsTickerLoaded='1';
  fetch('/data/news.json?ts='+Date.now(),{cache:'no-store'})
   .then(response=>{if(!response.ok)throw new Error('News snapshot unavailable');return response.json();})
   .then(data=>{
    const items=(Array.isArray(data.items)?data.items:[]).filter(x=>x&&typeof x.title==='string'&&x.title.trim()).slice(0,16);
    if(!items.length)throw new Error('No published headlines');
    slot.replaceChildren();
    const caption=document.createElement('strong');caption.className='sak-news-caption';caption.textContent=en?'NEWS':'الأخبار';
    const viewport=document.createElement('div');viewport.className='sak-news-window';
    const track=document.createElement('div');track.className='sak-news-track';
    for(let copy=0;copy<2;copy++)for(const item of items){
     const link=document.createElement('a');link.className='sak-news-item';
     link.href=typeof item.link==='string'&&/^https?:\/\//i.test(item.link)?item.link:'#';
     link.target='_blank';link.rel='noopener noreferrer';link.textContent=item.title.trim();
     if(item.source)link.title=String(item.source);
     track.appendChild(link);
    }
    viewport.appendChild(track);slot.append(caption,viewport);slot.classList.remove('visitor-slot-empty');
   })
   .catch(error=>{console.warn('[Sakaker] News ticker could not load published headlines.',error);slot.dataset.newsTickerLoaded='0';slot.classList.add('visitor-slot-empty');});
 };
 const boot=()=>ensure();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 new MutationObserver(()=>{if(!document.getElementById('sakakerNewsSlot'))ensure();}).observe(document.documentElement,{childList:true,subtree:true});
})();

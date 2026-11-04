/* SAKAKER News Recovery — restores the “اضغط للفتح” control and resilient RSS loading. */
(()=>{
  'use strict';
  const AR_FEEDS=[
    ['أخبار عامة','https://news.google.com/rss?hl=ar&gl=SA&ceid=SA:ar'],
    ['أخبار العالم','https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=SA&ceid=SA:ar'],
    ['الرياضة','https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ar&gl=SA&ceid=SA:ar'],
    ['الاقتصاد','https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ar&gl=SA&ceid=SA:ar']
  ];
  const EN_FEEDS=[
    ['General News','https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en'],
    ['World News','https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en'],
    ['Sports','https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en'],
    ['Economy','https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en']
  ];
  const $=id=>document.getElementById(id);
  const lang=()=>document.documentElement.lang==='en'?'en':'ar';
  let loading=false,lastFetch=0,requestNo=0;

  function ensureUI(){
    let header=$('sakFestiveHeader');
    let holidays=$('sakHolidayCountdowns');
    if(!holidays){
      holidays=document.createElement('div');
      holidays.id='sakHolidayCountdowns';
      (header||document.body).appendChild(holidays);
    }
    const clock=$('sakakerWatermarkClock');
    if(clock && clock.parentElement!==holidays) holidays.appendChild(clock);

    let button=$('sakNewsLaunch');
    if(!button){
      button=document.createElement('button');
      button.id='sakNewsLaunch';
      button.type='button';
      button.setAttribute('aria-haspopup','dialog');
      button.setAttribute('aria-controls','sakNewsDialog');
      button.setAttribute('aria-expanded','false');
      holidays.appendChild(button);
    }else if(button.parentElement!==holidays){
      holidays.appendChild(button);
    }

    let dialog=$('sakNewsDialog');
    if(!dialog){
      dialog=document.createElement('dialog');
      dialog.id='sakNewsDialog';
      dialog.setAttribute('aria-labelledby','sakNewsTitle');
      dialog.innerHTML='<div class="sak-news-heading"><h2 id="sakNewsTitle"></h2><button type="button" id="sakNewsClose">×</button></div><div id="sakNewsContent" tabindex="0"></div>';
      document.body.appendChild(dialog);
    }
    let style=$('sak-news-recovery-style');
    if(!style){
      style=document.createElement('style');
      style.id='sak-news-recovery-style';
      style.textContent=
        '#sakHolidayCountdowns{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:5px!important;min-width:0!important}'+
        'html body #sakNewsLaunch{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:relative!important;z-index:5!important;grid-column:2!important;grid-row:2!important;justify-self:stretch!important;align-self:stretch!important;min-width:0!important;min-height:36px!important;width:100%!important;padding:5px!important;border:1px solid #dfbade99!important;border-radius:10px!important;color:#fff0fb!important;background:linear-gradient(120deg,#144757e8,#6b3b64e8)!important;font:800 11px/1.5 Tahoma,Arial,sans-serif!important;cursor:pointer!important;text-align:center!important;white-space:normal!important}'+
        'html body #sakNewsLaunch:focus-visible{outline:2px solid #fff!important;outline-offset:3px!important}'+
        'html body #sakNewsDialog:not([open]){display:none!important}'+
        'html body #sakNewsDialog[open]{display:flex!important;flex-direction:column!important}';
      document.head.appendChild(style);
    }
    return {button,dialog,holidays};
  }

  function renderButton(){
    const ui=ensureUI(),en=lang()==='en';
    ui.button.textContent=en?'📰 News · Click here to open ↗':'📰 الأخبار · اضغط هنا للفتح ↗';
    ui.button.setAttribute('aria-label',en?'Click here to open the news window':'اضغط هنا لفتح نافذة الأخبار');
    const title=$('sakNewsTitle');
    if(title)title.textContent=en?'Latest News · World · Sports · Economy':'آخر الأخبار · العالم · الرياضة · الاقتصاد';
    ui.dialog.dir=en?'ltr':'rtl';
    renderDialog();
  }

  function renderDialog(){
    const box=$('sakNewsContent');
    if(!box)return;
    const en=lang()==='en',data=window.sakLatestWorldNews;
    const items=data&&data.lang===lang()&&Array.isArray(data.items)?data.items:[];
    const fallback=loading?(en?'Loading the latest headlines…':'جارٍ تحميل أحدث الأخبار…'):
      (en?'News could not be reached at the moment. It will retry automatically.':'تعذر الوصول إلى الأخبار حالياً. ستتم إعادة المحاولة تلقائياً.');
    box.replaceChildren();
    (items.length?items:[fallback]).forEach(item=>{
      const card=document.createElement('article');
      card.textContent=item;
      box.appendChild(card);
    });
  }

  function publish(items,language){
    window.sakLatestWorldNews={items:items.slice(),lang:language,updatedAt:Date.now()};
    window.dispatchEvent(new Event('sak-world-news-updated'));
    renderDialog();
  }

  function timeoutFetch(url,ms){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),ms);
    return fetch(url,{signal:controller.signal,cache:'no-store'}).then(response=>{
      if(!response.ok)throw new Error('HTTP '+response.status);
      return response;
    }).finally(()=>clearTimeout(timer));
  }

  function parseXml(xmlText,label){
    const xml=new DOMParser().parseFromString(xmlText,'text/xml');
    if(xml.querySelector('parsererror'))return [];
    return Array.from(xml.querySelectorAll('item,entry')).slice(0,6).map(node=>{
      const title=node.querySelector('title');
      const value=(title?.textContent||'').replace(/\s+/g,' ').trim();
      return value?('['+label+'] '+value):'';
    }).filter(Boolean);
  }

  async function viaProxy(url){
    const proxies=[
      'https://api.allorigins.win/raw?url='+encodeURIComponent(url),
      'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(url),
      'https://corsproxy.io/?url='+encodeURIComponent(url)
    ];
    for(const proxy of proxies){
      try{
        const response=await timeoutFetch(proxy,8500);
        const text=await response.text();
        if(text&&/<(rss|feed|\?xml|rdf:RDF)/i.test(text.slice(0,1200)))return text;
      }catch(error){}
    }
    try{
      const response=await timeoutFetch('https://api.allorigins.win/get?url='+encodeURIComponent(url),8500);
      const data=await response.json();
      if(data&&typeof data.contents==='string')return data.contents;
    }catch(error){}
    return '';
  }

  async function fetchFeed(pair){
    const xml=await viaProxy(pair[1]);
    return xml?parseXml(xml,pair[0]):[];
  }

  async function loadNews(force){
    if(document.hidden||loading)return;
    if(!force&&Date.now()-lastFetch<4*60*1000)return;
    loading=true;
    const ticket=++requestNo,language=lang();
    const cachedKey='sakakerWorldNewsCacheV4-'+language;
    try{
      const cached=JSON.parse(localStorage.getItem(cachedKey)||'null');
      if(cached&&Array.isArray(cached.items)&&Date.now()-Number(cached.time||0)<90*60*1000){
        publish(cached.items,language);
      }else{
        publish([],language);
      }
    }catch(error){publish([],language);}
    renderDialog();
    try{
      const feeds=language==='en'?EN_FEEDS:AR_FEEDS;
      const results=await Promise.allSettled(feeds.map(fetchFeed));
      if(ticket!==requestNo||language!==lang())return;
      const seen=new Set(),items=[];
      results.forEach(result=>{
        if(result.status!=='fulfilled')return;
        result.value.forEach(item=>{
          const key=item.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
          if(key&&!seen.has(key)){seen.add(key);items.push(item);}
        });
      });
      if(items.length){
        const finalItems=items.slice(0,48);
        try{localStorage.setItem(cachedKey,JSON.stringify({time:Date.now(),items:finalItems}));}catch(error){}
        publish(finalItems,language);
      }else{
        const old=window.sakLatestWorldNews;
        if(!old||old.lang!==language||!old.items?.length)publish([],language);
      }
      lastFetch=Date.now();
    }finally{
      loading=false;
      renderDialog();
    }
  }

  function openNews(){
    const ui=ensureUI();
    renderButton();
    if(!ui.dialog.open){
      try{ui.dialog.showModal();}catch(error){ui.dialog.setAttribute('open','');}
      document.body.dataset.sakNewsPreviousOverflow=document.body.style.overflow||'';
      document.body.style.overflow='hidden';
      ui.button.setAttribute('aria-expanded','true');
    }
    renderDialog();
    loadNews(false);
  }
  function closeNews(){
    const dialog=$('sakNewsDialog'),button=$('sakNewsLaunch');
    if(dialog&&dialog.open)dialog.close();
    else if(dialog)dialog.removeAttribute('open');
    if(document.body.dataset.sakNewsPreviousOverflow!==undefined){
      document.body.style.overflow=document.body.dataset.sakNewsPreviousOverflow;
      delete document.body.dataset.sakNewsPreviousOverflow;
    }
    if(button){button.setAttribute('aria-expanded','false');button.focus();}
  }

  function bind(){
    const ui=ensureUI();
    renderButton();
    if(!ui.button.dataset.sakNewsRecoveryBound){
      ui.button.dataset.sakNewsRecoveryBound='1';
      ui.button.addEventListener('click',event=>{event.preventDefault();openNews();});
    }
    const close=$('sakNewsClose');
    if(close&&!close.dataset.sakNewsRecoveryBound){
      close.dataset.sakNewsRecoveryBound='1';
      close.addEventListener('click',closeNews);
    }
    if(!ui.dialog.dataset.sakNewsRecoveryBound){
      ui.dialog.dataset.sakNewsRecoveryBound='1';
      ui.dialog.addEventListener('click',event=>{if(event.target===ui.dialog)closeNews();});
      ui.dialog.addEventListener('close',()=>{
        if(document.body.dataset.sakNewsPreviousOverflow!==undefined){
          document.body.style.overflow=document.body.dataset.sakNewsPreviousOverflow;
          delete document.body.dataset.sakNewsPreviousOverflow;
        }
        ui.button.setAttribute('aria-expanded','false');
      });
    }
  }

  function start(){
    bind();
    const observer=new MutationObserver(()=>{
      if(!$('sakNewsLaunch')||!$('sakNewsDialog'))bind();
      renderButton();
    });
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    loadNews(true);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadNews(false);});
    setInterval(()=>loadNews(true),10*60*1000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

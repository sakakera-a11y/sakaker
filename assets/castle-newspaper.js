(()=>{'use strict';
if(window.__sakCastleNewspaperLoaded)return;window.__sakCastleNewspaperLoaded=true;
const $=id=>document.getElementById(id);
const day=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const feeds=[
{name:'Google News · السعودية',url:'https://news.google.com/rss?hl=ar&gl=SA&ceid=SA:ar',category:'saudi'},
{name:'Google News · العالم',url:'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=SA&ceid=SA:ar',category:'world'},
{name:'Google News · الاقتصاد',url:'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ar&gl=SA&ceid=SA:ar',category:'economy'},
{name:'Google News · الرياضة',url:'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ar&gl=SA&ceid=SA:ar',category:'sports'},
{name:'Google News · التقنية',url:'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=ar&gl=SA&ceid=SA:ar',category:'tech'},
{name:'Google News · الثقافة والفنون',url:'https://news.google.com/rss/headlines/section/topic/ARTS?hl=ar&gl=SA&ceid=SA:ar',category:'culture'},
{name:'Google News · العلوم',url:'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=ar&gl=SA&ceid=SA:ar',category:'science'},
{name:'Google News · الترفيه',url:'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=ar&gl=SA&ceid=SA:ar',category:'entertainment'},
{name:'العربية',url:'https://www.alarabiya.net/feed/rss2',category:'world'},
{name:'عرب نيوز · English',url:'https://www.arabnews.com/rss.xml',category:'world'},
{name:'عاجل',url:'https://ajel.sa/rss.xml',category:'saudi'},
{name:'الوطن',url:'https://www.alwatan.com.sa/rssFeed/1',category:'saudi'},
{name:'المدينة',url:'https://www.al-madina.com/rssFeed/193',category:'saudi'},
{name:'أم القرى',url:'https://www.uqn.gov.sa/rssFeed/20',category:'saudi'},
{name:'اليوم',url:'https://www.alyaum.com/rssFeed/1005',category:'saudi'}];
const categories={all:'الكل',saudi:'السعودية',world:'العالم',economy:'الاقتصاد',sports:'الرياضة',tech:'التقنية',culture:'الثقافة والفنون',science:'العلوم',entertainment:'الترفيه'};
let items=[],category='all',loading=false,lastLoad=0,found=new Set();
function mount(){
 const dock=$('sakakerUtilityDock');if(!dock||$('sakCastleNewspaperLauncher'))return;
 const b=document.createElement('button');b.id='sakCastleNewspaperLauncher';b.type='button';b.className='sak-ostrich-icon sakaker-dock-entry';b.dataset.sakakerDockKey='newspaper';b.title='صحيفة القلعة';b.setAttribute('aria-label','صحيفة القلعة');b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls','sakCastleNewspaperDialog');
 const art=document.createElement('span');art.className='sak-ostrich-art';const src=document.querySelector('#sakakerAllIconsDock .sak-ostrich-art svg');
 if(src)art.append(src.cloneNode(true));else art.innerHTML='<svg viewBox="0 0 160 100" aria-hidden="true"><path d="M12 55 Q58 5 82 45 Q110 5 148 38 Q110 32 88 61 Q56 25 12 55Z" fill="#f4d7ff" stroke="#fff" stroke-width="3"/></svg>';
 const label=document.createElement('span');label.className='sak-ostrich-name';label.textContent='صحيفة القلعة';b.append(art,label);
 b.style.cssText='display:flex!important;flex:0 0 76px!important;width:76px!important;min-width:76px!important;max-width:76px!important;min-height:76px!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;cursor:pointer!important;touch-action:manipulation!important;position:relative!important;z-index:3!important;border:0!important;background:transparent!important;padding:0!important;box-shadow:none!important;outline:0!important;';
 art.style.cssText='display:block!important;width:46px!important;height:42px!important;filter:hue-rotate(225deg) saturate(1.7) brightness(1.25) drop-shadow(0 0 5px #d9a7ff) drop-shadow(0 0 11px #8c45d8)!important;';
 label.style.cssText='display:block!important;color:#f1d9ff!important;-webkit-text-fill-color:#f1d9ff!important;text-shadow:0 0 5px #a85cff,0 1px 3px #000!important;font:800 9px/1.2 Tahoma,Arial,sans-serif!important;text-align:center!important;white-space:nowrap!important;';
 b.addEventListener('click',open);const hub=dock.querySelector(':scope > .sak-gull-hub');if(hub)dock.insertBefore(b,hub);else dock.appendChild(b);
}
function styles(){
 if($('sak-castle-newspaper-style'))return;
 const s=document.createElement('style');s.id='sak-castle-newspaper-style';
 s.textContent=[
 '#sakCastleNewspaperDialog{width:min(960px,96vw);max-width:96vw;max-height:92dvh;padding:0;border:1px solid #bd91e7;border-radius:18px;background:linear-gradient(145deg,#071b24,#17112b 60%,#082c31);color:#fff;box-shadow:0 0 28px #9b59d477;overflow:hidden;font-family:Tajawal,Cairo,Tahoma,Arial,sans-serif}',
 '#sakCastleNewspaperDialog::backdrop{background:#02070bd9;backdrop-filter:blur(5px)}',
 '#sakCastleNewspaperDialog .cn-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 16px;background:linear-gradient(110deg,#1c3a46,#39204d);border-bottom:1px solid #c7a0e755}',
 '#sakCastleNewspaperDialog h2{font-size:20px;margin:0;color:#f2dcff}',
 '#sakCastleNewspaperDialog .cn-close{border:1px solid #e8d3ff66;border-radius:10px;background:#311d46;color:#fff;padding:5px 12px;font-size:22px}',
 '#sakCastleNewspaperDialog .cn-body{padding:12px;overflow:auto;max-height:calc(92dvh - 58px)}',
 '#sakCastleNewspaperDialog .cn-tabs{display:flex;gap:7px;overflow-x:auto;padding:3px 1px 10px;scrollbar-width:thin}',
 '#sakCastleNewspaperDialog .cn-tabs button,#sakCastleNewspaperDialog .cn-refresh{flex:0 0 auto;border:1px solid #bda0d788;border-radius:999px;padding:7px 12px;color:#f5eaff;background:#211a37;cursor:pointer}',
 '#sakCastleNewspaperDialog .cn-tabs button[aria-pressed=true]{background:linear-gradient(120deg,#7045a4,#286b75);border-color:#e8caff;box-shadow:0 0 12px #a76ce477}',
 '#sakCastleNewspaperDialog .cn-story{padding:11px;margin:8px 0;border:1px solid #9a82b744;border-radius:12px;background:#ffffff09}',
 '#sakCastleNewspaperDialog .cn-story a{color:#f5dcff;text-decoration:none;font-weight:800;line-height:1.6}',
 '#sakCastleNewspaperDialog .cn-meta{font-size:11px;color:#b9d4d4;margin-top:5px}',
 '#sakCastleNewspaperDialog .cn-desc{font-size:13px;line-height:1.6;color:#e1e8e8;margin-top:6px}',
 '#sakCastleNewspaperDialog .cn-empty{padding:18px;text-align:center;color:#e2d2f5}',
 '#sakCastleNewspaperDialog .cn-game{padding:14px;border:1px solid #9a82b766;border-radius:14px;background:#ffffff09;margin:10px 0}',
 '#sakCastleNewspaperDialog .cn-game h3{margin:0 0 8px;color:#f1d8ff}',
 '#sakCastleNewspaperDialog .cn-game p{line-height:1.7}',
 '#sakCastleNewspaperDialog input{max-width:100%;padding:10px;border-radius:9px;border:1px solid #b89bd6;background:#0b2029;color:#fff;font:inherit}',
 '#sakCastleNewspaperDialog .cn-action{border:1px solid #e6c7ff;border-radius:10px;padding:9px 14px;color:#fff;background:linear-gradient(120deg,#62428c,#17616a);cursor:pointer;margin:5px 3px}',
 '#sakCastleNewspaperDialog .cn-grid{display:grid;grid-template-columns:repeat(3,38px);gap:3px;margin:12px auto;width:max-content}',
 '#sakCastleNewspaperDialog .cn-cell{width:38px;height:38px;border:1px solid #d7c3e8;background:#f7f1ff;color:#281c39;border-radius:4px;text-align:center;font-weight:900;padding:0}',
 '#sakCastleNewspaperDialog .cn-cell.blank{background:#10232b;border-color:#31434c}',
 '#sakCastleNewspaperDialog .cn-pictures{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
 '#sakCastleNewspaperDialog .cn-picture{width:100%;height:auto;border:1px solid #bfa1d8;border-radius:10px;background:#d4e8e7;touch-action:manipulation}',
 '#sakCastleNewspaperDialog .cn-signs{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}',
 '#sakCastleNewspaperDialog .cn-signs button{border:1px solid #aa8bc7;border-radius:9px;padding:7px 9px;background:#211a37;color:#fff}',
 '#sakCastleNewspaperDialog .cn-signs button[aria-pressed=true]{background:#65448a}',
 '@media(max-width:560px){#sakCastleNewspaperDialog{width:100vw;max-width:100vw;max-height:96dvh;border-radius:14px}#sakCastleNewspaperDialog .cn-body{padding:9px;max-height:calc(96dvh - 58px)}#sakCastleNewspaperDialog .cn-pictures{gap:5px}#sakCastleNewspaperDialog .cn-cell{width:32px;height:32px}}'
 ].join('');
 document.head.appendChild(s);
}
function dialog(){
 let d=$('sakCastleNewspaperDialog');if(d)return d;
 d=document.createElement('dialog');d.id='sakCastleNewspaperDialog';d.dir='rtl';
 d.innerHTML='<div class="cn-head"><h2>📰 صحيفة القلعة</h2><button class="cn-close" type="button" aria-label="إغلاق">×</button></div><div class="cn-body"><div class="cn-tabs" id="cnMainTabs"><button data-tab="news" aria-pressed="true">الأخبار</button><button data-tab="crossword" aria-pressed="false">الكلمات المتقاطعة</button><button data-tab="differences" aria-pressed="false">الاختلافات الخمسة</button><button data-tab="horoscope" aria-pressed="false">حظك اليوم</button></div><section id="cnPanel"></section></div>';
 document.body.appendChild(d);d.querySelector('.cn-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close();});
 d.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));return d;
}
function open(){styles();const d=dialog();try{d.showModal();}catch(_){d.setAttribute('open','');}showTab('news');if(!items.length||Date.now()-lastLoad>15*60*1000)loadNews();}
function safeUrl(v){try{const u=new URL(v,location.href);return u.protocol==='https:'?u.href:'';}catch(_){return '';}}
async function fetchText(url){const c=new AbortController(),t=setTimeout(()=>c.abort(),6500);try{const r=await fetch(url,{signal:c.signal,cache:'no-store'});if(!r.ok)throw Error();return await r.text();}finally{clearTimeout(t);}}
async function fetchXml(feed){
 const proxies=['https://api.allorigins.win/raw?url=','https://api.codetabs.com/v1/proxy?quest=','https://corsproxy.io/?url='];
 for(const p of proxies){try{const txt=await fetchText(p+encodeURIComponent(feed.url));if(/<(rss|feed|rdf:RDF|\?xml)/i.test(txt.slice(0,1800)))return txt;}catch(_){}}
 return '';
}
function parse(xmlText,feed){
 const xml=new DOMParser().parseFromString(xmlText,'text/xml');if(xml.querySelector('parsererror'))return [];
 return [...xml.querySelectorAll('item,entry')].map(n=>{
 const title=(n.querySelector('title')?.textContent||'').replace(/\s+/g,' ').trim(),ln=n.querySelector('link'),url=safeUrl(ln?.getAttribute('href')||ln?.textContent||n.querySelector('guid')?.textContent||'');
 const desc=(n.querySelector('description,summary,content')?.textContent||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,240),date=n.querySelector('pubDate,published,updated')?.textContent||'';
 return title&&url?{title,link:url,desc,date,source:feed.name,category:feed.category}:null;
 }).filter(Boolean).slice(0,25);
}
function cache(){try{const c=JSON.parse(localStorage.getItem('sakCastleNewspaperCacheV1')||'null');return c&&Array.isArray(c.items)?c:null;}catch(_){return null;}}
function renderNews(){
 const p=$('cnPanel');if(!p)return;p.replaceChildren();
 const tabs=document.createElement('div');tabs.className='cn-tabs';
 Object.entries(categories).forEach(([k,v])=>{const b=document.createElement('button');b.textContent=v;b.setAttribute('aria-pressed',String(category===k));b.addEventListener('click',()=>{category=k;renderNews();});tabs.appendChild(b);});
 const refresh=document.createElement('button');refresh.className='cn-refresh';refresh.textContent=loading?'جارٍ التحديث…':'تحديث الأخبار';refresh.disabled=loading;refresh.addEventListener('click',()=>loadNews(true));tabs.appendChild(refresh);p.appendChild(tabs);
 const meta=document.createElement('div');meta.className='cn-meta';meta.textContent=lastLoad?'آخر تحديث: '+new Date(lastLoad).toLocaleString('ar-SA'):'مصادر الصحيفة';p.appendChild(meta);
 const list=items.filter(x=>category==='all'||x.category===category);
 if(!list.length){const e=document.createElement('div');e.className='cn-empty';e.textContent=loading?'جارٍ جلب الأخبار من المصادر…':'لا توجد أخبار متاحة حالياً؛ حاول التحديث لاحقاً.';p.appendChild(e);}
 list.forEach(x=>{const card=document.createElement('article');card.className='cn-story';const a=document.createElement('a');a.href=x.link;a.target='_blank';a.rel='noopener noreferrer';a.textContent=x.title;card.appendChild(a);const m=document.createElement('div');m.className='cn-meta';m.textContent=x.source+(x.date?' · '+x.date:'');card.appendChild(m);if(x.desc){const d=document.createElement('div');d.className='cn-desc';d.textContent=x.desc;card.appendChild(d);}p.appendChild(card);});
}
async function loadNews(force=false){
 if(loading||(!force&&Date.now()-lastLoad<15*60*1000))return;loading=true;const c=cache();if(!items.length&&c?.items?.length)items=c.items;renderNews();
 try{
 const results=await Promise.allSettled(feeds.map(async f=>{const x=await fetchXml(f);return x?parse(x,f):[];}));
 const unique=new Map();results.forEach(r=>{if(r.status==='fulfilled')r.value.forEach(x=>{if(!unique.has(x.link))unique.set(x.link,x);});});
 const fresh=[...unique.values()].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0));
 if(fresh.length){items=fresh.slice(0,100);try{localStorage.setItem('sakCastleNewspaperCacheV1',JSON.stringify({savedAt:Date.now(),items}));}catch(_){}}
 lastLoad=Date.now();
 }finally{loading=false;renderNews();}
}
function tabButton(tab){dialog().querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tab)));}
function showTab(tab){tabButton(tab);const p=$('cnPanel');p.replaceChildren();if(tab==='news'){category='all';renderNews();}else if(tab==='crossword')crossword(p);else if(tab==='differences')differences(p);else horoscope(p);}
const puzzles=[
 {a:'بحر',d:'بيت',ac:'ماء واسع مالح',dc:'مكان يسكن فيه الإنسان'},
 {a:'قمر',d:'قلم',ac:'جرم نراه ليلاً',dc:'أداة نكتب بها'},
 {a:'ورد',d:'وقت',ac:'زهرة جميلة',dc:'زمن أو موعد'},
 {a:'نجم',d:'نهر',ac:'جرم يلمع في السماء',dc:'مجرى ماء عذب'}];
function norm(s){return String(s||'').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/\s/g,'').trim();}
function crossword(panel){
 const q=puzzles[Number(day().replace(/-/g,''))%puzzles.length],w=document.createElement('div');w.className='cn-game';w.innerHTML='<h3>🧩 الكلمات المتقاطعة اليومية</h3><p>حل الكلمتين؛ تشتركان في الحرف الأول داخل المربع المشترك.</p>';
 const grid=document.createElement('div');grid.className='cn-grid';for(let r=0;r<4;r++)for(let c=0;c<3;c++){const cell=document.createElement('div');const active=(r===1&&c<3)||(c===0&&r>=2);cell.className='cn-cell'+(active?'':' blank');cell.textContent=active?'؟':'';grid.appendChild(cell);}w.appendChild(grid);
 const ca=document.createElement('p');ca.textContent='أفقي: '+q.ac;w.appendChild(ca);const a=document.createElement('input');a.maxLength=3;a.placeholder='الإجابة الأفقية';w.appendChild(a);
 const cd=document.createElement('p');cd.textContent='عمودي: '+q.dc;w.appendChild(cd);const d=document.createElement('input');d.maxLength=3;d.placeholder='الإجابة العمودية';w.appendChild(d);
 const result=document.createElement('p');result.setAttribute('aria-live','polite');w.appendChild(result);const check=document.createElement('button');check.className='cn-action';check.textContent='تحقق من الحل';check.addEventListener('click',()=>{const ok=norm(a.value)===q.a&&norm(d.value)===q.d;result.textContent=ok?'أحسنت! إجابتك صحيحة.':'ليست الإجابة صحيحة بعد؛ حاول مرة أخرى.';result.style.color=ok?'#a6f2c5':'#ffd4a6';if(ok)grid.querySelectorAll('.cn-cell:not(.blank)').forEach((x,i)=>x.textContent=[...q.a][i]||[...q.d][i-2]||'');});w.appendChild(check);const date=document.createElement('div');date.className='cn-meta';date.textContent='لغز يوم '+day();w.appendChild(date);panel.appendChild(w);
}
function scene(alt){
 const sun=alt?'':'<circle cx="260" cy="35" r="16" fill="#ffe48b"/>',cloud=alt?'':'<path d="M35 47 Q28 31 45 28 Q54 10 70 27 Q88 24 91 43Z" fill="#fff"/>',flag=alt?'':'<path d="M160 20 L160 4 L180 10 L160 15Z" fill="#e24b65"/>',door=alt?'#4b8a8d':'#6d3d29';
 const palm=alt?'<circle cx="282" cy="92" r="4" fill="#e5a34c"/><circle cx="292" cy="92" r="4" fill="#e5a34c"/>':'<circle cx="282" cy="92" r="4" fill="#e5a34c"/><circle cx="292" cy="92" r="4" fill="#e5a34c"/><circle cx="287" cy="84" r="4" fill="#e5a34c"/>';
 return '<svg class="cn-picture" viewBox="0 0 320 190" role="img" aria-label="مشهد القلعة"><rect width="320" height="190" fill="#a9dbe5"/><rect y="130" width="320" height="60" fill="#74aa71"/>'+sun+cloud+'<path d="M100 130 L100 72 L130 72 L130 48 L190 48 L190 72 L220 72 L220 130Z" fill="#d9c49b" stroke="#765e47" stroke-width="3"/><path d="M125 48 L160 25 L195 48Z" fill="#a95b50"/>'+flag+'<rect x="118" y="88" width="18" height="18" fill="#557c91"/><rect x="184" y="88" width="18" height="18" fill="#557c91"/><path d="M146 130 V104 Q160 88 174 104 V130Z" fill="'+door+'"/><path d="M277 133 L284 73" stroke="#704b2e" stroke-width="8"/><path d="M284 78 Q250 50 264 68 Q280 48 286 70 Q303 46 303 70 Q321 63 300 84Z" fill="#28784f"/>'+palm+'<path d="M0 160 Q65 145 115 163 T230 159 T320 161" fill="none" stroke="#e6d9a2" stroke-width="3"/></svg>';
}
function differences(panel){
 found=new Set();const w=document.createElement('div');w.className='cn-game';w.innerHTML='<h3>🔎 اكتشف الاختلافات الخمسة</h3><p>قارن الصورتين، ثم اضغط على موضع الاختلاف في الصورة اليمنى.</p>';
 const pics=document.createElement('div');pics.className='cn-pictures';const l=document.createElement('div'),r=document.createElement('div');l.innerHTML=scene(false);r.innerHTML=scene(true);const svg=r.querySelector('svg'),hue=(Number(day().replace(/-/g,''))%5)*19; l.querySelector('svg').style.filter='hue-rotate('+hue+'deg)';svg.style.filter='hue-rotate('+hue+'deg)';pics.append(l,r);w.appendChild(pics);
 const points=[{x:260,y:35},{x:60,y:30},{x:170,y:12},{x:160,y:112},{x:287,y:88}],out=document.createElement('p');out.className='cn-picture-hint';out.textContent='تم العثور على 0 من 5';w.appendChild(out);
 svg.addEventListener('click',e=>{const rect=svg.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*320,y=(e.clientY-rect.top)/rect.height*190;let idx=-1,dist=999;points.forEach((v,i)=>{const n=Math.hypot(x-v.x,y-v.y);if(n<dist){dist=n;idx=i;}});if(dist<19&&!found.has(idx)){found.add(idx);const mark=document.createElementNS('http://www.w3.org/2000/svg','circle');mark.setAttribute('cx',points[idx].x);mark.setAttribute('cy',points[idx].y);mark.setAttribute('r','12');mark.setAttribute('fill','none');mark.setAttribute('stroke','#ffdf5e');mark.setAttribute('stroke-width','4');svg.appendChild(mark);out.textContent=found.size===5?'ممتاز! اكتشفت الاختلافات الخمسة كلها.':'أحسنت! '+found.size+' من 5';}});
 const date=document.createElement('div');date.className='cn-meta';date.textContent='تحدي يوم '+day();w.appendChild(date);panel.appendChild(w);
}
const signs=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'],readings=['يوم مناسب لترتيب الأولويات وإنجاز خطوة مؤجلة.','امنح نفسك وقتاً للتفكير قبل اتخاذ قرار جديد.','قد يحمل اليوم فرصة لحوار لطيف أو فكرة مفيدة.','حافظ على هدوئك ووزع وقتك بين العمل والراحة.','ركز على هدف واحد وستشعر بتقدم أوضح.','التفاصيل الصغيرة تستحق الانتباه اليوم.','وازن بين رغباتك والتزاماتك ولا تتعجل.','اجعل الصراحة واللطف أساس تعاملاتك.','جرب طريقة جديدة في التعلم أو العمل.','التخطيط الهادئ أفضل من الاستعجال.','استمع لوجهة نظر مختلفة فقد تلهمك.','خصص وقتاً للراحة وتجديد النشاط.'];
function horoscope(panel){
 const w=document.createElement('div');w.className='cn-game';w.innerHTML='<h3>✨ حظك اليوم</h3><p>اختر برجك لقراءة عبارة يومية خفيفة للتسلية.</p>';
 const row=document.createElement('div');row.className='cn-signs';let selected=0;const out=document.createElement('p');out.setAttribute('aria-live','polite');
 const show=()=>out.textContent=readings[(selected+Number(day().replace(/-/g,'')))%readings.length];
 signs.forEach((v,i)=>{const b=document.createElement('button');b.textContent=v;b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>{selected=i;row.querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',String(i===j)));show();});row.appendChild(b);});
 w.append(row,out);const note=document.createElement('div');note.className='cn-meta';note.textContent='للتسلية فقط؛ الأبراج والتوقعات ليست علماً ولا وسيلة لمعرفة المستقبل.';w.appendChild(note);show();panel.appendChild(w);
}
function start(){styles();mount();new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
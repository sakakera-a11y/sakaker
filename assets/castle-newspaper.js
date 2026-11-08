(()=>{'use strict';
if(window.__sakCastleNewspaperLoaded)return;window.__sakCastleNewspaperLoaded=true;
const $=id=>document.getElementById(id);
let language=(()=>{try{const saved=localStorage.getItem('sakCastleNewspaperLang');if(saved==='en'||saved==='ar')return saved;}catch(_){}const page=String(document.documentElement.lang||'').toLowerCase();return page.startsWith('en')?'en':'ar';})();
const enText={
'صحيفة القلعة':'Castle Newspaper','الأخبار':'News','الكلمات المتقاطعة':'Daily Crossword','الاختلافات الخمسة':'Find Five Differences','حظك اليوم':'Daily Horoscope','إغلاق':'Close','عاجل':'Ajel','BBC News · World':'BBC News · World','تعذر الاتصال بمصادر الأخبار الآن. حاول التحديث بعد قليل.':'Could not connect to news sources. Please try again shortly.','جارٍ فتح الصحيفة…':'Opening the newspaper…','مصدر الخبر':'News source',
'الكل':'All','السعودية':'Saudi Arabia','العالم':'World','الاقتصاد':'Business','الرياضة':'Sports','التقنية':'Technology','الثقافة والفنون':'Arts & Culture','العلوم':'Science','الترفيه':'Entertainment',
'جارٍ التحديث…':'Updating…','تحديث الأخبار':'Refresh News','آخر تحديث: ':'Last updated: ','مصادر الصحيفة':'Newspaper sources',
'جارٍ جلب الأخبار من المصادر…':'Loading headlines from sources…','لا توجد أخبار متاحة حالياً؛ حاول التحديث لاحقاً.':'No headlines are available right now. Please try again later.',
'🧩 الكلمات المتقاطعة اليومية':'🧩 Daily Crossword','حل الكلمتين؛ تشتركان في الحرف الأول داخل المربع المشترك.':'Solve both words. They share the first letter in the intersecting square.',
'الإجابة الأفقية':'Across answer','الإجابة العمودية':'Down answer','أفقي: ':'Across: ','عمودي: ':'Down: ',
'تحقق من الحل':'Check answers','أحسنت! إجابتك صحيحة.':'Excellent! Both answers are correct.','ليست الإجابة صحيحة بعد؛ حاول مرة أخرى.':'Not quite. Try again.',
'لغز يوم':'Puzzle for ','حل الكلمتين؛ تشتركان في الحرف الأول داخل المربع المشترك.':'Solve both words; they share their first letter in the crossing square.','أفقي: ':'Across: ','عمودي: ':'Down: ','لغز يوم':'Puzzle for ','تحدي يوم':'Challenge for ','مشهد القلعة':'Castle scene','تم العثور على 0 من 5':'Found 0 of 5','🔎 اكتشف الاختلافات الخمسة':'🔎 Find the Five Differences','قارن الصورتين، ثم اضغط على موضع الاختلاف في الصورة اليمنى.':'Compare the pictures, then tap a difference in the right-hand picture.',
'تم العثور على 0 من 5':'Found 0 of 5','ممتاز! اكتشفت الاختلافات الخمسة كلها.':'Great! You found all five differences.','أحسنت! ':'Well done! ',' من 5':' of 5','تحدي يوم':'Challenge for ',
'✨ حظك اليوم':'✨ Daily Horoscope','اختر برجك لقراءة عبارة يومية خفيفة للتسلية.':'Choose your zodiac sign for a light daily entertainment message.',
'للتسلية فقط؛ الأبراج والتوقعات ليست علماً ولا وسيلة لمعرفة المستقبل.':'For entertainment only. Astrology is not science and cannot predict the future.',
'الحمل':'Aries','الثور':'Taurus','الجوزاء':'Gemini','السرطان':'Cancer','الأسد':'Leo','العذراء':'Virgo','الميزان':'Libra','العقرب':'Scorpio','القوس':'Sagittarius','الجدي':'Capricorn','الدلو':'Aquarius','الحوت':'Pisces',
'يوم مناسب لترتيب الأولويات وإنجاز خطوة مؤجلة.':'A good day to set priorities and complete a postponed task.','امنح نفسك وقتاً للتفكير قبل اتخاذ قرار جديد.':'Take time to think before making a new decision.','قد يحمل اليوم فرصة لحوار لطيف أو فكرة مفيدة.':'Today may bring a pleasant conversation or a useful idea.','حافظ على هدوئك ووزع وقتك بين العمل والراحة.':'Stay calm and balance work with rest.','ركز على هدف واحد وستشعر بتقدم أوضح.':'Focus on one goal and you may notice clearer progress.','التفاصيل الصغيرة تستحق الانتباه اليوم.':'Small details deserve your attention today.','وازن بين رغباتك والتزاماتك ولا تتعجل.':'Balance your wishes with your commitments; do not rush.','اجعل الصراحة واللطف أساس تعاملاتك.':'Let honesty and kindness guide your interactions.','جرب طريقة جديدة في التعلم أو العمل.':'Try a new approach to learning or work.','التخطيط الهادئ أفضل من الاستعجال.':'Calm planning is better than rushing.','استمع لوجهة نظر مختلفة فقد تلهمك.':'Listen to a different point of view; it may inspire you.','خصص وقتاً للراحة وتجديد النشاط.':'Make time to rest and recharge.'
};
const originalText=new WeakMap();
function translateTextNode(n){if(!originalText.has(n))originalText.set(n,n.nodeValue);const original=originalText.get(n);let value=original;if(language==='en'){for(const [ar,en] of Object.entries(enText)){if(value===ar){value=en;break;}if(value.startsWith(ar)&&ar.endsWith(' ')){value=en+value.slice(ar.length);break;}}}n.nodeValue=value;}
function applyLanguage(root=document){const d=$('sakCastleNewspaperDialog');if(d){d.dir=language==='ar'?'rtl':'ltr';d.lang=language;}const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())translateTextNode(walker.currentNode);if(d){d.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{for(const attr of ['placeholder','aria-label','title'])if(el.hasAttribute(attr)){const key='__cn_'+attr;if(!el.dataset[key])el.dataset[key]=el.getAttribute(attr);const v=el.dataset[key];el.setAttribute(attr,language==='en'?(enText[v]||v):v);}});}}
function setLanguage(next){
 language=next==='en'?'en':'ar';
 try{localStorage.setItem('sakCastleNewspaperLang',language);}catch(_){}
 const d=$('sakCastleNewspaperDialog');
 if(d){
  d.lang=language;
  d.dir=language==='ar'?'rtl':'ltr';
  applyLanguage(d);
 }
 const b=$('cnLangToggle');
 if(b){b.textContent=language==='ar'?'English':'العربية';b.setAttribute('aria-label',language==='ar'?'Switch to English':'التبديل إلى العربية');}
 if(d){
  const active=d.querySelector('[data-tab][aria-pressed="true"]');
  if(active)showTab(active.dataset.tab);
 }
}

const day=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const feeds=[
{name:'عاجل',url:'https://ajel.sa/rss.xml',category:'saudi'},
{name:'BBC News · World',url:'https://feeds.bbci.co.uk/news/world/rss.xml',category:'world'}
];
const categories={all:'الكل',saudi:'السعودية',world:'العالم',economy:'الاقتصاد',sports:'الرياضة',tech:'التقنية',culture:'الثقافة والفنون',science:'العلوم',entertainment:'الترفيه'};
let items=[],category='all',loading=false,lastLoad=0,found=new Set(),newsError='';
function mount(){
 const oldTopButton=$('sakNewsLaunch');if(oldTopButton)oldTopButton.remove();
 const dock=$('sakakerUtilityDock');if(!dock||$('sakCastleNewspaperLauncher'))return;
 const b=document.createElement('button');b.id='sakCastleNewspaperLauncher';b.type='button';b.className='sak-ostrich-icon sakaker-dock-entry';b.dataset.sakakerDockKey='newspaper';const pageEn=String(document.documentElement.lang||'ar').toLowerCase().startsWith('en');const launchLabel=pageEn?'Castle Newspaper':'صحيفة القلعة';b.title=launchLabel;b.setAttribute('aria-label',launchLabel);b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls','sakCastleNewspaperDialog');
 const art=document.createElement('span');art.className='sak-ostrich-art';const src=document.querySelector('#sakakerAllIconsDock .sak-ostrich-art svg');
 if(src)art.append(src.cloneNode(true));else art.innerHTML='<svg viewBox="0 0 160 100" aria-hidden="true"><path d="M12 55 Q58 5 82 45 Q110 5 148 38 Q110 32 88 61 Q56 25 12 55Z" fill="#f4d7ff" stroke="#fff" stroke-width="3"/></svg>';
 const label=document.createElement('span');label.className='sak-ostrich-name';label.textContent=launchLabel;b.append(art,label);
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
 '@media(max-width:560px){#sakCastleNewspaperDialog{width:100vw;max-width:100vw;max-height:96dvh;border-radius:14px}#sakCastleNewspaperDialog .cn-body{padding:9px;max-height:calc(96dvh - 58px)}#sakCastleNewspaperDialog .cn-pictures{gap:5px}#sakCastleNewspaperDialog .cn-cell{width:32px;height:32px}}',
 '#sakCastleNewspaperDialog{border:1px solid #b9a1e8;border-radius:22px;background:radial-gradient(ellipse at 12% 0%,#254a58 0%,transparent 38%),radial-gradient(ellipse at 100% 100%,#39234f 0%,transparent 42%),linear-gradient(145deg,#071a26 0%,#11182b 54%,#092b32 100%);box-shadow:0 24px 90px #02060bd9,0 0 0 1px #ffffff12,0 0 38px #a77be544;color:#f8f5ff}',
 '#sakCastleNewspaperDialog .cn-head{position:relative;padding:17px 19px;background:linear-gradient(110deg,#163b4aee,#38224fee 58%,#18515aee);border-bottom:1px solid #d8c1ff55}',
 '#sakCastleNewspaperDialog .cn-head:after{content:"";position:absolute;inset:auto 18px 0;height:1px;background:linear-gradient(90deg,transparent,#d8b5ff,transparent)}',
 '#sakCastleNewspaperDialog h2{font-size:clamp(19px,3vw,25px);font-weight:900;letter-spacing:.2px;text-shadow:0 2px 16px #d9b8ff55}',
 '#sakCastleNewspaperDialog .cn-close{min-width:42px;min-height:38px;border:1px solid #e8d3ff66;border-radius:12px;background:linear-gradient(145deg,#3d2a58,#172e3c);color:#fff;box-shadow:inset 0 1px #ffffff18;transition:transform .2s,filter .2s}',
 '#sakCastleNewspaperDialog .cn-close:hover,#sakCastleNewspaperDialog .cn-action:hover{filter:brightness(1.18);transform:translateY(-1px)}',
 '#sakCastleNewspaperDialog .cn-body{padding:clamp(10px,2.2vw,20px);scrollbar-color:#8864ad #101e2b}',
 '#sakCastleNewspaperDialog .cn-tabs{gap:8px;padding:5px 2px 14px;scrollbar-width:thin}',
 '#sakCastleNewspaperDialog .cn-tabs button,#sakCastleNewspaperDialog .cn-refresh{border:1px solid #9f8bc866;border-radius:999px;padding:9px 15px;background:linear-gradient(145deg,#182b3b,#29203d);color:#f7efff;font-weight:800;box-shadow:inset 0 1px #ffffff12;transition:all .2s}',
 '#sakCastleNewspaperDialog .cn-tabs button:hover,#sakCastleNewspaperDialog .cn-refresh:hover:not(:disabled){border-color:#d9c0ff;background:linear-gradient(120deg,#3b4270,#17616a);transform:translateY(-1px)}',
 '#sakCastleNewspaperDialog .cn-tabs button[aria-pressed=true]{background:linear-gradient(115deg,#7650a8,#177b83);border-color:#e8d5ff;box-shadow:0 5px 18px #6d4d9b55,inset 0 1px #ffffff33}',
 '#sakCastleNewspaperDialog .cn-refresh:disabled{opacity:.58;cursor:wait}',
 '#sakCastleNewspaperDialog .cn-story{position:relative;padding:15px 16px;margin:10px 0;border:1px solid #bda4d52e;border-radius:15px;background:linear-gradient(120deg,#ffffff0d,#ffffff05);box-shadow:0 7px 22px #00000018;transition:transform .2s,border-color .2s,background .2s}',
 '#sakCastleNewspaperDialog .cn-story:hover{transform:translateY(-2px);border-color:#bba0e988;background:linear-gradient(120deg,#ffffff16,#ffffff08)}',
 '#sakCastleNewspaperDialog .cn-story a{display:block;color:#f4dcff;font-size:15px;font-weight:900;line-height:1.75;text-decoration:none}',
 '#sakCastleNewspaperDialog .cn-story a:hover{color:#a8f0e9;text-decoration:underline;text-underline-offset:4px}',
 '#sakCastleNewspaperDialog .cn-meta{font-size:11px;color:#b9d4dc;line-height:1.7}',
 '#sakCastleNewspaperDialog .cn-desc{font-size:13px;line-height:1.9;color:#e1e8ef;margin-top:7px}',
 '#sakCastleNewspaperDialog .cn-status{margin:10px 0;padding:10px 13px;border:1px solid #d9b56a66;border-radius:12px;background:#7b5a1c22;color:#ffe6b0;font-size:13px;line-height:1.7}',
 '#sakCastleNewspaperDialog .cn-empty{padding:24px 16px;text-align:center;border:1px dashed #a88bc966;border-radius:14px;background:#ffffff08;color:#e2d2f5;line-height:1.8}',
 '#sakCastleNewspaperDialog .cn-game{padding:clamp(14px,2.5vw,22px);border:1px solid #bda4d555;border-radius:18px;background:linear-gradient(145deg,#ffffff12,#ffffff05);box-shadow:0 12px 30px #00000020;margin:8px 0}',
 '#sakCastleNewspaperDialog .cn-game h3{margin:0 0 10px;color:#f3ddff;font-size:19px;font-weight:900}',
 '#sakCastleNewspaperDialog .cn-game p{line-height:1.9;color:#e8e3f1}',
 '#sakCastleNewspaperDialog input{width:min(100%,320px);padding:11px 13px;border-radius:11px;border:1px solid #a98bcf;background:#091c29;color:#fff;font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}',
 '#sakCastleNewspaperDialog input:focus{border-color:#75d9d0;box-shadow:0 0 0 3px #4abdb333}',
 '#sakCastleNewspaperDialog .cn-action{border:1px solid #dfc4ff;border-radius:12px;padding:10px 17px;color:#fff;background:linear-gradient(115deg,#7650a8,#167b80);font-weight:900;cursor:pointer;margin:7px 3px;box-shadow:0 6px 18px #00000025;transition:all .2s}',
 '#sakCastleNewspaperDialog .cn-grid{gap:4px;margin:16px auto 20px}',
 '#sakCastleNewspaperDialog .cn-cell{width:42px;height:42px;border:1px solid #d9c4ef;background:linear-gradient(145deg,#fff,#e9e2f4);color:#2b1d3b;border-radius:8px;font-size:18px;box-shadow:0 3px 8px #00000020}',
 '#sakCastleNewspaperDialog .cn-cell.blank{background:#0b202b;border:1px solid #2b4853;box-shadow:none}',
 '#sakCastleNewspaperDialog .cn-pictures{gap:12px;margin:12px 0}',
 '#sakCastleNewspaperDialog .cn-picture{border:1px solid #c7a7e8;border-radius:14px;box-shadow:0 8px 24px #00000035}',
 '#sakCastleNewspaperDialog .cn-signs button{border:1px solid #aa8bc7;border-radius:11px;padding:8px 12px;background:linear-gradient(145deg,#182b3b,#29203d);color:#fff;font-weight:700}',
 '#sakCastleNewspaperDialog .cn-signs button[aria-pressed=true]{background:linear-gradient(120deg,#7650a8,#177b83);border-color:#e8caff;box-shadow:0 4px 14px #6d4d9b55}',
 '@media(max-width:560px){#sakCastleNewspaperDialog .cn-head{padding:12px 13px}#sakCastleNewspaperDialog .cn-story{padding:12px}#sakCastleNewspaperDialog .cn-story a{font-size:14px}#sakCastleNewspaperDialog .cn-cell{width:34px;height:34px;font-size:16px}#sakCastleNewspaperDialog .cn-tabs button,#sakCastleNewspaperDialog .cn-refresh{padding:8px 12px;font-size:12px}}',
 '#sakCastleNewspaperDialog{background:radial-gradient(ellipse at 8% 4%,#ffd9ed55 0%,transparent 31%),radial-gradient(ellipse at 93% 8%,#b8eaff55 0%,transparent 32%),radial-gradient(ellipse at 85% 92%,#d9c5ff55 0%,transparent 34%),radial-gradient(ellipse at 12% 88%,#b8ffe455 0%,transparent 32%),linear-gradient(135deg,#132d45 0%,#273653 28%,#3b3155 52%,#25485a 76%,#173e4b 100%);border:1px solid #f4d9ff;box-shadow:0 24px 90px #02060bd9,0 0 0 1px #ffffff22,0 0 24px #ff9fdc66,0 0 42px #8be9ff55,0 0 58px #b8ffcf44;color:#fff}',
'#sakCastleNewspaperDialog .cn-head{background:linear-gradient(105deg,#ffb7dc33,#ffe9ad33 25%,#b9f6df33 50%,#b8e5ff33 75%,#d8c1ff44),linear-gradient(110deg,#183e50ee,#45335fee 55%,#205765ee);border-bottom:1px solid #f7e5ff88;backdrop-filter:blur(14px)}',
'#sakCastleNewspaperDialog .cn-head:after{height:2px;background:linear-gradient(90deg,#ffb5d9,#ffe6a6,#baf4c9,#aee8ff,#d5baff)}',
'#sakCastleNewspaperDialog h2{color:#fff4ff;text-shadow:0 0 8px #ffb6df99,0 0 18px #9deaff88,0 2px 3px #111}',
'#sakCastleNewspaperDialog .cn-body{background:linear-gradient(145deg,#ffffff08,#ffffff02)}',
'#sakCastleNewspaperDialog .cn-tabs button,#sakCastleNewspaperDialog .cn-refresh{border:1px solid #d8d0f088;background:linear-gradient(145deg,#ffffff20,#ffffff08);box-shadow:inset 0 1px #ffffff35,0 4px 14px #080d1c33;backdrop-filter:blur(8px)}',
'#sakCastleNewspaperDialog .cn-tabs button[aria-pressed=true]{background:linear-gradient(110deg,#ed9dc9,#e9c88e,#91d8bd,#8bcbe8,#baa0e8);color:#18263b;border-color:#fff;box-shadow:0 0 16px #e8b6f099,0 5px 18px #0003}',
'#sakCastleNewspaperDialog .cn-story{border:1px solid #e4d7ff55;background:linear-gradient(115deg,#ffffff1b,#f5eaff0b 45%,#b7f4ec12);box-shadow:0 8px 24px #07101d33,inset 0 1px #ffffff20;backdrop-filter:blur(9px)}',
'#sakCastleNewspaperDialog .cn-story a{color:#fff0fa;text-shadow:0 1px 8px #f3a9d633}',
'#sakCastleNewspaperDialog .cn-story a:hover{color:#b9fff0}',
'#sakCastleNewspaperDialog .cn-meta{color:#d9eaff}',
'#sakCastleNewspaperDialog .cn-desc{color:#f1edf8}',
'#sakCastleNewspaperDialog .cn-status{border-color:#ffe3a477;background:linear-gradient(110deg,#ffdf9d22,#f6b7db1c);color:#fff0cb;box-shadow:0 5px 18px #0002}',
'#sakCastleNewspaperDialog .cn-empty{border-color:#e5c9ff88;background:linear-gradient(120deg,#ffffff16,#c6eaff0b,#ffd8ec12);color:#fff1ff}',
'#sakCastleNewspaperDialog .cn-game{border:1px solid #e4d4ff88;background:linear-gradient(135deg,#ffffff1b,#bce9ff10 45%,#ffd6ec12);box-shadow:0 12px 30px #0003,inset 0 1px #ffffff22;backdrop-filter:blur(10px)}',
'#sakCastleNewspaperDialog .cn-game h3{color:#fff0ff;text-shadow:0 0 12px #e3b5ff88}',
'#sakCastleNewspaperDialog .cn-game p{color:#f4efff}',
'#sakCastleNewspaperDialog .cn-action{border-color:#f3dfff;background:linear-gradient(105deg,#e99bc6,#e8c58c,#8fd4ba,#8ccbe8,#b49ae3);color:#17283a;text-shadow:none;box-shadow:0 6px 20px #0003,0 0 13px #e3b3ff55}',
'#sakCastleNewspaperDialog .cn-close{background:linear-gradient(110deg,#eaa4cd,#e5c58d,#8fd4ba,#91cbea,#b49be5);color:#17283a;border-color:#fff}',
'#sakCastleNewspaperDialog .cn-cell{background:linear-gradient(145deg,#fff,#f1eaff);border-color:#e5d5ff;box-shadow:0 3px 10px #0003}',
'#sakCastleNewspaperDialog .cn-signs button{background:linear-gradient(145deg,#ffffff22,#ffffff0c);border-color:#e5d5ff99}',
'#sakCastleNewspaperDialog .cn-signs button[aria-pressed=true]{background:linear-gradient(110deg,#ed9dc9,#e9c88e,#91d8bd,#8bcbe8,#baa0e8);color:#18263b;border-color:#fff}',
'#sakCastleNewspaperDialog .cn-close:focus-visible,#sakCastleNewspaperDialog button:focus-visible,#sakCastleNewspaperDialog a:focus-visible{outline:2px solid #fff;outline-offset:3px}',
 ].join('');
 document.head.appendChild(s);
}
function dialog(){
 let d=$('sakCastleNewspaperDialog');if(d)return d;
 d=document.createElement('dialog');d.id='sakCastleNewspaperDialog';d.dir='rtl';
 d.innerHTML='<div class="cn-head"><h2>📰 صحيفة القلعة</h2><div style="display:flex;gap:8px;align-items:center"><button id="cnLangToggle" class="cn-close" type="button">English</button><button class="cn-close" type="button" aria-label="إغلاق">×</button></div></div><div class="cn-body"><div class="cn-tabs" id="cnMainTabs"><button data-tab="news" aria-pressed="true">الأخبار</button><button data-tab="crossword" aria-pressed="false">الكلمات المتقاطعة</button><button data-tab="differences" aria-pressed="false">الاختلافات الخمسة</button><button data-tab="horoscope" aria-pressed="false">حظك اليوم</button></div><section id="cnPanel"></section></div>';
 document.body.appendChild(d);d.querySelector('.cn-close[aria-label="إغلاق"]').addEventListener('click',()=>d.close());d.querySelector('#cnLangToggle').addEventListener('click',()=>setLanguage(language==='ar'?'en':'ar'));d.addEventListener('click',e=>{if(e.target===d)d.close();});
 d.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));applyLanguage(d);setLanguage(language);return d;
}
function open(){styles();const d=dialog();try{d.showModal();}catch(_){d.setAttribute('open','');}showTab('news');if(!items.length||Date.now()-lastLoad>3*60*1000)loadNews();}
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
 const meta=document.createElement('div');meta.className='cn-meta cn-updated';meta.textContent=lastLoad?(language==='en'?'Last updated: ':'آخر تحديث: ')+new Date(lastLoad).toLocaleString(language==='ar'?'ar-SA':'en-GB'):(language==='en'?'Live news sources':'مصادر الأخبار المباشرة');p.appendChild(meta);
 if(newsError){const status=document.createElement('div');status.className='cn-status';status.setAttribute('role','status');status.textContent=language==='en'?(items.length?'Live update failed. Showing saved headlines.':'News sources are temporarily unavailable. Please try again.'):(items.length?'تعذر التحديث المباشر؛ نعرض الأخبار المحفوظة حالياً.':'مصادر الأخبار غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى.');p.appendChild(status);}
 const list=items.filter(x=>category==='all'||x.category===category);
 if(!list.length){const e=document.createElement('div');e.className='cn-empty';e.textContent=loading?'جارٍ جلب الأخبار من المصادر…':'لا توجد أخبار متاحة حالياً؛ حاول التحديث لاحقاً.';p.appendChild(e);}
 list.forEach(x=>{const card=document.createElement('article');card.className='cn-story';const a=document.createElement('a');a.href=x.link;a.target='_blank';a.rel='noopener noreferrer';a.textContent=x.title;card.appendChild(a);const m=document.createElement('div');m.className='cn-meta';m.textContent=x.source+(x.date?' · '+x.date:'');card.appendChild(m);if(x.desc){const d=document.createElement('div');d.className='cn-desc';d.textContent=x.desc;card.appendChild(d);}p.appendChild(card);});
 applyLanguage(p);
}
async function loadNews(force=false){
 if(loading||(!force&&Date.now()-lastLoad<3*60*1000))return;
 loading=true;newsError='';
 const c=cache();
 if(!items.length&&c?.items?.length){items=c.items;lastLoad=Number(c.savedAt)||0;}
 renderNews();
 try{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  let payload;
  try{
   const response=await fetch('/api/news?fresh='+Date.now(),{signal:controller.signal,cache:'no-store',headers:{'Accept':'application/json'}});
   if(!response.ok)throw new Error('HTTP '+response.status);
   payload=await response.json();
  }finally{clearTimeout(timer);}
  if(!Array.isArray(payload?.feeds)||!payload.feeds.length)throw new Error('No news sources responded');
  const fresh=payload.feeds.flatMap(feed=>parse(feed.xml,feed));
  if(!fresh.length)throw new Error('No readable headlines in the feeds');
  const unique=new Map();
  fresh.forEach(item=>{if(!unique.has(item.link))unique.set(item.link,item);});
  items=[...unique.values()].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0)).slice(0,100);
  lastLoad=Date.now();
  try{localStorage.setItem('sakCastleNewspaperCacheV1',JSON.stringify({savedAt:lastLoad,items}));}catch(_){}
 }catch(error){
  newsError='unavailable';
 }finally{
  loading=false;
  renderNews();
 }
}
function tabButton(tab){dialog().querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tab)));}
function showTab(tab){tabButton(tab);const p=$('cnPanel');p.replaceChildren();if(tab==='news'){category='all';renderNews();}else if(tab==='crossword')crossword(p);else if(tab==='differences')differences(p);else horoscope(p);applyLanguage(p);}
const puzzles=[
 {a:'بحر',d:'بيت',ac:'ماء واسع مالح',dc:'مكان يسكن فيه الإنسان'},
 {a:'قمر',d:'قلم',ac:'جرم نراه ليلاً',dc:'أداة نكتب بها'},
 {a:'ورد',d:'وقت',ac:'زهرة جميلة',dc:'زمن أو موعد'},
 {a:'نجم',d:'نهر',ac:'جرم يلمع في السماء',dc:'مجرى ماء عذب'},
{a:'شمس',d:'شعر',ac:'مصدر الضوء والدفء نهاراً',dc:'ما ينبت على الرأس'},
{a:'باب',d:'بحر',ac:'مدخل المنزل',dc:'ماء واسع مالح'},
{a:'عين',d:'علم',ac:'عضو الإبصار',dc:'راية الدولة'},
{a:'جمل',d:'جبل',ac:'حيوان سفينة الصحراء',dc:'مرتفع صخري كبير'}];
function norm(s){return String(s||'').toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/\s/g,'').trim();}
const englishPuzzles=[
{a:'sea',d:'sun',ac:'A large body of salt water',dc:'The star that lights our day'},
{a:'cat',d:'car',ac:'A common household pet',dc:'A road vehicle'},
{a:'map',d:'man',ac:'A drawing that shows places',dc:'An adult person'},
{a:'pen',d:'pig',ac:'A tool used for writing',dc:'A farm animal that oinks'},
{a:'sky',d:'sun',ac:'The space above the earth',dc:'The star at the center of our solar system'},
{a:'box',d:'bat',ac:'A container with sides',dc:'A flying mammal'},
{a:'cup',d:'cow',ac:'A vessel used for drinking',dc:'A farm animal that gives milk'},
{a:'dog',d:'day',ac:'A loyal four-legged pet',dc:'The time between sunrise and sunset'}
];
function crossword(panel){
 const bank=language==='en'?englishPuzzles:puzzles,q=bank[Number(day().replace(/-/g,''))%bank.length],w=document.createElement('div');w.className='cn-game';w.innerHTML='<h3>🧩 الكلمات المتقاطعة اليومية</h3><p>حل الكلمتين؛ تشتركان في الحرف الأول داخل المربع المشترك.</p>';
 const grid=document.createElement('div');grid.className='cn-grid';for(let r=0;r<4;r++)for(let c=0;c<3;c++){const cell=document.createElement('div');const active=(r===1&&c<3)||(c===0&&r>=2);cell.className='cn-cell'+(active?'':' blank');cell.textContent=active?'؟':'';grid.appendChild(cell);}w.appendChild(grid);
 const ca=document.createElement('p');ca.textContent='أفقي: '+q.ac;w.appendChild(ca);const a=document.createElement('input');a.maxLength=3;a.placeholder='الإجابة الأفقية';w.appendChild(a);
 const cd=document.createElement('p');cd.textContent='عمودي: '+q.dc;w.appendChild(cd);const d=document.createElement('input');d.maxLength=3;d.placeholder='الإجابة العمودية';w.appendChild(d);
 const result=document.createElement('p');result.setAttribute('aria-live','polite');w.appendChild(result);const check=document.createElement('button');check.className='cn-action';check.textContent='تحقق من الحل';check.addEventListener('click',()=>{
 const ok=norm(a.value)===q.a&&norm(d.value)===q.d;
 result.textContent=language==='en'?(ok?'Excellent! Both answers are correct.':'Not quite. Check the clues and try again.'):(ok?'أحسنت! إجابتك صحيحة.':'ليست الإجابة صحيحة بعد؛ حاول مرة أخرى.');
 result.style.color=ok?'#a6f2c5':'#ffd4a6';
 if(ok)grid.querySelectorAll('.cn-cell:not(.blank)').forEach((x,i)=>x.textContent=[...q.a][i]||[...q.d][i-2]||'');
});w.appendChild(check);const date=document.createElement('div');date.className='cn-meta';date.textContent='لغز يوم '+day();w.appendChild(date);panel.appendChild(w);
}
function scene(alt){
 const variant=Number(day().replace(/-/g,''))%3,sky=['#a9dbe5','#d8c9ed','#f4d6b8'][variant],grass=['#74aa71','#829ac0','#85ae8c'][variant],wall=['#d9c49b','#d7c5dc','#e5d1a5'][variant];
 const sun=alt?'':'<circle cx="260" cy="35" r="16" fill="#ffe48b"/>',cloud=alt?'':'<path d="M35 47 Q28 31 45 28 Q54 10 70 27 Q88 24 91 43Z" fill="#fff"/>',flag=alt?'':'<path d="M160 20 L160 4 L180 10 L160 15Z" fill="#e24b65"/>',door=alt?'#4b8a8d':'#6d3d29';
 const palm=alt?'<circle cx="282" cy="92" r="4" fill="#e5a34c"/><circle cx="292" cy="92" r="4" fill="#e5a34c"/>':'<circle cx="282" cy="92" r="4" fill="#e5a34c"/><circle cx="292" cy="92" r="4" fill="#e5a34c"/><circle cx="287" cy="84" r="4" fill="#e5a34c"/>';
 return '<svg class="cn-picture" viewBox="0 0 320 190" role="img" aria-label="مشهد القلعة"><rect width="320" height="190" fill="'+sky+'"/><rect y="130" width="320" height="60" fill="'+grass+'"/>'+sun+cloud+'<path d="M100 130 L100 72 L130 72 L130 48 L190 48 L190 72 L220 72 L220 130Z" fill="'+wall+'" stroke="#765e47" stroke-width="3"/><path d="M125 48 L160 25 L195 48Z" fill="#a95b50"/>'+flag+'<rect x="118" y="88" width="18" height="18" fill="#557c91"/><rect x="184" y="88" width="18" height="18" fill="#557c91"/><path d="M146 130 V104 Q160 88 174 104 V130Z" fill="'+door+'"/><path d="M277 133 L284 73" stroke="#704b2e" stroke-width="8"/><path d="M284 78 Q250 50 264 68 Q280 48 286 70 Q303 46 303 70 Q321 63 300 84Z" fill="#28784f"/>'+palm+'<path d="M0 160 Q65 145 115 163 T230 159 T320 161" fill="none" stroke="#e6d9a2" stroke-width="3"/></svg>';
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
function start(){
 styles();mount();
 const syncLauncherLanguage=()=>{
  const pageEn=String(document.documentElement.lang||'ar').toLowerCase().startsWith('en');
  const launcher=$('sakCastleNewspaperLauncher');
  if(launcher){
   const label=pageEn?'Castle Newspaper':'صحيفة القلعة';
   const name=launcher.querySelector('.sak-ostrich-name');
   if(name)name.textContent=label;
   launcher.title=label;launcher.setAttribute('aria-label',label);
  }
 };
 new MutationObserver(m=>{
  mount();
  for(const x of m)for(const n of x.addedNodes)
   if(n.nodeType===Node.ELEMENT_NODE){
    const d=$('sakCastleNewspaperDialog');
    if(d&&(d.contains(n)||n.contains?.(d)))applyLanguage(n);
   }
 }).observe(document.body,{childList:true,subtree:true});
 new MutationObserver(syncLauncherLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 syncLauncherLanguage();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
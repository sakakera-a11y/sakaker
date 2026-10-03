(()=>{
'use strict';
const BTN_ID='sakShipStoryLibraryBtn';
const MODAL_ID='sakShipStoryLibraryModal';

const COPY={
 ar:{
  title:'🌙 الذكرى السنوية لبناء أبو القمر زمرد',
  lead:'أكثر من عامٍ مضى… ولم تكن الأيام مجرد أرقامٍ تتبدل، بل كانت صفحاتٍ من فكرةٍ بدأت صغيرة، ثم كبرت شيئًا فشيئًا، حتى أصبح لها اسمٌ ومكانٌ وذاكرة.',
  intro:'✨ البداية… حين كانت الفكرة مجرد حلم',
  h1:'🌱 الفصل الأول… حين بدأت الحكاية',
  p1:['في البداية لم يكن أمام أبو القمر زمرد إلا صفحةٌ بيضاء، وبعض الأفكار التي كانت تتزاحم في رأسه، وصورةٌ لموقعٍ لم يكن قد وُلد بعد.','كان يضيف جزءًا، ثم يعود إليه، ويغيّر لونًا، ويحرك أيقونة، ويجرّب فكرة، ويكتشف أخرى.','لم يكن يعرف كيف ستكون الصورة النهائية، لكنه كان يعرف شيئًا واحدًا: أنه لن يتوقف حتى يرى فكرته أمامه.'],
  bridge1:'💻 كل تعديل صغير كان خطوة في طريق طويل',
  h2:'💻 الفصل الثاني… ليالٍ بين الأكواد',
  p2:['مرت الأيام، وأصبحت الصفحة الواحدة صفحات، والفكرة الواحدة عشرات الأفكار.','ظهرت الخلفيات، ثم الفيديو، ثم القصص، ثم الألعاب، ثم الدردشة، ثم السفينة التي أصبحت واحدةً من علامات الموقع.','وفي كل مرة كان شيءٌ يتعطل، كان أبو القمر زمرد يعود إليه من جديد، يفتح الكود، ويبحث عن الخطأ، ويجرب مرةً أخرى.','فلم يكن الموقع يُبنى في يوم… بل بُني من الصبر.'],
  bridge2:'🚢 سفينة أبو القمر زمرد… رمز الرحلة',
  h3:'🚢 الفصل الثالث… حين أبحرت السفينة',
  p3:['ذات يوم ظهرت السفينة.','لم تكن مجرد أيقونةٍ في زاوية الشاشة، بل أصبحت كأنها تحمل قصص أبو القمر زمرد وتبحر بها بين صفحات الموقع.','مرةً تظهر، ومرةً تختفي، ثم تعود من جديد، كما تعود الذكريات حين نظن أننا نسيناها.','ومن خلفها جاءت الحكايات؛ التنين الفضي، والصحراء، والصقنقور، والقمر، والزمرد، والرحلات التي مزجت الواقع بالخيال.'],
  bridge3:'🌙 عام مضى… والحكاية ما زالت مستمرة',
  h4:'✨ الفصل الرابع… عامٌ من البناء',
  p4:['ومرت الشهور.','حتى جاء اليوم الذي نظر فيه أبو القمر زمرد إلى ما كان أمامه، ثم تذكر كيف كان كل شيءٍ في البداية.','تذكر أول صفحة، وأول خطأ، وأول صورة، وأول أيقونة، وأول مرةٍ شاهد فيها الموقع يعمل كما أراد.','فعرف أن الأشياء الكبيرة لا تبدأ كبيرة.','إنها تبدأ بفكرة، ثم تحتاج إلى من يتمسك بها حين تبدو للآخرين مجرد فكرةٍ عابرة.'],
  h5:'🕯️ كلمة في الذكرى',
  p5:['في هذه الذكرى لا نحتفل بمرور عامٍ فقط، بل نحتفل بكل ساعةٍ قضيت في البناء، وبكل محاولةٍ لم تنجح ثم أُعيدت، وبكل فكرةٍ أصبحت جزءًا من الموقع.','والحمد لله أولًا وآخرًا، فما كان لشيءٍ أن يتم إلا بتوفيقه.','ثم كانت رحلةٌ من التعاون بين الفكرة والكلمة والكود، حتى وصل أبو القمر زمرد إلى هذا اليوم.'],
  end:'الذكرى السنوية لبداية رحلة لم تنتهِ بعد',close:'إغلاق',button:'🌙 محتوى السفينة'
 },
 en:{
  title:'🌙 The Anniversary of Building the Abwalqmrzmrd Website',
  lead:'More than a year has passed. The days were not merely changing numbers, but pages in the story of an idea that began small, grew little by little, and gained a name, a place, and a memory.',
  intro:'✨ The beginning… when the idea was only a dream',
  h1:'🌱 Chapter One… When the Story Began',
  p1:['At first, Abwalqmrzmrd had only a blank page, thoughts crowding his mind, and a vision of a website that had not yet been born.','He would add a section, return to it, change a color, move an icon, test an idea, and discover another.','He did not know what the final picture would look like, but he knew one thing: he would not stop until he could see his idea before him.'],
  bridge1:'💻 Every small edit was a step on a long road',
  h2:'💻 Chapter Two… Nights Among the Code',
  p2:['Days passed. One page became many pages, and one idea became dozens.','Backgrounds appeared, followed by video, stories, games, chat, and then the ship that became one of the site’s symbols.','Whenever something failed, Abwalqmrzmrd returned to it, opened the code, searched for the error, and tried again.','The website was not built in a day; it was built through patience.'],
  bridge2:'🚢 The ship of Abwalqmrzmrd… a symbol of the journey',
  h3:'🚢 Chapter Three… When the Ship Set Sail',
  p3:['One day, the ship appeared.','It was not merely an icon in the corner of the screen. It seemed to carry the story of Abwalqmrzmrd and sail with it through the pages of the website.','Sometimes it appeared, sometimes it vanished, and then it returned, just as memories return when we think we have forgotten them.','Behind it came the tales of the silver dragon, the desert, the sand skink, the moon, the emerald, and journeys blending reality with imagination.'],
  bridge3:'🌙 A year has passed… and the story continues',
  h4:'✨ Chapter Four… A Year of Building',
  p4:['The months passed until the day came when Abwalqmrzmrd looked at what stood before him and remembered how everything had begun.','He remembered the first page, the first error, the first picture, the first icon, and the first time he saw the website work as he intended.','He realized that great things do not begin great. They begin as an idea and need someone who holds on to it when others see it as only a passing thought.'],
  h5:'🕯️ A Word on the Anniversary',
  p5:['On this anniversary, we celebrate not only the passing of a year, but every hour spent building, every attempt that failed and was tried again, and every idea that became part of the website.','Praise be to God first and last; nothing could have been completed except by His grace.','It was a journey of cooperation between idea, word, and code, bringing Abwalqmrzmrd to this day.'],
  end:'The anniversary of a journey that is still unfolding',close:'Close',button:'🌙 Ship Story'
 }
};

function lang(){return (document.documentElement.lang||'ar').toLowerCase().startsWith('en')?'en':'ar';}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function ps(arr){return arr.map(x=>'<p>'+esc(x)+'</p>').join('');}
function storyHtml(){
 const t=COPY[lang()];
 return `<article class="sak-ship-story" dir="${lang()==='ar'?'rtl':'ltr'}">
 <h2>${esc(t.title)}</h2><p class="lead">${esc(t.lead)}</p><div class="bridge">${esc(t.intro)}</div>
 <h3>${esc(t.h1)}</h3>${ps(t.p1)}<div class="bridge">${esc(t.bridge1)}</div>
 <h3>${esc(t.h2)}</h3>${ps(t.p2)}<div class="bridge">${esc(t.bridge2)}</div>
 <h3>${esc(t.h3)}</h3>${ps(t.p3)}<div class="bridge">${esc(t.bridge3)}</div>
 <h3>${esc(t.h4)}</h3>${ps(t.p4)}
 <section class="word"><h3>${esc(t.h5)}</h3>${ps(t.p5)}</section>
 <footer><strong>🌙 أبو القمر زمرد</strong><span>${esc(t.end)}</span><small>2025 — 2026</small></footer></article>`;
}

function installStyle(){
 if(document.getElementById('sakShipStoryLibraryStyle')) return;
 const s=document.createElement('style');s.id='sakShipStoryLibraryStyle';s.textContent=`
 #sakTextLibrarySections{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(170px,1fr))!important;gap:12px!important;margin-top:18px!important}
 #sakTextLibrarySections>button{min-height:64px!important;padding:13px 14px!important;border-radius:18px!important;color:#fff!important;font-weight:900!important;font-size:15px!important;letter-spacing:.1px!important;box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 0 18px rgba(255,255,255,.05)!important;transition:transform .2s ease,filter .2s ease,box-shadow .2s ease!important}
 #sakTextLibrarySections>button:hover{transform:translateY(-3px)!important;filter:brightness(1.12)!important}
 #sakTextLibrarySections>button[data-sak-section="ebooks"]{background:linear-gradient(145deg,#4a2500,#b66b00)!important;border:1px solid #ffd36a!important;box-shadow:0 0 18px rgba(255,180,50,.28)!important}
 #sakTextLibrarySections>button[data-sak-section="puzzles"]{background:linear-gradient(145deg,#2b1458,#6e40c9)!important;border:1px solid #bba3ff!important;box-shadow:0 0 18px rgba(160,120,255,.28)!important}
 #sakTextLibrarySections>button[data-sak-section="quiz"]{background:linear-gradient(145deg,#003d68,#087bb4)!important;border:1px solid #74d7ff!important;box-shadow:0 0 18px rgba(70,190,255,.28)!important}
 #sakTextLibrarySections>button[data-sak-section="today"]{background:linear-gradient(145deg,#584a00,#aa8c00)!important;border:1px solid #ffe779!important;box-shadow:0 0 18px rgba(255,225,80,.25)!important}
 #sakTextLibrarySections>button[data-sak-section="culture"]{background:linear-gradient(145deg,#004a35,#008c63)!important;border:1px solid #74ffd6!important;box-shadow:0 0 18px rgba(80,255,205,.23)!important}
 #sakTextLibrarySections>button[data-sak-section="stories"]{background:linear-gradient(145deg,#5b1738,#a23d70)!important;border:1px solid #ff9ac5!important}
 #sakTextLibrarySections>button[data-sak-section="about"]{background:linear-gradient(145deg,#263238,#546e7a)!important;border:1px solid #b0bec5!important}
 #sakTextLibrarySections>button[data-sak-section="wisdom"]{background:linear-gradient(145deg,#4b3100,#8d6500)!important;border:1px solid #e7c86a!important}
 #sakTextLibrarySections>button[data-sak-section="ship"]{background:linear-gradient(145deg,#003a38,#00796f)!important;border:1px solid #63ffe9!important;box-shadow:0 0 18px rgba(0,255,220,.25)!important}
 #sakTextLibrarySections>button[data-sak-section="other"]{background:linear-gradient(145deg,#19323b,#315b68)!important;border:1px solid #76bdcf!important}
 #${BTN_ID}{cursor:pointer!important}
 #${MODAL_ID}{position:fixed!important;inset:0!important;display:none;align-items:center!important;justify-content:center!important;padding:12px!important;background:rgba(0,0,0,.78)!important;backdrop-filter:blur(6px);z-index:2147483300!important;box-sizing:border-box!important}
 #${MODAL_ID}.show{display:flex!important}
 #${MODAL_ID} .sak-ship-panel{width:min(920px,96vw)!important;height:min(88dvh,900px)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;border:1px solid rgba(0,255,213,.55)!important;border-radius:20px!important;background:linear-gradient(180deg,#020b0b,#041818,#020909)!important;box-shadow:0 0 30px rgba(0,255,213,.22)!important}
 #${MODAL_ID} .sak-ship-head{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:12px 14px!important;border-bottom:1px solid rgba(0,255,213,.25)!important;flex:0 0 auto!important}
 #${MODAL_ID} .sak-ship-close{border:1px solid #ffd75b!important;border-radius:50%!important;width:40px!important;height:40px!important;background:#081415!important;color:#fff!important;font-size:20px!important;cursor:pointer!important}
 #${MODAL_ID} .sak-ship-scroll{overflow:auto!important;-webkit-overflow-scrolling:touch!important;padding:10px 18px 28px!important;flex:1 1 auto!important}
 #${MODAL_ID} .sak-ship-story{max-width:760px;margin:auto;color:#d9fff8;line-height:1.95;font-family:Tajawal,Arial,sans-serif}
 #${MODAL_ID} h2,#${MODAL_ID} h3{text-align:center;color:#d4af37;text-shadow:0 0 9px rgba(212,175,55,.55)}
 #${MODAL_ID} .lead{text-align:center;color:#9ffff0;font-size:1.08rem}
 #${MODAL_ID} .bridge{text-align:center;color:#00ffd5;margin:22px 0 12px;font-weight:800}
 #${MODAL_ID} .word{margin-top:25px;padding:18px;border-inline:3px solid #d4af37;border-radius:14px;background:rgba(0,255,200,.045)}
 #${MODAL_ID} footer{display:grid;gap:6px;text-align:center;margin-top:28px;color:#00ffd5}#${MODAL_ID} footer strong{color:#d4af37;font-size:1.35rem}#${MODAL_ID} footer small{color:#aaa}
 `;document.head.appendChild(s);
}

function findHost(){
 return document.querySelector('.cards')||document.querySelector('main .grid')||document.querySelector('main')||document.body;
}
function ensureButton(){
 let b=document.getElementById(BTN_ID);if(!b){b=document.createElement('button');b.id=BTN_ID;b.type='button';b.dataset.sakShipLibrary='1';findHost().appendChild(b);}
 b.onclick=openModal;b.textContent=COPY[lang()].button;b.setAttribute('aria-label',COPY[lang()].button);return b;
}
function ensureModal(){
 let m=document.getElementById(MODAL_ID);if(m)return m;
 m=document.createElement('div');m.id=MODAL_ID;m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="sak-ship-panel"><div class="sak-ship-head"><strong id="sakShipStoryLibraryTitle"></strong><button class="sak-ship-close" type="button">✕</button></div><div class="sak-ship-scroll"></div></div>';
 document.body.appendChild(m);m.querySelector('.sak-ship-close').addEventListener('click',closeModal);m.addEventListener('click',e=>{if(e.target===m)closeModal();});return m;
}
function classifyButton(btn){
 const txt=(btn.textContent+' '+(btn.id||'')+' '+(btn.getAttribute('onclick')||'')).toLowerCase();
 if(/كتب إلكترونية|الكتب الالكترونية|ebooks?|ebook|sakebooks/.test(txt))return['ebooks',1];
 if(/ألغاز|الغاز|puzzle|riddle/.test(txt))return['puzzles',2];
 if(/اختبر معلوماتك|quiz/.test(txt))return['quiz',3];
 if(/معلومة اليوم|today fact|opentodayfact/.test(txt))return['today',4];
 if(/ثقافة عامة|general culture|openfolder\(4\)/.test(txt))return['culture',5];
 if(/خواطر وقصص|stories|openfolder\(1\)/.test(txt))return['stories',6];
 if(/تعريف بالموقع|about|openfolder\(5\)/.test(txt))return['about',7];
 if(/حكم وأمثال|wisdom/.test(txt))return['wisdom',8];
 if(btn.id===BTN_ID||/محتوى السفينة|ship story/.test(txt))return['ship',9];
 return['other',50];
}
function arrangeSections(){
 const main=document.querySelector('main');if(!main)return;
 let source=[...main.querySelectorAll(':scope button')];
 const ship=document.getElementById(BTN_ID);if(ship&&!source.includes(ship))source.push(ship);
 source=source.filter(b=>b.id!=='back');
 if(!source.length)return;
 let host=document.getElementById('sakTextLibrarySections');
 if(!host){host=document.createElement('div');host.id='sakTextLibrarySections';const h=main.querySelector('h1');(h||main.firstChild)?.after(host);}
 const ranked=source.map((b,i)=>{const [kind,rank]=classifyButton(b);b.dataset.sakSection=kind;return{b,rank,i};}).sort((a,b)=>a.rank-b.rank||a.i-b.i);
 ranked.forEach(x=>host.appendChild(x.b));
}
function render(){const t=COPY[lang()];const b=ensureButton();b.textContent=t.button;const m=ensureModal();m.querySelector('#sakShipStoryLibraryTitle').textContent=t.title;m.querySelector('.sak-ship-scroll').innerHTML=storyHtml();m.querySelector('.sak-ship-close').setAttribute('aria-label',t.close);arrangeSections();}
function openModal(){render();const m=ensureModal();m.classList.add('show');document.body.classList.add('modal-open');m.querySelector('.sak-ship-close').focus();}
function closeModal(){const m=document.getElementById(MODAL_ID);if(m)m.classList.remove('show');document.body.classList.remove('modal-open');document.getElementById(BTN_ID)?.focus();}
function init(){installStyle();ensureButton();ensureModal();render();arrangeSections();[300,900,1800,3500].forEach(ms=>setTimeout(arrangeSections,ms));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(MODAL_ID)?.classList.contains('show'))closeModal();});
new MutationObserver(()=>{render();arrangeSections();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
})();

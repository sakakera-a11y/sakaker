(()=>{
'use strict';
const HOST_ID='sakTextLibrarySections';
const SHIP_ID='sakShipStoryLibraryBtn';
const EBOOK_ID='sakEbooksLibraryBtn';

function classify(btn){
  const txt=(btn.textContent+' '+(btn.id||'')+' '+(btn.getAttribute('onclick')||'')).toLowerCase();
  if(/كتب إلكترونية|الكتب الالكترونية|ebooks?|ebook|sakebooks/.test(txt)) return ['ebooks',1];
  if(/ألغاز|الغاز|puzzle|riddle/.test(txt)) return ['puzzles',2];
  if(/اختبر معلوماتك|quiz/.test(txt)) return ['quiz',3];
  if(/معلومة اليوم|today fact|opentodayfact/.test(txt)) return ['today',4];
  if(/ثقافة عامة|general culture|openfolder\(4\)/.test(txt)) return ['culture',5];
  if(/خواطر وقصص|stories|openfolder\(1\)/.test(txt)) return ['stories',6];
  if(/تعريف بالموقع|about|openfolder\(5\)/.test(txt)) return ['about',7];
  if(/حكم وأمثال|wisdom/.test(txt)) return ['wisdom',8];
  if(btn.id===SHIP_ID||/محتوى السفينة|ship story/.test(txt)) return ['ship',9];
  return ['other',50];
}

function style(){
  if(document.getElementById('sakLibraryOrderStyle')) return;
  const s=document.createElement('style');
  s.id='sakLibraryOrderStyle';
  s.textContent=`
  #${HOST_ID}{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(170px,1fr))!important;gap:12px!important;margin-top:18px!important}
  #${HOST_ID}>button{min-height:64px!important;padding:13px 14px!important;border-radius:18px!important;color:#fff!important;font-weight:900!important;font-size:15px!important;box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 0 18px rgba(255,255,255,.05)!important;transition:.2s ease!important}
  #${HOST_ID}>button:hover{transform:translateY(-3px)!important;filter:brightness(1.12)!important}
  #${HOST_ID}>button[data-sak-section="ebooks"]{background:linear-gradient(145deg,#4a2500,#b66b00)!important;border:1px solid #ffd36a!important}
  #${HOST_ID}>button[data-sak-section="puzzles"]{background:linear-gradient(145deg,#2b1458,#6e40c9)!important;border:1px solid #bba3ff!important}
  #${HOST_ID}>button[data-sak-section="quiz"]{background:linear-gradient(145deg,#003d68,#087bb4)!important;border:1px solid #74d7ff!important}
  #${HOST_ID}>button[data-sak-section="today"]{background:linear-gradient(145deg,#584a00,#aa8c00)!important;border:1px solid #ffe779!important}
  #${HOST_ID}>button[data-sak-section="culture"]{background:linear-gradient(145deg,#004a35,#008c63)!important;border:1px solid #74ffd6!important}
  #${HOST_ID}>button[data-sak-section="stories"]{background:linear-gradient(145deg,#5b1738,#a23d70)!important;border:1px solid #ff9ac5!important}
  #${HOST_ID}>button[data-sak-section="about"]{background:linear-gradient(145deg,#263238,#546e7a)!important;border:1px solid #b0bec5!important}
  #${HOST_ID}>button[data-sak-section="wisdom"]{background:linear-gradient(145deg,#4b3100,#8d6500)!important;border:1px solid #e7c86a!important}
  #${HOST_ID}>button[data-sak-section="ship"]{background:linear-gradient(145deg,#003a38,#00796f)!important;border:1px solid #63ffe9!important;box-shadow:0 0 18px rgba(0,255,220,.28)!important}
  #sakThoughtsStories{display:grid;gap:16px;max-width:860px;margin:16px auto;padding:4px 0 18px}
  #sakThoughtsStories .sak-story-card{border:1px solid rgba(120,255,230,.42);border-radius:20px;background:linear-gradient(145deg,rgba(6,38,43,.94),rgba(3,19,28,.97));color:#effffc;padding:20px;box-shadow:0 0 24px rgba(0,255,220,.14)}
  #sakThoughtsStories .sak-story-card h2{margin:0 0 8px;text-align:center;font-size:clamp(19px,3vw,27px);color:#e5fffa;text-shadow:0 0 10px rgba(0,255,220,.3)}
  #sakThoughtsStories .sak-story-note{margin:0 0 12px;text-align:center;color:#ffe18a;font-weight:900}
  #sakThoughtsStories .sak-story-card p{margin:10px 0;line-height:1.95;font-size:clamp(15px,2.3vw,18px)}
  @media(max-width:600px){#sakThoughtsStories{gap:12px}#sakThoughtsStories .sak-story-card{padding:15px;border-radius:16px}}
  `;
  document.head.appendChild(s);
}

const stories=[
  {
    ar:{title:'📜 علي بابا والسبعون حرامي',lead:'حكاية شعبية بصياغة عربية وإنجليزية',paragraphs:[
      'كان علي بابا رجلًا بسيطًا يعمل في جمع الحطب. وفي يومٍ من الأيام رأى جماعة من اللصوص يقفون أمام صخرة كبيرة، فسمع قائدهم يقول: «افتح يا سمسم». انفتحت الصخرة عن مغارة تخفي كنوزًا كثيرة، فحفظ علي بابا العبارة وانتظر حتى غادروا.',
      'دخل علي بابا المغارة وأخذ قدرًا يسيرًا من المال ليعين أسرته، لكنه أوصى نفسه ألا يجعل الطمع دليلًا له. وعندما حاول آخرون معرفة السر، كادت المغارة أن تصبح سببًا للخطر، لولا الحكمة والشجاعة اللتان أنقذتا الموقف.',
      'تذكّرنا الحكاية بأن الثروة لا تكون خيرًا إلا حين ترافقها الأمانة والعقل، وأن الطمع قد يحوّل الفرصة إلى مشكلة.'
    ]},
    en:{title:'📜 Ali Baba and the Seventy Thieves',lead:'A folk tale presented in Arabic and English',paragraphs:[
      'Ali Baba was a modest woodcutter. One day he saw a band of thieves before a great rock and heard their leader say, “Open, Sesame.” The rock opened into a cave filled with treasure, and Ali Baba remembered the words until the thieves had gone.',
      'He entered the cave and took only a little to help his family, warning himself not to follow greed. When others tried to uncover the secret, wisdom and courage prevented the cave from becoming a disaster.',
      'The tale reminds us that wealth is good only when joined with honesty and sound judgment.'
    ]}
  },
  {
    ar:{title:'🌙 أبوالقمرزمرد وسفينة الضباب',lead:'مغامرة في البحر بين الشجاعة وحسن التدبير',paragraphs:[
      'خرج أبوالقمرزمرد ليلًا على متن سفينته حين غطّى الضباب البحر واختفت المنارات. وبينما ارتفعت الأمواج سمع نداء استغاثة من قارب صغير تائه بين الصخور، فغيّر مساره رغم صعوبة البحر.',
      'اعتمد على ضوء القمر واتجاه الريح، وقاد سفينته بهدوء حتى وصل إلى القارب وأنقذ ركابه. ثم رسم لهم طريق العودة بعلامات النجوم بدل المجازفة في الممرات الضيقة.',
      'عاد مع الفجر وقد أثبت أن البطولة ليست اندفاعًا، بل شجاعة تعرف متى تتقدم وكيف تحمي الآخرين.'
    ]},
    en:{title:'🌙 Abwalqmrzmrd and the Ship of Mist',lead:'A sea adventure of courage and judgment',paragraphs:[
      'Abwalqmrzmrd sailed at night when thick mist covered the sea and hid the beacons. Through the rising waves he heard a distress call from a small boat drifting toward the rocks, so he changed course despite the danger.',
      'Using moonlight and the wind, he guided his ship carefully to the stranded crew and rescued them. He then marked a safe return path by the stars instead of risking the narrow channels.',
      'At dawn he returned with a simple lesson: heroism is not reckless speed, but courage guided by responsibility.'
    ]}
  },
  {
    ar:{title:'💎 أبوالقمرزمرد وقلعة الزمرد الخفية',lead:'رحلة بحث عن سر القلعة القديمة',paragraphs:[
      'عثر أبوالقمرزمرد على خريطة قديمة تشير إلى قلعة مخفية خلف وادٍ صخري لا يظهر مدخلها إلا عندما ينعكس ضوء القمر على حجر أخضر في الجبل. سلك الطريق وحده وواجه ممرات متاهة وأبوابًا لا تفتح بالقوة.',
      'اكتشف أن كل باب يحمل لغزًا عن الصبر والعدل والوفاء، وأن الحلول تقوده إلى قلب القلعة. هناك وجد صندوقًا من الزمرد، لكنه ترك الجواهر وأخذ سجلًا تاريخيًا يحفظ أسرار المكان وأسماء من بنوه.',
      'خرج وهو يدرك أن أعظم الكنوز ليست دائمًا ما يلمع، بل ما يحفظ المعرفة والذاكرة.'
    ]},
    en:{title:'💎 Abwalqmrzmrd and the Hidden Emerald Castle',lead:'A quest for the secret of an ancient fortress',paragraphs:[
      'Abwalqmrzmrd discovered an old map pointing to a fortress hidden beyond a rocky valley. Its entrance appeared only when moonlight struck a green stone in the mountain, leading him into a maze of passages and sealed doors.',
      'Each door carried a riddle about patience, justice, and loyalty. Solving them brought him to a chamber filled with emeralds, yet he chose an old historical record instead of the jewels.',
      'He left knowing that the greatest treasure is sometimes not what shines, but what preserves knowledge and memory.'
    ]}
  },
  {
    ar:{title:'⚓ أبوالقمرزمرد وحارس الميناء الأسود',lead:'مواجهة غامضة لحماية مدينة ساحلية',paragraphs:[
      'وصل أبوالقمرزمرد إلى ميناء توقفت فيه السفن عن الإبحار بسبب إشارات ضوئية كاذبة كانت تقود البحارة نحو منطقة خطرة. لاحظ أن الضوء يتحرك في توقيت منتظم، فعرف أن الأمر ليس ظاهرة طبيعية.',
      'تتبع الإشارة حتى برج مهجور واكتشف رجلًا يستغل خوف الناس لاحتكار التجارة. بدل المواجهة المتهورة، جمع الأدلة وأعاد تشغيل المنارة الحقيقية ثم كشف الخدعة أمام أهل الميناء.',
      'عادت السفن إلى البحر، وأصبح الميناء آمنًا من جديد بفضل الشجاعة التي اقترنت بالدليل والحكمة.'
    ]},
    en:{title:'⚓ Abwalqmrzmrd and the Guardian of the Black Harbor',lead:'A mystery to protect a coastal city',paragraphs:[
      'Abwalqmrzmrd reached a harbor where ships had stopped sailing because false lights were guiding crews toward dangerous waters. The lights moved on a regular schedule, proving that the threat was man-made.',
      'He traced the signal to an abandoned tower and found a man exploiting fear to control trade. Rather than rush into a fight, he gathered evidence, restored the true lighthouse, and exposed the scheme to the harbor community.',
      'Ships returned to sea, and the harbor was safe again because courage had been paired with proof and wisdom.'
    ]}
  },
  {
    ar:{title:'🗺️ أبوالقمرزمرد وجزيرة الرياح السبع',lead:'مغامرة في جزيرة لا تثبت طرقها على حال',paragraphs:[
      'قاد أبوالقمرزمرد رحلة إلى جزيرة تتغير طرقها مع اتجاه الرياح السبع. كلما ظن البحارة أنهم اقتربوا من الجبل الأوسط تغيرت الرمال وتحولت الممرات، فقرر التوقف عن مطاردة الطريق ومراقبة حركة الأشجار والغيوم.',
      'فهم أن الرياح تتكرر في دورة محددة، فوضع علامات على الصخور وحدد لحظة عبور الممر الصحيح. وصل الفريق إلى عين ماء عذبة كانت هدف الرحلة، وسجل الطريق ليستفيد منه المسافرون من بعده.',
      'كانت المغامرة انتصارًا للعقل الهادئ أمام الطبيعة المتقلبة.'
    ]},
    en:{title:'🗺️ Abwalqmrzmrd and the Island of Seven Winds',lead:'An expedition across an island of shifting paths',paragraphs:[
      'Abwalqmrzmrd led an expedition to an island whose roads shifted with seven changing winds. Each time the crew neared the central mountain, sand and passages moved, so he stopped chasing the route and began studying trees and clouds.',
      'He discovered that the winds repeated in a pattern. By marking rocks and timing the crossing, the team reached a fresh-water spring and recorded the route for future travelers.',
      'The adventure became a victory of calm observation over a restless landscape.'
    ]}
  },
  {
    ar:{title:'🔥 أبوالقمرزمرد ونجم الصحراء',lead:'سباق مع العاصفة لإنقاذ قافلة',paragraphs:[
      'أثناء عبوره الصحراء علم أبوالقمرزمرد أن قافلة ضلت طريقها قبل عاصفة رملية كبيرة. انطلق نحوها مستدلًا بنجم ثابت في الأفق وبآثار عجلات كادت الرياح تمحوها.',
      'وجد القافلة قرب منخفض خطير، فنقل أفرادها إلى أرض مرتفعة وثبت الخيام وربط الدواب في دائرة تحمي الصغار من الريح. وعندما هدأت العاصفة قادهم إلى بئر قديم كان قد سجله في رحلات سابقة.',
      'وصل الجميع بسلام، وصار نجم الصحراء رمزًا للطريق الذي يصنعه الإنسان حين يجمع الخبرة بالرحمة.'
    ]},
    en:{title:'🔥 Abwalqmrzmrd and the Desert Star',lead:'A race against a sandstorm to save a caravan',paragraphs:[
      'While crossing the desert, Abwalqmrzmrd learned that a caravan had lost its route ahead of a major sandstorm. He followed a fixed star and fading wheel tracks before the wind erased them.',
      'He found the caravan near a dangerous hollow, moved everyone to higher ground, secured the tents, and arranged the animals to shield the children from the wind. When the storm passed, he led them to an old well he had mapped on an earlier journey.',
      'Everyone reached safety, and the desert star became a symbol of experience joined with compassion.'
    ]}
  }
];

function storiesMarkup(){
  const en=document.documentElement.lang==='en';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return '<div id="sakThoughtsStories" dir="'+(en?'ltr':'rtl')+'">'+stories.map(item=>{
    const s=en?item.en:item.ar;
    return '<article class="sak-story-card"><h2>'+esc(s.title)+'</h2><p class="sak-story-note">'+esc(s.lead)+'</p>'+s.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'</article>';
  }).join('')+'</div>';
}

function renderThoughts(){
  const title=document.getElementById('folderTitle');
  const body=document.getElementById('folderBody');
  const modal=document.getElementById('folderModal');
  if(title)title.textContent=document.documentElement.lang==='en'?'Thoughts & Stories':'خواطر وقصص';
  if(body)body.innerHTML=storiesMarkup();
  if(modal)modal.style.display='block';
}
window.showKhwater=function(el){
  const title=document.getElementById('folderTitle');
  if(title)title.textContent=document.documentElement.lang==='en'?'Thoughts & Stories':'خواطر وقصص';
  if(el)el.innerHTML=storiesMarkup();
};

function ensureEbooksButton(){
  const main=document.querySelector('main');
  if(!main)return null;
  let b=document.getElementById(EBOOK_ID);
  if(!b){b=document.createElement('button');b.id=EBOOK_ID;b.type='button';b.dataset.sakSection='ebooks'}
  const isEn=document.documentElement.lang==='en';
  b.textContent=isEn?'📚 E-Books':'📚 الكتب الإلكترونية';
  b.title=isEn?'Open E-Books':'فتح الكتب الإلكترونية';
  b.setAttribute('aria-label',b.title);
  b.onclick=()=>{if(window.parent&&window.parent!==window)window.parent.postMessage({type:'sak-open-ebooks'},location.origin)};
  return b;
}

function arrange(){
  const main=document.querySelector('main');if(!main)return;style();
  const ebookBtn=ensureEbooksButton();
  let host=document.getElementById(HOST_ID);
  if(!host){host=document.createElement('div');host.id=HOST_ID;const h=main.querySelector('h1');(h||main.firstChild)?.after(host)}
  if(ebookBtn&&!ebookBtn.isConnected)host.appendChild(ebookBtn);
  const buttons=[...main.querySelectorAll('button')].filter(b=>b.id!=='back'&&!b.closest('.modal'));
  const unique=[...new Set(buttons)];
  unique.forEach((b,i)=>{const [kind,rank]=classify(b);b.dataset.sakSection=kind;b.dataset.sakRank=String(rank);b.dataset.sakIndex=String(i)});
  unique.sort((a,b)=>(+a.dataset.sakRank)-(+b.dataset.sakRank)||(+a.dataset.sakIndex)-(+b.dataset.sakIndex));
  unique.forEach(b=>host.appendChild(b));
}

function installStoriesGuard(){
  if(document.__sakStoriesGuard)return;document.__sakStoriesGuard=true;
  document.addEventListener('click',e=>{
    const b=e.target?.closest?.('button,[role="button"],a');if(!b)return;
    const meta=((b.dataset?.sakSection||'')+' '+(b.getAttribute('onclick')||'')+' '+b.textContent);
    if(/stories|openFolder\(1\)|خواطر\s*وقصص|Thoughts\s*&?\s*Stories/i.test(meta)){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();renderThoughts();
    }
  },true);
}
function refreshOpenThoughts(){
  const body=document.getElementById('folderBody');
  const title=document.getElementById('folderTitle');
  if(body&&title&&/خواطر|Thoughts/i.test(title.textContent||'')){
    body.innerHTML=storiesMarkup();
    title.textContent=document.documentElement.lang==='en'?'Thoughts & Stories':'خواطر وقصص';
  }
}
function init(){arrange();installStoriesGuard();[100,300,700,1500,3000].forEach(ms=>setTimeout(arrange,ms))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
new MutationObserver(()=>{arrange();refreshOpenThoughts()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
})();
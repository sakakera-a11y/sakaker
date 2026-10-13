(function(){
'use strict';
const HOST_ID='sakTextLibrarySections',SHIP_ID='sakShipStoryLibraryBtn',EBOOK_ID='sakEbooksLibraryBtn';
function classify(btn){const txt=(btn.textContent+' '+(btn.id||'')+' '+(btn.getAttribute('onclick')||'')).toLowerCase();if(/كتب إلكترونية|الكتب الالكترونية|ebooks?|ebook/.test(txt))return 'ebooks';if(/القصص|خواطر|stories|reflections/.test(txt))return 'stories';return ''}
function style(){if(document.getElementById('sakLibraryOrderStyle'))return;const s=document.createElement('style');s.id='sakLibraryOrderStyle';s.textContent=`#${HOST_ID}{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}#${HOST_ID} .storyCard{background:linear-gradient(145deg,#06151a,#072d2b);padding:14px;border-radius:12px;border:1px solid rgba(100,255,200,.08);color:#e7fff8}#${HOST_ID} .storyTitle{font-weight:800;margin-bottom:6px}#${HOST_ID} .storyLead{color:#cfe7e7;font-size:13px;margin-bottom:8px}`;document.head.appendChild(s)}
const stories=[
  {
      "ar": {
        "title": "🌍 أبوالقمرزمرد والحياة والتقدم",
        "lead": "من اتساع الأرض إلى اتساع الفكر: كيف قرّبت وسائل التواصل الحديثة الناس رغم المسافات",
        "paragraphs": [
          "تأمل أبوالقمرزمرد الأرض ذات يوم، فرأى اتساع الصحارى والبحار والسهول، وتذكر أن الله أوجد الحياة والأرض،[...].",
          "ومع مرور الزمن ازداد عدد الناس، وتكاثرت المدن، وتنوعت اللغات والتجارب والأفكار. كانت الأرض واسعة، لكن ا[...].",
          "قال أبوالقمرزمرد: «إذا ضاقت الساحة التي نجتمع فيها، فليس الحل أن نتوقف عن اللقاء؛ بل أن نبتكر طريقًا جدي[...]."
        ]
      },
      "en": {
        "title": "🌍 Abwalqmrzmrd, Life, and Progress",
        "lead": "From the wide Earth to a wider exchange of ideas: how modern communication brings people closer across distance",
        "paragraphs": [
          "One day, Abwalqmrzmrd looked across the Earth and saw its broad deserts, seas, and plains. [...].",
          "As time passed, the number of people grew, cities expanded, and languages, experiences, and ideas multiplied. [...].",
          "Abwalqmrzmrd said, “If the place where we gather becomes too small, the answer is not to stop meeting; it is to invent another way to reach one another.” [...]."
        ]
      },
      "image": "Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A0%D9%A0%D9%A6-%D9%A1%D9%A7%D9%A4%D9%A2%D9%A0%D9%A7_1.png",
      "serial": 8
    },
  {
      "ar": {
        "title": "⭐ أبوالقمرزمرد ونجم الصحراء",
        "lead": "رحلة ليلية بين الرمال والنجوم",
        "paragraphs": [
          "ضلّت قافلة في الصحراء بعد عاصفة رملية، فتقدم أبوالقمرزمرد للبحث عن الطريق.",
          "اعتمد على نجم ثابت وآثار الريح حتى عثر على بئر قديمة وممر يقود إلى الواحة.",
          "وصلت القافلة بسلام، وبقي نجم الصحراء رمزًا للأمل وحسن التقدير."
        ]
      },
      "en": {
        "title": "⭐ Abwalqmrzmrd and the Desert Star",
        "lead": "A night journey across sand and stars",
        "paragraphs": [
          "A caravan lost its way after a sandstorm, and Abwalqmrzmrd went ahead to find a route.",
          "He followed a fixed star and the wind patterns until he found an old well and a path to the oasis.",
          "The caravan arrived safely, and the desert star became a symbol of hope and sound judgment."
        ]
      },
      "image": "https://raw.githubusercontent.com/sakakera-a11y/sakaker/main/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A0%D9%A0%D9%A6-%D9%A1%D9%A7%D9%A4%D9%A2%D9%A0%D9%A7_1.png",
      "imageAlt": {
        "ar": "صورة أبوالقمرزمرد في الصحراء مرفقة بحكاية نجم الصحراء",
        "en": "Abwalqmrzmrd in the desert, accompanying the Desert Star story"
      },
      "serial": 1
    },
  {
      "ar": {
        "title": "🗺️ أبوالقمرزمرد وجزيرة الرياح السبع",
        "lead": "مغامرة في جزيرة لا تثبت طرقها على حال",
        "paragraphs": [
          "قاد أبوالقمرزمرد رحلة إلى جزيرة تتغير طرقها مع الرياح.",
          "راقب الأشجار والغيوم حتى فهم دورة الرياح وحدد الممر الآمن.",
          "وصل إلى قلب الجزيرة وعاد برفاقه سالمين من دون أن يفقد أحدًا."
        ]
      },
      "en": {
        "title": "🗺️ Abwalqmrzmrd and the Island of Seven Winds",
        "lead": "An adventure on an island whose paths constantly shift",
        "paragraphs": [
          "Abwalqmrzmrd led a voyage to an island whose paths changed with the winds.",
          "By watching trees and clouds, he discovered the wind cycle and found the safe route.",
          "He reached the island’s heart and brought everyone home safely."
        ]
      },
      "image": "assets/castle-tour/waterfalls.jpg",
      "serial": 2
    },
  {
      "ar": {
        "title": "⚓ أبوالقمرزمرد وحارس الميناء الأسود",
        "lead": "مواجهة غامضة لحماية مدينة ساحلية",
        "paragraphs": [
          "وصل أبوالقمرزمرد إلى ميناء كانت إشارات كاذبة تقود السفن إلى الخطر.",
          "تتبع الضوء إلى برج مهجور وكشف خدعة تستغل خوف البحارة.",
          "أعاد المنارة الحقيقية وعادت السفن إلى البحر بأمان."
        ]
      },
      "en": {
        "title": "⚓ Abwalqmrzmrd and the Guardian of the Black Harbor",
        "lead": "A mystery to protect a coastal city",
        "paragraphs": [
          "Abwalqmrzmrd found false lights guiding ships toward danger.",
          "He traced them to an abandoned tower and exposed the scheme behind them.",
          "The true lighthouse returned to service and the harbor became safe again."
        ]
      },
      "image": "assets/castle-tour/harbor.jpg",
      "serial": 3
    },
  {
      "ar": {
        "title": "💎 أبوالقمرزمرد وقلعة الزمرد الخفية",
        "lead": "رحلة بحث عن سر القلعة القديمة",
        "paragraphs": [
          "عثر أبوالقمرزمرد على خريطة تقوده إلى قلعة لا يظهر مدخلها إلا تحت ضوء القمر.",
          "حل ألغاز الأبواب حتى وصل إلى غرفة الكنوز، لكنه اختار سجلًا تاريخيًا بدل الجواهر.",
          "خرج وهو يدرك أن المعرفة قد تكون أثمن من الذهب والزمرد."
        ]
      },
      "en": {
        "title": "💎 Abwalqmrzmrd and the Hidden Emerald Castle",
        "lead": "A quest for the secret of an ancient fortress",
        "paragraphs": [
          "Abwalqmrzmrd followed an old map to a fortress revealed only by moonlight.",
          "He solved its riddles and reached a treasure chamber, choosing an ancient record instead of jewels.",
          "He left knowing that knowledge can be worth more than gold or emeralds."
        ]
      },
      "image": "assets/castle-tour/castle-entrance.webp",
      "serial": 4
    },
  {
      "ar": {
        "title": "🌙 أبوالقمرزمرد وسفينة الضباب",
        "lead": "مغامرة في البحر بين الشجاعة وحسن التدبير",
        "paragraphs": [
          "خرج أبوالقمرزمرد ليلًا حين غطى الضباب البحر، فسمع نداء استغاثة من قارب تائه قرب الصخور.",
          "قاد سفينته بضوء القمر واتجاه الريح حتى أنقذ الركاب ورسم لهم طريق العودة بالنجوم.",
          "عاد مع الفجر وقد أثبت أن البطولة شجاعة تعرف كيف تحمي الآخرين."
        ]
      },
      "en": {
        "title": "🌙 Abwalqmrzmrd and the Ship of Mist",
        "lead": "A sea adventure of courage and judgment",
        "paragraphs": [
          "Abwalqmrzmrd sailed through thick mist and heard a distress call near the rocks.",
          "Using moonlight and wind, he reached the stranded boat and guided its crew home by the stars.",
          "He returned at dawn having shown that true heroism protects others."
        ]
      },
      "image": "assets/castle-tour/moon-gallery.jpg",
      "serial": 5
    },
  {
      "ar": {
        "title": "🌙 أبوالقمرزمرد والتنين الفضي: سرّ الصحراء والقمر المفقود",
        "lead": "مغامرة مترابطة بين رمالٍ لا تهدأ، وتنينٍ فضي، وصقنقورٍ رملي، ونجمٍ زمردي يقود إلى القمر",
        "paragraphs": [
          "في ليلةٍ صافية، خرج أبوالقمرزمرد ليتفقد الطريق حول الواحة، فرأى السماء وقد خلت من القمر. لم تكن النجوم [...].",
          "وقبل أن يجمع أهل الواحة، سمعوا خفقان جناحين عظيمين فوق الجبال. هبط أمامهم تنينٌ فضي، وعلى إحدى جناحيه خ[...].",
          "لم يندفع أبوالقمرزمرد خلف التنين على عجل. طلب من أهل الواحة أن يثبتوا الخيام، ويغطوا الماء، ويربطوا ال�[...]."
        ]
      },
      "en": {
        "title": "🌙 Abwalqmrzmrd and the Silver Dragon: The Secret of the Desert and the Missing Moon",
        "lead": "An intertwined adventure across restless dunes, with a silver dragon, a sand skink, and an emerald star guiding the way to the moon",
        "paragraphs": [
          "On a clear night, Abwalqmrzmrd went to check the path around the oasis and saw that the moon was gone from the sky. [...].",
          "Before he could gather the people of the oasis, they heard the beat of enormous wings above the mountains. [...].",
          "Abwalqmrzmrd did not rush after the dragon. He asked the people to secure their tents, cover the water, and tie down their supplies. [...]."
        ]
      },
      "image": "سفينة القمر فوق المحيطอันว่างเปล่า.png",
      "serial": 6
    },
  {
      "ar": {
        "title": "💫 حلم لا ينتهي",
        "lead": "أحلام الإنسان لا تقرأ تقاويم العمر — تبتسم وتبكي في نفس الوقت",
        "paragraphs": [
          "ذات صباح قرّر رجل أن يبني قوس قزح في حديقته الصغيرة. جمع الأكواب والوسائد والشموع، ولكنّه نسى أن يسأل السماء عن الإذن فاستعان بجارٍ أعطاه سحابة ورق.",
          "تذكّر أن عمره محدود واطّلع على جدول حياته فوجد أن خانة \"الأحلام\" ممتلئة إلى ما بعد تقاعده. ضحك، ثم بكى قليلاً، لأن القلب رفض أن يوافق على ذلك الجدول.",
          "في النهاية، نام وهو يحلم بأن يواصل الحلم غدًا — لأنّ الأحلام لا تقرأ تاريخ الانتهاء، ولا تتوقف حتى لو توقف الجسم عن العدّ."
        ]
      },
      "en": {
        "title": "💫 An Endless Dream",
        "lead": "Human dreams don't check the calendar — they grin and sob at once",
        "paragraphs": [
          "One morning a man decided to build a rainbow in his tiny garden. He gathered cups, cushions and candles, but forgot to ask the sky for permission, so a neighbor lent him a paper cloud.",
          "He glanced at his life schedule and noticed the \"dreams\" column was booked well past his retirement. He laughed, then cried a little, because his heart refused to sign that timetable.",
          "At last he went to sleep dreaming he would keep dreaming tomorrow — because dreams don't read expiration dates, and they don't stop simply because the body does."
        ]
      },
      "image": "assets/castle-tour/moon-gallery.jpg",
      "serial": 7
    },
  {
      "ar": {
        "title": "🏔️ حكمة من سفح الجبل",
        "lead": "حكاية طريفة عن النجاة والحكمة التي لا تُنسى",
        "paragraphs": [
          "كان رجل يصعد سفح جبل برفقة ابنه، وكانا يتأملان جمال الطبيعة وروعة خلق الله؛ ينظران إلى المشاهد الخلابة ويتفكران في حسن صنع الكون.",
          "وفجأة زلّت قدم الابن وكاد يهوي من السفح، لكنه تدارك نفسه في اللحظة الأخيرة وتشبث بعضو والده الذكري، فنجا من السقوط.",
          "حمد الأب الله على نجاة ابنه، ثم قال له بحكمة مازحة لا تُنسى: «تذكّر يا بني، لو كنتَ مع أمك لما استطعتَ النجاة!»"
        ]
      },
      "en": {
        "title": "🏔️ A Lesson from the Mountain",
        "lead": "A humorous tale about survival and an unforgettable lesson",
        "paragraphs": [
          "A man was climbing a mountainside with his son. They paused to admire the beauty of nature and the wonder of God's creation, taking in the magnificent scenery and reflecting on the craftsmanship of the universe.",
          "Suddenly, the son's foot slipped and he nearly plunged down the slope. At the last moment, he caught himself by grabbing his father's penis, and that is how he escaped the fall.",
          "The father thanked God that his son was safe, then offered him a joking lesson he would never forget: “Remember, my son, if you had been with your mother, you wouldn't have been able to save yourself!”"
        ]
      },
      "image": "assets/castle-tour/gardens.jpg",
      "serial": 9
    }
];
function renderThoughts(){const en=document.documentElement.lang==='en',title=document.getElementById('folderTitle'),body=document.getElementById('folderBody'),modal=document.getElementById('folderModal');if(!body||!title||!modal)return;title.textContent=en?'Stories & Reflections':'القصص والخواطر';body.innerHTML='';const list=document.createElement('div');list.id=HOST_ID;stories.forEach(st=>{const card=document.createElement('article');card.className='storyCard';if(st.image){const img=document.createElement('img');img.src=st.image;img.alt=en?(st.en.title||'Story illustration'):(st.ar.title||'صورة القصة');img.loading='lazy';img.style.cssText='display:block;width:100%;height:150px;object-fit:cover;border-radius:9px;margin-bottom:10px';card.appendChild(img)}const h=document.createElement('div');h.className='storyTitle';h.textContent=en?st.en.title:st.ar.title;const lead=document.createElement('div');lead.className='storyLead';lead.textContent=en?st.en.lead:st.ar.lead;card.appendChild(h);card.appendChild(lead);const btn=document.createElement('button');btn.type='button';btn.textContent=en?'Read':'اقرأ';btn.addEventListener('click',()=>{const content=(en?st.en.paragraphs:st.ar.paragraphs).join('\n\n');const f=document.getElementById('folderBodyContent')||document.createElement('div');f.id='folderBodyContent';f.textContent='';f.style.whiteSpace='pre-wrap';f.textContent=content;modal.querySelector('.folderContent')?.replaceWith(f);});card.appendChild(btn);list.appendChild(card)});body.appendChild(list);modal.classList.add('show');modal.style.display='block'}
window.showKhwater=renderThoughts;
window.addKhwaterStory=function(story){if(!story||!story.ar||!story.en||!Array.isArray(story.ar.paragraphs)||!Array.isArray(story.en.paragraphs))return false;story.serial=Math.max(0,story.serial||0);stories.push(story);return true};
function ensureEbooksButton(){const main=document.querySelector('main');if(!main)return null;let b=document.getElementById(EBOOK_ID);if(!b){b=document.createElement('button');b.id=EBOOK_ID;b.type='button';b.textContent='📚 الكتب الإلكترونية';b.addEventListener('click',()=>{const ev=new Event('sak-open-ebooks');window.dispatchEvent(ev)});main.prepend(b)}return b}
function arrange(){const main=document.querySelector('main');if(!main)return;style();const ebookBtn=ensureEbooksButton();let host=document.getElementById(HOST_ID);if(!host){host=document.createElement('section');host.id=HOST_ID;main.appendChild(host)}
}
function lift(){['sakTextLibraryModal','folderModal','quizModal','puzzleModal','sakakerSiteNewsModal','sakBooksAppLayer'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement)el.parentElement.removeChild(el)})}
function init(){arrange();lift();document.addEventListener('click',e=>{const b=e.target?.closest?.('button,[role="button"],a');if(!b)return;const m=((b.dataset?.sakSection||'')+' '+(b.getAttribute('title')||'')+' '+(b.getAttribute('aria-label')||'')+' '+(b.textContent||'')).replace(/\s+/g,' ').trim();if(/كتب\s*إلكترونية|الكتب\s*الالكترونية|E-?Books?/i.test(m)){ensureEbooksButton().click()}if(/خواطر|قصص|Stories|Reflections/i.test(m)){showKhwater()}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

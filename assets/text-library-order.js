(()=>{
'use strict';
const HOST_ID='sakTextLibrarySections',SHIP_ID='sakShipStoryLibraryBtn',EBOOK_ID='sakEbooksLibraryBtn';
function classify(btn){const txt=(btn.textContent+' '+(btn.id||'')+' '+(btn.getAttribute('onclick')||'')).toLowerCase();if(/كتب إلكترونية|الكتب الالكترونية|ebooks?|ebook|sakebooks/.test(txt))return['ebooks',1];if(/ألغاز|الغاز|puzzle|riddle/.test(txt))return['puzzles',2];if(/اختبر معلوماتك|quiz/.test(txt))return['quiz',3];if(/معلومة اليوم|today fact|opentodayfact/.test(txt))return['today',4];if(/ثقافة عامة|general culture|openfolder\(4\)/.test(txt))return['culture',5];if(/خواطر وقصص|stories|openfolder\(1\)/.test(txt))return['stories',6];if(/تعريف بالموقع|about|openfolder\(5\)/.test(txt))return['about',7];if(/حكم وأمثال|wisdom/.test(txt))return['wisdom',8];if(btn.id===SHIP_ID||/محتوى السفينة|ship story/.test(txt))return['ship',9];return['other',50]}
function style(){if(document.getElementById('sakLibraryOrderStyle'))return;const s=document.createElement('style');s.id='sakLibraryOrderStyle';s.textContent=`#${HOST_ID}{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(170px,1fr))!important;gap:12px!important;margin-top:18px!important}#${HOST_ID}>button{min-height:64px!important;padding:13px 14px!important;border-radius:18px!important;color:#fff!important;font-weight:900!important;font-size:15px!important;box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 0 18px rgba(255,255,255,.05)!important}#${HOST_ID}>button[data-sak-section="ebooks"]{background:linear-gradient(145deg,#4a2500,#b66b00)!important;border:1px solid #ffd36a!important}#${HOST_ID}>button[data-sak-section="stories"]{background:linear-gradient(145deg,#5b1738,#a23d70)!important;border:1px solid #ff9ac5!important}#sakThoughtsStories{display:grid;gap:16px;max-width:860px;margin:16px auto;padding:4px 0 18px}#sakThoughtsStories .sak-story-card{border:1px solid rgba(120,255,230,.42);border-radius:20px;background:linear-gradient(145deg,rgba(6,38,43,.94),rgba(3,19,28,.97));color:#effffc;padding:20px;box-shadow:0 0 24px rgba(0,255,220,.14)}#sakThoughtsStories .sak-story-card h2{text-align:center;color:#e5fffa}#sakThoughtsStories .sak-story-note{text-align:center;color:#ffe18a;font-weight:900}html body #sakTextLibraryModal,html body #folderModal,html body #quizModal,html body #puzzleModal,html body #sakakerSiteNewsModal,html body #sakBooksAppLayer{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-width:none!important;max-height:none!important;z-index:2147483647!important;isolation:isolate!important;box-sizing:border-box!important;transform:none!important}html body #folderModal .panel,html body #quizModal .panel,html body #puzzleModal .panel,html body #sakTextLibraryModal .panel{position:relative!important;z-index:1!important;max-height:calc(100dvh - 20px)!important}@media(max-width:600px){#sakThoughtsStories .sak-story-card{padding:15px;border-radius:16px}}`;document.head.appendChild(s)}
const stories=[
  {
    "ar": {
      "title": "🌙 أبوالقمرزمرد والتنين الفضي: سرّ الصحراء والقمر المفقود",
      "lead": "مغامرة مترابطة بين رمالٍ لا تهدأ، وتنينٍ فضي، وصقنقورٍ رملي، ونجمٍ زمردي يقود إلى القمر",
      "paragraphs": [
        "في ليلةٍ صافية، خرج أبوالقمرزمرد ليتفقد الطريق حول الواحة، فرأى السماء وقد خلت من القمر. لم تكن النجوم وحدها كافيةً لتبدد الظلام؛ فقد اختفت العلامات الفضية التي اعتاد المسافرون أن يهتدوا بها، وبدأت ظلال الكثبان تتشابه حتى صار كل ممرٍ كأنه الطريق الصحيح.",
        "وقبل أن يجمع أهل الواحة، سمعوا خفقان جناحين عظيمين فوق الجبال. هبط أمامهم تنينٌ فضي، وعلى إحدى جناحيه خدشٌ طويل يلمع بضوءٍ خافت. قال التنين إن القمر لم ينطفئ، لكن ضوءه احتُجز خلف مرآةٍ سوداء في برجٍ مدفون تحت الصحراء، وإن عاصفةً جديدة ستطمر مدخل البرج إن تأخروا.",
        "لم يندفع أبوالقمرزمرد خلف التنين على عجل. طلب من أهل الواحة أن يثبتوا الخيام، ويغطوا الماء، ويربطوا الأمتعة، ثم اختار رفاقًا خفيفي الحمل يعرفون السير ليلًا. رسموا علاماتٍ على الطريق، واتفقوا أن يسيروا معًا وألا يبتعد أحدٌ عن الحبل الذي يصل أفراد المقدمة، كي لا تفرقهم الرمال إذا عادت العاصفة.",
        "وحين وصلوا إلى أول الكثبان، ظهر من الرمل صقنقورٌ رملي صغير بلون الرمال، يحمل على ظهره خطًا زمرديًا دقيقًا. لم يخف من التنين، بل دار حول أثرٍ غريب وقال إن الأرض تحت أقدامهم جوفاء قرب صخرةٍ مائلة. تبعه أبوالقمرزمرد بحذر، فوجدوا شقًا ضيقًا يهبط إلى ممرٍ قديم، وكانت على جدرانه رسومٌ لقمرٍ تحيط به نجوم خضراء.",
        "قادهم الصقنقور عبر الممرات المتعرجة؛ كان يلتقط اهتزاز الرمل قبل أن تنهار الحواف، ويشير بذيله إلى الحجارة الثابتة. أما التنين الفضي فكان يحمي المدخل من الريح، بينما حافظ أبوالقمرزمرد على نظام الرحلة: جرعات ماءٍ محسوبة، واستراحات قصيرة، وعلامة عند كل منعطف. وهكذا ضبطوا سيرهم في الصحراء بدل أن يحاولوا قهرها بالقوة.",
        "في عمق البرج وجدوا قاعةً مستديرة، تتوسطها مرآةٌ سوداء ضخمة تعلوها قطعة زجاجٍ معتمة. كان انعكاس القمر محبوسًا داخلها، وكلما ضربتها الريح من الخارج ازداد الظلام حولهم. وعلى قاعدة المرآة نقشٌ يقول إن الطريق لا يفتح لمن يطلب الضوء لنفسه، بل لمن يعيده إلى الجميع.",
        "أخرج أبوالقمرزمرد نجمًا زمرديًا صغيرًا كان قد وجده في خريطة القافلة القديمة. لم يكن حجرًا عاديًا؛ فقد أضاء حين اقترب من النقش، وكشف ثلاث نقاطٍ خفية حول القاعة. فهم أبوالقمرزمرد أن النجمة لا تكسر المرآة، بل تدل على مواضع تثبيتها. تسلق التنين إلى أعلى البرج، ودفع بكتفه دعامةً عالقة، بينما زحف الصقنقور في شقٍ ضيق ليحرر المزلاج الأخير.",
        "دارت المرآة ببطء، لكن القطعة المعتمة بقيت في مكانها. عندها استخدم التنين الفضي جناحه ليصد عاصفة الرمل المتدفقة من فتحة السقف، وثبت أبوالقمرزمرد النجم الزمردي في موضعه، فيما دفع الصقنقور المزلاج بذيله بكل قوته. انزاحت القطعة السوداء أخيرًا، وانطلق خيطٌ من ضوء القمر عبر القاعة، ثم صعد من البرج كأنه طريقٌ فضي يشق السماء.",
        "عاد القمر إلى مكانه، وامتلأت الصحراء بضوئه الهادئ. هدأت العاصفة، وظهرت المعالم من جديد: صخرة الواحة، وخط القافلة، والنخيل البعيد. أطلق التنين زئيرًا فرحًا، أما الصقنقور فاختفى لحظةً في الرمل ثم خرج قرب قدم أبوالقمرزمرد، كأنه يعلن أن المغامرة انتهت بسلام.",
        "عند الفجر عادوا إلى الواحة، لا يحملون كنزًا من الذهب، بل خريطةً للبرج وعلاماتٍ آمنةً للطريق. دوّن أبوالقمرزمرد ما حدث، وترك نسخةً لأهل الصحراء كي يعرف المسافرون كيف يتصرفون إذا ضاع ضوء القمر: يتعاونون، ويحفظون الماء، ويتبعون العلامات، ويصغون إلى خبرة الأرض. ومنذ تلك الليلة صار النجم الزمردي يظهر في الحكايات إلى جوار التنين الفضي، تذكيرًا بأن الشجاعة تزداد قوةً حين تسير مع الحكمة والرفقة."
      ]
    },
    "en": {
      "title": "🌙 Abwalqmrzmrd and the Silver Dragon: The Secret of the Desert and the Missing Moon",
      "lead": "An intertwined adventure across restless dunes, with a silver dragon, a sand skink, and an emerald star guiding the way to the moon",
      "paragraphs": [
        "On a clear night, Abwalqmrzmrd went to check the path around the oasis and saw that the moon was gone from the sky. The stars alone could not soften the darkness: the familiar silver landmarks had vanished, and the dunes cast such similar shadows that every passage looked like the right one.",
        "Before he could gather the people of the oasis, they heard the beat of enormous wings above the mountains. A silver dragon landed before them, a long scratch on one wing glowing faintly. The dragon said the moon had not gone dark; its light was trapped behind a black mirror in a tower buried beneath the desert. A new sandstorm would cover the tower’s entrance if they delayed.",
        "Abwalqmrzmrd did not rush after the dragon. He asked the people to secure their tents, cover the water, and tie down their supplies. Then he chose a small, lightly packed group who knew how to travel at night. They marked their route and agreed to stay together, keeping a guide rope between the front travelers so the sand could not scatter them if the storm returned.",
        "At the first dune, a small sand-colored skink emerged, a thin emerald line running along its back. It was not afraid of the dragon. It circled an unusual patch of ground and explained that the sand beneath them was hollow near a leaning rock. Abwalqmrzmrd followed carefully and found a narrow opening leading down to an old passage, its walls painted with a moon surrounded by green stars.",
        "The skink led them through the twisting tunnels. It sensed loose sand before the edges could collapse and pointed with its tail to firm stones. The silver dragon shielded the entrance from the wind while Abwalqmrzmrd kept the expedition in order: measured sips of water, short rests, and a marker at every turn. They learned to manage their journey through the desert instead of trying to overpower it.",
        "Deep inside the tower, they found a round chamber with a huge black mirror at its center and a dark glass piece above it. The moon’s reflection was trapped inside. Each gust from outside made the chamber darker. An inscription on the mirror’s base read: the way opens not for those who seek light for themselves, but for those who return it to everyone.",
        "Abwalqmrzmrd took out a small emerald star he had found on an old caravan map. It was no ordinary stone: as it neared the inscription, it glowed and revealed three hidden points around the chamber. He understood that the star was not meant to break the mirror, but to show where it should be secured. The dragon climbed to the top of the tower and pushed a jammed support, while the skink slipped through a narrow crack to release the final latch.",
        "The mirror began to turn, but the dark glass stayed in place. The silver dragon spread a wing to block the sandstorm rushing through an opening in the roof. Abwalqmrzmrd fixed the emerald star into its place, while the skink pushed the latch with all its strength. At last, the black piece shifted. A thread of moonlight crossed the chamber and rose from the tower like a silver road cutting through the sky.",
        "The moon returned to its place and filled the desert with its calm light. The storm eased, and familiar landmarks appeared again: the oasis rock, the caravan trail, and the distant palms. The dragon gave a joyful roar. The skink disappeared into the sand for a moment, then emerged beside Abwalqmrzmrd’s foot, as if to announce that the adventure had ended safely.",
        "At dawn they returned to the oasis with no gold, but with a map of the tower and safe markers for the route. Abwalqmrzmrd recorded what had happened and left a copy for the desert people, so travelers would know what to do if the moonlight disappeared: work together, protect the water, follow the markers, and listen to the land’s experience. From that night on, the emerald star appeared in stories beside the silver dragon—a reminder that courage grows stronger when it travels with wisdom and fellowship."
      ]
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
];
function renderThoughts(){const en=document.documentElement.lang==='en',title=document.getElementById('folderTitle'),body=document.getElementById('folderBody'),modal=document.getElementById('folderModal');if(title)title.textContent=en?'Thoughts & Stories':'خواطر وقصص';if(body){body.innerHTML='<div id="sakThoughtsStories"></div>';const host=body.firstElementChild;stories.forEach(st=>{const c=en?st.en:st.ar,a=document.createElement('article');a.className='sak-story-card';a.dir=en?'ltr':'rtl';a.innerHTML='<h2></h2><p class="sak-story-note"></p>';a.querySelector('h2').textContent=c.title;a.querySelector('.sak-story-note').textContent=c.lead;if(c.image){const figure=document.createElement('figure'),img=document.createElement('img');img.src=c.image;img.alt=typeof c.imageAlt==='string'?c.imageAlt:(c.imageAlt?.[en?'en':'ar']||c.title);img.loading='lazy';img.decoding='async';img.style.cssText='display:block;width:min(100%,760px);height:auto;margin:14px auto;border-radius:16px;border:1px solid rgba(120,255,230,.42)';figure.appendChild(img);a.appendChild(figure)}c.paragraphs.forEach(t=>{const p=document.createElement('p');p.textContent=t;a.appendChild(p)});host.appendChild(a)})}if(modal)modal.style.display='block'}
window.showKhwater=renderThoughts;
window.addKhwaterStory=function(story){if(!story||!story.ar||!story.en||!Array.isArray(story.ar.paragraphs)||!Array.isArray(story.en.paragraphs))return false;stories.unshift(story);if(document.getElementById('sakThoughtsStories'))renderThoughts();return true};
function ensureEbooksButton(){const main=document.querySelector('main');if(!main)return null;let b=document.getElementById(EBOOK_ID);if(!b){b=document.createElement('button');b.id=EBOOK_ID;b.type='button';b.dataset.sakSection='ebooks'}const en=document.documentElement.lang==='en';b.textContent=en?'📚 E-Books':'📚 الكتب الإلكترونية';b.title=en?'Open E-Books':'فتح الكتب الإلكترونية';b.setAttribute('aria-label',b.title);b.onclick=()=>{if(window.parent&&window.parent!==window)window.parent.postMessage({type:'sak-open-ebooks'},location.origin)};return b}
function arrange(){const main=document.querySelector('main');if(!main)return;style();const ebookBtn=ensureEbooksButton();let host=document.getElementById(HOST_ID);if(!host){host=document.createElement('div');host.id=HOST_ID;const h=main.querySelector('h1');(h||main.firstChild)?.after(host)}if(ebookBtn&&!ebookBtn.isConnected)host.appendChild(ebookBtn);const buttons=[...main.querySelectorAll('button')].filter(b=>b.id!=='back'&&!b.closest('.modal'));buttons.forEach((b,i)=>{const[k,r]=classify(b);b.dataset.sakSection=k;b.dataset.sakRank=r;b.dataset.sakIndex=i});buttons.sort((a,b)=>(+a.dataset.sakRank)-(+b.dataset.sakRank)||(+a.dataset.sakIndex)-(+b.dataset.sakIndex)).forEach(b=>host.appendChild(b))}
function lift(){['sakTextLibraryModal','folderModal','quizModal','puzzleModal','sakakerSiteNewsModal','sakBooksAppLayer'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement!==document.body)document.body.appendChild(el)})}
function init(){arrange();lift();document.addEventListener('click',e=>{const b=e.target?.closest?.('button,[role="button"],a');if(!b)return;const m=((b.dataset?.sakSection||'')+' '+(b.getAttribute('onclick')||'')+' '+b.textContent);if(/stories|openFolder\(1\)|خواطر\s*وقصص|Thoughts/i.test(m)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();renderThoughts()}},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
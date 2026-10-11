/* Visual Castle Museum: site-owned images + linked bilingual photo plaques.
   No private Drive images, no external trackers and no duplicate site content. */
(()=>{'use strict';
const root=document.getElementById('stage');
const rail=document.getElementById('museumRail');
if(!root||!rail||document.getElementById('sakExGuide'))return;
const base='/assets/castle-tour/';
const en=()=>String(document.documentElement.lang||'ar').startsWith('en');
const t=(a,b)=>en()?b:a;
const scene=(name)=>base+name+'.jpg';
const photos=[
{id:'castle-entrance',src:'/assets/castle-tour/castle-entrance.webp',ar:'بوابة المتحف الموحّد',en:'Unified Castle Museum',section:'photos',da:'لوحة الافتتاح الرئيسية المستخدمة في تصميم المتحف.',de:'Original illustrated entrance to the unified museum.'},
{id:'castle-gallery-wings',src:'/assets/castle-tour/castle-gallery-wings.webp',ar:'لوحات أجنحة المتحف',en:'Museum Wings',section:'books',da:'تصميم الأجنحة الإبداعية للكتب والألعاب والمعارض.',de:'Original illustrated pages for the museum’s books, games and exhibitions.'},
{id:'castle-gallery-services',src:'/assets/castle-tour/castle-gallery-services.webp',ar:'لوحات خدمات القلعة',en:'Castle Services Art',section:'news',da:'لوحة فنية تعرض أركان الثقافة والخدمات المتنوعة.',de:'Illustrated page showing culture, news and site services.'},
{id:'gate',src:scene('gate'),ar:'بوابة القلعة',en:'Castle Gate',section:'about',da:'مدخل القلعة في ليلة مضيئة.',de:'A moonlit entrance to the castle.'},
{id:'courtyard',src:scene('courtyard'),ar:'الساحة الملكية',en:'Royal Courtyard',section:'creative',da:'ممرات القلعة وأقواسها الملكية.',de:'Royal passages and illuminated arches.'},
{id:'gardens',src:scene('gardens'),ar:'حدائق القلعة',en:'Castle Gardens',section:'culture',da:'أزهار وحدائق وإطلالات على الماء.',de:'Flowers, gardens and peaceful water views.'},
{id:'waterfalls',src:scene('waterfalls'),ar:'الشلالات والجسور',en:'Waterfalls & Bridges',section:'videos',da:'شلالات ساحرة وسط الطبيعة.',de:'Waterfalls and nature around the castle.'},
{id:'great-hall',src:scene('great-hall'),ar:'القاعة الكبرى',en:'Grand Hall',section:'books',da:'داخل القلعة والثريات الذهبية.',de:'The castle interior with golden chandeliers.'},
{id:'throne-room',src:scene('throne-room'),ar:'قاعة العرش',en:'Throne Room',section:'chess',da:'عرش زمردي ونقوش كلاسيكية.',de:'Emerald throne and classical details.'},
{id:'moon-gallery',src:scene('moon-gallery'),ar:'الرواق الداخلي',en:'Moon Gallery',section:'stories',da:'إطلالات هادئة من رواق القصر.',de:'A quiet gallery overlooking the sea.'},
{id:'balcony',src:scene('balcony'),ar:'شرفة القمر',en:'Moon Balcony',section:'maps',da:'أفق القمر ومشاهد الجبال.',de:'Moonlit horizons and mountain views.'},
{id:'harbor',src:scene('harbor'),ar:'ميناء القلعة',en:'Castle Harbor',section:'live',da:'السفن والبحر على ضوء القمر.',de:'Ships and moonlit sea waters.'},
{id:'storyart',src:'/Screenshot_٢٠٢٦١٠٠٦-١٧٤٢٠٧_1.png',ar:'لوحة قصص الموقع',en:'Site Story Artwork',section:'stories',da:'صورة من أرشيف القصص المنشور في الموقع.',de:'Artwork from the website’s published story archive.'},
{id:'emblem',src:'/file_00000000e530821086e1b6135c3db20e.png',ar:'لوحة من أرشيف الموقع',en:'Site Archive Artwork',section:'photos',da:'عمل بصري محفوظ ضمن صور الموقع.',de:'Visual artwork in the public site collection.'},
{id:'ship',src:'/سفينة القمر فوق المحيطอันว่างเปล่า.png',ar:'سفينة القمر',en:'Moonlit Ship',section:'videos',da:'مشهد بحري من معرض الموقع.',de:'Marine artwork from the site gallery.'},
{id:'favicon',src:'/favicon.svg',ar:'شعار الموقع',en:'Website Emblem',section:'about',da:'الرمز البصري المنشور للموقع.',de:'The visual emblem published on the site.'}
];
const sections=[
{id:'tour',emoji:'🏰',ar:'جولة القلعة',en:'Castle Tour',descAr:'استكشف القلعة بالفيديوهات والمشاهد الخارجية والداخلية المتتابعة دون توقف.',descEn:'Enjoy the endlessly looping interior and exterior castle tour.',img:'gate',tag:'site'},
{id:'chat',emoji:'💬',ar:'الدردشة والتواصل',en:'Chat & Community',descAr:'انتقل إلى قسم التفاعل والدردشة بين زوار الموقع عند توفره.',descEn:'Visit the community chat and social interactions when available.',img:'moon-gallery',tag:'site'},
{id:'payment',emoji:'💳',ar:'الدفع والدعم',en:'Payments & Support',descAr:'اطلع على خيارات الدفع والدعم الموجودة في الموقع.',descEn:'Review the payment and support options available on the website.',img:'throne-room',tag:'shop'},
{id:'holidays',emoji:'✨',ar:'مناسبات وعدّادات',en:'Holidays & Countdowns',descAr:'راجع عدّادات رأس السنة والمناسبات في الصفحة الرئيسية.',descEn:'View the site’s New Year and seasonal countdowns.',img:'gardens',tag:'site'},
{id:'home',emoji:'🏠',ar:'الصفحة الرئيسية',en:'Home',descAr:'عد إلى الواجهة الرئيسية للوصول إلى جميع أيقونات الموقع.',descEn:'Return to the main site dashboard and its icons.',img:'courtyard',tag:'site'},
{id:'photos',emoji:'🖼️',ar:'المعرض الكامل للصور',en:'Complete Photo Gallery',descAr:'شاهد جميع الصور واللوحات المنشورة بالقلعة والموقع مع نبذة لكل صورة.',descEn:'Browse all published castle and site artwork with picture descriptions.',img:'great-hall',tag:'site'},
{id:'film',emoji:'🎬',ar:'الفيلم الفني للقلعة',en:'Castle Art Film',descAr:'شاهد الفيلم الفني القصير مع صوت البحر والطيور داخل المتحف.',descEn:'Watch the short castle art film with sea and bird sounds.',img:'gate',tag:'media'},
{id:'stories',emoji:'📜',ar:'القصص والخواطر',en:'Stories & Reflections',descAr:'حكايات ومغامرات وخواطر أدبية؛ استكشف النصوص والتسلسل داخل الموقع.',descEn:'Literary adventures, stories and reflections available on the website.',img:'moon-gallery',tag:'knowledge'},
{id:'books',emoji:'📚',ar:'المكتبة النصية والكتب',en:'Books & Text Library',descAr:'اقرأ الكتب والنصوص الإلكترونية والمحتوى المعرفي من المكتبة.',descEn:'Discover ebooks, texts and reading collections from the library.',img:'great-hall',tag:'knowledge'},
{id:'videos',emoji:'🎞️',ar:'مكتبة الفيديو',en:'Video Library',descAr:'مكتبة الأفلام والوثائقيات والمقاطع المصنّفة في صفحة واحدة.',descEn:'Browse the categorized films, documentaries and curated videos.',img:'waterfalls',tag:'media'},
{id:'videoFilms',to:'videos',emoji:'🎥',ar:'الأفلام والكرتون',en:'Films & Cartoons',descAr:'استعرض قسم الأفلام والرسوم المتحركة داخل مكتبة الفيديو.',descEn:'Find movie and animation categories in the video library.',img:'courtyard',tag:'media'},
{id:'videoSports',to:'videos',emoji:'🏅',ar:'الرياضة',en:'Sports',descAr:'شاهد مختارات المحتوى الرياضي من مكتبة الفيديو.',descEn:'Sports selections from the site video library.',img:'harbor',tag:'media'},
{id:'videoDocs',to:'videos',emoji:'🌍',ar:'الوثائقيات',en:'Documentaries',descAr:'رحلات ومعارف وأفلام وثائقية ضمن أقسام المكتبة.',descEn:'Educational and documentary collections in the video library.',img:'balcony',tag:'media'},
{id:'live',emoji:'📺',ar:'القنوات المباشرة والراديو',en:'Live TV & Radio',descAr:'تابع القنوات والإذاعات والروابط المباشرة المتوفرة.',descEn:'Explore available live channels, radio and streaming links.',img:'harbor',tag:'media'},
{id:'music',emoji:'🎹',ar:'الموسيقى والاستديو',en:'Music Studio',descAr:'أدوات الاستديو والمحتوى الموسيقي داخل الموقع.',descEn:'Music and studio tools available within the website.',img:'gardens',tag:'media'},
{id:'audioVideo',emoji:'🎬',ar:'تحويل الصوت والصور',en:'Audio & Image Tools',descAr:'أدوات إنشاء الفيديو ومزج الصوت والصور.',descEn:'Tools for assembling videos from audio and images.',img:'courtyard',tag:'creative'},
{id:'creative',emoji:'🎨',ar:'الرسم والإبداع',en:'Creative Drawing',descAr:'افتح استديو الرسم والتصميم والأدوات الإبداعية.',descEn:'Open the drawing and creative-design studio.',img:'gardens',tag:'creative'},
{id:'games',emoji:'🎮',ar:'بوابة الألعاب',en:'Games Hub',descAr:'اختر تجربة الألعاب والترفيه الموجودة في القلعة.',descEn:'Enter the website’s games and interactive entertainment.',img:'throne-room',tag:'entertainment'},
{id:'chess',emoji:'♟️',ar:'لعبة الشطرنج',en:'Chess',descAr:'جرّب الشطرنج ومستويات اللعب المتوفرة.',descEn:'Explore chess with its available game levels.',img:'throne-room',tag:'entertainment'},
{id:'pong',emoji:'🏓',ar:'لعبة البونج',en:'Pong',descAr:'العب البونج واستكشف خيارات اللعب والتحدي.',descEn:'Play Pong and explore the available challenge options.',img:'courtyard',tag:'entertainment'},
{id:'riddles',emoji:'🧩',ar:'الألغاز',en:'Riddles',descAr:'أسئلة وألغاز للتفكير وحل التحديات.',descEn:'Riddles and challenges for curious visitors.',img:'gate',tag:'knowledge'},
{id:'quiz',emoji:'🧠',ar:'اختبر معلوماتك',en:'Knowledge Quiz',descAr:'اختبر معلوماتك في الأسئلة والاختيارات التفاعلية.',descEn:'Test your knowledge with interactive questions.',img:'great-hall',tag:'knowledge'},
{id:'culture',emoji:'🏛️',ar:'الثقافة والمعرفة',en:'Culture & Knowledge',descAr:'موضوعات ثقافية وعلمية ومعرفية من محتوى الموقع.',descEn:'Cultural, scientific and educational site content.',img:'moon-gallery',tag:'knowledge'},
{id:'news',emoji:'📰',ar:'أخبار الموقع',en:'Site News',descAr:'تابع الأخبار والتنبيهات والمستجدات المنشورة.',descEn:'Read site news, announcements and updates.',img:'gate',tag:'site'},
{id:'facebook',emoji:'🌐',ar:'فيس بوك',en:'Facebook',descAr:'اطلع على المشاركات والمقاطع المضمّنة من فيس بوك.',descEn:'View embedded Facebook posts and video content.',img:'harbor',tag:'site'},
{id:'maps',emoji:'🧭',ar:'الخرائط',en:'Maps',descAr:'انتقل إلى نافذة الخرائط والمواقع المتاحة.',descEn:'Explore maps and available locations.',img:'balcony',tag:'site'},
{id:'visitors',emoji:'🕊️',ar:'مشاركات الزوار',en:'Visitor Posts',descAr:'اقرأ منشورات الزوار والمشاركات المعتمدة.',descEn:'Read visitor contributions and approved submissions.',img:'gardens',tag:'site'},
{id:'shopping',emoji:'🛍️',ar:'التسوق والعروض',en:'Shopping & Offers',descAr:'استعرض روابط المتاجر والعروض الموجودة بالموقع.',descEn:'Visit the site’s shopping links and available offers.',img:'courtyard',tag:'shop'},
{id:'about',emoji:'🏰',ar:'التعريف بالموقع',en:'About the Site',descAr:'تعرف إلى القلعة وفكرة الموقع وأقسامه.',descEn:'Learn about the castle, the website and its sections.',img:'gate',tag:'site'}
];
const get=(id)=>sections.find(s=>s.id===id);
const text=(a,b)=>t(a,b);
function el(tag,cls,textValue){const n=document.createElement(tag);if(cls)n.className=cls;if(textValue!=null)n.textContent=textValue;return n}
function picture(src,alt,lazy=true){const img=document.createElement('img');img.src=src;img.alt=alt;img.loading=lazy?'lazy':'eager';img.decoding='async';img.addEventListener('error',()=>{if(!img.dataset.fallback){img.dataset.fallback='1';img.src=scene('gate')}});return img}
const guide=el('div');guide.id='sakExGuide';guide.setAttribute('aria-label','معرض القلعة التفاعلي / Castle museum');
const featured=el('div');featured.id='sakExFeatured';
const browse=el('button',null,'🖼️ '+text('تصفّح جميع لوحات المتحف','Browse the museum exhibits'));
browse.id='sakExBrowse';browse.type='button';
guide.append(browse,featured);root.append(guide);
const gallery=el('section');gallery.id='sakExGallery';gallery.setAttribute('role','dialog');gallery.setAttribute('aria-modal','true');gallery.setAttribute('aria-labelledby','sakExHeading');
const header=el('header','sak-ex-hdr');const heading=el('h2',null,text('متحف القلعة | لوحات الموقع','Castle Museum | Site Gallery'));heading.id='sakExHeading';
const close=el('button','sak-ex-x','✕');close.type='button';close.setAttribute('aria-label',text('إغلاق','Close'));header.append(heading,close);
const body=el('div');body.id='sakExGalleryBody';
const cover=el('div','sak-ex-cover');
const coverImg=picture('/assets/castle-tour/castle-entrance.webp',t('بوابة جولة القلعة','Castle museum entrance'),false);
const coverAction=el('button','sak-ex-cover-action',t('استكشف جميع الأقسام','Explore all sections'));coverAction.type='button';
coverAction.addEventListener('click',()=>document.getElementById('sakExSearch')?.focus());
cover.append(coverImg,coverAction);
body.append(cover);
const intro=el('p','sak-ex-intro');
const tabs=el('div','sak-ex-tabs');
const input=el('input');input.id='sakExSearch';input.type='search';input.autocomplete='off';input.placeholder=text('ابحث عن قسم أو صورة...','Search sections or pictures...');
input.setAttribute('aria-label',input.placeholder);
const list=el('div');body.append(intro,tabs,input,list);gallery.append(header,body);root.append(gallery);
const light=el('section');light.id='sakExLightbox';light.setAttribute('role','dialog');light.setAttribute('aria-modal','true');
const lightImg=picture(scene('gate'),'',false);const lightCaption=el('div');lightCaption.id='sakExLightCaption';
const lightButtons=el('div','sak-ex-light-actions');const prev=el('button',null,'❮');const next=el('button',null,'❯');const done=el('button',null,'✕');
[prev,next,done].forEach(b=>{b.type='button'});done.setAttribute('aria-label',text('إغلاق الصورة','Close picture'));
lightButtons.append(prev,done,next);light.append(lightImg,lightCaption,lightButtons);root.append(light);
let filter='all',query='',currentPhoto=0,open=false,lastFocus=null,featuredIndex=0;
const filters=[['all','جميع اللوحات','All exhibits'],['photos','معرض الصور','Picture gallery'],['sections','أقسام الموقع','Site sections'],['knowledge','الثقافة والكتب','Knowledge'],['media','الفيديو والصوت','Video & Audio'],['entertainment','الألعاب','Games'],['site','الخدمات','Services']];
function visit(id){
  const sec=get(id),key=sec?.to||id;
  if(key==='tour'){closeGallery();return}
  if(key==='home'){if(window.parent!==window)window.parent.postMessage({type:'sak-castle-close'},location.origin);else location.assign('/');return}
  if(key==='film'){closeGallery(false);rail.querySelector('.museumTile')?.click();return}
  if(key==='photos'){filter='photos';openGallery();return}
  if(window.parent!==window){
    window.parent.postMessage({type:'sak-castle-open-section',section:key},location.origin);
    return;
  }
  const routes={books:'/books.html',videos:'/videos.html',live:'/live.html',pong:'/pong.html',games:'/pong.html',creative:'/draw.html',audioVideo:'/audio-video.html',about:'/',payment:'/'};
  if(routes[key])location.assign(routes[key]);else location.assign('/');
}
function panel(image,title,description,emoji,onVisit,onPreview){
 const card=el('article','sak-ex-panel');const art=el('div','sak-ex-art');
 art.append(picture(image,title));if(emoji)art.append(el('span','sak-ex-emblem',emoji));
 const copy=el('div','sak-ex-copy');copy.append(el('h3',null,title),el('p',null,description));
 const actions=el('div','sak-ex-actions');const go=el('button','sak-ex-go',text('زيارة القسم ←','Visit section →'));go.type='button';go.addEventListener('click',onVisit);
 const preview=el('button','sak-ex-preview',text('معاينة الصورة','View artwork'));preview.type='button';preview.addEventListener('click',onPreview);
 actions.append(go,preview);copy.append(actions);card.append(art,copy);return card;
}
function photoCard(p,index){
 const sec=get(p.section);
 const title=text(p.ar,p.en),desc=text(p.da,p.de)+' '+text('ومن اللوحة يمكنك زيارة ', 'From this artwork visit ')+(sec?text(sec.ar,sec.en):text('القسم','the section'))+'.';
 return panel(p.src,title,desc,sec?.emoji||'🖼️',()=>visit(p.section),()=>openPhoto(index));
}
function sectionCard(s){
 const index=photos.findIndex(p=>p.section===(s.to||s.id));
 const caption=text(s.ar,s.en);
 return panel(scene(s.img),caption,text(s.descAr,s.descEn),s.emoji,()=>visit(s.id),()=>openPhoto(index>=0?index:photos.findIndex(p=>p.id===s.img)));
}
function hasQuery(ar,en2,descA,descE){if(!query)return true;return [ar,en2,descA,descE].join(' ').toLowerCase().includes(query.toLowerCase())}
function sectionTitle(txt){return el('h3','sak-ex-sectiontitle',txt)}
function render(){
 if(!open)return;
 heading.textContent=text('متحف القلعة | لوحات الموقع','Castle Museum | Site Gallery');
 close.setAttribute('aria-label',text('إغلاق','Close'));
 intro.textContent=text('كل لوحة باب تفاعلي إلى قسم من الموقع. يمكنك تصفح كل اللوحات بحرية دون حد زمني، وزيارة الأقسام مباشرة.', 'Every artwork is a live doorway to a website section. Browse at your pace without a time limit.');
 coverImg.alt=text('اللوحة الأصلية لافتتاح متحف القلعة','Original illustrated Castle Museum cover');
 coverAction.textContent=text('استكشف جميع الأقسام','Explore all sections');
 input.placeholder=text('ابحث عن قسم أو صورة...','Search sections or pictures...');
 tabs.replaceChildren();filters.forEach(([id,ar,en2])=>{const b=el('button','sak-ex-tab',text(ar,en2));b.type='button';b.setAttribute('aria-pressed',String(filter===id));b.addEventListener('click',()=>{filter=id;render()});tabs.append(b)});
 list.replaceChildren();let found=false;
 const showPics=filter==='all'||filter==='photos';
 if(showPics){const matches=photos.map((p,i)=>({p,i})).filter(({p})=>hasQuery(p.ar,p.en,p.da,p.de));
 if(matches.length){found=true;list.append(sectionTitle(text('اللوحات والصور المنشورة • '+photos.length,'Published artwork • '+photos.length)));const grid=el('div','sak-ex-grid');matches.forEach(({p,i})=>grid.append(photoCard(p,i)));list.append(grid)}}
 const eligible=sections.filter(s=>(filter==='all'||filter==='sections'||s.tag===filter)&&hasQuery(s.ar,s.en,s.descAr,s.descEn));
 if(eligible.length){found=true;list.append(sectionTitle(text('لوحات الأقسام • '+eligible.length,'Section signboards • '+eligible.length)));const grid=el('div','sak-ex-grid');eligible.forEach(s=>grid.append(sectionCard(s)));list.append(grid)}
 if(!found)list.append(el('div','sak-ex-empty',text('لم نجد نتائج مطابقة. جرّب البحث بكلمة أخرى.','No matching exhibits. Try a different search.')));
}
function pause(){try{window.SakCastleMuseum?.pause?.()}catch{}}
function resume(){try{window.SakCastleMuseum?.resume?.()}catch{}}
function openGallery(){
 if(!open){lastFocus=document.activeElement;open=true;gallery.classList.add('sak-ex-open');pause()}
 render();body.scrollTop=0;close.focus();
}
function closeGallery(shouldResume=true){
 open=false;gallery.classList.remove('sak-ex-open');query='';input.value='';if(shouldResume)resume();
 if(lastFocus&&lastFocus.isConnected&&typeof lastFocus.focus==='function')lastFocus.focus();
}
function openPhoto(index){
 currentPhoto=Math.max(0,index)%photos.length;light.classList.add('sak-ex-open');showPhoto();done.focus();
}
function showPhoto(){
 const p=photos[currentPhoto];
 lightImg.src=p.src;lightImg.alt=text(p.ar,p.en);lightCaption.textContent=text(p.ar,p.en)+' · '+(currentPhoto+1)+' / '+photos.length;
 done.setAttribute('aria-label',text('إغلاق الصورة','Close picture'));
}
function closePhoto(){light.classList.remove('sak-ex-open');if(open)close.focus()}
function renderFeatured(){
 featured.replaceChildren();
 const choices=[sections[featuredIndex%sections.length],sections[(featuredIndex+1)%sections.length]];
 choices.forEach(s=>{
  const card=el('div','sak-ex-spot');card.append(picture(scene(s.img),text(s.ar,s.en),false));
  const info=el('div','sak-ex-spot-info');info.append(el('strong',null,s.emoji+' '+text(s.ar,s.en)),el('p',null,text(s.descAr,s.descEn)));
  const button=el('button',null,text('ادخل القسم ←','Visit section →'));button.type='button';button.addEventListener('click',()=>visit(s.id));info.append(button);card.append(info);featured.append(card);
 });
 browse.textContent='🖼️ '+text('استكشف لوحات القلعة وأقسام الموقع','Explore artwork and site sections');
}
browse.addEventListener('click',()=>{filter='all';openGallery()});close.addEventListener('click',()=>closeGallery());input.addEventListener('input',()=>{query=input.value.trim();render()});
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='sak-castle-open-error'||!open)return;
 intro.textContent=text('هذا القسم غير متاح حاليًا من هذه النافذة. يمكنك العودة إلى الصفحة الرئيسية وزيارته عند توفره.','This section is not available through the current site launcher. Please visit the home page when it becomes available.');
 intro.setAttribute('role','status');
 body.scrollTop=0;
});
prev.addEventListener('click',()=>{currentPhoto=(currentPhoto-1+photos.length)%photos.length;showPhoto()});next.addEventListener('click',()=>{currentPhoto=(currentPhoto+1)%photos.length;showPhoto()});done.addEventListener('click',closePhoto);
light.addEventListener('click',e=>{if(e.target===light)closePhoto()});
window.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(light.classList.contains('sak-ex-open')){e.stopPropagation();closePhoto()}else if(open){e.stopPropagation();closeGallery()}}
 if(light.classList.contains('sak-ex-open')&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){currentPhoto=(currentPhoto+(e.key==='ArrowLeft'?-1:1)+photos.length)%photos.length;showPhoto()}
},true);
new MutationObserver(()=>{renderFeatured();if(open)render();if(light.classList.contains('sak-ex-open'))showPhoto()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
const sceneTitle=document.getElementById('sceneTitle');if(sceneTitle)new MutationObserver(()=>{featuredIndex=(featuredIndex+2)%sections.length;renderFeatured()}).observe(sceneTitle,{childList:true,characterData:true,subtree:true});
// The original approved artwork opens the tour; the existing cinematic loop continues behind it.
const opening=el('div','sak-ex-opening');
opening.id='sakExOpening';
opening.append(picture('/assets/castle-tour/castle-entrance.webp',text('بوابة جولة القلعة','Castle Tour opening'),false));
const openingSkip=el('button','sak-ex-opening-skip',text('استكشف المتحف ←','Explore the museum →'));
openingSkip.type='button';
let introTimer;
function finishOpening(showGallery=false){
 if(!opening.isConnected)return;
 clearTimeout(introTimer);
 opening.classList.add('sak-ex-opening-hide');
 setTimeout(()=>opening.remove(),500);
 if(showGallery){filter='all';openGallery();}
}
openingSkip.addEventListener('click',()=>finishOpening(true));
root.append(opening);
introTimer=setTimeout(()=>finishOpening(false),window.matchMedia('(prefers-reduced-motion:reduce)').matches?2200:7500);
const oldClose=gallery.querySelector('.sak-ex-x');
if(oldClose)oldClose.addEventListener('click',()=>finishOpening(false));
renderFeatured();document.body.classList.add('sak-ex-ready');
})();
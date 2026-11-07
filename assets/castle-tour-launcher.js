/* SAKAKER — standalone Castle Tour launcher.
   Intentionally independent of the horizontally scrollable icon dock. */
(()=>{'use strict';
const ID='sakCastleTourBtn', STYLE='sakCastleTourButtonStyle', OVERLAY='sakCastleTourOverlay';
const english=()=>String(document.documentElement.lang||'ar').toLowerCase().startsWith('en');
function installStyle(){
  if(document.getElementById(STYLE))return;
  const style=document.createElement('style');
  style.id=STYLE;
  style.textContent=[
    /* Existing Castle Tour icon: top-center, directly above the festive/visitor row. */
    'html body #sakCastleTourBtn{position:relative!important;inset:auto!important;display:flex!important;flex:0 0 auto!important;align-items:center!important;justify-content:center!important;width:72px!important;min-width:72px!important;max-width:72px!important;height:78px!important;min-height:78px!important;max-height:78px!important;margin:8px auto 4px!important;padding:0!important;transform:none!important;translate:none!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important;background:transparent!important;background-color:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;filter:none!important;clip-path:none!important;z-index:40!important;}',
    'html body #sakCastleTourBtn::before,html body #sakCastleTourBtn::after{content:none!important;display:none!important;}',
    'html body #sakCastleTourBtn .sak-ostrich-art,html body #sakCastleTourBtn .sak-ostrich-name{background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}',
    'html body #sakCastleTourBtn .sak-ostrich-art{filter:drop-shadow(0 0 5px #ffeeb2) drop-shadow(0 0 12px #ffc42b)!important;}',
    /* Symbol-only launcher. Preserve an accessible name on the button itself. */
    'html body #sakCastleTourBtn .sak-ostrich-name{display:none!important;visibility:hidden!important;pointer-events:none!important;}',
    '@media(max-width:600px){html body #sakCastleTourBtn{width:64px!important;min-width:64px!important;height:70px!important;min-height:70px!important;margin:6px auto 3px!important;}}',
    'body.locked #sakCastleTourBtn,body.sak-ebook-layer-open #sakCastleTourBtn,body.sakaker-fb-popup-open #sakCastleTourBtn{visibility:hidden!important;pointer-events:none!important;}',
    '#sakCastleTourBtn:focus-visible{outline:2px solid #ffe68a!important;outline-offset:3px!important;}',
    '@media(prefers-reduced-motion:reduce){#sakCastleTourBtn .sak-ostrich-art{animation:none!important;}}'
  ].join('\n');
  document.head.appendChild(style);
}
function sanitizeName(name){
  return String(name||'').replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,70);
}
function openTour(){
  if(document.body?.classList.contains('locked')||document.getElementById(OVERLAY))return;
  const previousFocus=document.activeElement;
  const previousHtmlOverflow=document.documentElement.style.overflow;
  const previousBodyOverflow=document.body.style.overflow;
  const mainVideo=document.getElementById('sakSiteBackgroundVideo');
  const mainWasPlaying=!!mainVideo&&!mainVideo.paused;
  if(mainWasPlaying)mainVideo.pause();
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';
  const host=document.createElement('section');
  host.id=OVERLAY;
  host.setAttribute('role','dialog');
  host.setAttribute('aria-modal','true');
  host.setAttribute('aria-label',english()?'Castle Tour':'جولة القلعة');
  host.style.cssText='position:fixed!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:clamp(6px,2vw,22px)!important;margin:0!important;z-index:2147483646!important;background:rgba(1,10,18,.83)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;overflow:hidden!important;';
  const loader=document.createElement('div');
  loader.id='sakCastleTourLoading';
  loader.setAttribute('role','status');
  loader.setAttribute('aria-live','polite');
  loader.style.cssText='position:absolute;inset:0;z-index:2;display:grid;place-items:center;padding:20px;background:rgba(2,12,19,.9);color:#fff0b8;font:800 16px/1.7 Tahoma,Arial,sans-serif;text-align:center;';
  loader.innerHTML='<div><span aria-hidden="true" style="display:block;width:38px;height:38px;margin:0 auto 12px;border:4px solid rgba(255,232,160,.25);border-top-color:#ffe27a;border-radius:50%;animation:sakCastleTourSpin .8s linear infinite"></span>'+(english()?'Loading the castle tour…':'جارٍ تحميل جولة القلعة…')+'</div>';
  if(!document.getElementById('sakCastleTourLoadingStyle')){
    const style=document.createElement('style');style.id='sakCastleTourLoadingStyle';
    style.textContent='@keyframes sakCastleTourSpin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){#sakCastleTourLoading span{animation:none!important}}';
    document.head.appendChild(style);
  }
  host.appendChild(loader);
  const frame=document.createElement('iframe');
  frame.src='/castle-tour.html?v=20261011-30scenes';
  frame.title='جولة القلعة / Castle Tour';
  frame.allow='autoplay';
  frame.style.cssText='display:block;flex:0 1 auto;width:min(1120px,100%)!important;height:min(92dvh,880px)!important;max-height:calc(100dvh - 12px)!important;min-height:0!important;border:2px solid rgba(255,223,147,.78)!important;border-radius:clamp(14px,2.5vw,24px)!important;background:#06151c!important;box-shadow:0 24px 85px #000d,0 0 26px rgba(65,222,204,.22)!important;overflow:hidden!important;';
  host.appendChild(frame);
  document.body.appendChild(host);
  let finished=false;
  const sendGreeting=()=>{
    if(finished||!frame.contentWindow)return;
    const user=window.firebaseAuth?.currentUser;
    const name=sanitizeName(user?.displayName||user?.providerData?.find(p=>p?.displayName)?.displayName||'');
    frame.contentWindow.postMessage({type:'sak-castle-greeting',name,lang:english()?'en':'ar'},location.origin);
  };
  const close=()=>{
    if(finished)return;
    finished=true;
    window.removeEventListener('message',onMessage);
    document.removeEventListener('keydown',onKey);
    host.remove();
    document.documentElement.style.overflow=previousHtmlOverflow;
    document.body.style.overflow=previousBodyOverflow;
    if(mainWasPlaying&&mainVideo&&!document.body.classList.contains('locked'))mainVideo.play().catch(()=>{});
    if(previousFocus?.isConnected&&typeof previousFocus.focus==='function')previousFocus.focus();
  };
  const onMessage=e=>{
    if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data)return;
    if(e.data.type==='sak-castle-ready')sendGreeting();
    if(e.data.type==='sak-castle-close')close();

    if(e.data.type==='sak-castle-open-section'){
      const key=String(e.data.section||'');
      const selectors={
        books:'#sakTextLibraryButton,#sakTextLibraryBtn',
        videos:'#emeraldLibraryButton',
        live:'#liveFlasher',
        games:'#sakEntertainmentStationBtn,#pongGame-btn',
        chess:'#sakEmeraldChessIcon',
        pong:'#pongGame-btn',
        creative:'#sakCreativeIcon',
        music:'#emOpenBtn',
        maps:'#mapIcon,.launcher[data-map]',
        visitors:'#visitorPostsCard',
        shopping:'#sakShoppingIcon',
        news:'#sakNewsLaunch',
        facebook:'#facebookVideoIcon',
        chat:'#sakChatOpenBtn,#sakChatLauncher,#sakChatBtn',
        payment:'#sakGlobalPayment button,#sakGlobalPayment [role="button"],#sakPayPalButton'
      };
      const route={books:'/books.html',videos:'/videos.html',live:'/live.html',games:'/pong.html',pong:'/pong.html',creative:'/draw.html',audioVideo:'/audio-video.html',about:'/'};
      if(key==='tour')return;
      if(key==='home'){close();return}
      if(key==='holidays'){
        close();
        setTimeout(()=>document.querySelector('#sakHolidayCountdowns,#sakFestiveHeader')?.scrollIntoView({block:'center',behavior:'smooth'}),140);
        return;
      }
      if(!['books','videos','live','games','chess','pong','music','audioVideo','creative','maps','visitors','shopping','stories','culture','riddles','quiz','news','facebook','about','chat','payment'].includes(key))return;
      let target=selectors[key]?document.querySelector(selectors[key]):null;
      if(!target){
        const phrases={
          books:/المكتبة\s*النصية|Text\s*Library|الكتب\s*الإلكترونية/i,
          stories:/خواطر|قصص|Stories|Reflections/i,
          maps:/الخرائط|Maps/i,
          visitors:/مشاركات\s*الزوار|Visitor\s*Posts/i,
          shopping:/التسوق\s*والعروض|Shopping|Offers/i,
          chess:/الشطرنج|Chess/i,
          pong:/البونج|Pong/i,
          music:/الموسيقى|Music|تحويل\s*الصوت/i,
          culture:/ثقافة|Culture|معرفة|Knowledge/i,
          riddles:/ألغاز|Riddles|Puzzle/i,
          quiz:/اختبر\s*معلوماتك|Quiz|Test\s*Your\s*Knowledge/i,
          news:/الأخبار|أخبار\s*الموقع|News/i,
          facebook:/فيس\s*بوك|Facebook/i,
          about:/تعريف|About/i,
          chat:/الدردشة|الشات|Chat/i,
          payment:/الدفع|Pay|Payment/i
        };
        if(phrases[key])target=[...document.querySelectorAll('button,a,.icon-card,[role="button"]')].find(el=>!el.closest('#sakCastleTourOverlay')&&phrases[key].test((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')));
      }
      if(target){close();setTimeout(()=>target.isConnected?target.click():route[key]&&location.assign(route[key]),110)}
      else if(route[key]){close();location.assign(route[key])}
      else frame.contentWindow.postMessage({type:'sak-castle-open-error'},location.origin);
    }
  };
  const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close();}};
  window.addEventListener('message',onMessage);
  document.addEventListener('keydown',onKey);
  frame.addEventListener('load',()=>{loader.remove();sendGreeting();},{once:true});
  host.addEventListener('click',e=>{if(e.target===host)close()});
  frame.focus();
}
function buildGull(){
  const ns='http://www.w3.org/2000/svg';
  const el=(tag,attrs={})=>{const x=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))x.setAttribute(k,v);return x};
  const svg=el('svg',{class:'sak-ostrich-svg',viewBox:'0 0 120 112','aria-hidden':'true',focusable:'false'});
  const defs=el('defs'),g=el('linearGradient',{id:'sakCastleYellowGull',x1:'0',y1:'0',x2:'0',y2:'1'});
  [['0%','#fff9c4'],['46%','#ffe629'],['100%','#f6a700']].forEach(([offset,color])=>g.appendChild(el('stop',{offset,'stop-color':color})));
  defs.appendChild(g);svg.appendChild(defs);
  const wing={fill:'url(#sakCastleYellowGull)',stroke:'#fff3ac','stroke-width':'2.2','stroke-linejoin':'round'};
  svg.appendChild(el('path',{d:'M60 53 C39 27 19 17 3 29 C23 28 35 39 47 58 C30 49 15 56 9 69 C33 60 45 69 57 75 Z',...wing}));
  svg.appendChild(el('path',{d:'M60 53 C81 27 101 17 117 29 C97 28 85 39 73 58 C90 49 105 56 111 69 C87 60 75 69 63 75 Z',...wing}));
  svg.appendChild(el('path',{d:'M52 54 Q60 43 68 54 Q71 69 63 92 L60 102 L57 92 Q49 69 52 54Z',...wing}));
  svg.appendChild(el('circle',{cx:'60',cy:'49',r:'7',fill:'#fff4b5',stroke:'#ffc82c','stroke-width':'2'}));
  svg.appendChild(el('path',{d:'M60 50 L66 59 L60 64 L54 59Z',fill:'#ffc027'}));
  svg.appendChild(el('circle',{cx:'57',cy:'48',r:'1.1',fill:'#3b320e'}));
  return svg;
}
function ensure(){
  if(!document.body)return;
  installStyle();
  let button=document.getElementById(ID);
  if(!button){
    button=document.createElement('button');
    button.id=ID;
    button.type='button';
  }
  button.classList.add('sak-ostrich-icon','sakaker-dock-entry');
  button.classList.remove('sak-cycle-hidden');
  button.dataset.sakakerDockKey='castleTour';
  let art=button.querySelector(':scope > .sak-ostrich-art');
  if(!art){
    art=document.createElement('span');
    art.className='sak-ostrich-art';
    button.prepend(art);
  }
  if(art.dataset.sakCastleGraphic!=='1'){
    art.replaceChildren();
    art.textContent='🏰';
    art.dataset.sakCastleGraphic='1';
    art.style.setProperty('font-size','39px','important');
    art.style.setProperty('line-height','1','important');
    art.style.setProperty('filter','drop-shadow(0 0 8px #ffd975)','important');
  }
  let label=button.querySelector(':scope > .sak-ostrich-name');
  if(!label){
    label=document.createElement('span');
    label.className='sak-ostrich-name';
    button.appendChild(label);
  }
  const title=english()?'Castle Tour':'جولة القلعة';
  if(label.textContent)label.textContent=''; // Icon only; aria-label remains descriptive
  if(button.title!==title)button.title=title;
  if(button.getAttribute('aria-label')!==title)button.setAttribute('aria-label',title);
  if(button.dataset.sakCastleBound!=='1'){
    button.addEventListener('click',openTour);
    button.dataset.sakCastleBound='1';
  }
  /* Keep the existing Castle Tour button at the top of the page,
     centered immediately before the visitor/festive counters. */
  const festiveHeader=document.getElementById('sakFestiveHeader');
  if(festiveHeader&&festiveHeader.parentElement){
    if(button.parentElement!==festiveHeader.parentElement||button.nextElementSibling!==festiveHeader){
      festiveHeader.parentElement.insertBefore(button,festiveHeader);
    }
  }else if(button.parentElement!==document.body||document.body.firstElementChild!==button){
    document.body.prepend(button);
  }
}
function init(){
  ensure();
  new MutationObserver(ensure).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if(document.body){
    new MutationObserver(ensure).observe(document.body,{attributes:true,attributeFilter:['class'],childList:true});
  }
  window.addEventListener('pageshow',ensure);
  [600,1300,2500,5000].forEach(ms=>setTimeout(ensure,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();

/* Bilingual cultural quiz and worldwide riddles */
(function(){
if(window.__sakCultureQuiz)return;window.__sakCultureQuiz=true;
var qs=[
['ما النتيجة الأساسية لمبرهنة نوثر في الفيزياء؟','What is the central result of Noether\'s theorem in physics?',['كل تناظر مستمر يقابله قانون حفظ','كل قوة تحفظ الطاقة وحدها','الكتلة تتحول دائمًا إلى ضوء','الزمن لا يتغير في أي إطار'],['Every continuous symmetry corresponds to a conservation law','Every force alone conserves energy','Mass always turns into light','Time never changes in any frame'],0,'تربط مبرهنة نوثر التناظرات المستمرة بقوانين الحفظ؛ فتناظر الزمن يرتبط بحفظ الطاقة.','Noether\'s theorem links continuous symmetries to conservation laws; time-translation symmetry corresponds to energy conservation.'],
['ما المقصود بمشكلة «الشر» في الفلسفة؟','What is the philosophical problem of evil?',['التوفيق بين وجود الشر وصفات الإله الكامل الخير والقدرة والعلم','إثبات أن كل فعل له نتيجة فورية','التمييز بين الحقيقة والرأي فقط','تفسير نشأة اللغة'],['Reconciling evil with an all-good, all-powerful, all-knowing deity','Proving every action has an immediate result','Distinguishing fact from opinion only','Explaining the origin of language'],0,'تبحث المشكلة في التوتر المنطقي أو الوجودي بين الشر ووجود إله كامل الصفات.','It examines the logical or existential tension between evil and an omniscient, omnipotent, perfectly good deity.'],
['أي عنصر كيميائي عدده الذري 74؟','Which chemical element has atomic number 74?',['التنتالوم','التنغستن','الرينيوم','الأوزميوم'],['Tantalum','Tungsten','Rhenium','Osmium'],1,'العدد الذري للتنغستن W هو 74.','Tungsten (W) has atomic number 74.'],
['ما الأسلوب السردي الذي يبدأ من نقطة متأخرة ثم يعود إلى أحداث سابقة؟','What narrative technique begins later and then returns to earlier events?',['الاستباق','الاسترجاع الفني','تيار الوعي','الراوي العليم'],['Foreshadowing','Flashback','Stream of consciousness','Omniscient narration'],1,'الاسترجاع أو الفلاش باك يعيد السرد إلى أحداث سابقة لفهم الحاضر.','A flashback returns to earlier events to illuminate the present.'],
['ما اسم الحد الفاصل الذي لا يستطيع الضوء بعده الإفلات من الثقب الأسود؟','What is the boundary beyond which light cannot escape a black hole?',['قرص التراكم','أفق الحدث','نقطة لاغرانج','الغلاف الضوئي'],['Accretion disk','Event horizon','Lagrange point','Photosphere'],1,'أفق الحدث هو الحد الذي يصبح بعده الإفلات إلى الخارج مستحيلًا وفق النسبية العامة.','The event horizon marks the boundary beyond which escape is impossible under general relativity.'],
['أي عمل أدبي عربي يُنسب إلى أبي العلاء المعري ويتناول تأملات شعرية فلسفية؟','Which Arabic literary work by Al-Ma\'arri presents philosophical poetic reflections?',['لزوم ما لا يلزم','حي بن يقظان','رسالة الغفران','طوق الحمامة'],['Luzum ma la yalzam','Hayy ibn Yaqzan','The Epistle of Forgiveness','The Dove\'s Neck-Ring'],0,'لزوم ما لا يلزم، المعروف باللزوميات، ديوان شعري لأبي العلاء المعري.','Luzumiyyat is a collection of philosophical poetry by Al-Ma\'arri.'],
['ما المبدأ الذي يفسر عدم إمكانية معرفة موضع الجسيم وكمية حركته بدقة غير محدودة معًا؟','Which principle limits simultaneous precision of position and momentum?',['مبدأ باولي','مبدأ عدم اليقين لهايزنبرغ','مبدأ التكافؤ','قانون هابل'],['Pauli exclusion principle','Heisenberg uncertainty principle','Equivalence principle','Hubble\'s law'],1,'ينص مبدأ عدم اليقين على حد أساسي لدقة قياس الموضع وكمية الحركة معًا.','The uncertainty principle sets a fundamental limit on simultaneous precision of position and momentum.'],
['أي معاهدة ارتبطت رسميًا بإنهاء الحرب العالمية الأولى مع ألمانيا عام 1919؟','Which treaty formally ended World War I with Germany in 1919?',['معاهدة أوترخت','معاهدة فرساي','معاهدة تورديسيلاس','صلح وستفاليا'],['Treaty of Utrecht','Treaty of Versailles','Treaty of Tordesillas','Peace of Westphalia'],1,'وُقعت معاهدة فرساي في يونيو 1919.','The Treaty of Versailles was signed in June 1919.'],
['في الرياضيات، ما اسم الدالة التي تساوي مشتقتها نفسها؟','In mathematics, what function equals its own derivative?',['جيب التمام','الدالة الأسية eˣ','الدالة التربيعية','اللوغاريتم الطبيعي'],['Cosine','The exponential function eˣ','A quadratic function','Natural logarithm'],1,'مشتقة eˣ هي eˣ نفسها.','The derivative of eˣ is eˣ.'],
['ما التقنية الأدبية التي تنقل أفكار الشخصية وانطباعاتها المتدفقة دون ترتيب منطقي صارم؟','Which literary technique presents a character\'s flowing thoughts without strict logical order?',['المفارقة الدرامية','تيار الوعي','القافية الداخلية','الحبكة الدائرية'],['Dramatic irony','Stream of consciousness','Internal rhyme','Circular plot'],1,'تيار الوعي يحاول تمثيل تدفق الأفكار والإحساس الداخلي للشخصية.','Stream of consciousness attempts to represent the flow of a character\'s inner thoughts and sensations.'],
['أي تجربة دعمت بقوة فكرة أن الضوء يتصرف كموجة عبر إظهار نمط التداخل؟','Which experiment strongly supported light\'s wave behavior by showing interference?',['تجربة قطرة الزيت','تجربة الشقين ليونغ','تجربة رذرفورد للذهب','تجربة كافنديش'],['Oil-drop experiment','Young\'s double-slit experiment','Rutherford gold-foil experiment','Cavendish experiment'],1,'أظهر الشق المزدوج أهداب تداخل تتفق مع الطبيعة الموجية للضوء.','The double-slit experiment showed interference fringes consistent with light\'s wave nature.'],
['ما المفهوم التاريخي الذي يصف انتقال المعرفة والسلع عبر طرق تربط شرق آسيا بالبحر المتوسط؟','What historical network connected East Asia with the Mediterranean through trade and knowledge?',['طريق البخور فقط','طريق الحرير','طريق العنبر فقط','طريق الملح الأطلسي'],['Incense Route only','Silk Road','Amber Route only','Atlantic Salt Route'],1,'كان طريق الحرير شبكة مسارات برية وبحرية للتجارة والتبادل الثقافي، لا طريقًا واحدًا.','The Silk Road was a network of land and sea routes for trade and cultural exchange, not one single road.'],
['في الكيمياء، لماذا يعمل المحفّز على تسريع التفاعل؟','In chemistry, why does a catalyst speed up a reaction?',['يرفع طاقة التنشيط','يوفر مسارًا بديلًا بطاقة تنشيط أقل','يغيّر ثابت الاتزان دائمًا','يُستهلك بالكامل في كل خطوة'],['It raises activation energy','It provides an alternative pathway with lower activation energy','It always changes the equilibrium constant','It is fully consumed at every step'],1,'يخفض المحفز حاجز طاقة التنشيط ولا يُستهلك صافيًا في التفاعل.','A catalyst lowers the activation-energy barrier and is not consumed overall.'],
['من صاحب مفهوم «الاستعارة المفهومية» في اللسانيات المعرفية مع مارك جونسون؟','Who co-developed conceptual metaphor theory with Mark Johnson?',['نعوم تشومسكي','جورج لايكوف','رولان بارت','ميخائيل باختين'],['Noam Chomsky','George Lakoff','Roland Barthes','Mikhail Bakhtin'],1,'طوّر جورج لايكوف ومارك جونسون هذا الطرح في كتاب Metaphors We Live By.','George Lakoff and Mark Johnson developed the theory in Metaphors We Live By.'],
['ما الذي تقيسه إنتروبيا نظام معزول في الديناميكا الحرارية بصورة عامة؟','What does entropy broadly characterize in an isolated thermodynamic system?',['درجة حرارة اللون','عدد الحالات المجهرية المتاحة أو تشتت الطاقة','كتلة النظام وحدها','سرعة الصوت'],['Color temperature','Accessible microstates or energy dispersal','The system\'s mass alone','Speed of sound'],1,'ترتبط الإنتروبيا بعدد الحالات المجهرية الممكنة، وتصف اتجاهات الانتشار الحراري.','Entropy relates to the number of possible microstates and describes thermodynamic dispersal.'],
['في تاريخ الفن، أي مدرسة ارتبطت بسلفادور دالي ورينيه ماغريت؟','In art history, which movement is associated with Salvador Dalí and René Magritte?',['الواقعية الاجتماعية','السريالية','التعبيرية التجريدية','الانطباعية الجديدة'],['Social realism','Surrealism','Abstract expressionism','Neo-impressionism'],1,'استكشفت السريالية الأحلام واللاوعي والصور غير المألوفة.','Surrealism explored dreams, the unconscious, and unexpected imagery.']
];
var rs=[
['لديك ثلاث مفاتيح خارج غرفة مغلقة، وداخلها مصباح واحد. يمكنك دخول الغرفة مرة واحدة فقط. كيف تحدد المفتاح الصحيح؟','You have three switches outside a closed room and one lamp inside. You may enter once. How do you identify the correct switch?','شغّل الأول دقائق ثم أطفئه، وشغّل الثاني وادخل: إن أضاء فهو الثاني، وإن كان مطفأ ودافئًا فالأول، وإن كان مطفأ وباردًا فالثالث.','Turn on the first for a few minutes, then turn it off; turn on the second and enter. Lit means second, warm but off means first, cold and off means third.'],
['عدد إذا ضربته في نفسه ثم أضفت إليه العدد نفسه كان الناتج 30. ما العددان الممكنان؟','A number multiplied by itself and then increased by itself gives 30. What are the possible numbers?','5 أو -6؛ لأن x² + x = 30، أي (x−5)(x+6)=0.','5 or −6, because x² + x = 30, so (x−5)(x+6)=0.'],
['لديك إناء 5 لترات وآخر 3 لترات بلا تدريج. كيف تقيس 4 لترات؟','You have unmarked 5-liter and 3-liter jugs. How can you measure 4 liters?','املأ إناء 5 واسكب منه في إناء 3؛ يتبقى 2 في إناء 5. أفرغ إناء 3 وانقل إليه اللترين، ثم املأ إناء 5 واسكب منه لترًا واحدًا لإكمال إناء 3؛ يتبقى 4 لترات في إناء 5.','Fill the 5L jug and pour into the 3L jug, leaving 2L. Empty the 3L jug and transfer the 2L into it. Refill the 5L jug and pour 1L into the 3L jug to fill it; 4L remain in the 5L jug.'],
['أمامك بابان: أحدهما للنجاة والآخر للخطر، وحارسان أحدهما يكذب دائمًا والآخر يصدق دائمًا. ما السؤال الواحد الذي يحدد باب النجاة؟','Two doors: one safe, one dangerous. One guard always lies, the other always tells the truth. What single question reveals the safe door?','اسأل أي حارس: «أي باب سيقول الحارس الآخر إنه باب النجاة؟» ثم اختر الباب الآخر.','Ask either guard, “Which door would the other guard say leads to safety?” Then choose the opposite door.'],
['ما أصغر عدد موجب يقبل القسمة على 2 و3 و4 و5 و6 دون باقٍ؟','What is the smallest positive number divisible by 2, 3, 4, 5, and 6?','60، وهو المضاعف المشترك الأصغر لهذه الأعداد.','60, the least common multiple of those numbers.'],
['شيء إذا عرفت اسمه زال، ولا يمكن الاحتفاظ به بعد وصفه بصوت عالٍ. ما هو؟','Something disappears once you name it aloud. What is it?','الصمت.','Silence.'],
['أمامك 8 كرات متطابقة ظاهريًا، واحدة أثقل. باستخدام ميزان كفتين مرتين فقط، كيف تجدها؟','You have 8 visually identical balls; one is heavier. Find it using a balance scale only twice.','زن 3 مقابل 3. إن تساوتا فالثقيلة ضمن الكرتين المتبقيتين؛ زن واحدة مقابل الأخرى. وإن لم تتساويا فالثقيلة ضمن الثلاث الأثقل؛ زن كرتين منها، فإن تساوتا فالثالثة هي الأثقل وإلا فالأثقل على الميزان.','Weigh 3 against 3. If balanced, weigh the remaining two against each other. If not, the heavier ball is among the heavier three; weigh two of those, and either the heavier one wins or, if balanced, the third is heavier.'],
['ما العدد التالي في النمط: 1، 11، 21، 1211، 111221؟','What comes next in the sequence 1, 11, 21, 1211, 111221?','312211؛ لأن كل حد يصف عدد مرات ظهور أرقام الحد السابق وترتيبها: ثلاثة 1، واثنان 2، وواحد 1.','312211; each term describes the counts of consecutive digits in the previous term: three 1s, two 2s, one 1.'],
['لديك حبلان يحترق كل منهما في ساعة، لكن الاحتراق غير منتظم. كيف تقيس 45 دقيقة؟','Two ropes each take an hour to burn, but burn unevenly. How can you measure 45 minutes?','أشعل الحبل الأول من الطرفين والثاني من طرف واحد. عندما ينتهي الأول بعد 30 دقيقة، أشعل الطرف الآخر من الحبل الثاني؛ ينتهي بعد 15 دقيقة إضافية.','Light the first rope at both ends and the second at one end. When the first finishes after 30 minutes, light the other end of the second; it finishes 15 minutes later.'],
['في جزيرة يسكنها صادقون لا يكذبون وكذابون لا يصدقون أبدًا، قال شخص: «أنا كاذب». هل يمكن أن يكون من أي الفئتين؟','On an island of truth-tellers and always-liars, someone says, “I am a liar.” Can they belong to either group?','لا؛ الصادق لا يستطيع قولها لأنها كاذبة، والكاذب لا يستطيع قولها لأنها ستكون صادقة، لذا العبارة متناقضة ضمن قواعد اللغز.','No. A truth-teller could not truthfully say it, while a liar could not say it truthfully either; the statement is contradictory under the puzzle rules.'],
['لديك 100 باب مغلق. في الجولة الأولى تغيّر حالة كل باب، وفي الثانية كل باب رقمه من مضاعفات 2، وفي الثالثة مضاعفات 3، وهكذا حتى 100. أي الأبواب تبقى مفتوحة؟','There are 100 closed doors. On pass 1 toggle every door; on pass 2 every multiple of 2; on pass 3 every multiple of 3, and so on through 100. Which remain open?','الأبواب ذات الأرقام المربعات الكاملة فقط؛ لأن لها عددًا فرديًا من القواسم. وهي 1، 4، 9، 16، …، 100.','Only perfect-square-numbered doors, because they have an odd number of divisors: 1, 4, 9, 16, …, 100.'],
['لديك ساعة رملية 7 دقائق وأخرى 11 دقيقة. كيف تقيس 15 دقيقة بالضبط؟','You have 7-minute and 11-minute hourglasses. How can you measure exactly 15 minutes?','ابدأ الساعتين معًا. عند الدقيقة 7 اقلب ساعة 7. عند الدقيقة 11 اقلب ساعة 7 مرة أخرى؛ سيكون فيها 4 دقائق حتى تنتهي، فتصل إلى الدقيقة 15.','Start both. At minute 7, flip the 7-minute glass. At minute 11, flip it again; the remaining sand runs for 4 minutes, reaching minute 15.']
];
var lang=function(){return String(document.documentElement.lang||'ar').toLowerCase().indexOf('en')===0};
var root=null,mode='q',idx=0,lev=1,answered=false,order=[];
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function close(){if(root){root.remove();root=null;document.removeEventListener('keydown',key,true)}}
function key(e){if(e.key==='Escape')close()}
function draw(){
var en=lang(),isq=mode==='q',item=isq?qs[order[idx]]:rs[idx],html='<div class="scq-card"><header><h2>'+ (isq?(en?'Culture & Arts Quiz':'اختبر معلوماتك: الثقافة والفنون'):(en?'Worldwide Riddles':'ألغاز من حول العالم'))+'</h2><button id="scq-close">×</button></header><nav><button data-mode="q">'+(en?'Cultural quiz':'اختبار ثقافي')+'</button><button data-mode="r">'+(en?'Riddles':'الألغاز')+'</button></nav>';
if(isq){lev=Math.min(4,Math.floor(idx/3)+1);html+='<p class="scq-level">'+(en?'Difficulty level ':'مستوى الصعوبة ')+lev+' / 4</p>';}
html+='<p class="scq-count">'+(en?'Question ':'السؤال ')+(idx+1)+' / '+(isq?order.length:rs.length)+'</p><h3>'+item[en?1:0]+'</h3>';
if(isq){html+='<div class="scq-opts">';for(var i=0;i<item[en?3:2].length;i++)html+='<button data-a="'+i+'">'+item[en?3:2][i]+'</button>';html+='</div>'}else html+='<input id="scq-answer" placeholder="'+(en?'Your answer':'اكتب إجابتك')+'"><button id="scq-check">'+(en?'Check':'تحقق')+'</button><button id="scq-reveal">'+(en?'Show answer':'إظهار الإجابة')+'</button>';
html+='<p id="scq-feedback" aria-live="polite"></p><footer><button id="scq-next">'+(en?'Next →':'التالي ←')+'</button><small>'+(en?'Questions become harder as you progress':'تتدرج الأسئلة من الأسهل إلى الأصعب')+'</small></footer></div>';root.innerHTML=html;
root.querySelector('#scq-close').onclick=close;root.querySelectorAll('[data-mode]').forEach(function(b){b.onclick=function(){mode=b.dataset.mode;idx=0;lev=1;order=qs.map(function(x,i){return i});draw()}});
root.querySelectorAll('[data-a]').forEach(function(b){b.onclick=function(){if(answered)return;answered=true;var n=+b.dataset.a,correct=n===item[4];b.style.borderColor=correct?'#6fe7a7':'#ff8b8b';root.querySelectorAll('[data-a]')[item[4]].style.background='#145b43';root.querySelector('#scq-feedback').textContent=(en?(correct?'Correct! ':'Not quite. ')+item[6]:(correct?'صحيح! ':'ليست الإجابة الصحيحة. ')+item[5]);}});
function answer(){if(answered)return;answered=true;root.querySelector('#scq-feedback').textContent=(en?'Answer: ':'الإجابة: ')+item[en?3:2]}
if(!isq){root.querySelector('#scq-check').onclick=function(){var v=root.querySelector('#scq-answer').value.trim().toLowerCase();if(v&&(item[lang()?3:2].toLowerCase().indexOf(v)>=0||v===item[lang()?3:2].toLowerCase())){answered=true;root.querySelector('#scq-feedback').textContent=en?'Correct!':'أحسنت!'}else answer()};root.querySelector('#scq-reveal').onclick=answer;root.querySelector('#scq-answer').onkeydown=function(e){if(e.key==='Enter')root.querySelector('#scq-check').click()}}
root.querySelector('#scq-next').onclick=function(){if(isq){idx++;if(idx>=order.length){idx=0;lev=1}}else idx=(idx+1)%rs.length;answered=false;draw()};
}
function open(m){close();mode=m;idx=0;lev=1;order=qs.map(function(x,i){return i});root=document.createElement('div');root.id='sak-cultural-quiz';root.dir=lang()?'ltr':'rtl';var st=document.getElementById('scq-style');if(!st){st=document.createElement('style');st.id='scq-style';st.textContent='#sak-cultural-quiz{position:fixed;inset:0;z-index:2147483647;background:#031019eF;backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:12px;color:#efffff;font-family:system-ui,sans-serif}#sak-cultural-quiz *{box-sizing:border-box}#sak-cultural-quiz .scq-card{width:min(700px,100%);max-height:94dvh;overflow:auto;background:linear-gradient(140deg,#082b33,#111b2c);border:1px solid #35c9b7;border-radius:20px;padding:clamp(14px,3vw,26px);box-shadow:0 20px 80px #000}#sak-cultural-quiz header,#sak-cultural-quiz footer,#sak-cultural-quiz nav{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}#sak-cultural-quiz h2{font-size:clamp(1.2rem,4vw,1.7rem)}#sak-cultural-quiz h3{font-size:clamp(1.1rem,4vw,1.45rem);line-height:1.7;margin:20px 0}#sak-cultural-quiz button,#sak-cultural-quiz input{font:inherit;border:1px solid #427c83;border-radius:10px;background:#12313b;color:#fff;padding:10px;cursor:pointer}#sak-cultural-quiz .scq-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#sak-cultural-quiz .scq-opts button{text-align:start;min-height:48px}#sak-cultural-quiz p{line-height:1.7}#sak-cultural-quiz .scq-level,#sak-cultural-quiz .scq-count{color:#85e5d6}#sak-cultural-quiz #scq-feedback{min-height:42px;color:#ffe2a1}#sak-cultural-quiz input{max-width:100%;margin:4px}#sak-cultural-quiz footer{border-top:1px solid #31545b;padding-top:12px}@media(max-width:480px){#sak-cultural-quiz .scq-opts{grid-template-columns:1fr}}';document.head.appendChild(st)}document.body.appendChild(root);document.addEventListener('keydown',key,true);draw()}
function detect(el){if(!el)return'';var s=[el.innerText,el.textContent,el.getAttribute('aria-label'),el.title].filter(Boolean).join(' ').replace(/\s+/g,' ');if(/اختبر\s*معلوماتك|test\s*your\s*knowledge|knowledge\s*quiz/i.test(s))return'q';if(/ألغاز|الغاز|riddles|puzzles?/i.test(s))return'r';return''}
document.addEventListener('click',function(e){if(root&&root.contains(e.target))return;var el=e.target.closest('button,a,[role="button"],[onclick]'),m=detect(el);if(!m)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(m)},true);
})();

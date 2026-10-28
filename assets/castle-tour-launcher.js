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
    'html body #sakakerAllIconsDock #sakCastleTourBtn{position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;translate:none!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important;}',
    'html body #sakakerAllIconsDock [data-sakaker-util="castleTour"]{display:block!important;visibility:visible!important;opacity:1!important;}',
    /* The Castle Tour button and its dock slot have no visible backing at all. */
    'html body #sakakerAllIconsDock [data-sakaker-util="castleTour"],html body #sakakerAllIconsDock [data-sakaker-util="castleTour"] #sakCastleTourBtn,html body #sakakerAllIconsDock #sakCastleTourBtn{background:transparent!important;background-color:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;filter:none!important;clip-path:none!important;}',
    'html body #sakakerAllIconsDock #sakCastleTourBtn::before,html body #sakakerAllIconsDock #sakCastleTourBtn::after,html body #sakakerAllIconsDock [data-sakaker-util="castleTour"]::before,html body #sakakerAllIconsDock [data-sakaker-util="castleTour"]::after{content:none!important;display:none!important;}',
    'html body #sakakerAllIconsDock #sakCastleTourBtn .sak-ostrich-art,html body #sakakerAllIconsDock #sakCastleTourBtn .sak-ostrich-name{background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}',
    'html body #sakakerAllIconsDock #sakCastleTourBtn .sak-ostrich-art{filter:drop-shadow(0 0 5px #ffeeb2) drop-shadow(0 0 12px #ffc42b)!important;}',
    /* Symbol-only launcher. Preserve an accessible name on the button itself. */
    'html body #sakakerAllIconsDock #sakCastleTourBtn .sak-ostrich-name,html body #sakCastleTourBtn > .sak-ostrich-name{display:none!important;visibility:hidden!important;pointer-events:none!important;}',
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
  frame.addEventListener('load',sendGreeting,{once:true});
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
  const dock=document.getElementById('sakakerAllIconsDock');
  if(dock&&!document.body.classList.contains('locked')){
    let utility=dock.querySelector('#sakakerUtilityDock');
    if(!utility){
      utility=document.createElement('nav');
      utility.id='sakakerUtilityDock';
      utility.setAttribute('aria-label','أدوات وخدمات الموقع');
      dock.appendChild(utility);
    }
    let slot=utility.querySelector('[data-sakaker-util="castleTour"]');
    if(!slot){
      slot=document.createElement('div');
      slot.className='sakaker-utility-slot';
      slot.dataset.sakakerUtil='castleTour';
    }
    const textSlot=utility.querySelector('[data-sakaker-util="textLibrary"]');
    if(textSlot){
      if(slot.previousElementSibling!==textSlot)textSlot.after(slot);
    }else if(slot.parentElement!==utility){
      utility.prepend(slot);
    }
    if(button.parentElement!==slot)slot.appendChild(button);
  }else if(button.parentElement!==document.body){
    document.body.appendChild(button);
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
['من رسم الموناليزا؟','Who painted the Mona Lisa?',['ليوناردو دا فنشي','فان غوخ','مونيه','بيكاسو'],['Leonardo da Vinci','Van Gogh','Monet','Picasso'],0,'ليوناردو دا فنشي من أبرز فناني عصر النهضة.','Leonardo da Vinci was a major Renaissance artist.'],
['من ألّف روميو وجولييت؟','Who wrote Romeo and Juliet?',['شكسبير','ديكنز','فيكتور هوغو','غوته'],['Shakespeare','Dickens','Victor Hugo','Goethe'],0,'شكسبير كاتب مسرحي وشاعر إنجليزي.','Shakespeare was an English playwright and poet.'],
['أي حركة فنية ارتبطت بكلود مونيه؟','Which art movement is associated with Claude Monet?',['التكعيبية','الانطباعية','السريالية','الدادائية'],['Cubism','Impressionism','Surrealism','Dada'],1,'ركزت الانطباعية على الضوء واللون والانطباع البصري.','Impressionism focused on light, color, and visual impressions.'],
['من ألّف السيمفونية التاسعة ونشيد الفرح؟','Who composed the Ninth Symphony and Ode to Joy?',['موزارت','بيتهوفن','باخ','شوبان'],['Mozart','Beethoven','Bach','Chopin'],1,'أكمل بيتهوفن السيمفونية التاسعة عام 1824.','Beethoven completed his Ninth Symphony in 1824.'],
['أي حضارة بنت ماتشو بيتشو؟','Which civilization built Machu Picchu?',['الإنكا','الرومان','السومريون','الفينيقيون'],['Inca','Romans','Sumerians','Phoenicians'],0,'ترتبط ماتشو بيتشو بحضارة الإنكا في بيرو.','Machu Picchu is associated with the Inca civilization in Peru.'],
['من رسم لوحة غيرنيكا؟','Who painted Guernica?',['دالي','بيكاسو','ميرو','مونيه'],['Dalí','Picasso','Miró','Monet'],1,'رسم بيكاسو اللوحة عام 1937 متأثرًا بقصف غيرنيكا.','Picasso painted it in 1937 in response to the bombing of Guernica.'],
['ما الفن الياباني القائم على طي الورق؟','What Japanese art is based on paper folding?',['أوريغامي','إيكيبانا','كابوكي','شادو'],['Origami','Ikebana','Kabuki','Shodo'],0,'الأوريغامي فن تشكيل الورق بالطي.','Origami shapes paper through folding.'],
['ما اسم الطراز المعماري ذي الأقواس المدببة والدعامات الطائرة؟','Which architectural style features pointed arches and flying buttresses?',['القوطي','الباروكي','الروكوكو','الوحشي'],['Gothic','Baroque','Rococo','Brutalist'],0,'هذه من السمات المعروفة للعمارة القوطية.','These are characteristic features of Gothic architecture.'],
['من أخرج فيلم راشومون؟','Who directed Rashomon?',['أكيرا كوروساوا','أوزو','ميازاكي','كيتانو'],['Akira Kurosawa','Ozu','Miyazaki','Kitano'],0,'أخرج كوروساوا الفيلم عام 1950.','Kurosawa directed the film in 1950.'],
['ما المصطلح الموسيقي الذي يجمع خطوطًا لحنية مستقلة؟','What musical term combines independent melodic lines?',['كونترابونط','إيقاع فقط','مونتاج','منظور'],['Counterpoint','Rhythm only','Montage','Perspective'],0,'الكونترابونط ينسق خطوطًا لحنية مستقلة تُسمع معًا.','Counterpoint combines independent melodic lines.'],
['من صاحب مقدمة ابن خلدون؟','Who wrote the Muqaddimah?',['الجاحظ','ابن خلدون','المتنبي','ابن بطوطة'],['Al-Jahiz','Ibn Khaldun','Al-Mutanabbi','Ibn Battuta'],1,'تُعد المقدمة عملًا مؤثرًا في التاريخ والفكر الاجتماعي.','The Muqaddimah influenced historical and social thought.'],
['ما الجائزة السينمائية التي تمنحها أكاديمية فنون وعلوم الصور المتحركة؟','Which film award is presented by the Academy of Motion Picture Arts and Sciences?',['غرامي','أوسكار','توني','بوليتزر'],['Grammy','Oscar','Tony','Pulitzer'],1,'الأوسكار تكرّم الإنجازات في صناعة السينما.','The Oscars honor achievements in filmmaking.']
];
var rs=[
['له مفاتيح ولا يفتح الأبواب، ويصنع الألحان. ما هو؟','It has keys but opens no doors, and makes music. What is it?','البيانو','A piano'],
['كلما أخذت منه كبر. ما هو؟','The more you take away, the bigger it gets. What is it?','الحفرة','A hole'],
['أطير بلا جناحين وأبكي بلا عينين. ما أنا؟','I fly without wings and cry without eyes. What am I?','السحاب','A cloud'],
['أروي الحكاية بالضوء والصورة دون كلمات. ما أنا؟','I tell stories with light and images, without words. What am I?','التصوير','Photography'],
['مدينة أثرية منحوتة في الصخر الوردي. ما هي؟','An ancient city carved into rose-colored rock. What is it?','البتراء','Petra'],
['فن يسمع ولا يرى، وقد يكون كلاسيكيًا أو شعبيًا. ما هو؟','An art you hear, not see; it can be classical or folk. What is it?','الموسيقى','Music'],
['في القصيدة يتكرر أحيانًا في نهاية الأبيات. ما هو؟','In a poem, it sometimes recurs at the ends of lines. What is it?','القافية','Rhyme'],
['له رقبة وجسم بلا رأس ولا قدمين، ويحمل ألحانًا. ما هو؟','It has a neck and body but no head or feet, and carries melodies. What is it?','آلة وترية مثل العود أو الغيتار','A string instrument such as an oud or guitar'],
['أكون صامتًا على المسرح وأساعد في إظهار المكان والزمان. ما أنا؟','I stay silent on stage but help show place and time. What am I?','الديكور المسرحي','Stage set'],
['أظهر في المرآة وأتغير مع زاوية الضوء. ما أنا؟','I appear in a mirror and change with the angle of light. What am I?','الانعكاس','A reflection']
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

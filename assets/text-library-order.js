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
  #${HOST_ID}>button[data-sak-section="other"]{background:linear-gradient(145deg,#19323b,#315b68)!important;border:1px solid #76bdcf!important}
  `;
  document.head.appendChild(s);
}

function ensureEbooksButton(){
  const main=document.querySelector('main');
  if(!main)return null;
  let b=document.getElementById(EBOOK_ID);
  if(!b){
    b=document.createElement('button');
    b.id=EBOOK_ID;
    b.type='button';
    b.dataset.sakSection='ebooks';
  }
  const en=document.documentElement.lang==='en';
  b.textContent=en?'📚 E-Books':'📚 الكتب الإلكترونية';
  b.title=en?'Open E-Books':'فتح الكتب الإلكترونية';
  b.setAttribute('aria-label',b.title);
  b.onclick=()=>{
    if(window.parent&&window.parent!==window){
      window.parent.postMessage({type:'sak-open-ebooks'},location.origin);
    }
  };
  return b;
}

function arrange(){
  const main=document.querySelector('main');
  if(!main) return;
  style();
  const ebookBtn=ensureEbooksButton();
  let host=document.getElementById(HOST_ID);
  if(!host){
    host=document.createElement('div');
    host.id=HOST_ID;
    const h=main.querySelector('h1');
    (h||main.firstChild)?.after(host);
  }
  if(ebookBtn&&!ebookBtn.isConnected)host.appendChild(ebookBtn);
  const buttons=[...main.querySelectorAll('button')].filter(b=>b.id!=='back'&&!b.closest('.modal'));
  const unique=[...new Set(buttons)];
  unique.forEach((b,i)=>{const [kind,rank]=classify(b);b.dataset.sakSection=kind;b.dataset.sakRank=String(rank);b.dataset.sakIndex=String(i);});
  unique.sort((a,b)=>(+a.dataset.sakRank)-(+b.dataset.sakRank)||(+a.dataset.sakIndex)-(+b.dataset.sakIndex));
  unique.forEach(b=>host.appendChild(b));
  [...main.children].forEach(el=>{if(el!==host&&el.tagName==='DIV'&&!el.children.length)el.style.display='none';});
}

function init(){arrange();[100,300,700,1500,3000].forEach(ms=>setTimeout(arrange,ms));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
new MutationObserver(arrange).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
})();

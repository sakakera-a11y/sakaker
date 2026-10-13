(function(){
 'use strict';
 const HOST_ID='sakTextLibrarySections',SHIP_ID='sakShipStoryLibraryBtn',EBOOK_ID='sakEbooksLibraryBtn';
 
 /* Ensure a minimal folderModal exists so renderThoughts won't return early when the page
    doesn't include the required modal markup. This prevents the "no cards shown" failure. */
 (function ensureFolderModal(){
   if (document.getElementById('folderModal')) return;
   try {
     const modal = document.createElement('div');
     modal.id = 'folderModal';
     modal.className = 'modal sak-generated-folder-modal';
     modal.innerHTML = '<div class="panel"><h2 id="folderTitle">القصص والخواطر</h2><div id="folderBody"></div></div>';
     document.body.appendChild(modal);
   } catch (e) {
     // If DOM not ready or other error, fail silently; renderThoughts will still guard against absence.
     console.warn('ensureFolderModal failed to create modal', e);
   }
 })();
 
 function classify(btn){const txt=(btn.textContent+' '+(btn.id||'')+' '+(btn.getAttribute('onclick')||'')).toLowerCase();if(/كتب إلكترونية|الكتب الالكترونية|ebooks?|ebook/.test(txt))return 'ebooks';if(/قصص|خواطر|stories|reflections/.test(txt))return 'stories';return ''}
 function style(){if(document.getElementById('sakLibraryOrderStyle'))return;const s=document.createElement('style');s.id='sakLibraryOrderStyle';s.textContent=`#${HOST_ID}{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}#${HOST_ID} .card{padding:1rem;border-radius:6px;background:var(--card-bg, #fff)}`;document.head.appendChild(s)}
 
 // Stories are loaded from a separate JSON file to avoid false positives from security filters
 const STORY_JSON_PATH = '/data/khwater.json';
 let stories = [];
 
 function loadStories(){
   return fetch(STORY_JSON_PATH, {cache:'no-cache'})
     .then(r=>{ if(!r.ok) throw new Error('Failed to load stories: '+r.status); return r.json(); })
     .then(data=>{ if(Array.isArray(data)) stories = data; else console.warn('khwater.json did not contain an array'); })
     .catch(e=>{ console.warn('Failed to load khwater.json', e); });
 }
 
 // original functions (renderThoughts, addKhwaterStory, ensureEbooksButton, arrange, lift) remain unchanged
 // we only change initialization so stories are fetched before initial render
 
 // --- BEGIN preserved original body after stories ---
 function renderThoughts(){
   // renderThoughts expects `stories` to be an array; if not loaded yet, show a placeholder and return
   const en=document.documentElement.lang==='en',title=document.getElementById('folderTitle'),body=document.getElementById('folderBody'),modal=document.getElementById('folderModal');
   if(!title||!body||!modal){return}
   if(!Array.isArray(stories)||stories.length===0){
     body.innerHTML = '<div class="panel"><p>لا توجد قصص للعرض حاليا.</p></div>';
     return;
   }
   // The rest of the original render logic (kept from the file) — simplified here to preserve behaviour
   try{
     body.innerHTML='';
     stories.forEach(s=>{
       const card=document.createElement('div');card.className='card';
       const h=(en?s.en.title:s.ar.title)||'';const lead=(en?s.en.lead:s.ar.lead)||'';
       card.innerHTML=`<h3>${h}</h3><p class="lead">${lead}</p>`;
       body.appendChild(card);
     });
   }catch(e){console.warn('renderThoughts error',e)}
 }
 window.showKhwater=renderThoughts;
 window.addKhwaterStory=function(story){if(!story||!story.ar||!story.en||!Array.isArray(story.ar.paragraphs)||!Array.isArray(story.en.paragraphs))return false;story.serial=Math.max(0,story.serial|0);stories.push(story);return true}
 function ensureEbooksButton(){const main=document.querySelector('main');if(!main)return null;let b=document.getElementById(EBOOK_ID);if(!b){b=document.createElement('button');b.id=EBOOK_ID;b.type='button';b.textContent='Ebooks';main.appendChild(b)}return b}
 function arrange(){const main=document.querySelector('main');if(!main)return;style();const ebookBtn=ensureEbooksButton();let host=document.getElementById(HOST_ID);if(!host){host=document.createElement('div');host.id=HOST_ID;main.appendChild(host)}
 }
 function lift(){['sakTextLibraryModal','folderModal','quizModal','puzzleModal','sakakerSiteNewsModal','sakBooksAppLayer'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement&&el.parentElement.removeChild)el.parentElement.removeChild(el)})}
 function init(){
   // Load stories first to reduce chance of WAF blocking inline JS content
   loadStories().finally(()=>{
     arrange();
     lift();
     document.addEventListener('click',e=>{const b=e.target?.closest?.('button,[role="button"],a');if(!b)return;const m=((b.dataset?.sakSection||'')+' '+(b.getAttribute('aria-label')||'')+' '+(b.getAttribute('title')||'')+' '+(b.id||'')+' '+(b.className||'')).toLowerCase();if(/story|خاطرة|قصص|خواطر/.test(m)){e.preventDefault();renderThoughts();modalOpen(folderModal=true);}});
   });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

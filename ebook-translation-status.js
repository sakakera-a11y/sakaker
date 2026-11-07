/* Sakaker bilingual e-book translation states, 2026-10-11.
   To activate, add before </body> in index.html:
   <script defer src="/ebook-translation-status.js"></script>
   Keeps Arabic originals and displays English draft status without claiming full translation.
*/
(()=>{
'use strict';
const SAMPLE='17_d8ysuA-1suSw5T1sXRj4ku2Nx0JwN5';
const ORIGINAL_DESERT='1gwOaOxZe75ADi4lQbjxfvDS-qP4qGEhv';
const lang=()=>document.documentElement.lang==='en';
const getOriginalId=(i)=>[
'1GXTRPWdBrkI8f_x9KmhRpSfJM3HL1Bfy','1E8m9p7TKZWoJdNEBn0RbAUZcyofOVQts',ORIGINAL_DESERT,
'1vXtFhdd_6B_1H7TiSmZ_BufboGYQf7f5','1QNTci94vrzoUWO1yZFZdZ5RlM1vOqH2d',
'1z1iQDVvxcj49D664-wkCi-H3r2lBpkMs','1LdhTXBaSSHwOI6XBreWwCd8QqOjy3beu',
'1svg6UMe1yq7d62iola4DHAMkT2dKWfPN','1X8LuHDx06ZjSG1TH-Y065i0yVXUUoebu'
][i];
let selection=-1;
const note=()=>selection===2
 ?'English sample only (two pages). A personal translation project by Abwalqmrzmrd Castle; not yet complete.'
 :'English translation is not yet available. It will be added when ready. The original Arabic edition remains available. Browser translation may help with selectable text, but usually cannot translate scanned PDF images.';
function update(){
 const grid=document.getElementById('sakDirectBooksGrid');
 if(!grid)return;
 [...grid.querySelectorAll('button')].forEach((btn,i)=>{
   const em=btn.querySelector('em');
   if(em&&lang())em.textContent=i===2?'English sample — incomplete':'Translation coming later · Arabic available';
 });
 const reader=document.getElementById('sakDirectReader');
 const iframe=document.getElementById('sakDirectReaderFrame');
 const download=document.getElementById('sakDirectReaderDownload');
 if(!reader||!iframe||!download||selection<0||!reader.classList.contains('open'))return;
 let status=document.getElementById('sakEbookTranslationNotice');
 if(!status){status=document.createElement('p');status.id='sakEbookTranslationNotice';status.setAttribute('role','status');status.style.cssText='padding:9px 12px;margin:8px 10px;border-radius:10px;border:1px solid #dec88a;background:#173239;color:#fff1c2;font-size:13px;line-height:1.65';reader.querySelector('#sakDirectReaderHead')?.after(status);}
 let originalLink=document.getElementById('sakEbookArabicOriginal');
 if(!originalLink){originalLink=document.createElement('a');originalLink.id='sakEbookArabicOriginal';originalLink.target='_blank';originalLink.rel='noopener';originalLink.style.cssText='color:#d8ffef;text-decoration:underline;padding:5px';reader.querySelector('#sakDirectReaderHead')?.append(originalLink);}
 status.hidden=!lang();originalLink.hidden=!lang();
 const originalId=getOriginalId(selection);
 if(!lang()){
   const originalSrc='https://drive.google.com/file/d/'+originalId+'/preview';
   if(!iframe.src.includes('/'+originalId+'/'))iframe.src=originalSrc;
   download.href='https://drive.google.com/uc?export=download&id='+originalId;
   return;
 }
 status.textContent=note();
 originalLink.textContent='📘 Open Arabic original';
 originalLink.href='https://drive.google.com/file/d/'+originalId+'/view';
 const activeId=selection===2?SAMPLE:originalId;
 const newSrc='https://drive.google.com/file/d/'+activeId+'/preview';
 if(!iframe.src.includes('/'+activeId+'/'))iframe.src=newSrc;
 download.href='https://drive.google.com/uc?export=download&id='+activeId;
}
document.addEventListener('click',e=>{
 const book=e.target.closest?.('#sakDirectBooksGrid button');
 if(book){
   selection=[...book.parentElement.children].indexOf(book);
   queueMicrotask(update);
 }
 if(e.target.closest?.('#sakDirectReaderBack'))selection=-1;
},true);
new MutationObserver(()=>{queueMicrotask(update)}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
const wrap=()=>{
 const original=window.openSakakerEbooks;
 if(typeof original!=='function'||original.__statusWrapped)return;
 const wrapped=function(...args){const result=original.apply(this,args);queueMicrotask(update);return result};
 wrapped.__statusWrapped=true;window.openSakakerEbooks=wrapped;
};
wrap();
})();

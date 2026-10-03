(()=>{
'use strict';
const BTN_ID='sakShipStoryLibraryBtn';
const STYLE_ID='sakShipStoryLibraryStyle';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    #${BTN_ID}{
      padding:12px!important;border-radius:12px!important;
      background:linear-gradient(135deg,rgba(1,84,75,.95),rgba(81,54,4,.95))!important;
      color:#fff!important;border:1px solid rgba(255,221,95,.9)!important;
      box-shadow:0 0 10px rgba(0,255,213,.25),0 0 16px rgba(255,210,72,.22)!important;
      cursor:pointer!important;font-weight:800!important;
    }
    #${BTN_ID}:hover,#${BTN_ID}:focus-visible{filter:brightness(1.14)!important;outline:1px solid #fff3a0!important}
    #folderBody .sak-ship-story-embedded{max-width:100%!important;overflow-wrap:anywhere!important}
    #folderBody .sak-ship-story-embedded img,#folderBody .sak-ship-story-embedded video,#folderBody .sak-ship-story-embedded iframe{max-width:100%!important;height:auto!important}
  `;
  document.head.appendChild(s);
}

function mainButtonRow(){
  const main=document.querySelector('main');
  if(!main)return null;
  return [...main.querySelectorAll('div')].find(d=>d.querySelector(':scope > button'))||null;
}

function setFolderOpen(title,html){
  const modal=document.getElementById('folderModal');
  const body=document.getElementById('folderBody');
  const heading=document.getElementById('folderTitle');
  if(!modal||!body||!heading)return false;
  heading.textContent=title;
  body.innerHTML='<div class="sak-ship-story-embedded">'+html+'</div>';
  modal.classList.add('show');
  modal.style.display='flex';
  document.body.classList.add('modal-open');
  body.scrollTop=0;
  return true;
}

function cleanShipHtml(root){
  const clone=root.cloneNode(true);
  clone.querySelectorAll('#closeShip_new,script').forEach(el=>el.remove());
  clone.removeAttribute('id');
  clone.style.display='block';
  clone.style.position='static';
  clone.style.transform='none';
  clone.style.width='100%';
  clone.style.maxWidth='100%';
  clone.style.maxHeight='none';
  clone.style.overflow='visible';
  clone.style.background='transparent';
  clone.style.border='0';
  clone.style.boxShadow='none';
  clone.style.padding='0';
  return clone.innerHTML;
}

async function getShipHtml(){
  try{
    if(window.parent&&window.parent!==window){
      const source=window.parent.document.getElementById('shipPopup_new');
      if(source)return cleanShipHtml(source);
    }
  }catch(_){ }

  const res=await fetch('/index.html?ship-library-source=1',{cache:'no-store'});
  if(!res.ok)throw new Error('index fetch failed');
  const text=await res.text();
  const doc=new DOMParser().parseFromString(text,'text/html');
  const source=doc.getElementById('shipPopup_new');
  if(!source)throw new Error('ship content not found');
  return cleanShipHtml(source);
}

async function openShipStoryInLibrary(){
  const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
  const title=en?'Ship story and site anniversary':'محتوى السفينة وذكرى الموقع';
  setFolderOpen(title,en?'Loading…':'جاري تحميل المحتوى…');
  try{
    const html=await getShipHtml();
    setFolderOpen(title,html);
  }catch(err){
    setFolderOpen(title,en?'Unable to load the ship content right now.':'تعذر تحميل محتوى السفينة الآن.');
    console.error(err);
  }
}

function installButton(){
  installStyle();
  if(document.getElementById(BTN_ID))return;
  const row=mainButtonRow();
  if(!row)return;
  const b=document.createElement('button');
  b.id=BTN_ID;
  b.type='button';
  const en=(document.documentElement.lang||'').toLowerCase().startsWith('en');
  b.textContent=en?'🌙 Ship story':'🌙 محتوى السفينة';
  b.addEventListener('click',openShipStoryInLibrary);
  row.appendChild(b);
}

window.openShipStoryInLibrary=openShipStoryInLibrary;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installButton,{once:true});else installButton();
setTimeout(installButton,500);
setTimeout(installButton,1500);
})();

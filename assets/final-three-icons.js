(()=>{'use strict';
function removeVisitorCounters(){
  const selectors=[
    '#sakakerVisitorCounter','#sakakerRightStats','#visitorCounter','#visitCounter',
    '[id*="VisitorCounter"]','[id*="visitorCounter"]',
    '[class*="visitor-counter"]','[class*="visitorCounter"]'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el=>el.remove());
}
function findTextLibrary(){
  const nodes=[...document.querySelectorAll('button,[role="button"],.launcher,[title],[aria-label]')];
  return nodes.find(el=>{
    if(el.closest('#sakTextLibraryModal'))return false;
    const s=((el.getAttribute('title')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'')).replace(/\s+/g,' ').trim();
    return /المكتبة\s*النصية|Text\s*Library/i.test(s);
  })||null;
}
function removeEmptyTextLibrary(){
  const el=findTextLibrary();
  if(el)el.remove();
}
function installFacebookLinks(){
  const popup=document.getElementById('facebookVideoPopup');
  const box=popup?.querySelector('.fbVideoBox');
  if(!box||box.querySelector('#sakFacebookExtraLinks'))return;
  const links=[
    ['منشور فيسبوك 1','https://www.facebook.com/100082898274465/posts/1089659210474011/?app=fbl'],
    ['ريلز فيسبوك','https://www.facebook.com/share/r/1BQxaJUuP5/'],
    ['منشور فيسبوك 2','https://www.facebook.com/61556336314377/posts/122326658408211210/']
  ];
  const wrap=document.createElement('section');
  wrap.id='sakFacebookExtraLinks';
  wrap.setAttribute('aria-label','روابط فيسبوك');
  wrap.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin:12px 0 4px;padding:10px;border:1px solid rgba(0,255,204,.35);border-radius:14px;background:rgba(0,25,35,.45);box-shadow:inset 0 0 18px rgba(0,255,204,.08)';
  links.forEach(([label,url],i)=>{
    const a=document.createElement('a');
    a.href=url;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.textContent='📘 '+label;
    a.dataset.ar=label;
    a.dataset.en=i===1?'Facebook Reel':'Facebook Post '+(i===0?'1':'2');
    a.style.cssText='display:flex;align-items:center;justify-content:center;min-height:42px;padding:8px 10px;border-radius:11px;border:1px solid rgba(120,220,255,.5);background:linear-gradient(135deg,rgba(24,119,242,.75),rgba(0,210,190,.35));color:#fff;text-decoration:none;font:700 12px Tajawal,Tahoma,Arial,sans-serif;text-align:center;box-shadow:0 0 12px rgba(24,119,242,.22)';
    wrap.appendChild(a);
  });
  const comments=box.querySelector('.fbCommentsBox,.fbComments,.fbCommentWrite');
  if(comments)box.insertBefore(wrap,comments);
  else box.appendChild(wrap);
  const updateLanguage=()=>{
    const en=document.documentElement.lang==='en';
    wrap.querySelectorAll('a').forEach(a=>{a.textContent='📘 '+(en?a.dataset.en:a.dataset.ar)});
  };
  updateLanguage();
  new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
function run(){
  removeVisitorCounters();
  removeEmptyTextLibrary();
  installFacebookLinks();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
new MutationObserver(()=>{removeEmptyTextLibrary();installFacebookLinks()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
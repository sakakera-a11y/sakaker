(function(){
'use strict';
if(document.getElementById('sakShoppingLauncherStyle'))return;
const style=document.createElement('style');style.id='sakShoppingLauncherStyle';style.textContent=`
html body #sakakerAllIconsDock #sakShoppingIcon{position:relative!important;inset:auto!important;flex:0 0 74px!important;width:74px!important;height:80px!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;color:#e2fff3!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;pointer-events:auto!important;touch-action:manipulation!important;overflow:visible!important;transform:none!important}
#sakShoppingIcon svg{width:58px;height:58px;filter:drop-shadow(0 0 7px #7effd2)}
#sakShoppingIcon small{font:700 10px/1.2 Tahoma,Arial,sans-serif!important;color:#d0ffec;text-align:center;white-space:normal!important;text-shadow:0 0 7px #00dfab}
#sakShoppingIcon:focus-visible{outline:2px solid #ffe399!important;border-radius:10px!important}
@media(max-width:700px){html body #sakakerAllIconsDock #sakShoppingIcon{flex-basis:54px!important;width:54px!important;height:62px!important}#sakShoppingIcon svg{width:43px;height:43px}#sakShoppingIcon small{font-size:8px!important}}
`;document.head.append(style);
let button;
function label(){if(!button)return;const text=document.documentElement.lang==='en'?'Shopping & offers':'التسوق والعروض';button.setAttribute('aria-label',text);button.title=text;button.querySelector('small').textContent=text}
function mount(){const dock=document.getElementById('sakakerAllIconsDock');if(!dock)return false;if(document.getElementById('sakShoppingIcon'))return true;button=document.createElement('button');button.id='sakShoppingIcon';button.type='button';button.setAttribute('aria-haspopup','dialog');button.innerHTML='<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="sakShopMetal" x2="0" y2="1"><stop stop-color="#fff6cc"/><stop offset=".45" stop-color="#d8fff2"/><stop offset="1" stop-color="#559d8b"/></linearGradient></defs><path d="M15 22h34l5 33H10z" fill="url(#sakShopMetal)" stroke="#dfffed" stroke-width="2"/><path d="M23 25V17a9 9 0 0 1 18 0v8" fill="none" stroke="#fff0b7" stroke-width="4"/><path d="m32 30 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#08725c"/></svg><small></small>';const chess=document.getElementById('sakEmeraldChessIcon');if(chess)chess.after(button);else dock.append(button);label();button.addEventListener('click',async()=>{button.disabled=true;try{const app=await import('/assets/shopping/shop.js?v=20260930-shopping-6');app.openShop()}catch(e){alert(document.documentElement.lang==='en'?'Could not load shopping. Please retry.':'تعذر تحميل التسوق. حاول مرة أخرى.')}finally{button.disabled=false}});return true}
if(!mount()){const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true})}
new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

/* Facebook + Ship combined launcher — 2026-10-05 */
(()=>{
'use strict';
const NEW_FACEBOOK_POST='https://www.facebook.com/100028434609770/posts/1947785229512612/';
function setup(){
 const launcher=document.getElementById('facebookVideoIcon'),fbPopup=document.getElementById('facebookVideoPopup'),shipIcon=document.getElementById('shipIcon_new'),shipPopup=document.getElementById('shipPopup_new');
 if(!launcher||!fbPopup||!shipIcon||!shipPopup||document.getElementById('sakSocialShipPopup'))return false;
 const frame=fbPopup.querySelector('iframe.fbResponsiveEmbed');
 if(frame){frame.setAttribute('data-facebook-href',NEW_FACEBOOK_POST);frame.setAttribute('data-facebook-plugin','post');frame.src='https://www.facebook.com/plugins/post.php?href='+encodeURIComponent(NEW_FACEBOOK_POST)+'&show_text=true&width=500';}
 const style=document.createElement('style');style.id='sakFacebookShipCombinedStyle';style.textContent=`
 html body #shipIcon_new{display:none!important}
 html body #sakakerAllIconsDock#sakakerAllIconsDock#sakakerAllIconsDock #facebookVideoIcon.sak-social-ship-combined::after{width:78px!important;white-space:normal!important;line-height:1.15!important}
 #sakSocialShipPopup{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;background:rgba(0,8,14,.84);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
 #sakSocialShipPopup.active{display:flex}
 #sakSocialShipBox{position:relative;width:min(900px,96vw);max-height:94dvh;overflow:hidden;box-sizing:border-box;border:1px solid rgba(93,255,218,.65);border-radius:22px;background:linear-gradient(145deg,rgba(4,34,34,.98),rgba(5,18,27,.98));box-shadow:0 0 34px rgba(0,255,210,.24),0 0 50px rgba(108,79,255,.16);color:#fff}
 #sakSocialShipHead{position:sticky;top:0;z-index:4;display:flex;align-items:center;gap:10px;padding:12px 54px 10px 14px;background:rgba(3,21,27,.96);border-bottom:1px solid rgba(125,255,225,.25)}
 #sakSocialShipTitle{flex:1;margin:0;font:800 17px/1.3 Tajawal,Tahoma,Arial,sans-serif;color:#d7fff4;text-shadow:0 0 9px rgba(0,255,210,.35)}
 #sakSocialShipClose{position:absolute;top:9px;right:10px;width:38px;height:38px;border:1px solid rgba(255,255,255,.55);border-radius:50%;background:rgba(0,0,0,.58);color:#fff;font:700 22px/1 Arial;cursor:pointer}
 #sakSocialShipTabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px;background:rgba(3,19,24,.92);border-bottom:1px solid rgba(125,255,225,.18)}
 #sakSocialShipTabs button{min-height:42px;border:1px solid rgba(112,255,220,.45);border-radius:12px;background:rgba(0,72,66,.38);color:#eafff9;font:800 14px/1.2 Tajawal,Tahoma,Arial,sans-serif;cursor:pointer}
 #sakSocialShipTabs button.active{color:#071714;background:linear-gradient(135deg,#9fffe7,#ffe797);border-color:#fff3b7;box-shadow:0 0 15px rgba(100,255,220,.30)}
 #sakSocialShipContent{max-height:calc(94dvh - 112px);overflow-y:auto;overflow-x:hidden;padding:10px;box-sizing:border-box;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
 #sakSocialShipPopup .sak-combined-section[hidden]{display:none!important}
 #sakSocialShipPopup #facebookVideoPopup{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;display:block!important;padding:0!important;margin:0!important;background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;z-index:auto!important;animation:none!important}
 #sakSocialShipPopup #facebookVideoPopup .fbVideoBox{width:min(620px,100%)!important;max-width:100%!important;max-height:none!important;margin:0 auto!important}
 #sakSocialShipPopup #facebookVideoClose{display:none!important}
 #sakSocialShipPopup #shipPopup_new{display:block!important;position:relative!important;top:auto!important;left:auto!important;transform:none!important;width:100%!important;max-width:100%!important;max-height:none!important;margin:0!important;box-sizing:border-box!important;z-index:auto!important;animation:none!important}
 #sakSocialShipPopup #closeShip_new{display:none!important}
 @media(max-width:600px){#sakSocialShipPopup{padding:4px}#sakSocialShipBox{width:calc(100vw - 8px);max-height:calc(100dvh - 8px);border-radius:15px}#sakSocialShipHead{padding:9px 48px 8px 10px}#sakSocialShipTitle{font-size:14px}#sakSocialShipTabs{padding:7px;gap:6px}#sakSocialShipTabs button{min-height:40px;font-size:12px}#sakSocialShipContent{max-height:calc(100dvh - 102px);padding:6px}#sakSocialShipPopup #shipPopup_new{padding:14px!important;border-radius:15px!important}}
 `;document.head.append(style);
 shipIcon.setAttribute('aria-hidden','true');shipIcon.setAttribute('tabindex','-1');launcher.classList.add('sak-social-ship-combined');
 const modal=document.createElement('div');modal.id='sakSocialShipPopup';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.innerHTML='<div id="sakSocialShipBox"><div id="sakSocialShipHead"><h2 id="sakSocialShipTitle"></h2><button id="sakSocialShipClose" type="button">✕</button></div><div id="sakSocialShipTabs" role="tablist"><button id="sakSocialFacebookTab" type="button" role="tab" aria-controls="sakSocialFacebookSection"></button><button id="sakSocialShipTab" type="button" role="tab" aria-controls="sakSocialShipSection"></button></div><div id="sakSocialShipContent"><section id="sakSocialFacebookSection" class="sak-combined-section" role="tabpanel"></section><section id="sakSocialShipSection" class="sak-combined-section" role="tabpanel" hidden></section></div></div>';document.body.append(modal);
 const fbSection=document.getElementById('sakSocialFacebookSection'),shipSection=document.getElementById('sakSocialShipSection'),close=document.getElementById('sakSocialShipClose'),facebookTab=document.getElementById('sakSocialFacebookTab'),shipTab=document.getElementById('sakSocialShipTab'),content=document.getElementById('sakSocialShipContent');fbSection.append(fbPopup);shipSection.append(shipPopup);
 let oldOverflow='';
 function language(){const en=document.documentElement.lang==='en',label=en?'Facebook • Ship':'فيس بوك • السفينة';launcher.dataset.gullLabel=label;launcher.setAttribute('aria-label',label);launcher.title=label;const t=launcher.querySelector('.fbIconText');if(t)t.textContent=label;document.getElementById('sakSocialShipTitle').textContent=en?'Facebook & Ship':'فيس بوك والسفينة';facebookTab.textContent=en?'Facebook':'فيس بوك';shipTab.textContent=en?'Ship':'السفينة';close.setAttribute('aria-label',en?'Close':'إغلاق')}
 function show(which){const fb=which!=='ship';fbSection.hidden=!fb;shipSection.hidden=fb;facebookTab.classList.toggle('active',fb);shipTab.classList.toggle('active',!fb);facebookTab.setAttribute('aria-selected',String(fb));shipTab.setAttribute('aria-selected',String(!fb));fbPopup.classList.toggle('active',fb);content.scrollTop=0;if(fb)setTimeout(()=>window.dispatchEvent(new Event('resize')),30)}
 function open(){language();show('facebook');oldOverflow=document.body.style.overflow;modal.classList.add('active');document.body.style.overflow='hidden';close.focus()}
 function shut(){modal.classList.remove('active');fbPopup.classList.remove('active');document.body.style.overflow=oldOverflow;launcher.focus()}
 launcher.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open()},true);launcher.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;e.preventDefault();e.stopImmediatePropagation();open()},true);facebookTab.onclick=()=>show('facebook');shipTab.onclick=()=>show('ship');close.onclick=shut;modal.addEventListener('click',e=>{if(e.target===modal)shut()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('active'))shut()});new MutationObserver(language).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});language();show('facebook');return true;
}
if(!setup()){const observer=new MutationObserver(()=>{if(setup())observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true})}
})();

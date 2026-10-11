/* Position the original live clock and date below payment, without resetting their values. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 let wrapper;
 function install(){
  if($('sakClockPaymentStyle'))return;
  const st=document.createElement('style');st.id='sakClockPaymentStyle';
  st.textContent=[
   'html body #sakClockUnderPayment{position:fixed!important;left:8px!important;right:auto!important;bottom:8px!important;top:auto!important;z-index:2147483050!important;box-sizing:border-box!important;width:180px!important;max-width:calc(100vw - 12px)!important;min-height:54px!important;max-height:100px!important;margin:0!important;padding:7px 8px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;border:1.5px solid #ffe5a2!important;border-radius:15px!important;background:linear-gradient(135deg,rgba(3,35,43,.9),rgba(5,65,62,.86))!important;box-shadow:0 0 13px rgba(255,214,105,.7),inset 0 0 12px rgba(108,255,213,.18)!important;color:#fff3b5!important;text-align:center!important;pointer-events:none!important;}',
   'html body #sakClockUnderPayment #clock{grid-area:auto!important;display:block!important;position:static!important;width:100%!important;margin:0!important;padding:0!important;font:1000 clamp(18px,4.6vw,24px)/1.2 Tahoma,Arial,sans-serif!important;letter-spacing:0!important;color:#fff4b0!important;-webkit-text-fill-color:#fff4b0!important;white-space:nowrap!important;text-align:center!important;text-shadow:0 0 5px #fff1bf,0 0 13px #ffc766!important;}',
   'html body #sakClockUnderPayment #date{grid-area:auto!important;display:block!important;position:static!important;width:100%!important;margin:0!important;padding:0!important;font:800 clamp(11px,3.2vw,14px)/1.3 Tahoma,Arial,sans-serif!important;color:#aafff0!important;-webkit-text-fill-color:#aafff0!important;white-space:normal!important;text-align:center!important;overflow-wrap:anywhere!important;text-shadow:0 0 8px #24eddd!important;}',
   'html body #sakClockUnderPayment #clock::before{content:none!important;display:none!important;}',
   'body.locked #sakClockUnderPayment,body.sak-ebook-layer-open #sakClockUnderPayment,body.sakaker-fb-popup-open #sakClockUnderPayment{display:none!important;}',
   '@media(max-width:600px){html body #sakClockUnderPayment{width:160px!important;padding:6px 5px!important;min-height:50px!important;gap:2px!important}html body #sakClockUnderPayment #clock{font-size:19px!important}html body #sakClockUnderPayment #date{font-size:12px!important}}',
   '@media(max-width:340px){html body #sakClockUnderPayment{width:145px!important}html body #sakClockUnderPayment #clock{font-size:16px!important}}'
  ].join('\n');
  document.head.appendChild(st);
 }
 function bounds(el){if(!el)return null;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return null;const r=el.getBoundingClientRect();return r.width>1&&r.height>1?r:null}
 function place(){
  if(!wrapper||!wrapper.isConnected||document.body.classList.contains('locked'))return;
  const pay=bounds($('sakGlobalPayment')),r=wrapper.getBoundingClientRect(),w=r.width||160,h=r.height||58,vw=innerWidth,vh=innerHeight;
  const left=pay?pay.left+(pay.width-w)/2:8;
  const top=pay?pay.bottom+5:vh-h-7;
  wrapper.style.setProperty('left',Math.round(Math.max(5,Math.min(vw-w-5,left)))+'px','important');
  wrapper.style.setProperty('top',Math.round(Math.max(5,Math.min(vh-h-5,top)))+'px','important');
  wrapper.style.setProperty('right','auto','important');wrapper.style.setProperty('bottom','auto','important');
 }
 function ensure(){
  if(!document.body)return;install();
  const clock=$('clock'),date=$('date');if(!clock||!date)return;
  wrapper=$('sakClockUnderPayment')||document.createElement('div');
  wrapper.id='sakClockUnderPayment';
  wrapper.setAttribute('role','group');wrapper.setAttribute('aria-label','الساعة والتاريخ / Clock and date');
  if(wrapper.parentElement!==document.body)document.body.appendChild(wrapper);
  if(clock.parentElement!==wrapper)wrapper.appendChild(clock);
  if(date.parentElement!==wrapper)wrapper.appendChild(date);
  place();
 }
 function start(){ensure();addEventListener('resize',()=>requestAnimationFrame(place),{passive:true});addEventListener('orientationchange',()=>setTimeout(place,200),{passive:true});addEventListener('pageshow',ensure);[350,1100,2600,6000].forEach(ms=>setTimeout(ensure,ms));setInterval(()=>{if(!wrapper?.isConnected||!$('clock')||!$('date'))ensure();else place()},12000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
/* SAKAKER: adjust the actual festive header clock in-place. The site's live
 * ticker uses #sakakerWatermarkClock, not the hidden legacy #clock/#date. */
(()=>{'use strict';
  const STYLE_ID='sakClockTwoLinesLowerStyle';
  function install(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=[
      /* Leave the horizontal position/column as-is; nudge down 30px only. */
      'html body #sakFestiveHeader #sakakerWatermarkClock{transform:translateY(30px)!important;translate:none!important;min-height:37px!important;}',
      'html body #sakFestiveHeader #sakakerWatermarkClock>time{font-size:clamp(12px,1.2vw,15px)!important;font-weight:900!important;line-height:1.45!important;color:#fff2b3!important;text-shadow:0 0 5px #fff,0 0 12px #ffde73!important;}',
      'html body #sakFestiveHeader #sakakerWatermarkClock time{white-space:normal!important;overflow-wrap:anywhere!important;}',
      '@media(max-width:800px){html body #sakFestiveHeader #sakakerWatermarkClock{transform:translateY(30px)!important;}html body #sakFestiveHeader #sakakerWatermarkClock>time{font-size:12px!important;line-height:1.5!important;}}',
      '@media(max-width:380px){html body #sakFestiveHeader #sakakerWatermarkClock{transform:translateY(27px)!important;}html body #sakFestiveHeader #sakakerWatermarkClock>time{font-size:11px!important;}}',
      'body.locked #sakFestiveHeader #sakakerWatermarkClock{visibility:hidden!important;}'
    ].join('\n');
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
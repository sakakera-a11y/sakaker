/* Legacy news entry point: the old header news button is retired.
   Load the new Castle Newspaper and the independent crossword interface. */
(()=>{
  'use strict';
  if(!window.__sakCastleNewspaperLoaded&&!document.getElementById('sakCastleNewspaperLegacyLoader')){
    const script=document.createElement('script');
    script.id='sakCastleNewspaperLegacyLoader';
    script.src='/assets/castle-newspaper.js?v=20261111-diff-zones-touch1';
    script.async=true;
    document.head.appendChild(script);
  }
  if(!document.getElementById('sakakerNewsTickerLoader')){
    const ticker=document.createElement('script');
    ticker.id='sakakerNewsTickerLoader';
    ticker.src='/assets/news-ticker.js?v=20261111-live-ticker1';
    ticker.async=true;
    document.head.appendChild(ticker);
  }
  if(!document.getElementById('sakGardenCrosswordLoader')){
    const crossword=document.createElement('script');
    crossword.id='sakGardenCrosswordLoader';
    crossword.src='/assets/crossword-ui.js?v=20261109-six-by-six-crossword1';
    crossword.async=true;
    document.head.appendChild(crossword);
  }
})();
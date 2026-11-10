/* Legacy news entry point: the old header news button is retired.
   Load the new Castle Newspaper and the independent crossword interface. */
(()=>{
  'use strict';
  if(!window.__sakCastleNewspaperLoaded&&!document.getElementById('sakCastleNewspaperLegacyLoader')){
    const script=document.createElement('script');
    script.id='sakCastleNewspaperLegacyLoader';
    script.src='/assets/castle-newspaper.js?v=20261110-news-live9';
    script.async=true;
    document.head.appendChild(script);
  }
  if(!document.getElementById('sakGardenCrosswordLoader')){
    const crossword=document.createElement('script');
    crossword.id='sakGardenCrosswordLoader';
    crossword.src='/assets/crossword-ui.js?v=20261109-six-by-six-crossword1';
    crossword.async=true;
    document.head.appendChild(crossword);
  }
})();
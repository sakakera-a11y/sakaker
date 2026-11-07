/* Legacy news entry point: the old header news button is retired.
   Load the new Castle Newspaper module instead. */
(()=>{'use strict';
  if(window.__sakCastleNewspaperLoaded)return;
  if(document.getElementById('sakCastleNewspaperLegacyLoader'))return;
  const script=document.createElement('script');
  script.id='sakCastleNewspaperLegacyLoader';
  script.src='/assets/castle-newspaper.js?v=20261108-1';
  script.async=true;
  document.head.appendChild(script);
})();
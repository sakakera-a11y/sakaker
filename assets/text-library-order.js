(function () {
  'use strict';

  // Restrict changes to the dedicated text-library modal. Never remove the
  // main story modal, global buttons, or unrelated site sections.
  function removeThoughtsFromTextLibrary() {
    const modal = document.getElementById('sakTextLibraryModal');
    if (!modal) return;

    const grid = modal.querySelector('.sak-text-library-grid');
    if (!grid) return;

    grid.querySelectorAll('button, a, [role="button"]').forEach(function (item) {
      const label = [
        item.getAttribute('aria-label'),
        item.getAttribute('title'),
        item.textContent
      ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

      if (/^(📖\s*)?(خواطر|خواطر وقصص|قصص|القصص والخواطر|thoughts|thoughts\s*&\s*stories|stories|reflections)$/i.test(label)) {
        item.remove();
      }
    });
  }

  function init() {
    removeThoughtsFromTextLibrary();
    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver(removeThoughtsFromTextLibrary);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

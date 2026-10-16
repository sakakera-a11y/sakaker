(function () {
  'use strict';

  // Stories now belong in the dedicated e-book shelf. Keep original story
  // files intact; remove only standalone Thoughts/Stories launchers from the
  // site UI and never touch controls inside the e-book shelf/reader.
  const LABEL = /^(?:📖\s*)?(?:خواطر|خواطر وقصص|قصص|القصص والخواطر|thoughts|thoughts\s*&\s*stories|stories|reflections)$/i;

  function labelOf(item) {
    return [
      item.getAttribute('aria-label'),
      item.getAttribute('title'),
      item.textContent
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }

  function isEbookArea(item) {
    return !!item.closest(
      '#sakEbooksShelfModal,#sakEbookReaderModal,#reader,#booksGrid,' +
      '[data-sak-section="ebooks"],.sak-ebooks-box,.sak-ebook-reader-box'
    );
  }

  function removeThoughtsLaunchers() {
    // The legacy text-library modal may be dynamically rebuilt.
    const modal = document.getElementById('sakTextLibraryModal');
    if (modal) {
      const grid = modal.querySelector('.sak-text-library-grid');
      if (grid) {
        grid.querySelectorAll('button, a, [role="button"]').forEach(function (item) {
          if (!isEbookArea(item) && LABEL.test(labelOf(item))) item.remove();
        });
      }
    }

    // Remove exact standalone section launchers elsewhere, without touching
    // story content, generic navigation, or the e-book cards.
    document.querySelectorAll('button, a, [role="button"]').forEach(function (item) {
      if (isEbookArea(item) || item.closest('#sakTextLibraryModal')) return;
      if (!LABEL.test(labelOf(item))) return;
      const launcher = item.closest('button, a, [role="button"]') || item;
      if (!isEbookArea(launcher)) launcher.remove();
    });
  }

  function init() {
    removeThoughtsLaunchers();
    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver(removeThoughtsLaunchers);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

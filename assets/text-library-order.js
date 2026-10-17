(function () {
  'use strict';

  // Replace the former standalone Thoughts launcher with a dedicated
  // Abwalqmrzmrd book section. Keep the source stories and e-book library intact.
  const LABEL = /^(?:📖\s*)?(?:خواطر|خواطر وقصص|قصص|القصص والخواطر|thoughts|thoughts\s*&\s*stories|stories|reflections)$/i;
  const BOOK_LABEL = '📚 كتاب أبوالقمر زمرد';
  const BOOK_URL = '/abwalqmrzmrd-book.html';

  function labelOf(item) {
    const values = [
      item.getAttribute('aria-label'),
      item.getAttribute('title'),
      item.textContent
    ].filter(Boolean).map(value => value.replace(/\s+/g, ' ').trim());
    return values.find(value => LABEL.test(value)) || values.join(' ');
  }

  function isEbookArea(item) {
    return !!item.closest(
      '#sakEbooksShelfModal,#sakEbookReaderModal,#reader,#booksGrid,' +
      '[data-sak-section="ebooks"],.sak-ebooks-box,.sak-ebook-reader-box'
    );
  }

  function makeBookLauncher(item) {
    if (item.dataset.sakBookLauncher === 'true') return item;
    const replacement = item.cloneNode(true);
    replacement.dataset.sakBookLauncher = 'true';
    replacement.setAttribute('aria-label', BOOK_LABEL);
    replacement.setAttribute('title', BOOK_LABEL);
    replacement.textContent = BOOK_LABEL;

    if (replacement.tagName === 'A') {
      replacement.setAttribute('href', BOOK_URL);
      replacement.removeAttribute('target');
      replacement.removeAttribute('onclick');
    } else {
      if (replacement.tagName === 'BUTTON') replacement.type = 'button';
      replacement.setAttribute('role', replacement.tagName === 'BUTTON' ? 'button' : (replacement.getAttribute('role') || 'button'));
      if (!replacement.hasAttribute('tabindex') && replacement.tagName !== 'BUTTON') replacement.tabIndex = 0;
      replacement.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = BOOK_URL;
      };
      replacement.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          window.location.href = BOOK_URL;
        }
      });
    }
    item.replaceWith(replacement);
  }

  function updateLaunchers() {
    const modal = document.getElementById('sakTextLibraryModal');
    if (modal) {
      const grid = modal.querySelector('.sak-text-library-grid');
      if (grid) {
        grid.querySelectorAll('button, a, [role="button"]').forEach(function (item) {
          if (!isEbookArea(item) && LABEL.test(labelOf(item))) item.remove();
        });
      }
    }

    document.querySelectorAll('button, a, [role="button"]').forEach(function (item) {
      if (item.dataset.sakBookLauncher === 'true' || isEbookArea(item) || item.closest('#sakTextLibraryModal')) return;
      if (LABEL.test(labelOf(item))) makeBookLauncher(item);
    });
  }

  function init() {
    updateLaunchers();
    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver(updateLaunchers);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

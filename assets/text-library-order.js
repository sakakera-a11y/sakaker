(function () {
  'use strict';

  // Replace the former Thoughts launcher with the Abwalqmrzmrd book,
  // and also add the book as an item in the text library.
  const LABEL = /^(?:📖\s*)?(?:خواطر|خواطر وقصص|قصص|القصص والخواطر|thoughts|thoughts\s*&\s*stories|stories|reflections)$/i;
  const BOOK_LABEL = '📚 كتاب أبوالقمرزمرد';
  const BOOK_URL = '/books.html?v=20261018-book-fix';

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

  function openBook(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (typeof window.openSakakerEbooks === 'function') {
      try { window.openSakakerEbooks(); return; } catch (_) {}
    }
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'sak-open-ebooks' }, location.origin);
      return;
    }
    window.location.href = BOOK_URL;
  }

  function makeBookLauncher(item) {
    if (item.dataset.sakBookLauncher === 'true') return item;
    const replacement = item.cloneNode(true);
    replacement.dataset.sakBookLauncher = 'true';
    replacement.setAttribute('aria-label', BOOK_LABEL);
    replacement.setAttribute('title', BOOK_LABEL);
    replacement.textContent = BOOK_LABEL;

    if (replacement.tagName === 'A') {
      replacement.href = BOOK_URL;
      replacement.removeAttribute('target');
      replacement.removeAttribute('rel');
      replacement.onclick = openBook;
    } else {
      if (replacement.tagName === 'BUTTON') replacement.type = 'button';
      replacement.setAttribute('role', replacement.tagName === 'BUTTON' ? 'button' : (replacement.getAttribute('role') || 'button'));
      if (!replacement.hasAttribute('tabindex') && replacement.tagName !== 'BUTTON') replacement.tabIndex = 0;
      replacement.onclick = openBook;
      replacement.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') openBook(event);
      });
    }
    item.replaceWith(replacement);
    return replacement;
  }

  function addBookToTextLibrary() {
    const modal = document.getElementById('sakTextLibraryModal');
    const grid = modal && modal.querySelector('.sak-text-library-grid');
    if (!grid || grid.querySelector('[data-sak-book-library-item="true"]')) return;

    // Reuse the library's existing item styling where possible.
    const sample = grid.querySelector('button, a, [role="button"]');
    let item;
    if (sample) {
      item = sample.cloneNode(true);
      item.removeAttribute('id');
      item.removeAttribute('onclick');
      item.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      item.classList.add('sak-book-library-item');
    } else {
      item = document.createElement('button');
      item.type = 'button';
    }

    item.dataset.sakBookLibraryItem = 'true';
    item.dataset.sakBookLauncher = 'true';
    item.setAttribute('aria-label', BOOK_LABEL);
    item.setAttribute('title', BOOK_LABEL);
    item.textContent = BOOK_LABEL;
    if (item.tagName === 'A') {
      item.href = BOOK_URL;
      item.removeAttribute('target');
      item.removeAttribute('rel');
      item.onclick = openBook;
    } else {
      item.type = 'button';
      item.onclick = openBook;
    }
    grid.appendChild(item);
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
      addBookToTextLibrary();
    }

    document.querySelectorAll('button, a, [role="button"], .launcher').forEach(function (item) {
      if (item.dataset.sakBookLauncher === 'true' || isEbookArea(item) || item.closest('#sakTextLibraryModal')) return;
      if (LABEL.test(labelOf(item))) makeBookLauncher(item);
    });
  }

  function init() {
    updateLaunchers();
    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver(function () {
        updateLaunchers();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
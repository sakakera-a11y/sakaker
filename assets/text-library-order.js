(function () {
  'use strict';

  const EBOOK_ID = 'sakEbooksLibraryBtn';

  function isEnglish() {
    return (document.documentElement.lang || '').toLowerCase().startsWith('en');
  }

  function ensureEbooksButton() {
    const main = document.querySelector('main');
    if (!main) return;
    let button = document.getElementById(EBOOK_ID);
    if (!button) {
      button = document.createElement('button');
      button.id = EBOOK_ID;
      button.type = 'button';
      main.appendChild(button);
    }
    const label = isEnglish() ? 'E-Books' : 'الكتب الإلكترونية';
    const ariaLabel = isEnglish() ? 'Open e-books' : 'فتح الكتب الإلكترونية';
    if (button.textContent !== label) button.textContent = label;
    if (button.getAttribute('aria-label') !== ariaLabel) button.setAttribute('aria-label', ariaLabel);
  }

  function removeThoughtsSection() {
    document.querySelectorAll('main button, main a, main [role="button"]').forEach(function (element) {
      if (element.id === EBOOK_ID) return;
      const label = [
        element.getAttribute('aria-label') || '',
        element.getAttribute('title') || '',
        element.dataset && element.dataset.sakSection || '',
        element.textContent || ''
      ].join(' ').replace(/\\s+/g, ' ').trim();
      if (/^(قصص|خواطر|خاطرة|القصص والخواطر|stories|reflections|stories & reflections)$/i.test(label)) {
        element.remove();
      }
    });

    const obsoleteModal = document.getElementById('folderModal');
    if (obsoleteModal) obsoleteModal.remove();
  }

  function init() {
    removeThoughtsSection();
    ensureEbooksButton();

    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver(function () {
        removeThoughtsSection();
        ensureEbooksButton();
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
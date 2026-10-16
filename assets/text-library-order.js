(function () {
  'use strict';

  const EBOOK_ID = 'sakEbooksLibraryBtn';
  const REMOVED_SECTION_KEYS = new Set(['stories', 'thoughts', 'reflections', 'khwater']);

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

  function isThoughtsLabel(value) {
    const label = String(value || '').replace(/\s+/g, ' ').trim();
    return /^(قصص|خواطر|خاطرة|القصص والخواطر|قصص وخواطر|stories|thoughts|reflections|stories & reflections)$/i.test(label);
  }

  function removeThoughtsSection() {
    // Remove the actual text-library category by its stable data key, wherever the
    // library modal is mounted (it is not necessarily a child of <main>).
    document.querySelectorAll('[data-sak-section]').forEach(function (element) {
      const key = String(element.getAttribute('data-sak-section') || '').toLowerCase().trim();
      if (element.id !== EBOOK_ID && REMOVED_SECTION_KEYS.has(key)) element.remove();
    });

    // Also remove legacy category controls identified by their visible/accessibility label.
    document.querySelectorAll('button, a, [role="button"]').forEach(function (element) {
      if (element.id === EBOOK_ID) return;
      const labels = [
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
        element.textContent
      ];
      if (labels.some(isThoughtsLabel)) element.remove();
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
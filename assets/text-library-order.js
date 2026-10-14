(function () {
  'use strict';

  const HOST_ID = 'sakTextLibrarySections';
  const EBOOK_ID = 'sakEbooksLibraryBtn';
  const MODAL_ID = 'folderModal';
  let stories = [];
  let currentView = 'list';

  function ensureFolderModal() {
    let modal = document.getElementById(MODAL_ID);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = MODAL_ID;
      modal.className = 'modal sak-generated-folder-modal';
      modal.innerHTML = '<div class="panel"><h2 id="folderTitle">القصص والخواطر</h2><div id="folderBody"></div></div>';
      document.body.appendChild(modal);
    }
    return modal;
  }

  function style() {
    if (document.getElementById('sakLibraryOrderStyle')) return;
    const s = document.createElement('style');
    s.id = 'sakLibraryOrderStyle';
    s.textContent =
      '#' + HOST_ID + '{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:1rem}' +
      '#' + HOST_ID + ' .card{padding:1rem;background:var(--panel-bg,#fff);color:var(--text-color,#222);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.08)}' +
      '#' + HOST_ID + ' .card h3{margin:0 0 .5rem;font-size:1.05rem;line-height:1.5}' +
      '#' + HOST_ID + ' .story-title-button{font:inherit;font-weight:700;text-align:inherit;line-height:inherit;padding:0;border:0;background:transparent;color:inherit;cursor:pointer}' +
      '#' + HOST_ID + ' .story-title-button:hover{text-decoration:underline}' +
      '#' + HOST_ID + ' .card .lead{margin:0 0 .85rem;color:var(--text-color,#333);line-height:1.7}' +
      '#' + HOST_ID + ' .story-read{cursor:pointer;border:0;border-radius:8px;padding:.55rem .9rem;background:var(--accent-color,#087f8c);color:#fff}' +
      '#folderBody .story-detail{line-height:1.9;white-space:normal;overflow-wrap:anywhere}' +
      '#folderBody .story-detail p{margin:0 0 1rem}' +
      '#folderBody .story-back{cursor:pointer;margin:0 0 1rem;border:1px solid currentColor;border-radius:8px;padding:.45rem .8rem;background:transparent;color:inherit}';
    document.head.appendChild(s);
  }

  function isEnglish() {
    return (document.documentElement.lang || '').toLowerCase().startsWith('en');
  }

  function setText(element, text) {
    element.textContent = text == null ? '' : String(text);
  }

  function openStory(story) {
    const en = isEnglish();
    const modal = ensureFolderModal();
    const title = document.getElementById('folderTitle');
    const body = document.getElementById('folderBody');
    const item = en ? (story.en || story.ar) : (story.ar || story.en);
    if (!title || !body || !item) return;

    currentView = 'detail';
    setText(title, item.title || (en ? 'Story' : 'قصة'));
    body.replaceChildren();

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'story-back';
    setText(back, en ? '← Back to stories' : '→ العودة إلى القصص');
    back.addEventListener('click', showThoughts);
    body.appendChild(back);

    const detail = document.createElement('article');
    detail.className = 'story-detail';
    if (item.lead) {
      const lead = document.createElement('p');
      lead.className = 'lead';
      lead.style.fontWeight = '600';
      setText(lead, item.lead);
      detail.appendChild(lead);
    }

    (Array.isArray(item.paragraphs) ? item.paragraphs : []).forEach(function (paragraph) {
      const p = document.createElement('p');
      setText(p, paragraph);
      detail.appendChild(p);
    });

    body.appendChild(detail);
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
  }

  function renderThoughts() {
    const en = isEnglish();
    const modal = ensureFolderModal();
    const title = document.getElementById('folderTitle');
    const body = document.getElementById('folderBody');
    if (!title || !body || !modal) return;

    currentView = 'list';
    setText(title, en ? 'Stories & Reflections' : 'القصص والخواطر');
    body.replaceChildren();

    if (!Array.isArray(stories) || stories.length === 0) {
      const empty = document.createElement('p');
      setText(empty, en ? 'No stories available right now.' : 'لا توجد قصص للعرض حاليًا.');
      body.appendChild(empty);
      return;
    }

    const host = document.createElement('div');
    host.id = HOST_ID;
    host.setAttribute('aria-live', 'polite');

    stories.slice().sort(function (a, b) {
      const aSerial = Number(a && a.serial);
      const bSerial = Number(b && b.serial);
      // Keep the requested featured story (serial 8) first, then preserve
      // the numeric order of all remaining stories.
      if (aSerial === 8 && bSerial !== 8) return -1;
      if (bSerial === 8 && aSerial !== 8) return 1;
      return (Number.isFinite(aSerial) ? aSerial : Number.MAX_SAFE_INTEGER) -
        (Number.isFinite(bSerial) ? bSerial : Number.MAX_SAFE_INTEGER);
    }).forEach(function (story) {
      const card = document.createElement('article');
      card.className = 'card';
      const item = en ? (story.en || story.ar) : (story.ar || story.en);
      if (!item) return;

      const h = document.createElement('h3');
      const titleButton = document.createElement('button');
      titleButton.type = 'button';
      titleButton.className = 'story-title-button';
      setText(titleButton, item.title || (en ? 'Untitled story' : 'قصة بلا عنوان'));
      titleButton.addEventListener('click', function () { openStory(story); });
      h.appendChild(titleButton);
      card.appendChild(h);

      if (item.lead) {
        const lead = document.createElement('p');
        lead.className = 'lead';
        setText(lead, item.lead);
        card.appendChild(lead);
      }

      const read = document.createElement('button');
      read.type = 'button';
      read.className = 'story-read';
      setText(read, en ? 'Read story' : 'اقرأ القصة');
      read.addEventListener('click', function () { openStory(story); });
      card.appendChild(read);
      host.appendChild(card);
    });

    body.appendChild(host);
  }

  function showThoughts() {
    renderThoughts();
    const modal = ensureFolderModal();
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
  }

  function loadStories() {
    return fetch('/data/khwater.json', { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load khwater.json: ' + response.status);
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error('khwater.json must contain an array');
        stories = data.filter(function (story) {
          return story && (story.ar || story.en);
        });
        if (currentView === 'detail') return;
        renderThoughts();
      })
      .catch(function (error) {
        console.warn('Failed to load khwater stories', error);
      });
  }

  function ensureEbooksButton() {
    const main = document.querySelector('main');
    if (!main) return null;
    let button = document.getElementById(EBOOK_ID);
    if (!button) {
      button = document.createElement('button');
      button.id = EBOOK_ID;
      button.type = 'button';
      button.textContent = isEnglish() ? 'Ebooks' : 'الموسوعة';
      main.appendChild(button);
    }
    return button;
  }

  function arrange() {
    if (!document.querySelector('main')) return;
    style();
    ensureEbooksButton();
  }

  function lift() {
    ['sakTextLibraryModal', 'folderModal', 'quizModal', 'puzzleModal', 'sakakerSiteNewsModal', 'sakBooksAppLayer']
      .forEach(function (id) {
        const element = document.getElementById(id);
        if (element && element.parentElement && element.id !== MODAL_ID) {
          element.parentElement.removeChild(element);
        }
      });
  }

  function init() {
    ensureFolderModal();
    arrange();
    lift();
    renderThoughts();
    loadStories();
    window.showKhwater = showThoughts;
    window.addKhwaterStory = function (story) {
      if (!story || !story.ar || !story.en ||
          !Array.isArray(story.ar.paragraphs) || !Array.isArray(story.en.paragraphs)) return false;
      story.serial = Math.max(0, Number(story.serial) || 0);
      stories.push(story);
      renderThoughts();
      return true;
    };

    document.addEventListener('click', function (event) {
      const button = event.target && event.target.closest
        ? event.target.closest('button,[role="button"],a')
        : null;
      if (!button || button.classList.contains('story-read') || button.classList.contains('story-title-button') || button.classList.contains('story-back')) return;
      const searchable = [
        button.dataset && button.dataset.sakSection || '',
        button.getAttribute('aria-label') || '',
        button.getAttribute('title') || '',
        button.id || '',
        typeof button.className === 'string' ? button.className : '',
        button.textContent || ''
      ].join(' ');
      if (/story|reflection|خاطرة|قصص|خواطر/i.test(searchable)) {
        event.preventDefault();
        showThoughts();
      }
    }, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
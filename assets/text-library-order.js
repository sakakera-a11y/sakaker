(function(){
  'use strict';
  const HOST_ID = 'sakTextLibrarySections';
  const EBOOK_ID = 'sakEbooksLibraryBtn';

  function ensureFolderModal(){
    if (document.getElementById('folderModal')) return;
    try {
      const modal = document.createElement('div');
      modal.id = 'folderModal';
      modal.className = 'modal sak-generated-folder-modal';
      modal.innerHTML = '<div class="panel"><h2 id="folderTitle">القصص والخواطر</h2><div id="folderBody"></div></div>';
      document.body.appendChild(modal);
    } catch (e) {
      console.warn('ensureFolderModal failed', e);
    }
  }

  function style(){
    if (document.getElementById('sakLibraryOrderStyle')) return;
    const s = document.createElement('style');
    s.id = 'sakLibraryOrderStyle';
    s.textContent = `#${HOST_ID}{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}#${HOST_ID} .card{padding:1rem;background:var(--panel-bg,#fff);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.08)}#${HOST_ID} .card h3{margin:0 0 .5rem;font-size:1.05rem}#${HOST_ID} .card .lead{margin:0;color:var(--text-color,#333);line-height:1.6}`;
    document.head.appendChild(s);
  }

  let stories = [];

  function renderThoughts(){
    const en = document.documentElement.lang === 'en';
    const title = document.getElementById('folderTitle');
    const body = document.getElementById('folderBody');
    const modal = document.getElementById('folderModal');

    if (!title || !body || !modal) return;

    if (!Array.isArray(stories) || stories.length === 0) {
      body.innerHTML = '<div class="card"><h3>' + (en ? 'No stories available' : 'لا توجد قصص للعرض حاليا') + '</h3></div>';
      return;
    }

    body.innerHTML = '';
    const host = document.createElement('div');
    host.id = HOST_ID;
    host.setAttribute('aria-live', 'polite');

    stories.forEach((story) => {
      const card = document.createElement('article');
      card.className = 'card';
      const item = en ? (story.en || story.ar) : (story.ar || story.en);
      const titleText = item?.title || '';
      const leadText = item?.lead || '';
      const p = document.createElement('p');
      p.className = 'lead';
      p.textContent = leadText;
      const h = document.createElement('h3');
      h.textContent = titleText;
      card.appendChild(h);
      card.appendChild(p);
      host.appendChild(card);
    });

    body.appendChild(host);
  }

  function loadStories(){
    return fetch('/data/khwater.json', { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load khwater.json: ' + r.status);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          stories = data;
          renderThoughts();
        }
      })
      .catch((e) => {
        console.warn('Failed to load khwater stories', e);
      });
  }

  function ensureEbooksButton(){
    const main = document.querySelector('main');
    if (!main) return null;
    let btn = document.getElementById(EBOOK_ID);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = EBOOK_ID;
      btn.type = 'button';
      btn.textContent = 'Ebooks';
      main.appendChild(btn);
    }
    return btn;
  }

  function arrange(){
    const main = document.querySelector('main');
    if (!main) return;
    style();
    ensureEbooksButton();
  }

  function lift(){
    ['sakTextLibraryModal','folderModal','quizModal','puzzleModal','sakakerSiteNewsModal','sakBooksAppLayer'].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.parentElement) el.parentElement.removeChild(el);
    });
  }

  function init(){
    ensureFolderModal();
    arrange();
    lift();
    renderThoughts();
    loadStories();
    window.showKhwater = renderThoughts;
    window.addKhwaterStory = function(story){
      if (!story || !story.ar || !story.en || !Array.isArray(story.ar.paragraphs) || !Array.isArray(story.en.paragraphs)) return false;
      story.serial = Math.max(0, Number(story.serial) || 0);
      stories.push(story);
      renderThoughts();
      return true;
    };
    document.addEventListener('click', (event) => {
      const btn = event.target && event.target.closest ? event.target.closest('button,[role="button"],a') : null;
      if (!btn) return;
      const text = ((btn.dataset && btn.dataset.sakSection) || '') + ' ' + (btn.getAttribute('aria-label') || '') + ' ' + (btn.getAttribute('title') || '') + ' ' + (btn.id || '') + ' ' + (btn.className || '');
      if (/story|خاطرة|قصص|خواطر/.test(text.toLowerCase())) {
        event.preventDefault();
        renderThoughts();
      }
    }, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

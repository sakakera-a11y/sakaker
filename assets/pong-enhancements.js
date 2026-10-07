(() => {
  'use strict';
  const arena = document.getElementById('sakPongArena');
  if (!arena || document.getElementById('spxInvite')) return;
  const locale = () => document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'ar';
  const copy = {
    ar: { invite:'🔗 دعوة صديق', joinInvite:'🎮 انضم إلى الغرفة', joinInviteTitle:'انضم إلى الغرفة من رابط الدعوة', inviteTitle:'نسخ رابط دعوة لهذه الغرفة', inviteReady:'انسخ رابط الدعوة وأرسله لصديقك ليدخل إلى هذه الغرفة.', inviteFirst:'أنشئ غرفة أولًا لتفعيل رابط الدعوة.', copied:'تم نسخ رابط الدعوة', shareTitle:'انضم إلى مباراة Pong في SAKAKER', helpTitle:'طريقة اللعب', help:'اسحب المضرب أو حرّك الفأرة فوق الملعب. على لوحة المفاتيح استخدم ↑ ↓ أو W و S. أنشئ غرفة وأرسل رابط الدعوة، أو انضم باستخدام الرمز أو من قائمة الغرف العامة.', copyFallback:'تعذر النسخ تلقائيًا؛ انسخ الرابط من شريط العنوان.', inviteLabel:'دعوة صديق إلى الغرفة' },
    en: { invite:'🔗 Invite a friend', joinInvite:'🎮 Join invited room', joinInviteTitle:'Join the room from this invitation', inviteTitle:'Copy an invitation link to this room', inviteReady:'Copy the invite link and send it to a friend to join this room.', inviteFirst:'Create a room first to enable its invitation link.', copied:'Invitation link copied', shareTitle:'Join a Pong match on SAKAKER', helpTitle:'How to play', help:'Drag your paddle or move the mouse over the court. On a keyboard, use ↑ ↓ or W and S. Create a room and share its invite link, or join with a code or from the public rooms list.', copyFallback:'Automatic copying failed; copy the link from the address bar.', inviteLabel:'Invite a friend to this room' }
  };
  const t = key => copy[locale()][key];
  const codeInput = document.getElementById('sakPongCode');
  const status = document.getElementById('sakPongStatus');
  const copyButton = document.getElementById('sakPongCopy');
  const actionRow = copyButton?.parentElement;
  const courtHelp = arena.querySelector('.sp-layout > div > p[data-sp="help"]');
  if (!codeInput || !actionRow || !courtHelp) return;

  const style = document.createElement('style');
  style.textContent = [
    '#sakPongArena .spx-invite{border-color:#ffd45a;background:linear-gradient(135deg,#154a42,#176847);font-weight:700}',
    '#sakPongArena .spx-invite:not(:disabled){box-shadow:0 0 0 1px #ffd45a55,0 5px 16px #00d9a333}',
    '#sakPongArena .spx-join{border-color:#79ffd1;background:linear-gradient(135deg,#0d604f,#124b74);font-weight:700}',
    '#sakPongArena .spx-invite:focus-visible,#sakPongArena .spx-tips summary:focus-visible{outline:3px solid #ffe16b;outline-offset:2px}',
    '#sakPongArena .spx-tips{margin:8px 0 0;padding:8px 11px;border:1px solid #8fdba955;border-radius:12px;background:linear-gradient(120deg,#062d38,#092b25);color:#eafff5}',
    '#sakPongArena .spx-tips summary{cursor:pointer;font-weight:700;color:#ffe58b}',
    '#sakPongArena .spx-tips p{margin:7px 0 0;line-height:1.75}',
    '#sakPongArena .spx-toast{min-height:1.4em;margin-top:4px;color:#ffe58b;font-size:12px}',
    '@media(max-width:720px){#sakPongArena .spx-invite,#sakPongArena .spx-join{flex:1 1 140px}}',
    '@media(prefers-reduced-motion:reduce){#sakPongArena .spx-invite{scroll-behavior:auto}}'
  ].join('');
  document.head.append(style);

  const inviteButton = document.createElement('button');
  inviteButton.id = 'spxInvite';
  inviteButton.type = 'button';
  inviteButton.className = 'spx-invite';
  inviteButton.setAttribute('aria-label', t('inviteLabel'));
  inviteButton.title = t('inviteTitle');
  inviteButton.textContent = t('invite');
  inviteButton.disabled = true;
  copyButton.insertAdjacentElement('afterend', inviteButton);
  const inviteCode = (new URL(location.href).searchParams.get('pongRoom') || '').replace(/[^A-Fa-f0-9]/g, '').slice(0, 12).toUpperCase();
  const joinButton = document.createElement('button');
  joinButton.id = 'spxJoinInvite';
  joinButton.type = 'button';
  joinButton.className = 'spx-join';
  joinButton.textContent = t('joinInvite');
  joinButton.title = t('joinInviteTitle');
  joinButton.hidden = !inviteCode || codeInput.value.toUpperCase() !== inviteCode;
  joinButton.addEventListener('click', () => document.getElementById('sakPongJoin')?.click());
  inviteButton.insertAdjacentElement('afterend', joinButton);

  const tips = document.createElement('details');
  tips.className = 'spx-tips';
  const summary = document.createElement('summary');
  summary.textContent = t('helpTitle');
  const help = document.createElement('p');
  help.textContent = t('help');
  tips.append(summary, help);
  courtHelp.insertAdjacentElement('afterend', tips);

  const toast = document.createElement('div');
  toast.className = 'spx-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  tips.append(toast);

  let toastTimer;
  function refresh() {
    const valid = /^[A-Fa-f0-9]{12}$/.test(codeInput.value.trim());
    inviteButton.disabled = !valid;
    inviteButton.title = valid ? t('inviteTitle') : t('inviteFirst');
    inviteButton.setAttribute('aria-label', t('inviteLabel'));
    joinButton.hidden = !inviteCode || codeInput.value.toUpperCase() !== inviteCode;
  }
  function notify(message) {
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.textContent = ''; }, 4000);
  }
  function inviteUrl() {
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('pongRoom', codeInput.value.trim().toUpperCase());
    return url.toString();
  }
  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.append(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    if (!copied) throw new Error('copy-failed');
  }
  inviteButton.addEventListener('click', async () => {
    refresh();
    if (inviteButton.disabled) return;
    const url = inviteUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: t('shareTitle'), text: t('inviteReady'), url });
        notify(t('copied'));
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    try {
      await copyText(url);
      notify(t('copied'));
    } catch {
      notify(t('copyFallback'));
    }
  });
  codeInput.addEventListener('input', refresh);
  arena.addEventListener('click', event => {
    if (event.target.closest('#sakPongCreate, #sakPongJoin, #sakPongLeave')) {
      setTimeout(refresh, 0);
      setTimeout(refresh, 350);
    }
  });
  if (status) new MutationObserver(refresh).observe(status, { childList:true, characterData:true, subtree:true });
  new MutationObserver(() => {
    summary.textContent = t('helpTitle');
    help.textContent = t('help');
    inviteButton.textContent = t('invite');
    joinButton.textContent = t('joinInvite');
    joinButton.title = t('joinInviteTitle');
    inviteButton.setAttribute('aria-label', t('inviteLabel'));
    refresh();
  }).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  refresh();
})();

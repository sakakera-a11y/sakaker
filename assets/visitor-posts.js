import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const VISITOR_APP_URL = "https://script.google.com/macros/s/AKfycbwFmkvE9YpTbGfE5nZsFYx8mNG4v_XB4TfPBDSuUKmdRmk3rhQc3iFT_eLGHg85TAMiwg/exec";
const AUTH_ORIGINS = new Set(["https://sakaker.co", "https://www.sakaker.co", "https://sakakera-a11y.github.io"]);

const CLOCK_TIME_RE = /[0-9٠-٩]{1,2}\s*[:٫][0-9٠-٩]{2}\s*(?:ص|م|a\.?m\.?|p\.?m\.?)?/i;

function findClockNode() {
  const selectors = 'time,[id*="clock" i],[class*="clock" i],[id*="dateTime" i],[class*="dateTime" i],[id*="siteTime" i],[class*="siteTime" i]';
  const pool = new Set(document.querySelectorAll(selectors));
  document.querySelectorAll("p,span,div,section,output").forEach(el => {
    const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length >= 5 && text.length <= 180 && CLOCK_TIME_RE.test(text)) pool.add(el);
  });
  const visible = [...pool].filter(el => {
    if (!el || el.closest("#visitorClockDock,#visitorPostsOverlay,#loginOverlay")) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1 &&
      text.length <= 180 && CLOCK_TIME_RE.test(text);
  });
  visible.sort((a, b) =>
    a.children.length - b.children.length ||
    (a.innerText || a.textContent || "").length - (b.innerText || b.textContent || "").length ||
    (a.getBoundingClientRect().width * a.getBoundingClientRect().height) -
      (b.getBoundingClientRect().width * b.getBoundingClientRect().height)
  );
  return visible[0] || null;
}

function positionVisitorClock(host) {
  if (!host || !host.isConnected) return;
  host.style.setProperty("position","fixed","important");
  host.style.setProperty("left","50%","important");
  host.style.setProperty("right","auto","important");
  host.style.setProperty("top","auto","important");
  host.style.setProperty("bottom","max(8px, env(safe-area-inset-bottom))","important");
  host.style.setProperty("transform","translateX(-50%)","important");
  host.style.setProperty("width","calc(50vw - 16px)","important");
  host.style.setProperty("height","42px","important");
  host.style.setProperty("max-width","calc(50vw - 16px)","important");
  const dock=document.getElementById("sakakerAllIconsDock");
  if(dock)dock.style.setProperty("bottom","max(62px, calc(54px + env(safe-area-inset-bottom)))","important");
}

function installVisitorPosts() {
  const css = document.createElement("style");
  css.id = "visitorPostsStyle";
  css.textContent = `
    html body:has(#visitorPostsSection){display:block!important;min-height:100vh}
    :is(.sak-festival,.news-ticker,#visitorPostsSection){box-sizing:border-box!important;width:calc(50vw - 16px)!important;height:42px!important;min-height:42px!important;max-height:42px!important;max-width:calc(50vw - 16px)!important;padding:5px 9px!important;border:1px solid rgba(75,226,199,.88)!important;border-radius:16px!important;background:linear-gradient(135deg,rgba(5,41,50,.88),rgba(20,29,48,.9))!important;box-shadow:0 0 14px rgba(0,255,204,.18),0 0 14px rgba(255,215,0,.12)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}
    #visitorPostsSection{margin:8px 6px!important;padding:3px 6px!important;display:flex!important;flex:0 0 auto;align-items:stretch;justify-content:stretch;text-align:center;direction:inherit;position:relative!important;z-index:30!important;pointer-events:auto!important}
    #visitorPostsSection .visitor-posts-copy{display:none!important}
    /* Four top widgets share two aligned rows; the visitor button sits beside the New Year counter. */
    html body #sakFestiveHeader #sakHolidayCountdowns{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-areas:"newyear visitor" "christmas news"!important;align-items:stretch!important;gap:6px!important;width:100%!important;max-width:100%!important;min-width:0!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>:is(.sak-festival,#sakNewsLaunch,#visitorPostsSection){box-sizing:border-box!important;width:100%!important;height:clamp(64px,10vw,74px)!important;min-height:clamp(64px,10vw,74px)!important;max-height:clamp(64px,10vw,74px)!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:5px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;overflow:hidden!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>.sak-festival:first-of-type{grid-area:newyear;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:center!important;text-align:center!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>.sak-festival:nth-of-type(2){grid-area:christmas;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:center!important;text-align:center!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>.sak-festival .sak-festival-title{font-size:clamp(8px,1.5vw,11px)!important;line-height:1.25!important;overflow:hidden!important;text-overflow:ellipsis!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>.sak-festival .sak-festival-unit b{font-size:clamp(11px,2vw,15px)!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>#sakNewsLaunch{grid-area:news;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;white-space:normal!important;line-height:1.35!important;font-size:clamp(9px,1.7vw,12px)!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>#visitorPostsSection{grid-area:visitor;display:flex!important;align-items:stretch!important;justify-content:stretch!important}
    html body #sakFestiveHeader #sakHolidayCountdowns>#visitorPostsSection #visitorPostsCard{box-sizing:border-box!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;padding:2px!important;gap:4px!important}
    html body #visitorClockDock{border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
    @media(max-width:800px){html body #sakFestiveHeader #sakHolidayCountdowns{grid-column:1/-1!important;grid-row:2!important;width:100%!important;max-width:none!important;justify-self:stretch!important}}
    @media(max-width:380px){html body #sakFestiveHeader #sakHolidayCountdowns{gap:4px!important}html body #sakFestiveHeader #sakHolidayCountdowns>:is(.sak-festival,#sakNewsLaunch,#visitorPostsSection){height:64px!important;min-height:64px!important;max-height:64px!important;padding:4px!important}html body #sakFestiveHeader #sakHolidayCountdowns>#visitorPostsSection #visitorPostsCard{gap:2px!important}html body #sakFestiveHeader #sakHolidayCountdowns>#visitorPostsSection .visitor-gull{width:22px!important;height:20px!important}}
    #sakakerNewsSlot:empty,#sakakerNewsSlot.visitor-slot-empty,#sakakerClockSlot:empty{display:none!important;width:0!important;height:0!important;min-height:0!important;max-height:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
    #visitorClockDock{position:fixed!important;left:50%!important;right:auto!important;top:auto!important;bottom:max(8px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;z-index:2147482999!important;min-width:0!important;padding:4px 8px!important;color:#fff!important;text-align:center!important;pointer-events:none!important;overflow:hidden!important}
    #visitorClockDock::before{content:"◷";display:inline-block;margin-inline-end:6px;color:#ffe27a;font:700 18px/1 Arial,sans-serif;text-shadow:0 0 8px rgba(255,215,0,.5);vertical-align:middle}
    #visitorClockDock .visitor-clock-dock-content{box-sizing:border-box!important;display:inline-block!important;vertical-align:middle!important;width:auto!important;max-width:calc(100% - 30px)!important;height:auto!important;max-height:30px!important;margin:0!important;color:#fff!important;font:700 9px/1.25 Tahoma,Arial,sans-serif!important;text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    #visitorPostsCard{box-sizing:border-box!important;width:100%!important;height:100%!important;min-height:0!important;max-width:100%!important;padding:2px 5px!important;display:flex!important;flex-direction:row;align-items:center;justify-content:center;gap:6px;border:0!important;border-radius:12px!important;background:transparent!important;color:#fff3bd;box-shadow:none!important;font:800 11px Tahoma,Arial,sans-serif;cursor:pointer;touch-action:manipulation;pointer-events:auto!important;position:relative!important;z-index:2147482998!important}
    #visitorPostsCard:focus-visible{outline:3px solid #fff1a8;outline-offset:3px}
    #visitorPostsCard .visitor-gull{width:28px;height:24px;flex:none}
    #visitorPostsCard .visitor-gull path{stroke:none!important}
    #visitorPostsCard .visitor-card-label{display:flex;flex-direction:column;align-items:center;white-space:nowrap;text-align:center;line-height:1.2;font-size:clamp(9px,2vw,12px);font-weight:800}
    #visitorPostsCard .visitor-click-hint{display:block;margin-top:2px;font-size:.9em;animation:visitorPromptFlash 2.4s steps(1,end) infinite}
    @keyframes visitorPromptFlash{0%,100%{color:#ffeb00;text-shadow:0 0 8px #ffeb00}16.66%{color:#32aaff;text-shadow:0 0 8px #32aaff}33.33%{color:#111;text-shadow:0 0 6px #fff}50%{color:#fff;text-shadow:0 0 8px #fff}66.66%{color:#ff4141;text-shadow:0 0 8px #ff4141}83.33%{color:#43f06b;text-shadow:0 0 8px #43f06b}}
    @media(prefers-reduced-motion:reduce){#visitorPostsCard .visitor-click-hint{animation:none;color:#ffeb00}}
    :is(.sak-festival,.news-ticker) :is(p,h1,h2,h3){margin:0!important}
    @media(max-width:600px){:is(.sak-festival,.news-ticker,#visitorPostsSection,#visitorClockDock){height:40px!important;min-height:40px!important;max-height:40px!important;padding:4px 6px!important;border-radius:14px!important}#visitorPostsSection{margin:6px 4px!important}#visitorPostsCard{gap:4px}#visitorPostsCard .visitor-gull{width:25px;height:21px}#visitorClockDock{width:calc(50vw - 16px)!important;max-width:calc(50vw - 16px)!important}}
    #visitorPostsOverlay{position:fixed;inset:0;z-index:2147483000;background:rgba(2,10,15,.88);display:none;place-items:center;padding:clamp(6px,2vw,24px)}
    #visitorPostsOverlay.open{display:grid}
    #visitorPostsLoading{display:none;position:absolute;inset:0;z-index:1;place-items:center;margin:0;padding:22px;color:#fff;font:700 16px/1.6 Tahoma,Arial,sans-serif;text-align:center;pointer-events:none}
    #visitorPostsOverlay.loading #visitorPostsLoading,#visitorPostsOverlay.needs-signin #visitorPostsLoading{display:grid}
    #visitorPostsDialog{width:min(1100px,100%);height:min(94dvh,900px);position:relative;border:1px solid #dfc15d;border-radius:18px;overflow:hidden;background:#0b1d24;box-shadow:0 24px 80px #000a}
    #visitorPostsClose{position:absolute;z-index:2;top:8px;inset-inline-end:8px;width:42px;height:42px;border:1px solid #fff7;border-radius:50%;background:#10232beF;color:#fff;font-size:25px;line-height:1;cursor:pointer}
    #visitorPostsFrame{width:100%;height:100%;border:0;background:#102127}
    @media(max-width:600px){#visitorPostsOverlay{padding:0}#visitorPostsDialog{width:100%;height:100dvh;border:0;border-radius:0}#visitorPostsClose{top:5px}}
  `;
  if (!document.getElementById("visitorPostsStyle")) document.head.appendChild(css);

  let section = document.getElementById("visitorPostsSection");
  if (!section) {
    section = document.createElement("section");
    section.id = "visitorPostsSection";
    document.body.appendChild(section);
  }
  section.removeAttribute("aria-labelledby");
  section.setAttribute("aria-label", document.documentElement.lang.toLowerCase().startsWith("en") ? "Visitor Posts" : "مشاركات الزوار");
  section.querySelector(".visitor-posts-copy")?.remove();

  let card = section.querySelector("#visitorPostsCard");
  if (!card) {
    card = document.createElement("button");
    card.type = "button";
    card.id = "visitorPostsCard";
    card.className = "visitor-posts-launcher";
    card.setAttribute("aria-haspopup", "dialog");
    card.innerHTML = `<svg class="visitor-gull" viewBox="0 0 100 76" aria-hidden="true" focusable="false"><path fill="#ffd700" d="M5 43c16-16 29-21 43-15 12 5 18 4 26-5-2 14-14 22-29 18-14-4-23 1-40 15 7-1 15-5 21-9-4 7-12 13-21 15 12 1 25-4 34-13 10-9 20-9 31-4-13-1-22 7-31 16C29 80 9 71 5 43Z"/><path fill="#ffd700" d="M30 34c10-18 24-27 46-27-6 8-11 17-14 25-9 7-18 7-32 2Z"/></svg><span class="visitor-card-label"></span>`;
    section.appendChild(card);
  } else {
    card.type = "button";
    card.setAttribute("aria-haspopup", "dialog");
    if (!card.querySelector(".visitor-gull")) {
      card.insertAdjacentHTML("afterbegin", `<svg class="visitor-gull" viewBox="0 0 100 76" aria-hidden="true" focusable="false"><path fill="#ffd700" d="M5 43c16-16 29-21 43-15 12 5 18 4 26-5-2 14-14 22-29 18-14-4-23 1-40 15 7-1 15-5 21-9-4 7-12 13-21 15 12 1 25-4 34-13 10-9 20-9 31-4-13-1-22 7-31 16C29 80 9 71 5 43Z"/><path fill="#ffd700" d="M30 34c10-18 24-27 46-27-6 8-11 17-14 25-9 7-18 7-32 2Z"/></svg>`);
    }
    if (!card.querySelector(".visitor-card-label")) {
      const label = document.createElement("span");
      label.className = "visitor-card-label";
      card.appendChild(label);
    }
  }
  const applyCardLanguage = () => {
    const english = document.documentElement.lang.toLowerCase().startsWith("en");
    const label = card.querySelector(".visitor-card-label");
    if (label) label.innerHTML = english
      ? '<span class="visitor-main-label">Visitor Posts</span><span class="visitor-click-hint">Click here</span>'
      : '<span class="visitor-main-label">مشاركات الزوار</span><span class="visitor-click-hint">اضغط هنا</span>';
    card.setAttribute("aria-label", english ? "Open visitor submission form" : "فتح نموذج مشاركات الزوار");
    section.setAttribute("aria-label", english ? "Visitor Posts" : "مشاركات الزوار");
  };
  applyCardLanguage();
  const hideEmptyNewsSlot = () => {
    const slot = document.getElementById("sakakerNewsSlot");
    if (!slot) return;
    const hasContent = Boolean((slot.innerText || slot.textContent || "").trim()) ||
      Boolean(slot.querySelector("iframe,img,video,canvas,button,a,[role='button']"));
    slot.classList.toggle("visitor-slot-empty", !hasContent);
  };
  hideEmptyNewsSlot();
  const newsSlot = document.getElementById("sakakerNewsSlot");
  if (newsSlot) new MutationObserver(hideEmptyNewsSlot).observe(newsSlot, { childList: true, subtree: true, characterData: true });

  const placeVisitorSection = () => {
    const holidayGrid = document.getElementById("sakHolidayCountdowns");
    const newsButton = document.getElementById("sakNewsLaunch");
    if (holidayGrid) {
      if (newsButton?.parentElement === holidayGrid) {
        if (section.parentElement !== holidayGrid || section.previousElementSibling !== newsButton) newsButton.insertAdjacentElement("afterend", section);
      } else if (section.parentElement !== holidayGrid) {
        holidayGrid.appendChild(section);
      }
      return true;
    }
    const slot = document.getElementById("sakakerNewsSlot");
    const newsRow = slot?.closest(".sakaker-news-clock");
    if (newsRow && slot.parentElement === newsRow) {
      if (section.parentElement !== newsRow || section.previousElementSibling !== slot) slot.insertAdjacentElement("afterend", section);
      return true;
    }
    if (!section.isConnected) document.body.appendChild(section);
    return false;
  };
  const settleVisitorLayout = () => {
    if (document.body.classList.contains("locked")) return false;
    placeVisitorSection();
    if (clockDock) {
      positionVisitorClock(clockDock);
      return true;
    }
    const clock = findClockNode();
    if (!clock || !clock.parentNode) return false;
    clockDock = document.createElement("aside");
    clockDock.id = "visitorClockDock";
    clockDock.setAttribute("aria-label", document.documentElement.lang.toLowerCase().startsWith("en") ? "Site date and time" : "تاريخ ووقت الموقع");
    clock.classList.add("visitor-clock-dock-content");
    clockDock.appendChild(clock);
    document.body.appendChild(clockDock);
    positionVisitorClock(clockDock);
    return true;
  };
  let clockDock = document.getElementById("visitorClockDock") || null;
  const watchForClock = () => {
    if (settleVisitorLayout()) return;
    const clockObserver = new MutationObserver(() => {
      if (settleVisitorLayout()) clockObserver.disconnect();
    });
    clockObserver.observe(document.body, { childList: true, subtree: true });
    [250, 700, 1500, 3000, 6000].forEach(ms => setTimeout(() => {
      if (settleVisitorLayout()) clockObserver.disconnect();
    }, ms));
  };
  if (document.body.classList.contains("locked")) {
    const unlockObserver = new MutationObserver(() => {
      if (!document.body.classList.contains("locked")) {
        unlockObserver.disconnect();
        watchForClock();
      }
    });
    unlockObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  } else {
    watchForClock();
  }
  const clockColors = ["#ffdf46", "#42d9ff", "#f0a4ff", "#ffffff", "#ff6666", "#71ed91"];
  let clockColorIndex = 0;
  const updateClockColor = () => {
    const clockText = document.querySelector("#visitorClockDock .visitor-clock-dock-content");
    if (clockText) clockText.style.setProperty("color", clockColors[clockColorIndex], "important");
  };
  updateClockColor();
  setInterval(() => {
    clockColorIndex = (clockColorIndex + 1) % clockColors.length;
    updateClockColor();
  }, 5000);
  window.addEventListener("resize", () => positionVisitorClock(clockDock), { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(() => positionVisitorClock(clockDock), 180), { passive: true });
  new MutationObserver(applyCardLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  let overlay = document.getElementById("visitorPostsOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "visitorPostsOverlay";
    overlay.innerHTML = `<section id="visitorPostsDialog" role="dialog" aria-modal="true" aria-label="Visitor Posts"><button id="visitorPostsClose" type="button" aria-label="Close">×</button><p id="visitorPostsLoading" role="status"></p><iframe id="visitorPostsFrame" title="Visitor Posts"></iframe></section>`;
    document.body.appendChild(overlay);
  }
  const frame = overlay.querySelector("iframe");
  const syncOverlayLanguage = () => {
    const english = document.documentElement.lang.toLowerCase().startsWith("en");
    const dialog = overlay.querySelector("#visitorPostsDialog");
    const closeButton = overlay.querySelector("#visitorPostsClose");
    if (dialog) dialog.setAttribute("aria-label", english ? "Visitor Posts" : "مشاركات الزوار");
    if (closeButton) closeButton.setAttribute("aria-label", english ? "Close" : "إغلاق");
    frame.title = english ? "Visitor Posts" : "مشاركات الزوار";
    const frameUrl = frame.getAttribute("src") || "";
    if (frame.contentWindow && frameUrl && frameUrl !== "about:blank") {
      frame.contentWindow.postMessage({
        type: "sakakerVisitorLanguage",
        lang: english ? "en" : "ar"
      }, "*");
    }
  };
  syncOverlayLanguage();
  new MutationObserver(syncOverlayLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
  const close = () => {
    overlay.classList.remove("open", "loading", "needs-signin");
    frame.src = "about:blank";
    card.focus();
  };
  const loading = overlay.querySelector("#visitorPostsLoading");
  if (loading) loading.textContent = document.documentElement.lang.toLowerCase().startsWith("en") ? "Checking your site sign-in…" : "جارٍ التحقق من تسجيل الدخول…";
  overlay.querySelector("#visitorPostsClose").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && overlay.classList.contains("open")) close(); });

  let currentUser = null;
  let authReady = false;
  let resolveAuthState;
  const authStateReady = new Promise(resolve => { resolveAuthState = resolve; });
  const isAppsScriptHtmlOrigin = origin => {
    try { const host = new URL(origin).hostname; return host === "script.googleusercontent.com" || host.endsWith("-script.googleusercontent.com"); } catch { return false; }
  };
  window.addEventListener("message", async event => {
    const message = event.data || {};
    if (message.type !== "sakakerVisitorReady" || !isAppsScriptHtmlOrigin(event.origin) ||
        !overlay.classList.contains("open") || !String(frame.getAttribute("src") || "").startsWith(VISITOR_APP_URL)) return;
    if (!currentUser || !event.source) return;
    try {
      const siteUser = currentUser;
      const token = await siteUser.getIdToken(true);
      if (currentUser?.uid !== siteUser.uid || !overlay.classList.contains("open")) return;
      event.source.postMessage({ type: "sakakerVisitorAuth", token, lang: document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "ar" }, event.origin);
      overlay.classList.remove("loading", "needs-signin");
    } catch (error) {
      overlay.classList.remove("loading");
      loading.textContent = document.documentElement.lang.toLowerCase().startsWith("en") ? "Could not verify your site sign-in. Please close and retry." : "تعذر التحقق من تسجيل الدخول. أغلق النافذة ثم حاول مجددًا.";
      overlay.classList.add("needs-signin");
    }
  });
  const waitForAuth = () => {
    if (!window.firebaseAuth) {
      if (!authReady) setTimeout(waitForAuth, 120);
      return;
    }
    if (authReady) return;
    authReady = true;
    currentUser = window.firebaseAuth.currentUser || null;
    onAuthStateChanged(window.firebaseAuth, user => {
      currentUser = user;
      resolveAuthState(user);
    });
  };
  waitForAuth();

  if (card.dataset.visitorPostsBound !== "1") {
    card.dataset.visitorPostsBound = "1";
    card.addEventListener("click", async () => {
      const english = document.documentElement.lang.toLowerCase().startsWith("en");
      overlay.classList.add("open", "loading");
      if (!authReady) waitForAuth();
      await Promise.race([authStateReady, new Promise(resolve => setTimeout(resolve, 3000))]);
      if (!currentUser) {
        loading.textContent = english ? "Sign in to the site before posting. Close this window after signing in." : "سجّل الدخول إلى حساب الموقع قبل المشاركة، ثم أغلق هذه النافذة وأعد المحاولة.";
        overlay.classList.remove("loading");
        overlay.classList.add("needs-signin");
        return;
      }
      if (!VISITOR_APP_URL.startsWith("https://script.google.com/macros/s/")) {
        close();
        alert(english ? "Visitor Posts is still being configured." : "ما زال إعداد مشاركات الزوار جارياً.");
        return;
      }
      frame.onload = () => overlay.classList.remove("loading");
      frame.src = VISITOR_APP_URL + "?embedded=1";
    });
  }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installVisitorPosts, { once: true });
else installVisitorPosts();


// Independent castle-tour launcher: the existing visitor-posts module is
// already visible in the upper header, so it provides a second reliable
// bootstrap if the legacy icon dock is delayed or hidden on mobile.
(function bootstrapCastleTour(){
  function load(){
    if(document.getElementById('sakCastleTourLauncherScript'))return;
    const script=document.createElement('script');
    script.id='sakCastleTourLauncherScript';
    script.src='/assets/castle-tour-launcher.js?v=20261010-gull1';
    script.async=true;
    document.head.appendChild(script);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});
  else load();
})();

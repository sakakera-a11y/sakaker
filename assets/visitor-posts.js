import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const VISITOR_APP_URL = "https://script.google.com/macros/s/AKfycbyWpf5UvEuaeS5X3axvyq2vIDzFDogSMO1yteUbhdUCXryPdrT4vLEN4xCJjkSJoaO3hg/exec";
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
  host.style.setProperty("width","58px","important");
  host.style.setProperty("height","72px","important");
  host.style.setProperty("max-width","58px","important");
  const dock=document.getElementById("sakakerAllIconsDock");
  if(dock)dock.style.setProperty("bottom","max(88px, calc(78px + env(safe-area-inset-bottom)))","important");
}

function installVisitorPosts() {
  if (document.getElementById("visitorPostsSection")) return;

  const css = document.createElement("style");
  css.textContent = `
    html body:has(#visitorPostsSection){display:block!important;min-height:100vh}
    :is(.sak-festival,.news-ticker,#visitorPostsSection){box-sizing:border-box!important;width:calc(50vw - 16px)!important;height:82px!important;min-height:82px!important;max-width:calc(50vw - 16px)!important;padding:7px 10px!important;border:1px solid rgba(75,226,199,.88)!important;border-radius:20px!important;background:linear-gradient(135deg,rgba(5,41,50,.88),rgba(20,29,48,.9))!important;box-shadow:0 0 14px rgba(0,255,204,.18),0 0 14px rgba(255,215,0,.12)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}
    #visitorPostsSection{margin:8px 6px!important;padding:6px!important;display:flex!important;flex:0 0 auto;align-items:stretch;justify-content:stretch;text-align:center;direction:inherit;position:relative!important}
    #visitorPostsSection .visitor-posts-copy{display:none!important}
    #visitorClockDock{position:fixed!important;left:50%!important;right:auto!important;top:auto!important;bottom:max(8px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;z-index:2147482999!important;box-sizing:border-box!important;width:58px!important;height:72px!important;max-width:58px!important;min-width:58px!important;padding:3px!important;border:1px solid rgba(75,226,199,.9)!important;border-radius:18px!important;background:linear-gradient(135deg,rgba(5,41,50,.92),rgba(20,29,48,.94))!important;color:#fff!important;text-align:center!important;box-shadow:0 0 14px rgba(0,255,204,.25),0 0 14px rgba(255,215,0,.16)!important;pointer-events:none!important;overflow:hidden!important}
    #visitorClockDock::before{content:"◷";display:block;height:30px;color:#ffe27a;font:700 26px/30px Arial,sans-serif;text-shadow:0 0 8px rgba(255,215,0,.5)}
    #visitorClockDock .visitor-clock-dock-content{box-sizing:border-box!important;display:-webkit-box!important;width:100%!important;max-width:100%!important;height:31px!important;margin:0!important;color:#fff!important;font:700 8px/1.3 Tahoma,Arial,sans-serif!important;text-align:center!important;overflow:hidden!important;overflow-wrap:anywhere!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important}
    #visitorPostsCard{box-sizing:border-box!important;width:100%!important;height:100%!important;min-height:0!important;max-width:100%!important;padding:4px 6px!important;display:flex!important;flex-direction:row;align-items:center;justify-content:center;gap:6px;border:0!important;border-radius:14px!important;background:transparent!important;color:#fff3bd;box-shadow:none!important;font:800 12px Tahoma,Arial,sans-serif;cursor:pointer;touch-action:manipulation}
    #visitorPostsCard:focus-visible{outline:3px solid #fff1a8;outline-offset:3px}
    #visitorPostsCard .visitor-gull{width:36px;height:30px;flex:none}
    #visitorPostsCard .visitor-gull path{stroke:none!important}
    #visitorPostsCard .visitor-card-label{display:block;white-space:normal;text-align:center;line-height:1.25;font-size:clamp(10px,2.2vw,13px);font-weight:800}
    :is(.sak-festival,.news-ticker) :is(p,h1,h2,h3){margin:0!important}
    @media(max-width:600px){:is(.sak-festival,.news-ticker,#visitorPostsSection){height:76px!important;min-height:76px!important;padding:5px 6px!important;border-radius:16px!important}#visitorPostsSection{margin:6px 4px!important}#visitorPostsCard{gap:4px}#visitorPostsCard .visitor-gull{width:30px;height:26px}#visitorClockDock{width:54px!important;min-width:54px!important;height:68px!important}#visitorClockDock .visitor-clock-dock-content{font-size:7px!important}}
    #visitorPostsOverlay{position:fixed;inset:0;z-index:2147483000;background:rgba(2,10,15,.88);display:none;place-items:center;padding:clamp(6px,2vw,24px)}
    @media(max-width:600px){#visitorPostsSection{width:calc(100% - 20px)!important;margin:8px auto!important;padding:12px 10px!important;border-radius:18px}#visitorPostsCard{width:min(100%,300px);min-height:56px}}
    #visitorPostsOverlay.open{display:grid}
    #visitorPostsDialog{width:min(1100px,100%);height:min(94dvh,900px);position:relative;border:1px solid #dfc15d;border-radius:18px;overflow:hidden;background:#0b1d24;box-shadow:0 24px 80px #000a}
    #visitorPostsClose{position:absolute;z-index:2;top:8px;inset-inline-end:8px;width:42px;height:42px;border:1px solid #fff7;border-radius:50%;background:#10232beF;color:#fff;font-size:25px;line-height:1;cursor:pointer}
    #visitorPostsFrame{width:100%;height:100%;border:0;background:#102127}
    @media(max-width:600px){#visitorPostsOverlay{padding:0}#visitorPostsDialog{width:100%;height:100dvh;border:0;border-radius:0}#visitorPostsClose{top:5px}}
  `;
  document.head.appendChild(css);

  const card = document.createElement("button");
  card.type = "button";
  card.id = "visitorPostsCard";
  card.className = "visitor-posts-launcher";
  card.setAttribute("aria-haspopup", "dialog");
  card.innerHTML = `<svg class="visitor-gull" viewBox="0 0 100 76" aria-hidden="true" focusable="false"><path fill="#ffd700" d="M5 43c16-16 29-21 43-15 12 5 18 4 26-5-2 14-14 22-29 18-14-4-23 1-40 15 7-1 15-5 21-9-4 7-12 13-21 15 12 1 25-4 34-13 10-9 20-9 31-4-13-1-22 7-31 16C29 80 9 71 5 43Z"/><path fill="#ffd700" d="M30 34c10-18 24-27 46-27-6 8-11 17-14 25-9 7-18 7-32 2Z"/></svg><span class="visitor-card-label"></span>`;
  const applyCardLanguage = () => {
    const english = document.documentElement.lang.toLowerCase().startsWith("en");
    card.querySelector(".visitor-card-label").textContent = english ? "Visitor Posts" : "مشاركات الزوار";
    card.setAttribute("aria-label", english ? "Open visitor submission form" : "فتح نموذج مشاركات الزوار");
  };
  const section = document.createElement("section");
  section.id = "visitorPostsSection";
  section.setAttribute("aria-labelledby", "visitorPostsHeading");
  section.appendChild(card);
  applyCardLanguage();
  const settleVisitorLayout = () => {
    if (document.body.classList.contains("locked")) {
      if (!section.isConnected) document.body.appendChild(section);
      return false;
    }
    if (clockDock) {
      positionVisitorClock(clockDock);
      return true;
    }
    const clock = findClockNode();
    if (!clock || !clock.parentNode) {
      if (!section.isConnected) document.body.appendChild(section);
      return false;
    }
    clock.parentNode.insertBefore(section, clock);
    clockDock = document.createElement("aside");
    clockDock.id = "visitorClockDock";
    clockDock.setAttribute("aria-label", document.documentElement.lang.toLowerCase().startsWith("en") ? "Site date and time" : "تاريخ ووقت الموقع");
    clock.classList.add("visitor-clock-dock-content");
    clockDock.appendChild(clock);
    document.body.appendChild(clockDock);
    positionVisitorClock(clockDock);
    return true;
  };
  let clockDock = null;
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
  window.addEventListener("resize", () => positionVisitorClock(clockDock), { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(() => positionVisitorClock(clockDock), 180), { passive: true });
  new MutationObserver(applyCardLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  const overlay = document.createElement("div");
  overlay.id = "visitorPostsOverlay";
  overlay.innerHTML = `<section id="visitorPostsDialog" role="dialog" aria-modal="true" aria-label="Visitor Posts"><button id="visitorPostsClose" type="button" aria-label="Close">×</button><iframe id="visitorPostsFrame" title="Visitor Posts"></iframe></section>`;
  document.body.appendChild(overlay);
  const frame = overlay.querySelector("iframe");
  const close = () => {
    overlay.classList.remove("open");
    frame.src = "about:blank";
    card.focus();
  };
  overlay.querySelector("#visitorPostsClose").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && overlay.classList.contains("open")) close(); });

  let currentUser = null;
  let authReady = false;
  let resolveAuthState;
  const authStateReady = new Promise(resolve => { resolveAuthState = resolve; });
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

  card.addEventListener("click", async () => {
    const english = document.documentElement.lang.toLowerCase().startsWith("en");
    if (!authReady) waitForAuth();
    await Promise.race([authStateReady, new Promise(resolve => setTimeout(resolve, 5000))]);
    if (!currentUser) {
      alert(english ? "Sign in to the site before posting." : "سجّل الدخول إلى حساب الموقع قبل المشاركة.");
      return;
    }
    if (!VISITOR_APP_URL.startsWith("https://script.google.com/macros/s/")) {
      alert(english ? "Visitor Posts is still being configured." : "ما زال إعداد مشاركات الزوار جارياً.");
      return;
    }
    overlay.classList.add("open");
    frame.onload = async () => {
      if (!currentUser) return;
      const siteUser = currentUser;
      const token = await siteUser.getIdToken(true);
      if (frame.contentWindow) frame.contentWindow.postMessage({ type: "sakakerVisitorAuth", token, lang: english ? "en" : "ar" }, new URL(VISITOR_APP_URL).origin);
    };
    frame.src = VISITOR_APP_URL + "?embedded=1";
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installVisitorPosts, { once: true });
else installVisitorPosts();

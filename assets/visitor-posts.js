import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const VISITOR_APP_URL = "https://script.google.com/macros/s/AKfycbyWpf5UvEuaeS5X3axvyq2vIDzFDogSMO1yteUbhdUCXryPdrT4vLEN4xCJjkSJoaO3hg/exec";
const AUTH_ORIGINS = new Set(["https://sakaker.co", "https://www.sakaker.co", "https://sakakera-a11y.github.io"]);

function installVisitorPosts() {
  if (document.getElementById("visitorPostsSection")) return;

  const css = document.createElement("style");
  css.textContent = `
    #visitorPostsSection{box-sizing:border-box;width:min(920px,calc(100% - 24px));margin:28px auto calc(110px + env(safe-area-inset-bottom));padding:clamp(16px,3vw,26px);display:flex;flex-direction:column;align-items:center;gap:13px;text-align:center;direction:inherit;border:1px solid rgba(255,215,0,.6);border-radius:22px;background:linear-gradient(135deg,rgba(2,39,46,.94),rgba(8,22,37,.97));box-shadow:0 14px 42px #0007,0 0 22px rgba(0,255,204,.12)}
    #visitorPostsSection .visitor-posts-copy{max-width:720px}
    #visitorPostsSection h2{margin:0 0 7px;color:#ffe27a;font:800 clamp(18px,4vw,24px)/1.35 Tahoma,Arial,sans-serif;text-shadow:0 0 12px rgba(255,215,0,.24)}
    #visitorPostsSection p{margin:0;color:#e3f4f1;font:500 clamp(13px,3vw,16px)/1.8 Tahoma,Arial,sans-serif}
    #visitorPostsCard{min-height:52px;max-width:100%;padding:9px 18px;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid rgba(255,236,150,.8);border-radius:16px;background:linear-gradient(135deg,#15594d,#0b363c);color:#fff3bd;box-shadow:0 0 18px rgba(0,255,204,.2);font:800 15px Tahoma,Arial,sans-serif;cursor:pointer;touch-action:manipulation}
    #visitorPostsCard:focus-visible{outline:3px solid #fff1a8;outline-offset:3px}
    #visitorPostsCard .visitor-gull{width:44px;height:34px;flex:none}
    #visitorPostsCard .visitor-gull path{stroke:none!important}
    #visitorPostsCard .visitor-card-label{display:block;white-space:normal;text-align:center;line-height:1.3;font-size:clamp(13px,3.2vw,16px);font-weight:800}
    #visitorPostsOverlay{position:fixed;inset:0;z-index:2147483000;background:rgba(2,10,15,.88);display:none;place-items:center;padding:clamp(6px,2vw,24px)}
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
  card.innerHTML = `<svg class="visitor-gull" viewBox="0 0 100 76" aria-hidden="true" focusable="false"><path fill="#ffea00" d="M5 43c16-16 29-21 43-15 12 5 18 4 26-5-2 14-14 22-29 18-14-4-23 1-40 15 7-1 15-5 21-9-4 7-12 13-21 15 12 1 25-4 34-13 10-9 20-9 31-4-13-1-22 7-31 16C29 80 9 71 5 43Z"/><path fill="#ffe27a" d="M30 34c10-18 24-27 46-27-6 8-11 17-14 25-9 7-18 7-32 2Z"/></svg><span class="visitor-card-label"></span>`;
  const applyCardLanguage = () => {
    const english = document.documentElement.lang.toLowerCase().startsWith("en");
    card.querySelector(".visitor-card-label").textContent = english ? "Open submission form" : "فتح نموذج المشاركة";
    card.setAttribute("aria-label", english ? "Open visitor submission form" : "فتح نموذج مشاركات الزوار");
    document.querySelector("#visitorPostsSection h2").textContent = english ? "Share with the castle visitors" : "شارك زوار القلعة";
    document.querySelector("#visitorPostsSection p").textContent = english
      ? "Write a useful post or upload a file. Your submission will wait for moderator review before publication."
      : "اكتب مشاركة نافعة أو ارفع ملفًا؛ وستبقى بانتظار مراجعة المشرف قبل النشر.";
  };
  const section = document.createElement("section");
  section.id = "visitorPostsSection";
  section.setAttribute("aria-labelledby", "visitorPostsHeading");
  section.innerHTML = `<div class="visitor-posts-copy"><h2 id="visitorPostsHeading"></h2><p></p></div>`;
  section.appendChild(card);
  applyCardLanguage();
  document.body.appendChild(section);
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

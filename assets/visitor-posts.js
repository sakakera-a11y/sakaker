import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const VISITOR_APP_URL = "https://script.google.com/macros/s/AKfycbyWpf5UvEuaeS5X3axvyq2vIDzFDogSMO1yteUbhdUCXryPdrT4vLEN4xCJjkSJoaO3hg/exec";
const AUTH_ORIGINS = new Set(["https://sakaker.co", "https://www.sakaker.co", "https://sakakera-a11y.github.io"]);

function installVisitorPosts() {
  const cards = document.querySelector(".cards");
  if (!cards || document.getElementById("visitorPostsCard")) return;

  const css = document.createElement("style");
  css.textContent = `
    #visitorPostsCard .visitor-gull{width:48px;height:44px;margin-bottom:4px}
    #visitorPostsCard .visitor-card-label{font-weight:700}
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
  card.className = "icon-card";
  card.setAttribute("aria-haspopup", "dialog");
  card.innerHTML = `<svg class="visitor-gull" viewBox="0 0 100 76" aria-hidden="true" focusable="false"><path fill="#ffd447" d="M5 43c16-16 29-21 43-15 12 5 18 4 26-5-2 14-14 22-29 18-14-4-23 1-40 15 7-1 15-5 21-9-4 7-12 13-21 15 12 1 25-4 34-13 10-9 20-9 31-4-13-1-22 7-31 16C29 80 9 71 5 43Z"/><path fill="#238fe6" d="M30 34c10-18 24-27 46-27-6 8-11 17-14 25-9 7-18 7-32 2Z"/></svg><span class="visitor-card-label"></span>`;
  const applyCardLanguage = () => {
    const english = document.documentElement.lang.toLowerCase().startsWith("en");
    card.querySelector(".visitor-card-label").textContent = english ? "Visitor Posts" : "مشاركات الزوار";
    card.setAttribute("aria-label", english ? "Visitor Posts" : "مشاركات الزوار");
  };
  applyCardLanguage();
  cards.appendChild(card);
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
  const waitForAuth = () => {
    if (!window.firebaseAuth) {
      if (!authReady) setTimeout(waitForAuth, 120);
      return;
    }
    authReady = true;
    onAuthStateChanged(window.firebaseAuth, user => { currentUser = user; });
  };
  waitForAuth();

  card.addEventListener("click", async () => {
    const english = document.documentElement.lang.toLowerCase().startsWith("en");
    if (!currentUser) {
      alert(english ? "Sign in to the site with a verified email before posting." : "سجّل الدخول إلى الموقع ببريد إلكتروني موثّق قبل المشاركة.");
      return;
    }
    if (!VISITOR_APP_URL.startsWith("https://script.google.com/macros/s/")) {
      alert(english ? "Visitor Posts is still being configured." : "ما زال إعداد مشاركات الزوار جارياً.");
      return;
    }
    overlay.classList.add("open");
    frame.onload = async () => {
      if (!currentUser) return;
      const token = await currentUser.getIdToken(true);
      if (frame.contentWindow) frame.contentWindow.postMessage({ type: "sakakerVisitorAuth", token, lang: english ? "en" : "ar" }, "*");
    };
    frame.src = VISITOR_APP_URL + "?embedded=1";
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installVisitorPosts, { once: true });
else installVisitorPosts();

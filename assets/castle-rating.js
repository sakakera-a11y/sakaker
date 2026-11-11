import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

(() => {
  "use strict";
  const ROOT_ID = "sakakerCastleRating";
  const ENDPOINT = "/api/castle-rating";
  let currentUser = null;
  let authBound = false;
  let busy = false;
  let myChoice = null;

  const english = () => (document.documentElement.lang || "").toLowerCase().startsWith("en");
  const text = (ar, en) => english() ? en : ar;

  function installStyle() {
    if (document.getElementById("sakakerCastleRatingStyle")) return;
    const style = document.createElement("style");
    style.id = "sakakerCastleRatingStyle";
    style.textContent = `
      #${ROOT_ID}{
        position:fixed!important;right:max(10px,env(safe-area-inset-right))!important;
        left:auto!important;bottom:max(12px,env(safe-area-inset-bottom))!important;
        z-index:2147482000!important;box-sizing:border-box!important;
        width:min(270px,calc(100vw - 20px))!important;max-width:calc(100vw - 20px)!important;
        padding:11px!important;border:1px solid rgba(112,246,218,.72)!important;
        border-radius:16px!important;
        background:linear-gradient(145deg,rgba(3,28,33,.96),rgba(7,38,43,.94) 58%,rgba(55,39,12,.92))!important;
        box-shadow:0 0 0 1px rgba(0,0,0,.45),0 0 16px rgba(53,235,200,.25),0 0 20px rgba(240,190,75,.16)!important;
        color:#f5fff9!important;backdrop-filter:blur(12px)!important;
        -webkit-backdrop-filter:blur(12px)!important;
        font:700 12px/1.45 Tajawal,Tahoma,Arial,sans-serif!important;
        direction:inherit!important;display:flex!important;flex-direction:column!important;gap:8px!important;
      }
      #${ROOT_ID} .scr-head{display:flex;align-items:center;justify-content:center;gap:6px;
        color:#ffe6a0;font-size:14px;font-weight:900;text-shadow:0 0 8px rgba(255,210,90,.25)}
      #${ROOT_ID} .scr-sub{margin:0;text-align:center;color:#d5ece5;font-size:10px;font-weight:600}
      #${ROOT_ID} .scr-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      #${ROOT_ID} button{min-width:0;min-height:42px;padding:7px 5px;border:1px solid rgba(125,235,210,.5);
        border-radius:11px;background:rgba(8,72,66,.78);color:#fff;font:800 11px/1.3 inherit;
        cursor:pointer;touch-action:manipulation;display:flex;align-items:center;justify-content:center;gap:5px}
      #${ROOT_ID} button[data-choice="dislike"]{background:rgba(74,42,38,.78);border-color:rgba(255,174,133,.48)}
      #${ROOT_ID} button:disabled{opacity:.68;cursor:default}
      #${ROOT_ID} .scr-count{font-size:12px;font-variant-numeric:tabular-nums;color:#ffe79a}
      #${ROOT_ID} .scr-status{margin:0;min-height:15px;text-align:center;color:#ccebe1;font-size:10px;font-weight:600}
      #${ROOT_ID} button:focus-visible{outline:2px solid #fff0ae;outline-offset:2px}
      body.locked #${ROOT_ID}{display:none!important}
      @media(max-width:380px){#${ROOT_ID}{right:7px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;width:min(246px,calc(100vw - 14px))!important;padding:9px!important}}
      @media(prefers-reduced-motion:reduce){#${ROOT_ID} *{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function mount() {
    if (!document.body || document.getElementById(ROOT_ID)) return document.getElementById(ROOT_ID);
    installStyle();
    const root = document.createElement("section");
    root.id = ROOT_ID;
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "تقييم القلعة");
    root.innerHTML = `
      <div class="scr-head"><span aria-hidden="true">🏰</span><span data-role="title">تقييم القلعة</span></div>
      <p class="scr-sub" data-role="subtitle">ما رأيك بالقلعة؟ صوت واحد لكل حساب.</p>
      <div class="scr-actions">
        <button type="button" data-choice="like" disabled>
          <span aria-hidden="true">👍</span><span data-role="like-label">أعجبني</span><strong class="scr-count" data-role="likes">—</strong>
        </button>
        <button type="button" data-choice="dislike" disabled>
          <span aria-hidden="true">👎</span><span data-role="dislike-label">لم يعجبني</span><strong class="scr-count" data-role="dislikes">—</strong>
        </button>
      </div>
      <p class="scr-status" data-role="status" aria-live="polite">جارٍ التحقق من تسجيل الدخول…</p>
    `;
    root.querySelectorAll("button[data-choice]").forEach(button => {
      button.addEventListener("click", () => submitVote(button.dataset.choice));
    });
    document.body.appendChild(root);
    applyLanguage();
    return root;
  }

  function el(role) {
    return document.querySelector("#" + ROOT_ID + ' [data-role="' + role + '"]');
  }
  function setStatus(ar, en) {
    const node = el("status");
    if (node) node.textContent = text(ar, en);
  }
  function applyLanguage() {
    if (!document.getElementById(ROOT_ID)) return;
    const labels = {
      title: ["تقييم القلعة", "Castle Rating"],
      subtitle: ["ما رأيك بالقلعة؟ صوت واحد لكل حساب.", "What do you think of the castle? One vote per account."],
      "like-label": ["أعجبني", "Like"],
      "dislike-label": ["لم يعجبني", "Dislike"]
    };
    for (const [role, pair] of Object.entries(labels)) {
      const node = el(role);
      if (node) node.textContent = text(pair[0], pair[1]);
    }
    const root = document.getElementById(ROOT_ID);
    if (root) root.setAttribute("aria-label", text("تقييم القلعة", "Castle Rating"));
    if (myChoice) showVotedStatus(false);
    else if (!currentUser) setStatus("سجّل الدخول لتتمكن من التقييم.", "Sign in to rate the castle.");
  }
  function updateCounts(counts) {
    if (el("likes")) el("likes").textContent = Number(counts?.likes || 0).toLocaleString(english() ? "en-US" : "ar-SA");
    if (el("dislikes")) el("dislikes").textContent = Number(counts?.dislikes || 0).toLocaleString(english() ? "en-US" : "ar-SA");
  }
  function showVotedStatus(already) {
    if (myChoice === "like") setStatus(
      already ? "سبق أن قيّمت القلعة: أعجبني. شكراً لك." : "شكراً لك، تم تسجيل إعجابك.",
      already ? "You already rated the castle: Like. Thank you." : "Thank you. Your like has been recorded."
    );
    else if (myChoice === "dislike") setStatus(
      already ? "سبق أن قيّمت القلعة: لم يعجبني. شكراً لك." : "شكراً لك، تم تسجيل تقييمك.",
      already ? "You already rated the castle: Dislike. Thank you." : "Thank you. Your rating has been recorded."
    );
    document.querySelectorAll("#" + ROOT_ID + " button[data-choice]").forEach(button => {
      button.disabled = true;
      button.setAttribute("aria-pressed", button.dataset.choice === myChoice ? "true" : "false");
    });
  }
  function setButtonsEnabled(enabled) {
    document.querySelectorAll("#" + ROOT_ID + " button[data-choice]").forEach(button => {
      button.disabled = !enabled || busy || !!myChoice;
    });
  }
  async function requestApi(method, body) {
    if (!currentUser) throw new Error("authentication_required");
    const token = await currentUser.getIdToken();
    const response = await fetch(ENDPOINT, {
      method,
      headers: {
        "Authorization": "Bearer " + token,
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      cache: "no-store",
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "rating_unavailable");
    return data;
  }
  async function loadRating() {
    if (!currentUser) {
      setButtonsEnabled(false);
      setStatus("سجّل الدخول لتتمكن من التقييم.", "Sign in to rate the castle.");
      return;
    }
    setStatus("جارٍ تحميل التقييم…", "Loading ratings…");
    try {
      const data = await requestApi("GET");
      updateCounts(data.counts);
      myChoice = data.mine || null;
      if (myChoice) showVotedStatus(true);
      else {
        setButtonsEnabled(true);
        setStatus("يمكنك التصويت مرة واحدة بحسابك.", "You can vote once with your account.");
      }
    } catch (error) {
      setButtonsEnabled(false);
      setStatus(
        error.message === "authentication_required" ? "سجّل الدخول لتتمكن من التقييم." : "تعذر تحميل التقييم حالياً. حاول لاحقاً.",
        error.message === "authentication_required" ? "Sign in to rate the castle." : "Ratings are temporarily unavailable. Please try again later."
      );
    }
  }
  async function submitVote(choice) {
    if (!currentUser || busy || myChoice || !["like", "dislike"].includes(choice)) return;
    busy = true;
    setButtonsEnabled(false);
    setStatus("جارٍ تسجيل صوتك…", "Recording your vote…");
    try {
      const data = await requestApi("POST", { choice });
      updateCounts(data.counts);
      myChoice = data.mine || choice;
      showVotedStatus(!!data.alreadyVoted);
    } catch (error) {
      setStatus("لم يتم تسجيل التصويت. حاول مرة أخرى لاحقاً.", "Your vote was not recorded. Please try again later.");
      setButtonsEnabled(true);
    } finally {
      busy = false;
      if (myChoice) showVotedStatus(true);
    }
  }
  function bindAuth(attempt = 0) {
    if (authBound) return;
    if (!window.firebaseAuth) {
      if (attempt < 80) window.setTimeout(() => bindAuth(attempt + 1), 250);
      else setStatus("تعذر الاتصال بتسجيل الدخول. أعد تحميل الصفحة.", "Sign-in could not be reached. Reload the page.");
      return;
    }
    authBound = true;
    onAuthStateChanged(window.firebaseAuth, user => {
      currentUser = user || null;
      myChoice = null;
      setButtonsEnabled(false);
      if (currentUser) loadRating();
      else {
        updateCounts({ likes: 0, dislikes: 0 });
        setStatus("سجّل الدخول لتتمكن من التقييم.", "Sign in to rate the castle.");
      }
    });
  }

  function start() {
    if (document.body?.classList.contains("locked")) return;
    mount();
    bindAuth();
    new MutationObserver(applyLanguage).observe(document.documentElement, {
      attributes: true, attributeFilter: ["lang"]
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();

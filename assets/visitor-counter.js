(() => {
  "use strict";
  if (window.__sakakerD1VisitorCounterStarted) return;
  window.__sakakerD1VisitorCounterStarted = true;

  const ROOT_ID = "sakakerVisitorCounter";
  const STYLE_ID = "sakakerVisitorCounterD1Style";
  const ENDPOINT = "/api/visitor-counter";
  const ACTIVE_REFRESH_MS = 30000;

  function uuid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 3 | 8)).toString(16);
    });
  }

  function storedId(storage, key) {
    try {
      let value = storage.getItem(key);
      if (!value || !/^[a-f0-9-]{36}$/i.test(value)) {
        value = uuid();
        storage.setItem(key, value);
      }
      return value;
    } catch (_) {
      return uuid();
    }
  }

  function english() {
    return (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function ensureUi() {
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.setAttribute("role", "status");
      root.setAttribute("aria-live", "polite");
      root.setAttribute("aria-label", "إحصاءات زوار موقع سكاكر");
      (document.body || document.documentElement).appendChild(root);
    }
    const metrics = [
      ["svcTotal", "👥", "الزوار الفريدون", "Unique visitors"],
      ["svcToday", "📅", "زوار اليوم", "Today's visitors"],
      ["svcOnline", "🟢", "متصل الآن", "Online now"]
    ];
    for (const [id, icon, ar, en] of metrics) {
      if (document.getElementById(id)) continue;
      const item = document.createElement("div");
      item.className = "svc-item";
      const glyph = document.createElement("span");
      glyph.className = "svc-icon";
      glyph.setAttribute("aria-hidden", "true");
      glyph.textContent = icon;
      const label = document.createElement("span");
      label.className = "svc-label";
      label.dataset.ar = ar;
      label.dataset.en = en;
      label.textContent = english() ? en : ar;
      const value = document.createElement("strong");
      value.id = id;
      value.textContent = "—";
      item.append(glyph, label, value);
      root.appendChild(item);
    }
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        body #${ROOT_ID}{position:fixed!important;left:50%!important;right:auto!important;bottom:max(8px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;z-index:99990!important;display:flex!important;flex-wrap:wrap!important;justify-content:center!important;gap:7px!important;width:min(920px,calc(100vw - 16px))!important;box-sizing:border-box!important;padding:7px!important;border:1px solid rgba(93,245,218,.6)!important;border-radius:16px!important;background:rgba(3,24,30,.9)!important;box-shadow:0 0 16px rgba(0,235,205,.24)!important;color:#f2ffff!important;backdrop-filter:blur(12px)!important;font:600 12px/1.35 Tahoma,Arial,sans-serif!important}
        body #${ROOT_ID} .svc-item{display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;flex:1 1 130px!important;min-width:0!important;padding:4px!important}
        body #${ROOT_ID} .svc-label{text-align:center!important;white-space:normal!important}
        body #${ROOT_ID} strong{font-size:1.12em!important;color:#71ffe4!important;font-variant-numeric:tabular-nums!important}
        body #${ROOT_ID} .svc-online-stable strong{color:#80f7a0!important}
        @media(max-width:520px){body #${ROOT_ID}{gap:2px!important;padding:4px!important}body #${ROOT_ID} .svc-item{flex:1 1 29%!important;flex-direction:column!important;gap:2px!important;font-size:10px!important}body #${ROOT_ID} strong{font-size:12px!important}}
      `;
      document.head.appendChild(style);
    }
    return root;
  }

  function updateLabels() {
    document.querySelectorAll("#" + ROOT_ID + " .svc-label").forEach(label => {
      label.textContent = english() ? label.dataset.en : label.dataset.ar;
    });
  }

  function display(data) {
    if (!data || !Number.isFinite(Number(data.total)) ||
        !Number.isFinite(Number(data.today)) || !Number.isFinite(Number(data.online))) return;
    const total = document.getElementById("svcTotal");
    const today = document.getElementById("svcToday");
    const online = document.getElementById("svcOnline");
    if (total) total.textContent = Number(data.total).toLocaleString(english() ? "en-US" : "ar-SA");
    if (today) today.textContent = Number(data.today).toLocaleString(english() ? "en-US" : "ar-SA");
    if (online) online.textContent = Number(data.online).toLocaleString(english() ? "en-US" : "ar-SA");
    online?.closest(".svc-item")?.classList.add("svc-online-stable");
  }

  const visitorId = storedId(localStorage, "sakaker_d1_visitor_id");
  const sessionId = storedId(sessionStorage, "sakaker_d1_session_id");

  async function refresh() {
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ visitorId, sessionId })
      });
      if (!response.ok) throw new Error("Visitor API returned " + response.status);
      display(await response.json());
    } catch (error) {
      console.warn("Sakaker D1 visitor counter unavailable", error);
    }
  }

  function start() {
    ensureUi();
    updateLabels();
    refresh();
    window.setInterval(refresh, ACTIVE_REFRESH_MS);
    const observer = new MutationObserver(updateLabels);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
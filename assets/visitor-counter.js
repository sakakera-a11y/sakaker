(() => {
  "use strict";

  if (window.__sakakerCloudflareCounterStarted) return;
  window.__sakakerCloudflareCounterStarted = true;

  const $ = id => document.getElementById(id);
  const root = $("sakakerVisitorCounter");
  const onlineEl = $("svcOnline");
  const totalEl = $("svcTotal");
  const todayEl = $("svcToday");
  if (!root || !onlineEl || !totalEl || !todayEl) return;

  const previewHostSuffix = ".sakaker-pages-test.pages.dev";
  const isPreviewHost = location.hostname === "sakaker-pages-test.pages.dev"
    || location.hostname.endsWith(previewHostSuffix);
  const isVercelHost = /(^|\.)vercel\.app$/i.test(location.hostname)
    || location.hostname === "localhost"
    || location.hostname === "127.0.0.1";

  const FORCE_RUN = !!window.__sakakerVisitorCounterForce;
  const configuredApiUrl = window.__sakakerVisitorCounterUrl || "/api/visitor-counter";
  const normalizedApiUrl = /^https?:\/\//i.test(configuredApiUrl)
    ? configuredApiUrl
    : `${location.origin}${configuredApiUrl.startsWith("/") ? configuredApiUrl : `/${configuredApiUrl}`}`;

  if (!FORCE_RUN && !new Set(["sakaker.co", "www.sakaker.co"]).has(location.hostname) && !isPreviewHost && !isVercelHost) {
    return;
  }

  const HEARTBEAT_MS = 20_000;
  const visitorId = stableId(localStorage, "sakakerVisitorId");
  const sessionId = stableId(sessionStorage, "sakakerVisitorSessionId");

  function stableId(storage, key) {
    try {
      let value = storage.getItem(key);
      if (!value || !/^[a-f0-9-]{36}$/i.test(value)) {
        value = crypto.randomUUID();
        storage.setItem(key, value);
      }
      return value;
    } catch (_) {
      return crypto.randomUUID();
    }
  }

  function label(valueEl, ar, en, titleAr, titleEn) {
    const item = valueEl.closest(".svc-item");
    const labelEl = item?.querySelector(".svc-label");
    if (labelEl) {
      labelEl.dataset.ar = ar;
      labelEl.dataset.en = en;
    }
    valueEl.dataset.titleAr = titleAr;
    valueEl.dataset.titleEn = titleEn;
  }

  label(onlineEl, "المتواجدون الآن", "Online now", "جلسات الزوار النشطة", "Active visitor sessions");
  label(totalEl, "الزوار الفريدون", "Unique visitors", "إجمالي الزوار الفريدين التاريخي مع استمرار العد من Cloudflare", "Historical unique visitor total, continuing from Cloudflare");
  label(todayEl, "زوار فريدون اليوم", "Unique visitors today", "زوار فريدون حسب تاريخ الرياض", "Unique visitors for the Riyadh calendar day");
  onlineEl.closest(".svc-item")?.classList.add("svc-online-stable");

  if (!$("sakakerVisitorCounterCloudflareStyle")) {
    const style = document.createElement("style");
    style.id = "sakakerVisitorCounterCloudflareStyle";
    style.textContent = `
      html body #sakakerVisitorCounter{left:50%!important;right:auto!important;transform:translateX(-50%)!important;display:flex!important;flex-wrap:wrap!important;justify-content:center!important;gap:8px!important;bottom:max(12px,env(safe-area-inset-bottom))!important;padding:8px 10px!important;z-index:9999!important;position:fixed!important;max-width:min(700px,calc(100vw - 18px))!important}
      html body #sakakerVisitorCounter .svc-item{display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-width:0!important;flex:1 1 148px!important;padding:8px 10px!important;border-radius:12px!important;border:1px solid rgba(120,220,255,.35)!important;background:rgba(4,19,35,.5)!important;backdrop-filter:blur(8px)!important;box-shadow:0 0 15px rgba(73,183,255,.18)!important;color:#dffcff!important;animation:sakCounterGlowShift 12s ease-in-out infinite}
      html body #sakakerVisitorCounter .svc-label{white-space:normal!important;text-align:center!important;line-height:1.25!important;font-size:12px!important;opacity:.95!important;color:inherit!important}
      html body #sakakerVisitorCounter strong,html body #sakakerVisitorCounter .svc-label,html body #sakakerVisitorCounter .svc-icon{color:inherit!important;-webkit-text-fill-color:currentColor!important}
      html body #sakakerVisitorCounter .svc-item:nth-child(2){animation-delay:-3s!important}html body #sakakerVisitorCounter .svc-item:nth-child(3){animation-delay:-6s!important}
      @keyframes sakCounterTextShift{0%,32.999%{color:#b0fff1;text-shadow:0 0 5px #fff,0 0 12px #28ffe2}33.333%,66.665%{color:#ffe19b;text-shadow:0 0 5px #fff4d8,0 0 14px #ffd26a}66.666%,99.999%{color:#cfe7ff;text-shadow:0 0 5px #d7e7ff,0 0 14px #7eb8ff}}
      @keyframes sakCounterGlowShift{0%,32.999%{border-color:#70ffe2;box-shadow:0 0 11px rgba(64,255,228,.6),0 0 20px rgba(73,183,255,.8)}33.333%,66.665%{border-color:#ffe9a9;box-shadow:0 0 11px rgba(255,211,114,.65),0 0 20px rgba(249,159,255,.7)}66.666%,99.999%{border-color:#b5ceff;box-shadow:0 0 11px rgba(127,180,255,.6),0 0 20px rgba(94,144,255,.75)}}
      html body #sakakerVisitorCounter .svc-item.svc-online-stable{animation:none!important;color:#75ffa0!important;background:rgba(3,45,26,.45)!important;border:1px solid rgba(86,255,138,.55)!important;box-shadow:0 0 18px rgba(82,255,140,.35)!important}
      html body #sakakerVisitorCounter .svc-item.svc-online-stable .svc-icon,html body #sakakerVisitorCounter .svc-item.svc-online-stable .svc-label,html body #sakakerVisitorCounter .svc-item.svc-online-stable strong{color:inherit!important}
      @media(max-width:650px){html body #sakakerVisitorCounter{bottom:max(6px,env(safe-area-inset-bottom))!important;gap:3px!important;padding:5px!important}html body #sakakerVisitorCounter .svc-item{flex:1 1 31%!important;min-width:0!important;font-size:9px!important;gap:2px!important;padding-inline:2px!important}}
      @media(max-width:380px){html body #sakakerVisitorCounter .svc-item{flex:1 1 32%!important;font-size:9px!important}}
      @media(prefers-reduced-motion:reduce){html body #sakakerVisitorCounter,html body #sakakerVisitorCounter .svc-item{animation:none!important}}
    `;
    document.head.append(style);
  }

  function renderValue(el, value) {
    const isEn = document.documentElement.lang === "en";
    const number = Number(value);
    el.dataset.value = Number.isFinite(number) ? String(number) : "";
    el.textContent = Number.isFinite(number) ? number.toLocaleString(isEn ? "en-US" : "ar-SA") : (isEn ? "Unavailable" : "غير متاح");
  }

  function updateLanguage() {
    const isEn = document.documentElement.lang === "en";
    root.setAttribute("aria-label", isEn ? "Sakaker visitor statistics" : "إحصاءات زوار موقع سكاكر");
    root.querySelectorAll(".svc-label").forEach(el => {
      el.textContent = isEn ? (el.dataset.en || "") : (el.dataset.ar || "");
    });
    [onlineEl, totalEl, todayEl].forEach(el => {
      el.title = isEn ? (el.dataset.titleEn || "") : (el.dataset.titleAr || "");
      const value = Number(el.dataset.value);
      if (el.dataset.value !== undefined && Number.isFinite(value)) {
        el.textContent = value.toLocaleString(isEn ? "en-US" : "ar-SA");
      }
    });
  }

  async function update() {
    try {
      const isSameOrigin = /^https?:\/\//i.test(configuredApiUrl)
        ? new URL(configuredApiUrl).origin === location.origin
        : true;

      const response = await fetch(normalizedApiUrl, {
        method: "POST",
        credentials: isSameOrigin ? "same-origin" : "include",
        mode: isSameOrigin ? "same-origin" : "cors",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, sessionId })
      });

      if (!response.ok) throw new Error(`visitor counter returned ${response.status}`);
      const data = await response.json();
      renderValue(onlineEl, data.online);
      renderValue(totalEl, data.total);
      renderValue(todayEl, data.today);
      updateLanguage();
    } catch (error) {
      [onlineEl, totalEl, todayEl].forEach(el => {
        el.dataset.value = "";
        el.textContent = document.documentElement.lang === "en" ? "Unavailable" : "غير متاح";
      });
      console.warn("SAKAKER visitor counter:", error);
    }
  }

  updateLanguage();
  update();
  window.setInterval(update, HEARTBEAT_MS);
  new MutationObserver(updateLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();

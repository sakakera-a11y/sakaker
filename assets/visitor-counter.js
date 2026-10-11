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
  if (!new Set(["sakaker.co", "www.sakaker.co"]).has(location.hostname) && !isPreviewHost) return;

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
  label(totalEl, "الزوار الفريدون", "Unique visitors", "١٤١٠ زائرًا فريدًا تاريخيًا من Cloudflare مضافًا إليهم الزوار الفريدون منذ تشغيل العداد السحابي.", "1,410 historical Cloudflare unique visitors plus unique visitors counted by this Cloudflare counter.");
  label(todayEl, "زوار فريدون اليوم", "Unique visitors today", "زوار فريدون حسب تاريخ الرياض", "Unique visitors for the Riyadh calendar day");
  onlineEl.closest(".svc-item")?.classList.add("svc-online-stable");

  if (!$("sakakerVisitorCounterCloudflareStyle")) {
    const style = document.createElement("style");
    style.id = "sakakerVisitorCounterCloudflareStyle";
    style.textContent = `
      html body #sakakerVisitorCounter{left:50%!important;right:auto!important;transform:translateX(-50%)!important;display:flex!important;flex-wrap:wrap!important;justify-content:center!important;gap:6px!important;width:min(920px,calc(100vw - 20px))!important;max-width:calc(100vw - 20px)!important;box-sizing:border-box!important;padding:6px 9px!important;border:1.5px solid rgba(162,255,227,.88)!important;border-radius:20px!important;background:linear-gradient(110deg,rgba(2,21,40,.9),rgba(8,65,57,.87),rgba(64,28,75,.86))!important;box-shadow:0 0 10px rgba(55,250,227,.65),0 0 20px rgba(235,152,255,.45),inset 0 0 14px rgba(110,252,217,.11)!important;animation:sakCounterGlowShift 9s steps(1,end) infinite!important;isolation:isolate!important}
      html body #sakakerVisitorCounter .svc-item{flex:1 1 145px!important;min-width:0!important;justify-content:center!important;gap:4px!important;border-radius:12px!important;background:rgba(4,19,35,.3)!important;color:#fcf8d2;text-shadow:0 0 4px #fff9c6,0 0 9px #1cf8db;animation:sakCounterTextShift 9s steps(1,end) infinite!important}
      html body #sakakerVisitorCounter .svc-label{white-space:normal!important;text-align:center!important;line-height:1.25!important}
      html body #sakakerVisitorCounter strong,html body #sakakerVisitorCounter .svc-label,html body #sakakerVisitorCounter .svc-icon{color:inherit!important;-webkit-text-fill-color:currentColor!important;text-shadow:inherit!important}
      html body #sakakerVisitorCounter .svc-item:nth-child(2){animation-delay:-3s!important}html body #sakakerVisitorCounter .svc-item:nth-child(3){animation-delay:-6s!important}
      @keyframes sakCounterTextShift{0%,32.999%{color:#b0fff1;text-shadow:0 0 5px #fff,0 0 12px #28ffe2}33.333%,66.665%{color:#ffe19b;text-shadow:0 0 5px #fff4d8,0 0 14px #ffd26a}66.666%,99.999%{color:#e9c3ff;text-shadow:0 0 5px #fff,0 0 14px #bf7bff}100%{color:#b0fff1;text-shadow:0 0 5px #fff,0 0 12px #28ffe2}}
      @keyframes sakCounterGlowShift{0%,32.999%{border-color:#70ffe2;box-shadow:0 0 11px #40ffe49c,0 0 20px #49b7ffc4}33.333%,66.665%{border-color:#ffe9a9;box-shadow:0 0 11px #ffd372b3,0 0 20px #f99ff7a3}66.666%,99.999%{border-color:#e4b2ff;box-shadow:0 0 11px #b677ffbc,0 0 20px #52d9ff93}100%{border-color:#70ffe2;box-shadow:0 0 11px #40ffe49c,0 0 20px #49b7ffc4}}
      html body #sakakerVisitorCounter .svc-item.svc-online-stable{animation:none!important;color:#75ffa0!important;background:rgba(3,45,26,.45)!important;border:1px solid rgba(86,255,138,.55)!important;text-shadow:0 0 5px rgba(164,255,189,.85),0 0 12px rgba(35,240,99,.65)!important}
      html body #sakakerVisitorCounter .svc-item.svc-online-stable .svc-icon,html body #sakakerVisitorCounter .svc-item.svc-online-stable .svc-label,html body #sakakerVisitorCounter .svc-item.svc-online-stable #svcOnline{color:#75ffa0!important;-webkit-text-fill-color:#75ffa0!important;text-shadow:0 0 5px rgba(164,255,189,.9),0 0 12px rgba(35,240,99,.72)!important;animation:none!important}
      @media(max-width:650px){html body #sakakerVisitorCounter{bottom:max(6px,env(safe-area-inset-bottom))!important;gap:3px!important;padding:5px!important}html body #sakakerVisitorCounter .svc-item{flex:1 1 30%!important;font-size:10px!important;gap:3px!important}html body #sakakerVisitorCounter .svc-icon{font-size:11px!important}}
      @media(max-width:380px){html body #sakakerVisitorCounter .svc-item{flex:1 1 32%!important;font-size:9px!important}}
      @media(max-width:700px){html body #sakakerVisitorCounter{left:auto!important;right:max(6px,env(safe-area-inset-right))!important;bottom:max(107px,calc(96px + env(safe-area-inset-bottom)))!important;transform:none!important;width:calc(100vw - 115px)!important;max-width:310px!important;gap:2px!important;padding:5px 4px!important}html body #sakakerVisitorCounter .svc-item{flex:1 1 31%!important;min-width:0!important;font-size:9px!important;gap:2px!important;padding-inline:2px!important}}
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
      const response = await fetch("/api/visitor-counter", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, sessionId })
      });
      if (!response.ok) throw new Error(`Cloudflare counter returned ${response.status}`);
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
      console.warn("SAKAKER Cloudflare visitor counter:", error);
    }
  }

  updateLanguage();
  update();
  window.setInterval(update, HEARTBEAT_MS);
  new MutationObserver(updateLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();

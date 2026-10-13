import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  browserLocalPersistence,
  inMemoryPersistence,
  getAuth,
  setPersistence,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  doc,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp as firestoreServerTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp as rtdbServerTimestamp,
  set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

(() => {
  "use strict";

  if (window.__sakakerVisitorCounterV2Started) return;
  window.__sakakerVisitorCounterV2Started = true;

  const firebaseConfig = {
    apiKey: "AIzaSyCZw747d_KJa85KTDSOVI8EeX_J9Grpqrk",
    authDomain: "sakaker-9247f.firebaseapp.com",
    projectId: "sakaker-9247f",
    databaseURL: "https://sakaker-9247f-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "sakaker-9247f.firebasestorage.app",
    messagingSenderId: "689588937441",
    appId: "1:689588937441:web:4d17a1d02e72189bbfcda0"
  };

  const HISTORICAL_UNIQUE_VISITORS = 1410;
  const ACTIVE_WINDOW_MS = 60_000;
  const HEARTBEAT_MS = 20_000;

  const $ = id => document.getElementById(id);

  function ensureVisitorCounterDom() {
    let root = $("sakakerVisitorCounter");
    if (!root) {
      root = document.createElement("div");
      root.id = "sakakerVisitorCounter";
      root.setAttribute("role", "status");
      root.setAttribute("aria-live", "polite");
      root.setAttribute("aria-label", "إحصاءات زوار موقع سكاكر");
      const mount = document.body || document.documentElement;
      if (mount) mount.appendChild(root);
    }

    const buildMetric = (id, icon, ar, en, titleAr, titleEn) => {
      let el = $(id);
      if (!el) {
        const item = document.createElement("div");
        item.className = "svc-item";
        item.innerHTML = `<span class="svc-icon" aria-hidden="true">${icon}</span><span class="svc-label" data-ar="${ar}" data-en="${en}">${ar}</span><strong id="${id}">—</strong>`;
        root.appendChild(item);
        el = item.querySelector("strong");
      }
      const label = el?.closest(".svc-item")?.querySelector(".svc-label");
      if (label) {
        label.dataset.ar = ar;
        label.dataset.en = en;
      }
      el.dataset.titleAr = titleAr;
      el.dataset.titleEn = titleEn;
      return el;
    };

    return {
      onlineEl: buildMetric("svcOnline", "🟢", "المتواجدون الآن", "Online now", "جلسات الزوار النشطة، سواء زائر أو مستخدم مسجل", "Active anonymous or signed-in visitor sessions"),
      uniqueTotalEl: buildMetric("svcTotal", "👥", "الزوار الفريدون", "Unique visitors", "تقدير: ١٤١٠ زائرًا فريدًا تاريخيًا من Cloudflare مضافًا إليهم حسابات Firebase الفريدة؛ لا يمثل عدد المشاهدات", "Estimate: 1,410 historical Cloudflare unique visitors plus Firebase distinct anonymous accounts. Not a page-view total; overlap may occur."),
      uniqueTodayEl: buildMetric("svcToday", "📅", "زوار فريدون اليوم", "Unique visitors today", "عدد الزوار الفريدين في اليوم الحالي بحسب توقيت الرياض", "Unique visitors for the current Riyadh day")
    };
  }

  const { onlineEl, uniqueTotalEl, uniqueTodayEl } = ensureVisitorCounterDom();

  const uniqueApp = getApps().find(item => item.name === "sakakerVisitorCounter")
    || initializeApp(firebaseConfig, "sakakerVisitorCounter");
  const sessionApp = getApps().find(item => item.name === "sakakerPresenceCounter")
    || initializeApp(firebaseConfig, "sakakerPresenceCounter");
  const uniqueAuth = getAuth(uniqueApp);
  const sessionAuth = getAuth(sessionApp);
  const db = getFirestore(uniqueApp);
  const rtdb = getDatabase(sessionApp);

  function ensureCounterUi() {
    const root = $("sakakerVisitorCounter");
    if (!root) return;
    root.setAttribute("aria-label", "إحصاءات زوار موقع سكاكر");
    for (const id of ["svcSessionTotal", "svcSessionToday"]) {
      const metric = $(id);
      if (!metric) continue;
      const item = metric.closest(".svc-item");
      if (item?.previousElementSibling?.classList.contains("svc-sep")) item.previousElementSibling.remove();
      item?.remove();
    }
  }

  function riyadhDayKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function configureLabel(valueEl, ar, en) {
    const label = valueEl?.closest(".svc-item")?.querySelector(".svc-label");
    if (!label) return;
    label.dataset.ar = ar;
    label.dataset.en = en;
  }

  function addMetric(id, icon, ar, en, titleAr, titleEn) {
    if ($(id)) return $(id);
    const root = $("sakakerVisitorCounter");
    const separator = document.createElement("div");
    separator.className = "svc-sep";
    const item = document.createElement("div");
    item.className = "svc-item";
    item.innerHTML = `<span class="svc-icon" aria-hidden="true">${icon}</span><span class="svc-label" data-ar="${ar}" data-en="${en}">${ar}</span><strong id="${id}">—</strong>`;
    const value = item.querySelector("strong");
    value.title = document.documentElement.lang === "en" ? titleEn : titleAr;
    value.dataset.titleAr = titleAr;
    value.dataset.titleEn = titleEn;
    root.append(separator, item);
    return value;
  }

  // Online-presence status stays green; only visitor-total metrics cycle colors.
  onlineEl.closest(".svc-item")?.classList.add("svc-online-stable");
  configureLabel(onlineEl, "المتواجدون الآن", "Online now");
  configureLabel(uniqueTotalEl, "الزوار الفريدون", "Unique visitors");
  configureLabel(uniqueTodayEl, "زوار فريدون اليوم", "Unique visitors today");

  const styleId = "sakakerVisitorCounterV2Style";
  if (!$(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      html body #sakakerVisitorCounter{left:50%!important;right:auto!important;transform:translateX(-50%)!important;
        display:flex!important;flex-wrap:wrap!important;justify-content:center!important;gap:6px!important;
        width:min(920px,calc(100vw - 20px))!important;max-width:calc(100vw - 20px)!important;
        box-sizing:border-box!important;padding:6px 9px!important}
      html body #sakakerVisitorCounter .svc-item{flex:1 1 145px!important;min-width:0!important;justify-content:center!important;gap:4px!important}
      html body #sakakerVisitorCounter .svc-label{white-space:normal!important;text-align:center!important;line-height:1.25!important}
      @media(max-width:650px){html body #sakakerVisitorCounter{bottom:max(6px,env(safe-area-inset-bottom))!important;gap:3px!important;padding:5px!important}
        html body #sakakerVisitorCounter .svc-item{flex:1 1 30%!important;font-size:10px!important;gap:3px!important}
        html body #sakakerVisitorCounter .svc-icon{font-size:11px!important}}
      @media(max-width:380px){html body #sakakerVisitorCounter .svc-item{flex:1 1 32%!important;font-size:9px!important}}
      html body #sakakerVisitorCounter{
        border:1.5px solid rgba(162,255,227,.88)!important;
        border-radius:20px!important;
        background:linear-gradient(110deg,rgba(2,21,40,.86),rgba(8,65,57,.83),rgba(64,28,75,.82))!important;
        box-shadow:0 0 10px rgba(55,250,227,.65),0 0 20px rgba(235,152,255,.45),inset 0 0 14px rgba(110,252,217,.11)!important;
        animation:sakCounterGlowShift 9s steps(1,end) infinite!important;
        isolation:isolate!important;
      }
      html body #sakakerVisitorCounter .svc-item{
        border-radius:12px!important;
        background:rgba(4,19,35,.30)!important;
        color:#fcf8d2;
        text-shadow:0 0 4px #fff9c6,0 0 9px #1cf8db;
        animation:sakCounterTextShift 9s steps(1,end) infinite!important;
      }
      html body #sakakerVisitorCounter strong,
      html body #sakakerVisitorCounter .svc-label,
      html body #sakakerVisitorCounter .svc-icon{
        color:inherit!important;-webkit-text-fill-color:currentColor!important;
        text-shadow:inherit!important;
      }
      html body #sakakerVisitorCounter .svc-item:nth-child(2){animation-delay:-3s!important}
      html body #sakakerVisitorCounter .svc-item:nth-child(3){animation-delay:-6s!important}
      @keyframes sakCounterTextShift{
        0%,32.999%{color:#b0fff1;text-shadow:0 0 5px #fff,0 0 12px #28ffe2}
        33.333%,66.665%{color:#ffe19b;text-shadow:0 0 5px #fff4d8,0 0 14px #ffd26a}
        66.666%,99.999%{color:#e9c3ff;text-shadow:0 0 5px #fff,0 0 14px #bf7bff}
        100%{color:#b0fff1;text-shadow:0 0 5px #fff,0 0 12px #28ffe2}
      }
      @keyframes sakCounterGlowShift{
        0%,32.999%{border-color:#70ffe2;box-shadow:0 0 11px #40ffe49c,0 0 20px #49b7ffc4}
        33.333%,66.665%{border-color:#ffe9a9;box-shadow:0 0 11px #ffd372b3,0 0 20px #f99ff7a3}
        66.666%,99.999%{border-color:#e4b2ff;box-shadow:0 0 11px #b677ffbc,0 0 20px #52d9ff93}
        100%{border-color:#70ffe2;box-shadow:0 0 11px #40ffe49c,0 0 20px #49b7ffc4}
      }
      @media(max-width:700px){
        html body #sakakerVisitorCounter{
          left:auto!important;right:max(6px,env(safe-area-inset-right))!important;
          bottom:max(107px,calc(96px + env(safe-area-inset-bottom)))!important;
          transform:none!important;
          width:calc(100vw - 115px)!important;
          max-width:310px!important;
          gap:2px!important;padding:5px 4px!important;
        }
        html body #sakakerVisitorCounter .svc-item{
          flex:1 1 31%!important;
          min-width:0!important;
          font-size:9px!important;
          gap:2px!important;
          padding-inline:2px!important;
        }
      }
      /* Override the shared color cycle for the live-presence metric only.
         Keep its number, icon and label consistently green, including on mobile. */
      html body #sakakerVisitorCounter .svc-item.svc-online-stable{
        animation:none!important;
        color:#75ffa0!important;
        background:rgba(3,45,26,.45)!important;
        border:1px solid rgba(86,255,138,.55)!important;
        text-shadow:0 0 5px rgba(164,255,189,.85),0 0 12px rgba(35,240,99,.65)!important;
      }
      html body #sakakerVisitorCounter .svc-item.svc-online-stable .svc-icon,
      html body #sakakerVisitorCounter .svc-item.svc-online-stable .svc-label,
      html body #sakakerVisitorCounter .svc-item.svc-online-stable #svcOnline{
        color:#75ffa0!important;
        -webkit-text-fill-color:#75ffa0!important;
        text-shadow:0 0 5px rgba(164,255,189,.9),0 0 12px rgba(35,240,99,.72)!important;
        animation:none!important;
      }
      @media(prefers-reduced-motion:reduce){
        html body #sakakerVisitorCounter,
        html body #sakakerVisitorCounter .svc-item{animation:none!important}
      }
    `;
    document.head.append(style);
  }

  function updateCounterLanguage() {
    const isEn = document.documentElement.lang === "en";
    document.querySelectorAll("#sakakerVisitorCounter .svc-label").forEach(label => {
      label.textContent = isEn ? label.dataset.en : label.dataset.ar;
    });
    [onlineEl, uniqueTotalEl, uniqueTodayEl].forEach(el => {
      if (!el) return;
      if (el.dataset.titleAr || el.dataset.titleEn) {
        el.title = isEn ? (el.dataset.titleEn || "") : (el.dataset.titleAr || "");
      }
      if (el === onlineEl && el.dataset.state !== "live") {
        el.textContent = el.dataset.state === "error" ? (isEn ? "Unavailable" : "غير متاح") : "—";
        return;
      }
      const value = Number(el.dataset.value);
      el.textContent = Number.isFinite(value) ? value.toLocaleString(isEn ? "en-US" : "ar-SA") : "—";
    });
  }

  window.updateVisitorCounterLanguage = updateCounterLanguage;

  function registerCounterMarks(uid, counters) {
    return runTransaction(db, async transaction => {
      const snapshots = await Promise.all(counters.map(async counter => {
        const counterRef = doc(db, "siteStats", counter.id);
        const markRef = doc(db, "siteStats", counter.id, "visitorMarks", uid);
        const [counterSnapshot, markSnapshot] = await Promise.all([
          transaction.get(counterRef),
          transaction.get(markRef)
        ]);
        return { counter, counterRef, markRef, counterSnapshot, markSnapshot };
      }));

      let changed = false;
      snapshots.forEach(({ counter, counterRef, markRef, counterSnapshot, markSnapshot }) => {
        if (markSnapshot.exists()) return;
        const current = counterSnapshot.exists() ? Number(counterSnapshot.data().count) : 0;
        if (!Number.isSafeInteger(current) || current < 0) {
          throw new Error(`Invalid visitor count for ${counter.id}`);
        }
        const next = { count: current + 1, updatedAt: firestoreServerTimestamp() };
        if (counter.date) next.date = counter.date;
        transaction.set(markRef, { createdAt: firestoreServerTimestamp() });
        transaction.set(counterRef, next, { merge: true });
        changed = true;
      });
      return changed;
    });
  }

  const unsubscribers = [];
  function watchCounters(dayKey) {
    while (unsubscribers.length) unsubscribers.pop()();
    const watch = (id, handler) => {
      unsubscribers.push(onSnapshot(doc(db, "siteStats", id), handler, error => {
        console.warn("SAKAKER counter read:", error);
      }));
    };
    watch("visits", snapshot => {
      const newUnique = snapshot.exists() ? Number(snapshot.data().count || 0) : 0;
      uniqueTotalEl.dataset.value = String(HISTORICAL_UNIQUE_VISITORS + newUnique);
      uniqueTotalEl.dataset.titleEn = "Estimate: 1,410 historical Cloudflare unique visitors plus Firebase distinct anonymous accounts. Not a page-view total; overlap may occur.";
      uniqueTotalEl.dataset.titleAr = "تقدير: ١٤١٠ زائرًا فريدًا تاريخيًا من Cloudflare مضافًا إليهم حسابات Firebase الفريدة؛ لا يمثل عدد المشاهدات، وقد يحدث تداخل بين الزيارات.";
      updateCounterLanguage();
    });
    watch(`daily_${dayKey}`, snapshot => {
      uniqueTodayEl.dataset.value = String(snapshot.exists() ? Number(snapshot.data().count || 0) : 0);
      updateCounterLanguage();
    });
  }

  function startPresence(user) {
    const presenceRef = ref(rtdb, `onlineUsers/${user.uid}`);
    const allPresenceRef = ref(rtdb, "onlineUsers");
    const connectedRef = ref(rtdb, ".info/connected");
    let heartbeat = 0;
    let writeFailed = false;

    const writePresence = async () => {
      await onDisconnect(presenceRef).remove();
      await set(presenceRef, {
        uid: user.uid,
        name: "زائر",
        status: "available",
        lastSeen: rtdbServerTimestamp()
      });
      writeFailed = false;
    };

    const connectedUnsub = onValue(connectedRef, snapshot => {
      const connected = snapshot.val() === true;
      if (!connected) {
        if (heartbeat) window.clearInterval(heartbeat);
        heartbeat = 0;
        return;
      }
      writePresence().catch(error => {
        writeFailed = true;
        onlineEl.dataset.state = "error";
        updateCounterLanguage();
        console.warn("SAKAKER presence write:", error);
      });
      if (!heartbeat) heartbeat = window.setInterval(() => {
        writePresence().catch(error => console.warn("SAKAKER presence heartbeat:", error));
      }, HEARTBEAT_MS);
    }, error => {
      onlineEl.dataset.state = "error";
      updateCounterLanguage();
      console.warn("SAKAKER connection state:", error);
    });

    const presenceUnsub = onValue(allPresenceRef, snapshot => {
      const cutoff = Date.now() - ACTIVE_WINDOW_MS;
      const sessions = new Set();
      const records = snapshot.val() || {};
      Object.entries(records).forEach(([key, item]) => {
        const lastSeen = Number(item?.lastSeen);
        if (item && item.uid === key && ["available", "playing", "busy"].includes(item.status)
          && Number.isFinite(lastSeen) && lastSeen >= cutoff) {
          sessions.add(key);
        }
      });
      onlineEl.dataset.state = writeFailed ? "error" : "live";
      onlineEl.dataset.value = String(sessions.size);
      onlineEl.title = document.documentElement.lang === "en"
        ? "Active anonymous or signed-in visitor sessions"
        : "جلسات الزوار النشطة، سواء زائر أو مستخدم مسجل";
      updateCounterLanguage();
    }, error => {
      onlineEl.dataset.state = "error";
      updateCounterLanguage();
      console.warn("SAKAKER presence read:", error);
    });

    return () => {
      if (heartbeat) window.clearInterval(heartbeat);
      connectedUnsub();
      presenceUnsub();
    };
  }

  async function start() {
    ensureCounterUi();
    await Promise.all([
      setPersistence(uniqueAuth, browserLocalPersistence),
      setPersistence(sessionAuth, inMemoryPersistence)
    ]);
    const [uniqueCredential, sessionCredential] = await Promise.all([
      uniqueAuth.currentUser ? Promise.resolve({ user: uniqueAuth.currentUser }) : signInAnonymously(uniqueAuth),
      sessionAuth.currentUser ? Promise.resolve({ user: sessionAuth.currentUser }) : signInAnonymously(sessionAuth)
    ]);

    const uniqueUid = uniqueCredential.user.uid;
    let dayKey = riyadhDayKey();
    watchCounters(dayKey);
    const stopPresence = startPresence(sessionCredential.user);
    window.sakakerPresenceStop = stopPresence;

    await registerCounterMarks(uniqueUid, [
      { id: "visits" },
      { id: `daily_${dayKey}`, date: dayKey }
    ]).catch(error => console.warn("SAKAKER unique visitor write:", error));

    window.setInterval(async () => {
      try {
        const nextDay = riyadhDayKey();
        if (nextDay === dayKey) return;
        dayKey = nextDay;
        watchCounters(dayKey);
        await registerCounterMarks(uniqueUid, [{ id: `daily_${dayKey}`, date: dayKey }]);
      } catch (error) {
        console.warn("SAKAKER daily visitor rollover:", error);
      }
    }, 30_000);
  }

  start().catch(error => {
    onlineEl.dataset.state = "error";
    updateCounterLanguage();
    console.error("[SAKAKER visitor counter]", error);
  });
})();

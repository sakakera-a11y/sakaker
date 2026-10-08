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

  const uniqueApp = getApps().find(item => item.name === "sakakerVisitorCounter")
    || initializeApp(firebaseConfig, "sakakerVisitorCounter");
  const sessionApp = getApps().find(item => item.name === "sakakerPresenceCounter")
    || initializeApp(firebaseConfig, "sakakerPresenceCounter");
  const uniqueAuth = getAuth(uniqueApp);
  const sessionAuth = getAuth(sessionApp);
  const db = getFirestore(uniqueApp);
  const rtdb = getDatabase(sessionApp);

  const $ = id => document.getElementById(id);
  const onlineEl = $("svcOnline");
  const uniqueTotalEl = $("svcTotal");
  const uniqueTodayEl = $("svcToday");
  if (!onlineEl || !uniqueTotalEl || !uniqueTodayEl) return;

  function ensureCounterUi() {
    const root = $("sakakerVisitorCounter");
    if (!root) return;
    root.setAttribute("aria-label", "إحصاءات زوار موقع سكاكر");
  }

  function getSessionFlag(key) {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  }

  function setSessionFlag(key) {
    try { sessionStorage.setItem(key, "1"); } catch (_) {}
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

  const sessionTotalEl = addMetric(
    "svcSessionTotal", "↗️", "جلسات الزيارة منذ التحديث", "Visit sessions since update",
    "يبدأ هذا الإجمالي من تاريخ تفعيل عداد الجلسات.",
    "This total starts when session tracking is enabled."
  );
  const sessionTodayEl = addMetric(
    "svcSessionToday", "📈", "جلسات الزيارة اليوم", "Visit sessions today",
    "عدد جلسات فتح الموقع اليوم.",
    "Number of site visit sessions today."
  );

  configureLabel(onlineEl, "المتواجدون الآن", "Online now");
  configureLabel(uniqueTotalEl, "الزوار الفريدون إجمالًا", "Unique visitors total");
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
      @media(max-width:380px){html body #sakakerVisitorCounter .svc-item{flex:1 1 45%!important;font-size:9px!important}}
    `;
    document.head.append(style);
  }

  function updateCounterLanguage() {
    const isEn = document.documentElement.lang === "en";
    document.querySelectorAll("#sakakerVisitorCounter .svc-label").forEach(label => {
      label.textContent = isEn ? label.dataset.en : label.dataset.ar;
    });
    [onlineEl, uniqueTotalEl, uniqueTodayEl, sessionTotalEl, sessionTodayEl].forEach(el => {
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
      uniqueTotalEl.dataset.titleEn = "Verified Cloudflare historical unique visitors plus Firebase unique visitors";
      uniqueTotalEl.dataset.titleAr = "زوار فريدون تاريخيون موثقون من Cloudflare مضافًا إليهم زوار Firebase الفريدون";
      updateCounterLanguage();
    });
    watch(`daily_${dayKey}`, snapshot => {
      uniqueTodayEl.dataset.value = String(snapshot.exists() ? Number(snapshot.data().count || 0) : 0);
      updateCounterLanguage();
    });
    watch("sessionVisits", snapshot => {
      sessionTotalEl.dataset.value = String(snapshot.exists() ? Number(snapshot.data().count || 0) : 0);
      updateCounterLanguage();
    });
    watch(`dailySessionVisits_${dayKey}`, snapshot => {
      sessionTodayEl.dataset.value = String(snapshot.exists() ? Number(snapshot.data().count || 0) : 0);
      updateCounterLanguage();
    });
  }

  function startPresence(user) {
    const presenceRef = ref(rtdb, `onlineUsers/${user.uid}`);
    const allPresenceRef = ref(rtdb, "onlineUsers");
    const connectedRef = ref(rtdb, ".info/connected");
    let heartbeat = 0;

    const writePresence = async () => {
      await onDisconnect(presenceRef).remove();
      await set(presenceRef, {
        uid: user.uid,
        name: "زائر",
        status: "available",
        lastSeen: rtdbServerTimestamp()
      });
    };

    const connectedUnsub = onValue(connectedRef, snapshot => {
      if (snapshot.val() !== true) return;
      writePresence().catch(error => {
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
        if (item && item.uid === key && item.status === "available"
          && Number.isFinite(lastSeen) && lastSeen >= cutoff) {
          sessions.add(key);
        }
      });
      onlineEl.dataset.state = "live";
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
    const sessionUid = sessionCredential.user.uid;
    let dayKey = riyadhDayKey();
    watchCounters(dayKey);
    await registerCounterMarks(uniqueUid, [
      { id: "visits" },
      { id: `daily_${dayKey}`, date: dayKey }
    ]);

    const pageSessionKey = `sakakerVisitSessionRegistered:${dayKey}`;
    if (getSessionFlag(pageSessionKey) !== "1") {
      await registerCounterMarks(sessionUid, [
        { id: "sessionVisits" },
        { id: `dailySessionVisits_${dayKey}`, date: dayKey }
      ]);
      setSessionFlag(pageSessionKey);
    }

    const stopPresence = startPresence(sessionCredential.user);
    window.sakakerPresenceStop = stopPresence;

    window.setInterval(async () => {
      const nextDay = riyadhDayKey();
      if (nextDay === dayKey) return;
      dayKey = nextDay;
      watchCounters(dayKey);
      await registerCounterMarks(uniqueUid, [{ id: `daily_${dayKey}`, date: dayKey }]);
      const nextSessionKey = `sakakerVisitSessionRegistered:${dayKey}`;
      if (getSessionFlag(nextSessionKey) !== "1") {
        await registerCounterMarks(sessionUid, [{ id: `dailySessionVisits_${dayKey}`, date: dayKey }]);
        setSessionFlag(nextSessionKey);
      }
    }, 30_000);
  }

  start().catch(error => {
    onlineEl.dataset.state = "error";
    updateCounterLanguage();
    console.error("[SAKAKER visitor counter]", error);
  });
})();

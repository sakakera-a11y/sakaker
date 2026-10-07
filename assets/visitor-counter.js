import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

(() => {
  "use strict";

  if (window.__sakakerVisitorCounterStarted) return;
  window.__sakakerVisitorCounterStarted = true;

  const firebaseConfig = {
    apiKey: "AIzaSyCZw747d_KJa85KTDSOVI8EeX_J9Grpqrk",
    authDomain: "sakaker-9247f.firebaseapp.com",
    projectId: "sakaker-9247f",
    databaseURL: "https://sakaker-9247f-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "sakaker-9247f.firebasestorage.app",
    messagingSenderId: "689588937441",
    appId: "1:689588937441:web:4d17a1d02e72189bbfcda0"
  };

  const appName = "sakakerVisitorCounter";
  const app = getApps().find(item => item.name === appName)
    || initializeApp(firebaseConfig, appName);
  const auth = getAuth(app);
  const db = getFirestore(app);

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

  function ensureCounterUi() {
    let root = document.getElementById("sakakerVisitorCounter");
    if (!root) {
      root = document.createElement("aside");
      root.id = "sakakerVisitorCounter";
      root.setAttribute("aria-label", "إحصائيات زيارات الموقع");
      root.innerHTML = [
        '<span>إجمالي الزيارات <b id="svcTotal">—</b></span>',
        '<span>زيارات اليوم <b id="svcToday">—</b></span>'
      ].join("");
      document.body.appendChild(root);
    }

    root.style.cssText = [
      "position:fixed",
      "top:max(10px,env(safe-area-inset-top))",
      "right:max(10px,env(safe-area-inset-right))",
      "z-index:2147483646",
      "display:flex",
      "gap:8px",
      "align-items:center",
      "padding:8px 11px",
      "border:1px solid rgba(255,220,120,.75)",
      "border-radius:12px",
      "background:rgba(3,24,28,.92)",
      "color:#fff",
      "font:700 12px/1.5 Tahoma,Arial,sans-serif",
      "box-shadow:0 3px 14px rgba(0,0,0,.35)"
    ].join(";");

    if (!document.getElementById("sakakerVisitorCounterStyle")) {
      const style = document.createElement("style");
      style.id = "sakakerVisitorCounterStyle";
      style.textContent = [
        "body.locked #sakakerVisitorCounter{display:none!important}",
        "#sakakerVisitorCounter b{color:#ffe17d;margin-inline-start:4px}"
      ].join("");
      document.head.appendChild(style);
    }

    return root;
  }

  function setCounterValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = Number.isFinite(value) ? value.toLocaleString("en-US") : "—";
  }

  function subscribeToCounters(dayKey) {
    onSnapshot(doc(db, "siteStats", "visits"), snapshot => {
      setCounterValue("svcTotal", snapshot.exists() ? snapshot.data().count : 0);
    });
    onSnapshot(doc(db, "siteStats", `daily_${dayKey}`), snapshot => {
      setCounterValue("svcToday", snapshot.exists() ? snapshot.data().count : 0);
    });
  }

  async function registerOnce(docId, uid, dateValue) {
    const markerRef = doc(db, "siteStats", docId, "visitorMarks", uid);
    const countRef = doc(db, "siteStats", docId);
    const [markerSnapshot, countSnapshot] = await Promise.all([
      getDoc(markerRef),
      getDoc(countRef)
    ]);

    if (markerSnapshot.exists()) return false;

    const current = countSnapshot.exists() ? countSnapshot.data().count : 0;
    if (!Number.isSafeInteger(current) || current < 0) {
      throw new Error(`Invalid counter value for ${docId}`);
    }

    const nextData = {
      count: current + 1,
      updatedAt: serverTimestamp()
    };
    if (dateValue) nextData.date = dateValue;

    const batch = writeBatch(db);
    batch.set(markerRef, { createdAt: serverTimestamp() });
    batch.set(countRef, nextData, { merge: true });
    await batch.commit();
    return true;
  }

  async function start() {
    await setPersistence(auth, browserLocalPersistence);
    const credential = auth.currentUser
      ? { user: auth.currentUser }
      : await signInAnonymously(auth);
    const uid = credential.user.uid;
    const dayKey = riyadhDayKey();

    ensureCounterUi();
    subscribeToCounters(dayKey);

    await Promise.all([
      registerOnce("visits", uid, null),
      registerOnce(`daily_${dayKey}`, uid, dayKey)
    ]);
  }

  start().catch(error => {
    console.error("[SAKAKER visitor counter]", error);
  });
})();

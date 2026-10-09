const CFG = Object.freeze({
  pendingFolderId: "1t0lafrW5CZPv-iy7Da2-BY3EOmiFZFXo",
  dataFolderId: "1gWzK6Au9DD9lT_5X-Mmhur-aVDiB9t6S",
  adminEmail: "sakakera@gmail.com",
  firebaseApiKey: "AIzaSyCZw747d_KJa85KTDSOVI8EeX_J9Grpqrk",
  maxFileBytes: 10 * 1024 * 1024
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Castle Visitor Posts · sakaker.co")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getVisitorState(idToken) {
  const user = verifySiteToken_(idToken);
  const isAdmin = user.email.toLowerCase() === CFG.adminEmail.toLowerCase();
  return { isAdmin: isAdmin, pending: isAdmin ? listPending_() : [] };
}

function saveVisitorFile(input) {
  const user = verifySiteToken_(input && input.idToken);
  const category = String((input && input.category) || "");
  const fileName = cleanFileName_(input && input.fileName);
  const mimeType = String((input && input.mimeType) || "").slice(0, 150);
  const base64 = String((input && input.base64) || "");
  if (!fileName || !base64) throw new Error("اختر ملفًا صالحًا أولًا.");
  if (category !== "video" && category !== "image") throw new Error("نوع المشاركة غير صالح.");
  if (category === "video" && !/^video\/(mp4|webm|quicktime)$/i.test(mimeType)) throw new Error("اختر ملف فيديو مدعومًا.");
  if (category === "image" && !/^image\/(jpeg|png|gif|webp|heic)$/i.test(mimeType)) throw new Error("اختر صورة بصيغة مدعومة.");
  const durationSec = Number((input && input.durationSec) || 0);
  if (category === "video" && durationSec > 60) throw new Error("مدة الفيديو لا تتجاوز دقيقة واحدة.");
  if (base64.length > Math.ceil(CFG.maxFileBytes * 1.4)) throw new Error("الحد الأقصى لحجم الملف 10 MB.");

  const bytes = Utilities.base64Decode(base64);
  if (!bytes.length || bytes.length > CFG.maxFileBytes) throw new Error("الحد الأقصى لحجم الملف 10 MB.");
  const file = DriveApp.getFolderById(CFG.pendingFolderId)
    .createFile(Utilities.newBlob(bytes, mimeType, fileName));
  const record = {
    id: Utilities.getUuid(),
    type: category,
    fileId: file.getId(),
    fileName: file.getName(),
    mimeType: file.getMimeType(),
    size: bytes.length,
    durationSec: durationSec || null,
    status: "pending",
    submittedBy: user.email,
    uid: user.uid,
    submittedAt: new Date().toISOString()
  };
  dataFolder_().createFile(Utilities.newBlob(JSON.stringify(record), "application/json", record.id + ".json"));
  return { ok: true, fileName: record.fileName, status: record.status };
}

function saveVisitorText(input) {
  const user = verifySiteToken_(input && input.idToken);
  const text = String((input && input.text) || "").trim();
  if (!text) throw new Error("اكتب نص المشاركة أولًا.");
  if (text.length > 2000) throw new Error("الحد الأقصى للنص 2000 حرف.");
  const record = {
    id: Utilities.getUuid(),
    type: "text",
    text: text,
    status: "pending",
    submittedBy: user.email,
    uid: user.uid,
    submittedAt: new Date().toISOString()
  };
  dataFolder_().createFile(Utilities.newBlob(JSON.stringify(record), "application/json", record.id + ".json"));
  return { ok: true, status: record.status };
}

function approveVisitorFile(idToken, recordId) {
  requireAdmin_(idToken);
  const recordFile = recordFile_(recordId);
  const record = JSON.parse(recordFile.getBlob().getDataAsString());
  if (record.status !== "pending") throw new Error("هذا الملف لم يعد قيد المراجعة.");
  if (record.fileId) DriveApp.getFileById(record.fileId).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  record.status = "approved";
  record.approvedAt = new Date().toISOString();
  recordFile.setContent(JSON.stringify(record));
  return { ok: true };
}

function deleteVisitorFile(idToken, recordId) {
  requireAdmin_(idToken);
  const recordFile = recordFile_(recordId);
  const record = JSON.parse(recordFile.getBlob().getDataAsString());
  if (record.fileId) DriveApp.getFileById(record.fileId).setTrashed(true);
  record.status = "deleted";
  record.deletedAt = new Date().toISOString();
  recordFile.setContent(JSON.stringify(record));
  return { ok: true };
}

function requireAdmin_(idToken) {
  const user = verifySiteToken_(idToken);
  if (user.email.toLowerCase() !== CFG.adminEmail.toLowerCase()) {
    throw new Error("لوحة الإدارة متاحة للمشرف فقط.");
  }
  return user;
}

function verifySiteToken_(idToken) {
  const token = String(idToken || "");
  if (token.length < 100) throw new Error("سجّل الدخول إلى الموقع أولًا.");
  const url = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + encodeURIComponent(CFG.firebaseApiKey);
  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ idToken: token }),
    muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) throw new Error("انتهت جلسة تسجيل الدخول. سجّل الدخول مجددًا.");
  const body = JSON.parse(response.getContentText());
  const account = body.users && body.users[0];
  if (!account || account.disabled) throw new Error("تعذر التحقق من تسجيل الدخول.");
  return { uid: String(account.localId || ""), email: String(account.email || "") };
}

function listPending_() {
  const files = dataFolder_().getFiles();
  const pending = [];
  while (files.hasNext()) {
    const file = files.next();
    if (!/\.json$/i.test(file.getName())) continue;
    try {
      const record = JSON.parse(file.getBlob().getDataAsString());
      if (record.status === "pending") {
        if (record.fileId) record.url = DriveApp.getFileById(record.fileId).getUrl();
        pending.push(record);
      }
    } catch (error) {
      // Ignore malformed metadata; keep the other submissions available.
    }
  }
  pending.sort(function(a, b) { return String(b.submittedAt).localeCompare(String(a.submittedAt)); });
  return pending;
}

function dataFolder_() {
  return DriveApp.getFolderById(CFG.dataFolderId);
}

function recordFile_(recordId) {
  const id = String(recordId || "");
  if (!/^[a-f0-9-]{30,40}$/i.test(id)) throw new Error("معرّف الملف غير صالح.");
  const files = dataFolder_().getFilesByName(id + ".json");
  if (!files.hasNext()) throw new Error("لم يتم العثور على الطلب.");
  return files.next();
}

function cleanFileName_(name) {
  return String(name || "")
    .replace(/[\/\\:*?"<>|#%{}~]/g, "_")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 140);
}
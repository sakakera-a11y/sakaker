# قائمة التحقق النهائية لنشر عداد الزوار — Cloudflare D1

**تاريخ البدء:** 2026-10-12
**الفرع المدمج:** `cloudflare-visitor-counter` → `main`
**PR:** #7

---

## المرحلة 1: التحقق من الكود المدمج ✅
- [x] دمج فرع `cloudflare-visitor-counter` في `main`
- [x] PR #7 مُغلقة ومدمجة
- [x] مجلد `functions/` موجود في `main`
- [x] مجلد `migrations/` موجود في `main`

---

## المرحلة 2: التحقق من Cloudflare Dashboard
### Settings → Functions → D1 Database Bindings

**اختبر في Cloudflare Dashboard:**

1. **اذهب إلى:** Workers & Pages → sakaker → Settings → Functions → D1 Bindings
2. **تحقق من Production:**
   - [ ] `VISITOR_DB` مرتبط بـ `sakaker-visitor-counter`
   - [ ] حالة الربط: ✓ Connected
   
3. **تحقق من Preview:**
   - [ ] `VISITOR_DB` مرتبط بـ `sakaker-visitor-counter-preview`
   - [ ] حالة الربط: ✓ Connected

---

## المرحلة 3: التحقق من متغيرات البيئة
### Settings → Environment Variables

**في Production:**
- [ ] `VISITOR_TOTAL_BASELINE` = [سجل القيمة الحالية]
- [ ] `VISITOR_TODAY_BASELINE` = [سجل القيمة الحالية]
- [ ] `VISITOR_BASELINE_DAY` = [سجل التاريخ الحالي بصيغة Riyadh]

**ملاحظة:** احفظ هذه القيم قبل الاختبار!

---

## المرحلة 4: تطبيق الترحيل (Migration)
### في D1 Dashboard

**للـ Production Database (`sakaker-visitor-counter`):**
```bash
# شغّل هذا الاستعلام في D1 Console:
-- تطبيق الجداول من migrations/0001_visitor_counter.sql
CREATE TABLE IF NOT EXISTS visitor_totals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_count INTEGER DEFAULT 0,
  last_updated TEXT
);

CREATE TABLE IF NOT EXISTS daily_visitor_marks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_mark TEXT UNIQUE,
  marked_date TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS active_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE,
  last_seen TEXT
);
```

- [ ] جداول `visitor_totals` تم إنشاؤها
- [ ] جدول `daily_visitor_marks` تم إنشاؤه
- [ ] جدول `active_sessions` تم إنشاؤه

**اختبر وجود الجداول:**
```sql
SELECT name FROM sqlite_master WHERE type='table';
```
- [ ] تم التأكد من وجود الثلاث جداول

---

## المرحلة 5: الاختبار الحي
### في الموقع الرئيسي (Production)

1. **افتح الموقع:**
   - [ ] الموقع الأساسي يحمّل بدون أخطاء
   - [ ] الصفحة الرئيسية تعمل

2. **تحقق من العداد:**
   - [ ] العداد يظهر على الصفحة الرئيسية
   - [ ] يعرض عدد الزوار الإجمالي
   - [ ] يعرض عدد الزوار اليومي
   - [ ] يعرض الجلسات النشطة الحالية

3. **اختبر الوظيفة:**
   - [ ] افتح الموقع في متصفح جديد (incognito/private)
   - [ ] العداد يتزايد بـ 1
   - [ ] أعد تحميل الصفحة بنفس المتصفح
   - [ ] العداد لا يتزايد (نفس الزائر)
   - [ ] افتح متصفح آخر أو جهاز آخر
   - [ ] العداد يتزايد بـ 1 إضافي

4. **تحقق من قاعدة البيانات:**
   - [ ] شغّل في D1 Console:
     ```sql
     SELECT COUNT(*) as total FROM visitor_totals;
     SELECT COUNT(*) as today FROM daily_visitor_marks WHERE marked_date = date('now');
     SELECT COUNT(*) as active FROM active_sessions;
     ```
   - [ ] البيانات تتطابق مع ما يعرضه العداد

---

## المرحلة 6: مراجعة السجلات
### في Cloudflare Pages → Deployments

- [ ] آخر deployment بـ Production نجح
- [ ] لا توجد أخطاء في Functions logs
- [ ] وقت النشر أقل من 2 دقيقة

**إذا وجدت خطأ:**
- اضغط على Deployment
- افتح "Build logs" و"Runtime logs"
- ابحث عن أي رسالة خطأ متعلقة بـ D1 أو Functions

---

## المرحلة 7: التوثيق النهائي

- [ ] سجّل التاريخ والوقت الفعلي للنشر في Production
- [ ] احفظ screenshot للعداد في Production
- [ ] احفظ query results من D1 في ملف
- [ ] وثّق أي ملاحظات أو مشاكل واجهتها

---

## النتيجة النهائية

**المشروع مكتمل عندما:**
- ✅ الكود مدمج في `main`
- ✅ D1 مفعّل في Production
- ✅ Functions تعمل بدون أخطاء
- ✅ العداد يظهر في الموقع الرئيسي
- ✅ العد يتزايد بشكل صحيح
- ✅ قاعدة البيانات تحتوي على بيانات صحيحة

---

## الخطوات بعد الاكتمال

1. أغلق PR #7
2. احذف فرع `cloudflare-visitor-counter` (اختياري)
3. وثّق النتيجة النهائية في ملف README أو وثيقة المشروع
4. احتفل بالإنجاز! 🎉

---

**آخر تحديث:** 2026-10-12
**الحالة:** قيد الاختبار التشغيلي

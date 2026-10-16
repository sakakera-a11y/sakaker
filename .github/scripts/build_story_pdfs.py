#!/usr/bin/env python3
"""Build bilingual PDFs from the canonical story data without editing story text."""
import json, re, os, html
from pathlib import Path
from reportlab import rl_config
rl_config.invariant = 1  # Stable PDF bytes prevent concurrent workflow commits from racing.
import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image
ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "data" / "ebook-stories.json"
COVER = ROOT / "Screenshot_٢٠٢٦١٠٠٦-١٧٤٢٠٧_1.png"
OUT = ROOT / "ebooks"
INDIVIDUAL = OUT / "stories"
OUT.mkdir(parents=True, exist_ok=True)
INDIVIDUAL.mkdir(parents=True, exist_ok=True)
font_candidates = ["/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf", "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
font_path = next((p for p in font_candidates if os.path.exists(p)), None)
if not font_path: raise SystemExit("Arabic-capable font not found; install fonts-noto-core.")
pdfmetrics.registerFont(TTFont("StoryArabic", font_path))
pdfmetrics.registerFontFamily("StoryArabic", normal="StoryArabic", bold="StoryArabic", italic="StoryArabic", boldItalic="StoryArabic")
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", fontName="StoryArabic", fontSize=25, leading=36, alignment=TA_CENTER, textColor=colors.HexColor("#116653"), spaceAfter=12))
styles.add(ParagraphStyle(name="CoverSub", fontName="StoryArabic", fontSize=13, leading=21, alignment=TA_CENTER, textColor=colors.HexColor("#8A6A18")))
styles.add(ParagraphStyle(name="StoryTitle", fontName="StoryArabic", fontSize=17, leading=25, alignment=TA_RIGHT, textColor=colors.HexColor("#116653"), spaceBefore=8, spaceAfter=7))
styles.add(ParagraphStyle(name="ArabicBody", fontName="StoryArabic", fontSize=11.5, leading=20, alignment=TA_RIGHT, spaceAfter=8, wordWrap="RTL"))
styles.add(ParagraphStyle(name="EnglishTitle", fontName="StoryArabic", fontSize=15, leading=22, alignment=TA_LEFT, textColor=colors.HexColor("#116653"), spaceBefore=7, spaceAfter=7))
styles.add(ParagraphStyle(name="EnglishBody", fontName="StoryArabic", fontSize=10.5, leading=17, alignment=TA_LEFT, spaceAfter=7))
styles.add(ParagraphStyle(name="Label", fontName="StoryArabic", fontSize=10, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#8A6A18"), spaceAfter=8))
def clean_title(value): return re.sub(r"^[^\w\u0600-\u06FF]+", "", value or "").strip()
def ptext(value, arabic=False):
    value = str(value or "")
    if arabic: value = get_display(arabic_reshaper.reshape(value))
    return html.escape(value).replace("\n", "<br/>")
def make_story(story, index):
    serial = int(story.get("serial", index)); ar, en = story.get("ar", {}), story.get("en", {})
    ta, te = clean_title(ar.get("title", f"القصة {serial}")), clean_title(en.get("title", f"Story {serial}"))
    flow = [Paragraph(ptext(f"القصة {serial} — {ta}", True), styles["StoryTitle"]), Paragraph(ptext(ar.get("lead", ""), True), styles["ArabicBody"])]
    flow += [Paragraph(ptext(x, True), styles["ArabicBody"]) for x in ar.get("paragraphs", [])]
    flow += [Spacer(1, 3*mm), Paragraph(ptext(f"Story {serial} — {te}"), styles["EnglishTitle"]), Paragraph(ptext(en.get("lead", "")), styles["EnglishBody"])]
    flow += [Paragraph(ptext(x), styles["EnglishBody"]) for x in en.get("paragraphs", [])]
    return flow, ta, te, serial
def footer(canvas, doc):
    canvas.saveState(); canvas.setStrokeColor(colors.HexColor("#D8E8E2")); canvas.line(18*mm, 15*mm, A4[0]-18*mm, 15*mm)
    canvas.setFont("StoryArabic", 8); canvas.setFillColor(colors.HexColor("#52766B")); canvas.drawCentredString(A4[0]/2, 9*mm, f"أبوالقمرزمرد | Abwalqmrzmrd  •  {doc.page}"); canvas.restoreState()
stories = sorted(json.loads(SOURCE.read_text(encoding="utf-8")), key=lambda x: int(x.get("serial", 0)))
if len(stories) != 11: raise SystemExit(f"Expected 11 stories, found {len(stories)}")
for story in stories:
    if not story.get("ar", {}).get("paragraphs") or not story.get("en", {}).get("paragraphs"): raise SystemExit(f"Missing Arabic/English content: serial {story.get('serial')}")
combined = [Spacer(1, 5*mm), Image(str(COVER), width=145*mm, height=90*mm, kind="proportional"), Spacer(1, 8*mm), Paragraph(ptext("كتاب أبوالقمر زمرد", True), styles["CoverTitle"]), Paragraph(ptext("روايات وقصص حديثة", True), styles["CoverSub"]), Spacer(1, 4*mm), Paragraph("Abwalqmrzmrd Castle — Modern Tales and Stories", styles["CoverSub"]), Spacer(1, 8*mm), Paragraph(ptext("الطبعة الثنائية اللغة — العربية والإنجليزية", True), styles["Label"]), Paragraph("Bilingual Edition — Arabic &amp; English", styles["Label"]), PageBreak()]
for i, story in enumerate(stories):
    flow, _, _, _ = make_story(story, i+1); combined.extend(flow)
    if i < len(stories)-1: combined.append(PageBreak())
SimpleDocTemplate(str(OUT / "storybook-bilingual.pdf"), pagesize=A4, rightMargin=19*mm, leftMargin=19*mm, topMargin=18*mm, bottomMargin=20*mm, title="كتاب أبوالقمر زمرد — روايات وقصص حديثة").build(combined, onFirstPage=footer, onLaterPages=footer)
for i, story in enumerate(stories):
    flow, ta, te, serial = make_story(story, i+1)
    SimpleDocTemplate(str(INDIVIDUAL / f"{serial:02d}-story-bilingual.pdf"), pagesize=A4, rightMargin=19*mm, leftMargin=19*mm, topMargin=18*mm, bottomMargin=20*mm, title=f"{ta} / {te}").build(flow, onFirstPage=footer, onLaterPages=footer)
print(f"Built 1 combined bilingual book and {len(stories)} individual bilingual PDFs.")

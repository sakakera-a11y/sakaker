from pathlib import Path

JS_PATH = Path('assets/final-three-icons.js')

text = JS_PATH.read_text(encoding='utf-8')
original = text

replacements = [
    (
        "function ensureSiteBackground(){\n  if(!document.body)return;\n  installSiteBackgroundStyle();\n  removeOldSeaSoundControl();\n\n  let video=document.getElementById('sakSiteBackgroundVideo');",
        "function ensureSiteBackground(){\n  if(!document.body)return;\n  installSiteBackgroundStyle();\n\n  /* Performance: never create/download the heavy main-site background video\n     while the Google login gate is still visible. It is created only after\n     authentication unlocks the page. */\n  if(isLocked())return;\n\n  removeOldSeaSoundControl();\n  let video=document.getElementById('sakSiteBackgroundVideo');"
    ),
    (
        "    video.preload='auto';",
        "    /* Metadata is enough before playback begins; play() will stream the\n       actual video once the authenticated site is visible. */\n    video.preload='metadata';"
    ),
    (
        "function syncSiteBackgroundLock(){\n  const video=document.getElementById('sakSiteBackgroundVideo');\n  if(!video)return;\n  if(isLocked()){\n    video.pause();\n  }else{\n    startSiteBackgroundSound();\n    removeOldSeaSoundControl();\n    requestAnimationFrame(placeSiteSoundAboveClock);\n  }\n  updateSiteBackgroundButton();\n}",
        "function syncSiteBackgroundLock(){\n  let video=document.getElementById('sakSiteBackgroundVideo');\n\n  if(isLocked()){\n    if(video)video.pause();\n    return;\n  }\n\n  /* The video is intentionally absent during login. Create it now, once,\n     immediately after Firebase unlocks the page. */\n  if(!video){\n    ensureSiteBackground();\n    video=document.getElementById('sakSiteBackgroundVideo');\n    if(!video)return;\n  }\n\n  startSiteBackgroundSound();\n  removeOldSeaSoundControl();\n  requestAnimationFrame(placeSiteSoundAboveClock);\n  updateSiteBackgroundButton();\n}"
    ),
    (
        "function settle(){\n  removeVisitorCounters();\n  installFacebookEmbeds();\n  ensureSiteBackground();\n  rebuildIconAppearance();\n  removeOldSeaSoundControl();\n  requestAnimationFrame(placeSiteSoundAboveClock);\n}",
        "function settle(){\n  removeVisitorCounters();\n  installSiteBackgroundStyle();\n\n  /* Keep the login screen light: no Facebook scanning, icon rebuilding or\n     background-video creation until the authenticated page is visible. */\n  if(isLocked())return;\n\n  installFacebookEmbeds();\n  ensureSiteBackground();\n  rebuildIconAppearance();\n  removeOldSeaSoundControl();\n  requestAnimationFrame(placeSiteSoundAboveClock);\n}"
    ),
    (
        "[250,700,1500,3000,5500,9000].forEach(ms=>setTimeout(settle,ms));",
        "[500,1500,3500,7000].forEach(ms=>setTimeout(settle,ms));"
    ),
    (
        "new MutationObserver(()=>{installFacebookEmbeds();ensureSiteBackground();rebuildIconAppearance();removeOldSeaSoundControl();requestAnimationFrame(placeSiteSoundAboveClock);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});",
        "new MutationObserver(()=>{\n  if(isLocked())return;\n  installFacebookEmbeds();\n  ensureSiteBackground();\n  rebuildIconAppearance();\n  removeOldSeaSoundControl();\n  requestAnimationFrame(placeSiteSoundAboveClock);\n}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});"
    ),
]

for old, new in replacements:
    if new in text:
        continue
    if old not in text:
        raise SystemExit('Expected runtime pattern was not found; refusing unsafe patch:\n' + old[:140])
    text = text.replace(old, new, 1)

if text != original:
    JS_PATH.write_text(text, encoding='utf-8')
    print('Applied login-gate and background-video performance optimizations.')
else:
    print('Runtime performance optimizations already applied.')

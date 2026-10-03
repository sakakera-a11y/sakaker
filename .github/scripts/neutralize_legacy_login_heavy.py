from pathlib import Path
import re

INDEX = Path('index.html')
LOCAL_LOGIN = '/gemini_video_birds_login.mp4'
RAW_LOGIN = '/gemini_video_birds_login.mp4'

text = INDEX.read_text(encoding='utf-8')
original = text


def patch_script(script_id, replacements):
    global text
    pattern = re.compile(
        rf'(<script\b[^>]*\bid=["\']{re.escape(script_id)}["\'][^>]*>)(.*?)(</script>)',
        re.I | re.S,
    )
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise SystemExit(f'Expected exactly one script #{script_id}, found {len(matches)}; refusing unsafe patch.')
    m = matches[0]
    body = m.group(2)
    updated = body
    for old, new in replacements:
        if new in updated:
            continue
        count = updated.count(old)
        if count != 1:
            raise SystemExit(f'Expected one legacy pattern in #{script_id}, found {count}; refusing unsafe patch: {old[:120]}')
        updated = updated.replace(old, new, 1)
    if updated != body:
        text = text[:m.start(2)] + updated + text[m.end(2):]
        print(f'Patched #{script_id}')
    else:
        print(f'#{script_id} already optimized')


# 1) Do not preload/execute circular YouTube/HLS previews while the login gate
# is visible. They start immediately after Firebase removes body.locked.
patch_script('sakaker-final-preview-and-bilingual-update', [
    (
        'function startYouTubePreview(){const frame=',
        'function startYouTubePreview(){if(document.body.classList.contains("locked"))return;const frame='
    ),
    (
        'function startLivePreview(){const video=',
        'function startLivePreview(){if(document.body.classList.contains("locked"))return;const video='
    ),
    (
        'function prioritizeBackground(){document.querySelectorAll("#sakLoginBackgroundVideo,#sakakerMainVideoBackground").forEach(video=>{video.preload="auto";video.setAttribute("preload","auto");video.setAttribute("fetchpriority","high");video.setAttribute("playsinline","");video.play().catch(()=>{})})}',
        'function prioritizeBackground(){document.querySelectorAll("#sakLoginBackgroundVideo,#sakakerMainVideoBackground").forEach(video=>{video.preload="metadata";video.setAttribute("preload","metadata");video.removeAttribute("fetchpriority");video.setAttribute("playsinline","");if(!document.body.classList.contains("locked")&&video.id!=="sakLoginBackgroundVideo")video.play().catch(()=>{})})}'
    ),
    (
        'prioritizeBackground();translateStaticUi()})();',
        'prioritizeBackground();translateStaticUi();new MutationObserver(()=>{if(!document.body.classList.contains("locked")){startYouTubePreview();setTimeout(startLivePreview,400)}}).observe(document.body,{attributes:true,attributeFilter:["class"]})})();'
    ),
])

# 2) Old login-video keeper is allowed to preserve playback/sound behavior,
# but it must never switch the already-local video back to raw GitHub.
patch_script('sakaker-final-login-and-sea-audio-override', [
    (f'const LOGIN_URL="{RAW_LOGIN}";', f'const LOGIN_URL="{LOCAL_LOGIN}";'),
])

# 3) Old performance override must not re-escalate either background video to
# fetchpriority=high/preload=auto. Keep all visibility/play/pause logic.
patch_script('sakaker-performance-video-override', [
    (f'const LOGIN_SRC="{RAW_LOGIN}";', f'const LOGIN_SRC="{LOCAL_LOGIN}";'),
    (
        'login.preload="auto";login.setAttribute("fetchpriority","high");login.muted=true;safePlay(login)',
        'login.preload="metadata";login.setAttribute("preload","metadata");login.removeAttribute("fetchpriority");login.muted=true;safePlay(login)'
    ),
    (
        'if(main){main.preload="auto";main.setAttribute("fetchpriority","high");main.muted=true;safePlay(main)}',
        'if(main){main.preload="metadata";main.setAttribute("preload","metadata");main.removeAttribute("fetchpriority");main.muted=true;safePlay(main)}'
    ),
])

# Global safety: the primary login tag must stay local/metadata and its visual
# autoplay behavior must remain unchanged.
vm = re.search(r'<video\b(?=[^>]*\bid=["\']sakLoginBackgroundVideo["\'])[^>]*>', text, re.I)
if not vm:
    raise SystemExit('Login background video tag missing after legacy patch.')
tag = vm.group(0)
if LOCAL_LOGIN not in tag or not re.search(r'\bpreload=["\']metadata["\']', tag, re.I):
    raise SystemExit('Login video lost local metadata-loading configuration.')
for attr in ('autoplay', 'muted', 'loop', 'playsinline'):
    if not re.search(rf'\b{attr}\b', tag, re.I):
        raise SystemExit(f'Login video lost required attribute {attr}.')

# The three active legacy controllers patched above must no longer contain
# raw-login URLs or fetchpriority=high assignments.
for sid in (
    'sakaker-final-preview-and-bilingual-update',
    'sakaker-final-login-and-sea-audio-override',
    'sakaker-performance-video-override',
):
    m = re.search(rf'<script\b[^>]*\bid=["\']{re.escape(sid)}["\'][^>]*>(.*?)</script>', text, re.I | re.S)
    body = m.group(1)
    if RAW_LOGIN in body:
        raise SystemExit(f'Raw login video URL remains in active controller #{sid}.')
    if 'setAttribute("fetchpriority","high")' in body:
        raise SystemExit(f'High fetch priority remains in active controller #{sid}.')

if text != original:
    INDEX.write_text(text, encoding='utf-8')
    print('Legacy login/video controllers optimized safely.')
else:
    print('Legacy login/video controllers already optimized.')

# Idempotent trigger marker: 2026-10-02 performance pass v2.

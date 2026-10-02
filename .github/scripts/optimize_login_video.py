from pathlib import Path
import re

INDEX = Path('index.html')
LOCAL_LOGIN_VIDEO = '/gemini_generated_video_be58b3bc.mp4'

text = INDEX.read_text(encoding='utf-8')

# Change only the opening tag for the existing login background video.
pattern = re.compile(
    r'<video\b(?=[^>]*\bid=["\']sakLoginBackgroundVideo["\'])[^>]*>',
    re.IGNORECASE,
)
matches = list(pattern.finditer(text))
if len(matches) != 1:
    raise SystemExit(f'Expected exactly one sakLoginBackgroundVideo tag, found {len(matches)}; refusing unsafe patch.')

match = matches[0]
tag = match.group(0)
new_tag = tag

# Prevent the browser parser from starting the old raw.githubusercontent.com
# download before login-rescue.js gets a chance to run.
if re.search(r'\bsrc\s*=', new_tag, re.IGNORECASE):
    new_tag = re.sub(
        r'\bsrc\s*=\s*(["\']).*?\1',
        f'src="{LOCAL_LOGIN_VIDEO}"',
        new_tag,
        count=1,
        flags=re.IGNORECASE,
    )
else:
    new_tag = new_tag[:-1] + f' src="{LOCAL_LOGIN_VIDEO}">'

if re.search(r'\bpreload\s*=', new_tag, re.IGNORECASE):
    new_tag = re.sub(
        r'\bpreload\s*=\s*(["\']).*?\1',
        'preload="metadata"',
        new_tag,
        count=1,
        flags=re.IGNORECASE,
    )
else:
    new_tag = new_tag[:-1] + ' preload="metadata">'

# High fetch priority on a 12+ MB autoplay video blocks the login page from
# becoming interactive quickly. The video remains autoplay/muted/loop exactly
# as before; only its network priority/preload policy changes.
new_tag = re.sub(
    r'\s+fetchpriority\s*=\s*(["\']).*?\1',
    '',
    new_tag,
    flags=re.IGNORECASE,
)

# Safety checks: visual/playback behavior must remain untouched.
for attr in ('autoplay', 'muted', 'loop', 'playsinline'):
    if not re.search(rf'\b{attr}\b', new_tag, re.IGNORECASE):
        raise SystemExit(f'Refusing patch: required login-video attribute {attr!r} is missing.')

if LOCAL_LOGIN_VIDEO not in new_tag:
    raise SystemExit('Refusing patch: local login video source was not installed.')
if not re.search(r'\bpreload\s*=\s*["\']metadata["\']', new_tag, re.IGNORECASE):
    raise SystemExit('Refusing patch: preload=metadata was not installed.')
if re.search(r'\bfetchpriority\s*=', new_tag, re.IGNORECASE):
    raise SystemExit('Refusing patch: fetchpriority remains on login video.')

if new_tag == tag:
    print('Login video is already optimized.')
else:
    updated = text[:match.start()] + new_tag + text[match.end():]
    if updated.count('id="sakLoginBackgroundVideo"') + updated.count("id='sakLoginBackgroundVideo'") != 1:
        raise SystemExit('Refusing patch: login video id count changed unexpectedly.')
    INDEX.write_text(updated, encoding='utf-8')
    print('Optimized initial login-video source, preload and fetch priority.')
    print('Before:', tag)
    print('After :', new_tag)

# This script is deliberately idempotent so future runs are safe.

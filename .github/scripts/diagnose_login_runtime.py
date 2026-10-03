from pathlib import Path
import re

text = Path('index.html').read_text(encoding='utf-8')
needles = [
    'sakLoginBackgroundVideo',
    'fetchpriority',
    'raw.githubusercontent.com/sakakera-a11y/sakaker/main/gemini_video_birds_login.mp4',
    'sakLoginWeather',
    'sakPwaInstallIcon',
    'sakLoginProgress',
    'sakLoginDynamicMessage',
]

for needle in needles:
    print('\n' + '=' * 100)
    print('NEEDLE:', needle)
    print('=' * 100)
    starts = [m.start() for m in re.finditer(re.escape(needle), text, flags=re.I)]
    print('COUNT:', len(starts))
    for i, pos in enumerate(starts, 1):
        lo = max(0, pos - 1200)
        hi = min(len(text), pos + len(needle) + 1800)
        snippet = text[lo:hi]
        print(f'\n--- MATCH {i} @ {pos} ---')
        print(snippet)

# Trigger-safe diagnostic script; it never edits the repository.

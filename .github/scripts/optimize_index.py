from pathlib import Path
import re
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
s = path.read_text(encoding='utf-8', errors='ignore')


def add_attrs(match, attrs):
    tag = match.group(0)
    additions = []
    for name, value in attrs:
        if re.search(r'\b' + re.escape(name) + r'\s*=', tag, re.I):
            continue
        additions.append(f' {name}="{value}"')
    if not additions:
        return tag
    if tag.endswith('/>'):
        return tag[:-2] + ''.join(additions) + '/>'
    return tag[:-1] + ''.join(additions) + '>'


s = re.sub(
    r'<iframe\b[^>]*>',
    lambda m: add_attrs(m, [('loading', 'lazy')]),
    s,
    flags=re.I,
)

s = re.sub(
    r'<img\b[^>]*>',
    lambda m: add_attrs(m, [('loading', 'lazy'), ('decoding', 'async')]),
    s,
    flags=re.I,
)


def media_tag(match):
    tag = match.group(0)
    if re.search(r'\bpreload\s*=\s*["\']auto["\']', tag, re.I):
        return re.sub(
            r'\bpreload\s*=\s*["\']auto["\']',
            'preload="metadata"',
            tag,
            flags=re.I,
        )
    if not re.search(r'\bpreload\s*=', tag, re.I):
        return tag[:-1] + ' preload="metadata">'
    return tag


s = re.sub(r'<(?:video|audio)\b[^>]*>', media_tag, s, flags=re.I)

marker = '<!-- SAKAKER FREE HOSTING PERFORMANCE HINTS -->'
if marker not in s:
    hints = marker + '''
<style id="sakaker-free-hosting-performance">
@media (max-width:900px){
  html body *{-webkit-tap-highlight-color:transparent}
  html body [style*="backdrop-filter"],html body [class*="glass"]{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
}
@media (prefers-reduced-motion:reduce){
  html body *,html body *::before,html body *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
}
</style>
'''
    s = s.replace('</head>', hints + '</head>', 1)

path.write_text(s, encoding='utf-8')
print(path.stat().st_size)

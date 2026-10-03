from pathlib import Path
import re

p=Path('index.html')
s=p.read_text(encoding='utf-8')

legacy_ids=['sakSeaAudio','sakSeaSoundButton','sakakerBirdAudio','sakakerBirdSoundBtn','bird-sound-btn']

# Remove static legacy audio/button elements if present.
for legacy_id in legacy_ids:
    # paired audio/button/div/span/a tags
    s=re.sub(
        rf'<(audio|button|div|span|a)\b(?=[^>]*\bid=["\']{re.escape(legacy_id)}["\'])[^>]*>.*?</\1\s*>',
        '',s,flags=re.I|re.S)
    # standalone/self-closing tags
    s=re.sub(
        rf'<(?:audio|button|div|span|a)\b(?=[^>]*\bid=["\']{re.escape(legacy_id)}["\'])[^>]*?/?>',
        '',s,flags=re.I|re.S)

# Remove legacy CSS selectors from inline styles where they only target old sound controls.
for legacy_id in legacy_ids:
    s=s.replace('#'+legacy_id+',','').replace(',\n    #'+legacy_id,'').replace(', #'+legacy_id,'')

p.write_text(s,encoding='utf-8')

# Runtime safety: keep only the two approved sound paths.
cleanup=Path('assets/final-ui-cleanup.js')
c=cleanup.read_text(encoding='utf-8')
if "const LEGACY_SOUND_IDS=" not in c:
    marker="window.__sakakerFinalUiCleanup=true;\n"
    guard="""
const LEGACY_SOUND_IDS=['sakSeaAudio','sakSeaSoundButton','sakakerBirdAudio','sakakerBirdSoundBtn','bird-sound-btn'];
function purgeLegacyIndependentSounds(){
  LEGACY_SOUND_IDS.forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    try{if(typeof el.pause==='function'){el.pause();el.currentTime=0;}}catch(_){}
    el.remove();
  });
}
"""
    c=c.replace(marker,marker+guard,1)
    c=c.replace("function run(){cleanLoginProviders();cleanLegacySeaSound();ensureVideoFix();}","function run(){purgeLegacyIndependentSounds();cleanLoginProviders();cleanLegacySeaSound();ensureVideoFix();}")
cleanup.write_text(c,encoding='utf-8')

# Verify approved video sound sources remain.
idx=p.read_text(encoding='utf-8')
runtime=Path('assets/main-runtime-locks.js').read_text(encoding='utf-8')
icons=Path('assets/final-three-icons.js').read_text(encoding='utf-8')
assert 'gemini_video_birds_login.mp4' in runtime
assert 'gemini_generated_video_34118154.mp4' in icons
assert 'sakSiteSoundBtn' in icons
print('Legacy independent sea/bird sound cleanup prepared.')

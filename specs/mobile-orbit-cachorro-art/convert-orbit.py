# Uso (desde la raíz del repo):
#   uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py
# Convierte los diez PNG de design-src a mobile-pet-tracker/assets/images/orbit-<pose>.webp.
import hashlib, sys
from pathlib import Path
from PIL import Image

POSES = ['wave', 'wave-blink', 'talk', 'celebrate', 'sleep', 'collar', 'health', 'food', 'clipboard', 'walk']
SRC = Path('specs/mobile-orbit-cachorro-art/design-src')
DST = Path(sys.argv[1] if len(sys.argv) > 1 else 'mobile-pet-tracker/assets/images')

def clean(v):  # alfa < 16 es residuo fuera del contorno; alfa >= 252 es cuerpo opaco
    return 0 if v < 16 else 255 if v >= 252 else v

for pose in POSES:
    im = Image.open(SRC / f'orbit-{pose}.png')
    assert im.mode == 'RGBA' and im.size == (1024, 1024), (pose, im.mode, im.size)
    r, g, b, a = im.split()
    Image.merge('RGBA', (r, g, b, a.point(clean))).save(DST / f'orbit-{pose}.webp', 'WEBP', quality=80, method=6)

print('pose bytes sha256 bbox(l,t,r,b margins) minAlpha>0')
bad = 0
for pose in POSES:
    path = DST / f'orbit-{pose}.webp'
    data = path.read_bytes()
    a = Image.open(path).convert('RGBA').getchannel('A')
    hist = a.histogram()
    box = a.getbbox()
    margins = (box[0], box[1], 1024 - box[2], 1024 - box[3])
    min_alpha = next(i for i in range(1, 256) if hist[i])
    ok = len(data) <= 100000 and data[:4] == b'RIFF' and data[8:16] == b'WEBPVP8X' and min_alpha >= 16 and min(margins) >= 24
    bad += not ok
    print(pose, len(data), hashlib.sha256(data).hexdigest(), margins, min_alpha, 'ok' if ok else 'FALLA')
sys.exit(1 if bad else 0)

# Uso (desde la raiz del repo):
#   uvx --with pillow==13.0.0 python -I specs/mobile-orbit-splash-icono/convert-orbit-icons.py [carpeta-destino]
# Sin argumento escribe en mobile-pet-tracker/assets (images/ y expo.icon/Assets/).
# Con argumento escribe en <carpeta>/images y <carpeta>/expo.icon/Assets (crea ambas).
# Convierte las tres fuentes de design-src (G6) a los ocho PNG de marca de Orbit.
import hashlib, math, sys
from pathlib import Path
from PIL import Image, ImageChops

SRC = Path('specs/mobile-orbit-splash-icono/design-src')
DST = Path(sys.argv[1] if len(sys.argv) > 1 else 'mobile-pet-tracker/assets')
IMAGES = DST / 'images'
ICONSET = DST / 'expo.icon' / 'Assets'
IMAGES.mkdir(parents=True, exist_ok=True)
ICONSET.mkdir(parents=True, exist_ok=True)

SAFE_RADIUS = 338      # 66 % de 1024 / 2: zona segura adaptativa y circulo de 2/3 del splash Android 12
SPLASH_SCALE = 799     # cuerpo del splash (768 px) escalado para caber en SAFE_RADIUS
SPLASH_AT = (116, 109)
DARK_CUTOFF = 60       # luminancia por debajo de la cual el monocromo deja un hueco (ojos, nariz, boca)
NOTIF_WIDTH = 88       # ancho del perro en los iconos de notificacion de 96 x 96


def clean(v):  # alfa < 16 es residuo fuera del contorno; alfa >= 252 es cuerpo opaco
    return 0 if v < 16 else 255 if v >= 252 else v


def cleaned(im):
    r, g, b, a = im.convert('RGBA').split()
    return Image.merge('RGBA', (r, g, b, a.point(clean)))


def white_with(alpha):
    full = alpha.point(lambda v: 255)
    return Image.merge('RGBA', (full, full, full, alpha))


def fit96(im):
    crop = im.crop(im.getchannel('A').getbbox())
    height = round(crop.height * NOTIF_WIDTH / crop.width)
    crop = crop.resize((NOTIF_WIDTH, height), Image.LANCZOS)
    out = Image.new('RGBA', (96, 96), (0, 0, 0, 0))
    out.paste(crop, ((96 - NOTIF_WIDTH) // 2, (96 - height) // 2))
    return out


icon = Image.open(SRC / 'orbit-icon.png')
fg_src = Image.open(SRC / 'orbit-icon-fg.png')
splash_src = Image.open(SRC / 'orbit-splash.png')
assert icon.mode == 'RGB' and icon.size == (1024, 1024), ('icon', icon.mode, icon.size)
assert fg_src.mode == 'RGBA' and fg_src.size == (1024, 1024), ('fg', fg_src.mode, fg_src.size)
assert splash_src.mode == 'RGBA' and splash_src.size == (1024, 1024), ('splash', splash_src.mode, splash_src.size)

fg = cleaned(fg_src)
dark = fg.convert('L').point(lambda v: 0 if v < DARK_CUTOFF else 255)
mono = white_with(ImageChops.multiply(fg.getchannel('A'), dark))

body = cleaned(splash_src).resize((SPLASH_SCALE, SPLASH_SCALE), Image.LANCZOS)
splash = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
splash.paste(body, SPLASH_AT)
splash = cleaned(splash)

OUT = {
    'icon.png': icon.convert('RGBA'),
    'android-icon-foreground.png': fg,
    'android-icon-monochrome.png': mono,
    'splash-icon.png': splash,
    'favicon.png': icon.resize((48, 48), Image.LANCZOS).convert('RGBA'),
    'pet-tracker-notification-96.png': fit96(mono),
    'pet-tracker-notification-color-96.png': fit96(fg),
}
for name, im in OUT.items():
    im.save(IMAGES / name, 'PNG')
fg.save(ICONSET / 'orbit.png', 'PNG')

# Lectura de vuelta: tamano, modo, bytes, sha256, caja del alfa, radio maximo y alfa minimo > 0.
CHECKS = [(IMAGES / name) for name in OUT] + [ICONSET / 'orbit.png']
print('fichero size modo bytes sha256 bbox(l,t,r,b) radio alfaMin>0')
bad = 0
for path in CHECKS:
    data = path.read_bytes()
    im = Image.open(path)
    rgba = im.convert('RGBA')
    a = rgba.getchannel('A')
    hist = a.histogram()
    box = a.getbbox()
    w, h = im.size
    px = a.load()
    radius = max(
        (math.hypot(x + 0.5 - w / 2, y + 0.5 - h / 2) for y in range(h) for x in range(w) if px[x, y] > 0),
        default=0,
    )
    min_alpha = next(i for i in range(1, 256) if hist[i])
    name = path.name
    ok = data[:8] == b'\x89PNG\r\n\x1a\n' and im.mode == 'RGBA'
    if im.size[0] == 1024 and name != 'icon.png':
        ok = ok and min_alpha >= 16  # el reescalado a 96 px antialiasa; solo se limpia a 1024
    if name == 'icon.png':
        ok = ok and im.size == (1024, 1024) and hist[255] == w * h and len(data) <= 720000
    elif name == 'favicon.png':
        ok = ok and im.size == (48, 48) and hist[255] == w * h and len(data) <= 4500
    elif name == 'splash-icon.png':
        ok = ok and im.size == (1024, 1024) and radius <= SAFE_RADIUS and box[0] >= 174 and box[2] <= 850 and box[1] >= 174 and box[3] <= 850 and len(data) <= 500000
    elif name == 'android-icon-monochrome.png':
        seen = a.point(lambda v: 255 if v else 0)
        whites = all(ImageChops.multiply(ImageChops.invert(c), seen).getbbox() is None for c in rgba.split()[:3])
        ok = ok and im.size == (1024, 1024) and radius <= SAFE_RADIUS and whites and len(data) <= 36000
    elif name in ('android-icon-foreground.png', 'orbit.png'):
        ok = ok and im.size == (1024, 1024) and radius <= SAFE_RADIUS and len(data) <= 480000
    else:  # notificaciones de 96 x 96
        cap = 6000 if name == 'pet-tracker-notification-96.png' else 16000
        ok = ok and im.size == (96, 96) and box[0] >= 4 and box[1] >= 4 and 96 - box[2] >= 4 and 96 - box[3] >= 4 and len(data) <= cap
    bad += not ok
    print(name, im.size, im.mode, len(data), hashlib.sha256(data).hexdigest(), box, round(radius, 1), min_alpha, 'ok' if ok else 'FALLA')
sys.exit(1 if bad else 0)

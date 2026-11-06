import sys
from PIL import Image
src, dst, k = sys.argv[1], sys.argv[2], float(sys.argv[3])
im = Image.open(src)
a = im.getchannel('A').point(lambda v: 0 if v < 16 else 255 if v >= 252 else v)
l, t, r, b = a.getbbox()
cx, cy = (l + r) / 2, (t + b) / 2
w, h = round(im.width * k), round(im.height * k)
small = im.resize((w, h), Image.LANCZOS)
out = Image.new('RGBA', im.size, (0, 0, 0, 0))
out.alpha_composite(small, (round(cx - w * (cx / im.width)), round(cy - h * (cy / im.height))))
out.save(dst)
a2 = out.getchannel('A').point(lambda v: 0 if v < 16 else v)
bb = a2.getbbox()
print((bb[0], bb[1], 1024 - bb[2], 1024 - bb[3]), bb[2]-bb[0])

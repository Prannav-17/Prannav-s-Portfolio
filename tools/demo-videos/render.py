"""Phase 2: turn captured states + spec.json into a smooth 30 fps demo video.
Usage: python render.py <outDir> <slug> <dest.mp4> <ffmpeg> <font>"""
import json, math, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT, SLUG, DEST, FF, FONT = sys.argv[1:6]
FPS, OW, OH, SCALE = 30, 1280, 800, 2          # output size; screenshots are 2x
XFADE, LOOP = 0.45, 0.6                         # crossfade between screens, and back to the start

spec = json.load(open(f"{OUT}/{SLUG}/spec.json"))
scenes = spec["scenes"]
imgs = {}
def img(name):
    if name not in imgs: imgs[name] = Image.open(f"{OUT}/{SLUG}/{name}").convert("RGB")
    return imgs[name]

ease = lambda t: 4 * t * t * t if t < .5 else 1 - pow(-2 * t + 2, 3) / 2
def interp(keys, t):
    """keys: [[time, value...]] → eased value at t (holds before first / after last)."""
    if t <= keys[0][0]: return keys[0][1:]
    for (t0, *a), (t1, *b) in zip(keys, keys[1:]):
        if t <= t1:
            k = ease((t - t0) / (t1 - t0)) if t1 > t0 else 1
            return [ [x + (y - x) * k for x, y in zip(a[0], b[0])] ] if isinstance(a[0], list) else [x + (y - x) * k for x, y in zip(a, b)]
    return keys[-1][1:]

def camera(s, t): return interp(s["cam"], t)[0]
def cursor(s, t): return interp(s["cur"], t) if s.get("cur") else None
def to_screen(cam, p): x, y, w, h = cam; return ((p[0] - x) / w * OW, (p[1] - y) / h * OH)

def frame_of(s, t):
    x, y, w, h = camera(s, t)
    return img(s["img"]).resize((OW, OH), Image.BICUBIC, box=(x * SCALE, y * SCALE, (x + w) * SCALE, (y + h) * SCALE), reducing_gap=2.0)

font = ImageFont.truetype(FONT, 25)
try: font.set_variation_by_axes([620])
except Exception: pass

ARROW = [(0, 0), (0, 21), (5, 16), (9, 25), (13, 23), (9, 15), (16, 15)]
def draw_cursor(base, pos, press=0.0, ripple=None):
    ov = Image.new("RGBA", (OW, OH), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    if ripple:
        (rx, ry), k = ripple
        r = 10 + 34 * ease(min(1, k)); a = int(150 * (1 - k))
        d.ellipse([rx - r, ry - r, rx + r, ry + r], outline=(56, 189, 248, a), width=4)
        d.ellipse([rx - r * .45, ry - r * .45, rx + r * .45, ry + r * .45], fill=(56, 189, 248, int(a * .35)))
    sc = 1.15 * (1 - .18 * press); px, py = pos
    pts = [(px + u * sc, py + v * sc) for u, v in ARROW]
    sh = Image.new("RGBA", (OW, OH), (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(u + 2, v + 3) for u, v in pts], fill=(11, 37, 64, 90))
    ov = Image.alpha_composite(sh.filter(ImageFilter.GaussianBlur(2)), ov); d = ImageDraw.Draw(ov)
    d.polygon(pts, fill=(255, 255, 255, 255), outline=(11, 37, 64, 255), width=2)
    return Image.alpha_composite(base.convert("RGBA"), ov)

def draw_caption(base, text, alpha):
    if not text or alpha <= 0: return base
    ov = Image.new("RGBA", (OW, OH), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    l, t, r, b = d.textbbox((0, 0), text, font=font)
    pw, ph = r - l + 44, b - t + 26; x0, y0 = 30, OH - 30 - ph
    d.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], radius=ph // 2, fill=(11, 37, 64, int(228 * alpha)))
    d.ellipse([x0 + 16, y0 + ph / 2 - 4, x0 + 24, y0 + ph / 2 + 4], fill=(56, 189, 248, int(255 * alpha)))
    d.text((x0 + 32 - l, y0 + 13 - t), text, font=font, fill=(255, 255, 255, int(255 * alpha)))
    return Image.alpha_composite(base if base.mode == "RGBA" else base.convert("RGBA"), ov)

def compose(s, t, cap_alpha, cur_override=None):
    f = frame_of(s, t)
    cur = cur_override
    if cur is None and s.get("cur"): cur = to_screen(camera(s, t), cursor(s, t))
    if cur:
        press, ripple = 0.0, None
        for tc in s.get("click", []):
            if 0 <= t - tc < .5: ripple = (cur, (t - tc) / .5)
            if abs(t - tc) < .12: press = 1 - abs(t - tc) / .12
        f = draw_cursor(f, cur, press, ripple)
    return draw_caption(f, s["cap"], cap_alpha).convert("RGB")

proc = subprocess.Popen([FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{OW}x{OH}", "-r", str(FPS), "-i", "-",
                         "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", DEST], stdin=subprocess.PIPE)
emit = lambda im: proc.stdin.write(im.tobytes())
frames = 0
for i, s in enumerate(scenes):
    prev = scenes[i - 1] if i else None
    same_cap = prev is not None and prev["cap"] == s["cap"]
    n = round(s["dur"] * FPS)
    for k in range(n):
        t = k / FPS
        a = 1.0 if same_cap or i == 0 and k == 0 else min(1, t / .35)
        if i == 0: a = min(1, t / .35) if k else 0
        emit(compose(s, t, a)); frames += 1
    nxt = scenes[i + 1] if i + 1 < len(scenes) else None
    if nxt and nxt["img"] != s["img"]:
        # crossfade to the next screen; the cursor glides between the two positions
        m = round(XFADE * FPS)
        ca = to_screen(camera(s, s["dur"]), cursor(s, s["dur"])) if s.get("cur") else None
        cb = to_screen(camera(nxt, 0), cursor(nxt, 0)) if nxt.get("cur") else None
        for k in range(m):
            u = ease((k + 1) / (m + 1))
            cur = (ca[0] + (cb[0] - ca[0]) * u, ca[1] + (cb[1] - ca[1]) * u) if ca and cb else None
            A = frame_of(s, s["dur"]); B = frame_of(nxt, 0)
            f = Image.blend(A, B, u)
            if cur: f = draw_cursor(f, cur).convert("RGB")
            f = draw_caption(f, s["cap"], 1 - u) if nxt["cap"] != s["cap"] else draw_caption(f, s["cap"], 1)
            emit(f.convert("RGB")); frames += 1
# seamless loop: blend the last screen back into the first
last, first = scenes[-1], scenes[0]
m = round(LOOP * FPS)
for k in range(m):
    u = ease((k + 1) / (m + 1))
    f = Image.blend(frame_of(last, last["dur"]), frame_of(first, 0), u)
    emit(draw_caption(f, last["cap"], 1 - u).convert("RGB")); frames += 1
proc.stdin.close(); proc.wait()
print(f"{SLUG}: {frames} frames, {frames / FPS:.1f}s → {DEST}")

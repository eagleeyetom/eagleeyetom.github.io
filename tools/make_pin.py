"""Wzor przypinki 58 mm: plakat bez paska logotypow wpisany w kolo 700x700 px (300 dpi ~ 59 mm).

python tools/make_pin.py  ->  design/pin/przypinka-masska-2026.png (700x700, przezroczyste naroza)
                              design/pin/przypinka-masska-2026-2100.png (3x, do druku)
                              design/pin/przypinka-masska-2026-a4.png (arkusz A4, 300 dpi)
                              oraz to samo z paskiem ORGANIZATOR: przypinka-organizator-masska-2026*.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design/source/plakat-2026.jpg"
OUT = ROOT / "design/pin"
POSTER_BOTTOM = 5718          # nizej zaczyna sie pasek z logotypami
POSTER_W_FRAC = 0.64          # szerokosc plakatu / srednica kola
POSTER_TOP_FRAC = 0.100       # gorna krawedz plakatu / srednica kola (napisy musza zmiescic sie w kole)
FONT = ROOT / "tools/fonts/anton-latin-400-normal.woff"
RED = (200, 35, 10)           # czerwien z plakatu
BAND_TOP = 0.85               # gorna krawedz paska z napisem / srednica kola
SS = 4                        # supersampling dla gladkiej krawedzi


def pin(size, label=None):
    """Zwraca RGBA size x size: plakat na bialym kole; z `label` dolny czerwony pasek z napisem."""
    big = size * SS
    poster = Image.open(SRC).convert("RGB").crop((0, 0, 4134, POSTER_BOTTOM))
    w = round(big * POSTER_W_FRAC)
    h = round(w * poster.height / poster.width)
    poster = poster.resize((w, h), Image.LANCZOS)
    canvas = Image.new("RGB", (big, big), "white")
    canvas.paste(poster, ((big - w) // 2, round(big * POSTER_TOP_FRAC)))
    if label:
        d = ImageDraw.Draw(canvas)
        top = round(big * BAND_TOP)
        d.rectangle((0, top - 5 * size // 700 * SS, big, top), fill="white")
        d.rectangle((0, top, big, big), fill=RED)
        font = ImageFont.truetype(str(FONT), round(big * 0.088))
        box = d.textbbox((0, 0), label, font=font)
        tw, th = box[2] - box[0], box[3] - box[1]
        cy = top + (big - top) * 0.44
        d.text(((big - tw) / 2 - box[0], cy - th / 2 - box[1]), label, font=font, fill="white")
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, big - 1, big - 1), fill=255)
    out = canvas.convert("RGBA")
    out.putalpha(mask)
    return out.resize((size, size), Image.LANCZOS)


def sheet(dpi=300, label=None):
    """Arkusz A4: 3 x 4 przypinki, kolo 700 px = 59,4 mm, cienka linia ciecia."""
    a4 = (round(210 / 25.4 * dpi), round(297 / 25.4 * dpi))
    page = Image.new("RGB", a4, "white")
    d = 700
    p = pin(d, label)
    cols, rows, gap = 3, 4, 40
    x0 = (a4[0] - (cols * d + (cols - 1) * gap)) // 2
    y0 = (a4[1] - (rows * d + (rows - 1) * gap)) // 2
    dr = ImageDraw.Draw(page)
    for r in range(rows):
        for c in range(cols):
            x, y = x0 + c * (d + gap), y0 + r * (d + gap)
            page.paste(p, (x, y), p)
            dr.ellipse((x, y, x + d, y + d), outline=(150, 150, 150), width=2)
    return page


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    pin(700).save(OUT / "przypinka-masska-2026.png")
    pin(2100).save(OUT / "przypinka-masska-2026-2100.png")
    sheet().save(OUT / "przypinka-masska-2026-a4.png", dpi=(300, 300))
    pin(700, "ORGANIZATOR").save(OUT / "przypinka-organizator-masska-2026.png")
    pin(2100, "ORGANIZATOR").save(OUT / "przypinka-organizator-masska-2026-2100.png")
    sheet(label="ORGANIZATOR").save(OUT / "przypinka-organizator-masska-2026-a4.png", dpi=(300, 300))

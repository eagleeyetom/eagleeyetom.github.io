#!/usr/bin/env python3
"""Builds every web graphic derived from the poster of the current edition.

    design/source/plakat-2026.jpg      full poster (bowler hat, title lettering, partner logos at the bottom)
    design/source/plakaty/<year>.jpg   scans of the posters of earlier years

Usage (needs Pillow):  python tools/build_graphics.py

Outputs (all under public/):
    assets/img/lettering/*.webp    title, MASSKA and "25" candles cut out of the poster (transparent)
    assets/img/plakaty/2026*.webp  poster for the archive, and the figure without the lettering for the hero
    assets/img/plakaty/<year>.webp older posters, from the scans
    assets/img/partners/*.webp     partner logos, cut from the strip at the bottom of the poster
    assets/img/teatr/placeholder-N.webp stand-in photos for ensembles without pictures (poster details)
    assets/img/og-masska-2026.jpg  social sharing image (1200x630)
    assets/img/texture/ink-edge.webp halftone edge used above dark sections
    assets/icons/*, favicon.ico    favicons and app icons
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design" / "source"
PUB = ROOT / "public"
IMG = PUB / "assets" / "img"
ICONS = PUB / "assets" / "icons"

# Colours sampled from the poster
RED = (211, 47, 19)  # the bowler hat and the candles
WHITE = (255, 255, 255)
INK = (17, 17, 17)

# The artwork ends where the strip of partner logos begins
ART_BOTTOM = 5724


def save(img, path, **kwargs):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, **kwargs)
    print(f"  {path.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}  {path.stat().st_size // 1024} KB")


def resize_to_width(img, width):
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def figure_mask(poster):
    """The hat, face, suit and candles as one silhouette, apart from the lettering around them.
    On a quarter-size copy the halftone dots are grown until they touch, then the shapes
    connected to a few seed points are flooded; letters stay separate islands."""
    w, h = poster.width // 4, ART_BOTTOM // 4
    small = poster.crop((0, 0, poster.width, ART_BOTTOM)).resize((w, h), Image.BOX).convert("L")
    grown = small.point(lambda v: 255 if v < 238 else 0).filter(ImageFilter.MaxFilter(5))
    for seed in [(500, 300), (147, 1327), (959, 1254), (590, 1268)]:  # hat, suit left and right, bow tie
        if grown.getpixel(seed) == 255:
            ImageDraw.floodfill(grown, seed, 128)
    mask = grown.point(lambda v: 255 if v == 128 else 0)
    full = Image.new("L", poster.size, 0)
    full.paste(mask.resize((w * 4, h * 4), Image.NEAREST), (0, 0))
    return full


def lift(img, floor=28, trim=True):
    """Colour to alpha on a white background: white turns transparent, worn edges stay soft.
    Trimmed to the ink unless trim is False (then it keeps the size and position of img)."""
    rgb = img.convert("RGB")
    raw = rgb.tobytes()
    out = []
    for i in range(0, len(raw), 3):
        r, g, b = raw[i], raw[i + 1], raw[i + 2]
        a = 255 - min(r, g, b)
        if a < floor:
            out.append((0, 0, 0, 0))
            continue
        f = 255 / a
        out.append((round(255 - (255 - r) * f), round(255 - (255 - g) * f), round(255 - (255 - b) * f), a))
    res = Image.new("RGBA", rgb.size)
    res.putdata(out)
    return res.crop(res.getchannel("A").getbbox()) if trim else res


def lettering(poster, figure):
    print("Lettering")
    out = IMG / "lettering"
    # Everything that is not the figure: the lettering on white
    text = Image.composite(Image.new("RGB", poster.size, WHITE), poster, figure.filter(ImageFilter.MaxFilter(9)))

    title = lift(text.crop((60, 60, 1775, 1201)))
    save(resize_to_width(title, 720), out / "title.webp", quality=90, method=6, alpha_quality=90)

    # MASSKA without the top of "Sopot" below it (red)
    word = text.crop((2590, 100, 4100, 645))
    px = word.load()
    for y in range(word.height):
        for x in range(word.width):
            r, g, b = px[x, y]
            if r - g > 50:
                px[x, y] = WHITE
    masska = lift(word)
    save(resize_to_width(masska, 760), out / "masska.webp", quality=90, method=6, alpha_quality=90)
    save(resize_to_width(masska, 360), out / "masska-header.webp", quality=90, method=6, alpha_quality=90)

    # The "25" candles stand on the hat: cut just above the crown
    candles = lift(poster.crop((1760, 0, 2600, 640)))
    save(resize_to_width(candles, 360), out / "25.webp", quality=90, method=6, alpha_quality=90)
    return masska, candles


def figure_art(poster, figure):
    """The figure on white, without the lettering, for the hero."""
    soft = figure.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(4))
    return Image.composite(poster, Image.new("RGB", poster.size, WHITE), soft).crop((0, 0, poster.width, ART_BOTTOM))


def posters(poster, art):
    print("Posters")
    save(resize_to_width(poster, 900), IMG / "plakaty" / "2026.webp", quality=74, method=6)
    save(resize_to_width(art, 900), IMG / "plakaty" / "2026-art.webp", quality=74, method=6)
    # 1200x630 for link previews: the title, the candles and the crown of the hat
    h = round(poster.width * 630 / 1200)
    og = poster.crop((0, 0, poster.width, h)).resize((1200, 630), Image.LANCZOS)
    save(og, IMG / "og-masska-2026.jpg", quality=82, optimize=True, progressive=True)


# Share of the scan to keep (left, top, right, bottom) where it has a paper margin around the print
ARCHIVE_TRIM = {
    "2024": (0.0245, 0.0175, 0.9825, 0.9825),
}


def archive_posters():
    """Converts the scans in design/source/plakaty/<year>.jpg to the web posters of the timeline."""
    print("Archive posters")
    for src in sorted((SRC / "plakaty").glob("*.jpg")):
        img = Image.open(src).convert("RGB")
        if src.stem in ARCHIVE_TRIM:
            l, t, r, b = ARCHIVE_TRIM[src.stem]
            img = img.crop((round(img.width * l), round(img.height * t), round(img.width * r), round(img.height * b)))
        save(resize_to_width(img, 900), IMG / "plakaty" / f"{src.stem}.webp", quality=72, method=6)


# Partner logos in the strip at the bottom of the poster: name -> box (left, top, right, bottom)
# in poster pixels. The labels between them ("Organizator:", "Patronat medialny:") are page text.
PARTNERS = {
    "na-drodze-ekspresji": (350, 5740, 658, 5870),
    "sopot": (662, 5740, 1015, 5875),
    "wojewoda-pomorski": (1020, 5740, 1296, 5875),
    "prezydentka-sopotu": (1355, 5740, 1608, 5875),
    "radio-357": (1765, 5740, 1876, 5880),
    "radio-gdansk": (1920, 5740, 2236, 5875),
    "teatr-wybrzeze": (2300, 5740, 2595, 5875),
    "teatr-atelier": (2635, 5740, 2867, 5875),
    "mamuszki-14": (2917, 5740, 3269, 5875),
    "atelier-cocktails": (3306, 5740, 3417, 5875),
    "bart": (3462, 5740, 3724, 5875),
    "pkps": (3762, 5740, 3876, 5880),
}


def partners(poster):
    print("Partner logos")
    for name, box in PARTNERS.items():
        logo = poster.crop(box)
        ink = ImageOps.invert(logo.convert("L")).point(lambda v: 255 if v > 18 else 0)
        logo = logo.crop(ink.getbbox())
        pad = Image.new("RGB", (logo.width + 8, logo.height + 8), WHITE)
        pad.paste(logo, (4, 4))
        save(pad, IMG / "partners" / f"{name}.webp", quality=88, method=6)


# Poster details used as stand-in photos (3:2): (left, top, width) in poster pixels, and whether
# the detail is printed in red and black like a duotone
PLACEHOLDER_CROPS = [
    ((300, 650, 3600), False),   # the bowler hat
    ((1000, 2550, 2100), False),  # the lips in the halftone face
    ((900, 3950, 2650), False),   # bow tie and suit
    ((1250, 0, 1950), False),     # the candles on the crown
    ((500, 2650, 2850), True),    # the face, red and black
]


def placeholder_photos(art):
    """3:2 photos for ensemble pages that have none yet, cut from the figure."""
    print("Placeholder photos")
    for n, ((x, y, w), duotone) in enumerate(PLACEHOLDER_CROPS, start=1):
        h = round(w / 1.5)
        y = min(y, art.height - h)
        crop = art.crop((x, y, x + w, y + h))
        if duotone:
            crop = ImageOps.colorize(ImageOps.grayscale(crop), black=INK, white=WHITE, mid=RED)
        save(resize_to_width(crop, 1000), IMG / "teatr" / f"placeholder-{n}.webp", quality=62, method=6)


def ink_edge():
    """A strip of halftone dots that grow downwards until they merge, like the face on the poster.
    Used as a mask above dark sections so the dark block fades into the page in print dots.
    The dots sit on a 45 degree grid whose period divides the width, so the strip tiles."""
    print("Texture")
    pitch, width, height, scale = 18, 18 * 60, 160, 4
    big = Image.new("L", (width * scale, height * scale), 0)
    draw = ImageDraw.Draw(big)
    rows = int(height / (pitch / 2)) + 2
    for j in range(-1, rows):
        cy = j * pitch / 2
        offset = (pitch / 2) if j % 2 else 0
        t = max(0.0, min(1.0, (cy - 8) / (height - 30)))  # 0 at the top, 1 near the bottom
        r = (t ** 1.3) * pitch * 0.75
        if r < 0.6:
            continue
        for i in range(-1, width // pitch + 2):
            cx = i * pitch + offset
            draw.ellipse(((cx - r) * scale, (cy - r) * scale, (cx + r) * scale, (cy + r) * scale), fill=255)
    strip = big.resize((width, height), Image.LANCZOS)
    rgba = Image.new("RGBA", strip.size, (0, 0, 0, 0))
    rgba.putalpha(strip)
    save(rgba, IMG / "texture" / "ink-edge.webp", lossless=True, method=6)


def icons(candles):
    print("Icons")
    # The red "25" candles on white: the jubilee in one sign, legible down to 16 px
    def tile(size, fill=0.8, radius=0.0):
        img = Image.new("RGBA", (size, size), WHITE + (255,))
        scale = size * fill / max(candles.size)
        glyph = candles.resize((max(1, round(candles.width * scale)), max(1, round(candles.height * scale))), Image.LANCZOS)
        img.alpha_composite(glyph, ((size - glyph.width) // 2, (size - glyph.height) // 2))
        if radius:
            mask = Image.new("L", (size, size), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), round(size * radius), fill=255)
            img.putalpha(mask)
        return img

    save(tile(16, 0.96, 0.18), ICONS / "favicon-16x16.png")
    save(tile(32, 0.94, 0.18), ICONS / "favicon-32x32.png")
    save(tile(180, 0.72), ICONS / "apple-touch-icon.png")
    save(tile(192, 0.66, 0.18), ICONS / "android-chrome-192x192.png")
    save(tile(512, 0.66, 0.18), ICONS / "android-chrome-512x512.png")
    ico = tile(256, 0.92, 0.18)
    for target in (ICONS / "favicon.ico", PUB / "favicon.ico"):
        ico.save(target, sizes=[(16, 16), (32, 32), (48, 48)])
        print(f"  {target.relative_to(ROOT)}")


def main():
    if not (SRC / "plakat-2026.jpg").exists():
        sys.exit("Missing source file: design/source/plakat-2026.jpg")
    poster = Image.open(SRC / "plakat-2026.jpg").convert("RGB")
    figure = figure_mask(poster)
    masska, candles = lettering(poster, figure)
    art = figure_art(poster, figure)
    posters(poster, art)
    archive_posters()
    partners(poster)
    placeholder_photos(art)
    ink_edge()
    icons(candles)
    print("Done.")


if __name__ == "__main__":
    main()

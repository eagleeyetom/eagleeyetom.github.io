#!/usr/bin/env python3
"""Builds every web graphic derived from the two source files in design/source/.

    design/source/plakat-2026.webp     full poster of the current edition
    design/source/masska-stamp.webp    cut-out "MASSKA" lettering (transparent background)

Optional overrides: put a transparent PNG/WebP named xxv, jubileuszowy,
przeglad-teatralny or 2026 in design/source/lettering/ and it is used instead of the
lettering cut out of the poster.

Usage (needs Pillow):  python tools/build_graphics.py

Outputs (all under public/):
    assets/img/lettering/*.webp   poster lettering cut-outs + header and plate logos
    assets/img/plakaty/2026*.webp poster for the archive, and its artwork without the title band
    assets/img/plakaty/<year>.webp older posters, from the scans in design/source/plakaty/<year>.jpg
    assets/img/teatr/placeholder-N.webp stand-in photos for ensembles without pictures (poster details)
    assets/img/og-masska-2026.jpg social sharing image (1200x630)
    assets/img/texture/ink-edge.webp printed-ink edge used above dark sections
    assets/icons/*, favicon.ico   favicons and app icons
"""
import os
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design" / "source"
PUB = ROOT / "public"
IMG = PUB / "assets" / "img"
ICONS = PUB / "assets" / "icons"

# Colours sampled from the XXV poster
MAUVE = (179, 134, 145)
CYAN = (209, 255, 255)
PEACH = (251, 220, 197)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
INK = (31, 29, 27)


def save(img, path, **kwargs):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, **kwargs)
    print(f"  {path.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}  {path.stat().st_size // 1024} KB")


def resize_to_width(img, width):
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def cut_out(poster, box, fg, bg=MAUVE, pad=6):
    """Lifts one colour off the flat background: alpha is how far each pixel lies from the
    background towards the foreground, so worn edges keep their anti-aliasing."""
    crop = poster.crop(box).convert("RGB")
    dx = [f - b for f, b in zip(fg, bg)]
    norm = sum(d * d for d in dx)
    alpha = Image.new("L", crop.size)
    src, dst = crop.load(), alpha.load()
    for y in range(crop.height):
        for x in range(crop.width):
            p = src[x, y]
            t = sum((p[i] - bg[i]) * dx[i] for i in range(3)) / norm
            dst[x, y] = max(0, min(255, round(t * 255)))
    out = Image.new("RGBA", crop.size, fg + (0,))
    out.putalpha(alpha)
    bbox = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    out = out.crop(bbox)
    padded = Image.new("RGBA", (out.width + 2 * pad, out.height + 2 * pad), fg + (0,))
    padded.paste(out, (pad, pad))
    return padded


def lettering(poster):
    print("Lettering")
    out = IMG / "lettering"
    # (name, crop box in the 2678x3799 poster, colour, width to export)
    parts = [
        ("xxv", (30, 30, 580, 372), CYAN, 420),
        ("jubileuszowy", (640, 36, 1300, 172), PEACH, 640),
        ("przeglad-teatralny", (580, 176, 1600, 385), WHITE, 760),
        ("2026", (1310, 36, 1612, 204), BLACK, 320),
    ]
    for name, box, fg, width in parts:
        custom = next((p for p in (SRC / "lettering").glob(f"{name}.*")), None) if (SRC / "lettering").exists() else None
        img = Image.open(custom).convert("RGBA") if custom else cut_out(poster, box, fg)
        save(resize_to_width(img, width), out / f"{name}.webp", quality=92, method=6, alpha_quality=100)

    stamp = Image.open(SRC / "masska-stamp.webp").convert("RGBA")
    stamp = stamp.crop(stamp.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox())
    save(resize_to_width(stamp, 1042), out / "masska.webp", quality=90, method=6, alpha_quality=100)
    save(resize_to_width(stamp, 360), out / "masska-header.webp", quality=90, method=6, alpha_quality=100)
    return stamp


def posters(poster):
    print("Posters")
    save(resize_to_width(poster, 900), IMG / "plakaty" / "2026.webp", quality=72, method=6)
    # Artwork below the title band (band is ~11% of the height), for the hero
    band = round(poster.height * 0.1055)
    art = poster.crop((0, band, poster.width, poster.height))
    save(resize_to_width(art, 900), IMG / "plakaty" / "2026-art.webp", quality=72, method=6)
    # 1200x630 for link previews: the title band and the first strip of artwork
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


# Poster details used as stand-in photos: (left, top, width) as fractions of the artwork below the
# title band, and the colour the dark parts are turned into (None keeps the poster colours)
PLACEHOLDER_CROPS = [
    ((0.00, 0.02, 1.00), None),
    ((0.00, 0.50, 1.00), None),
    ((0.05, 0.18, 0.70), CYAN),
    ((0.30, 0.10, 0.70), MAUVE),
    ((0.20, 0.45, 0.80), PEACH),
]


def placeholder_photos(poster):
    """3:2 photos for ensemble pages that have none yet, cut from the poster artwork."""
    print("Placeholder photos")
    band = round(poster.height * 0.1055)
    art = poster.crop((0, band, poster.width, poster.height))
    for n, ((left, top, width), tint) in enumerate(PLACEHOLDER_CROPS, start=1):
        w = round(art.width * width)
        h = round(w / 1.5)
        x = min(round(art.width * left), art.width - w)
        y = min(round(art.height * top), art.height - h)
        crop = art.crop((x, y, x + w, y + h))
        if tint:
            crop = ImageOps.colorize(ImageOps.grayscale(crop), black=INK, white=tint)
        save(resize_to_width(crop, 1000), IMG / "teatr" / f"placeholder-{n}.webp", quality=60, method=6)


def ink_edge(poster):
    """A strip of printed ink that thins out upwards, made from the poster's bark texture.
    Used as a mask above dark sections so the dark block bleeds into the page."""
    print("Texture")
    height, half = 160, 1339
    bark = poster.crop((0, 900, half, 900 + height)).convert("L")
    pix = bark.load()
    rng = random.Random(25)
    strip = Image.new("L", (half * 2, height), 0)
    out = strip.load()
    for y in range(height):
        w = max(0.0, (y - 10) / (height - 10))  # 0 at the top, 1 at the bottom
        keep = min(1.0, w ** 0.85 * 1.45)
        for x in range(half):
            inked = 255 if (pix[x, y] < 90 and rng.random() < keep) or y > height * 0.9 else 0
            out[x, y] = inked
            out[half * 2 - 1 - x, y] = inked  # mirrored copy, so the strip tiles without a seam
    strip = strip.filter(ImageFilter.GaussianBlur(0.7)).point(lambda v: 255 if v > 110 else 0)
    rgba = Image.new("RGBA", strip.size, BLACK + (0,))
    rgba.putalpha(strip)
    save(rgba, IMG / "texture" / "ink-edge.webp", lossless=True, method=6)


def icons(stamp):
    print("Icons")
    # The first letter of the stamp is the icon: it stays legible at 16 px
    cols = stamp.getchannel("A").point(lambda v: 255 if v > 24 else 0)
    width = stamp.width
    gap_x = next(x for x in range(int(width * 0.12), int(width * 0.3))
                 if cols.crop((x, 0, x + 1, stamp.height)).getbbox() is None)
    m = stamp.crop((0, 0, gap_x, stamp.height))
    m = m.crop(m.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox())

    def tile(size, fill=0.6, radius=0.0):
        img = Image.new("RGBA", (size, size), MAUVE + (255,))
        scale = size * fill / max(m.size)
        glyph = m.resize((max(1, round(m.width * scale)), max(1, round(m.height * scale))), Image.LANCZOS)
        black = Image.new("RGBA", glyph.size, INK + (255,))
        img.paste(black, ((size - glyph.width) // 2, (size - glyph.height) // 2), glyph)
        if radius:
            mask = Image.new("L", (size, size), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), round(size * radius), fill=255)
            img.putalpha(mask)
        return img

    save(tile(16, 0.72, 0.18), ICONS / "favicon-16x16.png")
    save(tile(32, 0.7, 0.18), ICONS / "favicon-32x32.png")
    save(tile(180, 0.58), ICONS / "apple-touch-icon.png")
    save(tile(192, 0.5, 0.18), ICONS / "android-chrome-192x192.png")
    save(tile(512, 0.5, 0.18), ICONS / "android-chrome-512x512.png")
    ico = tile(256, 0.7, 0.18)
    for target in (ICONS / "favicon.ico", PUB / "favicon.ico"):
        ico.save(target, sizes=[(16, 16), (32, 32), (48, 48)])
        print(f"  {target.relative_to(ROOT)}")


def main():
    for name in ("plakat-2026.webp", "masska-stamp.webp"):
        if not (SRC / name).exists():
            sys.exit(f"Missing source file: design/source/{name}")
    poster = Image.open(SRC / "plakat-2026.webp").convert("RGB")
    stamp = lettering(poster)
    posters(poster)
    archive_posters()
    placeholder_photos(poster)
    ink_edge(poster)
    icons(stamp)
    print("Done.")


if __name__ == "__main__":
    main()

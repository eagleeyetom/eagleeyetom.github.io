#!/usr/bin/env python3
"""The English title for the home page: the poster's lettering, set again in English.

Usage (needs Pillow):  python tools/lettering_en.py

The poster is Polish, so its cut-out lettering (public/assets/img/lettering/title.webp, made by
tools/build_graphics.py) cannot say "International Anniversary Theatre Review". This sets the four
lines in two condensed fonts (tools/fonts: Anton and Oswald, SIL Open Font License) and gives them
the poster's print look: letters a little off the line and each other, ragged edges and ink gaps.
The red line and the black lines take their colours from the poster's own lettering. Writes
public/assets/img/lettering/title-en.webp, 720 wide like title.webp.
"""
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "tools" / "fonts"
OUT = ROOT / "public" / "assets" / "img" / "lettering"
SCALE = 4  # everything is drawn at 4x and reduced at the end, so the ragged edges stay fine
WIDTH = 720

# (text, font, left, top, width, height) in pixels of the 720 px wide result, like the poster's lines
LINES = [
    ("International", "oswald-latin-600-normal.woff", 98, 4, 604, 96, "red"),
    ("Anniversary", "anton-latin-400-normal.woff", 4, 108, 712, 154, "black"),
    ("Theatre", "anton-latin-400-normal.woff", 40, 274, 320, 92, "black"),
    ("Review", "anton-latin-400-normal.woff", 6, 394, 300, 98, "black"),
]


def poster_colours():
    """Red and black of the poster's own lettering (the two most common opaque colours)."""
    title = Image.open(OUT / "title.webp").convert("RGBA")
    red, black = [], []
    for r, g, b, a in title.get_flattened_data() if hasattr(title, 'get_flattened_data') else title.getdata():
        if a < 250:
            continue
        (red if r - g > 60 else black if max(r, g, b) < 70 else []).append((r, g, b))
    mean = lambda px: tuple(round(sum(c) / len(px)) for c in zip(*px))
    return {"red": mean(red), "black": mean(black)}


def word_mask(rng, text, font_file, width, height):
    """One line as a mask: letter by letter, each a little off, stretched to fill width x height."""
    size = int(height * 1.5)
    font = ImageFont.truetype(str(FONTS / font_file), size)
    # first pass at natural size to measure the line, then scale it to the box
    pad = size // 2
    canvas = Image.new("L", (int(font.getlength(text)) + 2 * pad, size * 2), 0)
    x = pad
    for ch in text:
        glyph = Image.new("L", (size * 2, size * 2), 0)
        ImageDraw.Draw(glyph).text((size // 2, size // 4), ch, font=font, fill=255)
        glyph = glyph.rotate(rng.uniform(-2.6, 2.6), resample=Image.BICUBIC, center=(size, size))
        glyph = glyph.resize((glyph.width, int(glyph.height * rng.uniform(0.95, 1.05))), Image.BICUBIC)
        dy = int(rng.uniform(-0.035, 0.035) * size)
        canvas.paste(255, (x - size // 2, dy), glyph.crop((0, 0, glyph.width, canvas.height - max(dy, 0))))
        x += int(font.getlength(ch) * rng.uniform(0.97, 1.0))
    box = canvas.getbbox()
    return canvas.crop(box).resize((width, height), Image.LANCZOS)


def print_look(rng, mask):
    """Ragged edges and ink gaps, like the lettering printed from cut letters."""
    soft = mask.filter(ImageFilter.GaussianBlur(SCALE * 1.4))
    ragged = Image.effect_noise(mask.size, 90).filter(ImageFilter.GaussianBlur(SCALE * 0.5))
    edge = ImageChops.add(soft, ragged, scale=1, offset=-128).point(lambda v: 255 if v > 128 else 0)
    # ink gaps: sparse specks of two sizes inside the letters
    gaps = Image.new("L", mask.size, 0)
    draw = ImageDraw.Draw(gaps)
    for _ in range(mask.width * mask.height // (SCALE * SCALE * 650)):
        r = rng.choice([0.8, 1.0, 1.3, 2.0]) * SCALE
        x, y = rng.uniform(0, mask.width), rng.uniform(0, mask.height)
        draw.ellipse((x - r, y - r * rng.uniform(0.6, 1), x + r, y + r), fill=255)
    gaps = gaps.filter(ImageFilter.GaussianBlur(SCALE * 0.3)).point(lambda v: 255 if v > 90 else 0)
    return ImageChops.subtract(edge, gaps)


def main():
    rng = random.Random(25)
    colours = poster_colours()
    height = max(top + h for _, _, _, top, _, h, _ in LINES) + 6
    result = Image.new("RGBA", (WIDTH * SCALE, height * SCALE), (0, 0, 0, 0))
    for text, font_file, left, top, width, line_height, colour in LINES:
        mask = word_mask(rng, text, font_file, width * SCALE, line_height * SCALE)
        mask = print_look(rng, mask)
        ink = Image.new("RGBA", mask.size, colours[colour] + (255,))
        ink.putalpha(mask)
        result.alpha_composite(ink, (left * SCALE, top * SCALE))
    result = result.resize((WIDTH, height), Image.LANCZOS)
    result = result.crop(result.getbbox())
    path = OUT / "title-en.webp"
    result.save(path, quality=90, method=6, alpha_quality=90)
    print(f"{path.relative_to(ROOT)}  {result.width}x{result.height}")


if __name__ == "__main__":
    main()

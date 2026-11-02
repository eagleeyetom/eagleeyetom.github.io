#!/usr/bin/env python3
"""High-resolution cut-outs of the poster for the promo clip (tools/promo/clip.html).

Usage (needs Pillow):  python tools/promo/assets.py

Writes tools/promo/assets/ (not kept in the repository): art.png, title.png, masska.png,
candles.png and meta.json with where the candles and their wicks sit on the artwork.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import build_graphics as g  # noqa: E402

OUT = Path(__file__).resolve().parent / "assets"
CANDLES_BOX = (1760, 0, 2600, 640)
WICKS = [(1976, 32), (2382, 64)]  # tips of the two wicks, in poster pixels


def light_ink(img):
    """The poster lettering for a dark stage: black ink turns warm white, the red stays red."""
    out = img.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, gr, b, a = px[x, y]
            if a and max(r, gr, b) - min(r, gr, b) < 70:
                px[x, y] = (242, 236, 226, a)
            elif a:
                px[x, y] = (min(255, r + 40), min(255, gr + 30), min(255, b + 20), a)
    return out


def stage_assets(poster, figure, title, masska):
    """For the stage version of the clip (stage.html): the figure on a transparent background,
    light lettering and a haze texture."""
    # Silhouette: the figure mask, and below the hat brim every row filled from its left edge
    # to its right edge, so the white shirt and the face stay solid instead of see-through
    small = figure.resize((figure.width // 4, figure.height // 4), Image.BOX).point(lambda v: 255 if v > 127 else 0)
    px = small.load()
    brim = 2950 // 4
    for y in range(brim, small.height):
        xs = [x for x in range(small.width) if px[x, y]]
        if xs:
            for x in range(xs[0], xs[-1] + 1):
                px[x, y] = 255
    alpha = small.resize(figure.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(3))
    cut = poster.convert("RGBA")
    cut.putalpha(alpha)
    cut = cut.crop((0, 0, poster.width, g.ART_BOTTOM))
    g.save(g.resize_to_width(cut, 1100), OUT / "figure.png", optimize=True)

    g.save(light_ink(g.resize_to_width(title, 1100)), OUT / "title-light.png")
    g.save(light_ink(g.resize_to_width(masska, 1300)), OUT / "masska-light.png")

    # Haze: soft noise of two sizes, white with the noise as its transparency
    import random
    rng = random.Random(25)
    layers = []
    for cols, rows, weight in ((14, 6, 0.65), (40, 16, 0.35)):
        n = Image.new("L", (cols, rows))
        n.putdata([rng.randint(0, 255) for _ in range(cols * rows)])
        layers.append((n.resize((2600, 1100), Image.BICUBIC), weight))
    haze = Image.blend(layers[0][0], layers[1][0], layers[1][1]).filter(ImageFilter.GaussianBlur(30))
    haze = haze.point(lambda v: max(0, min(255, int((v - 70) * 1.6))))
    smoke = Image.new("RGBA", haze.size, (255, 255, 255, 0))
    smoke.putalpha(haze)
    g.save(smoke, OUT / "haze.png", optimize=True)


def main():
    OUT.mkdir(exist_ok=True)
    poster = Image.open(g.SRC / "plakat-2026.jpg").convert("RGB")
    figure = g.figure_mask(poster)

    art = g.figure_art(poster, figure)
    g.save(g.resize_to_width(art, 1400), OUT / "art.png", optimize=True)

    text = Image.composite(Image.new("RGB", poster.size, g.WHITE), poster, figure.filter(ImageFilter.MaxFilter(9)))
    g.save(g.resize_to_width(g.lift(text.crop((60, 60, 1775, 1201))), 1400), OUT / "title.png")

    word = text.crop((2590, 100, 4100, 645))
    px = word.load()
    for y in range(word.height):
        for x in range(word.width):
            r, gr, b = px[x, y]
            if r - gr > 50:
                px[x, y] = g.WHITE
    g.save(g.resize_to_width(g.lift(word), 1500), OUT / "masska.png")

    # Candles kept at full size and not trimmed, so their place on the artwork is known exactly
    candles = g.lift(poster.crop(CANDLES_BOX), trim=False)
    g.save(candles, OUT / "candles.png")

    stage_assets(poster, figure, title=g.lift(text.crop((60, 60, 1775, 1201))), masska=g.lift(word))

    left, top, right, bottom = CANDLES_BOX
    meta = {
        "art": {"width": art.width, "height": art.height},
        "candles": {"left": left, "top": top, "width": right - left, "height": bottom - top},
        "wicks": [{"x": (x - left) / (right - left), "y": (y - top) / (bottom - top)} for x, y in WICKS],
    }
    (OUT / "meta.json").write_text(json.dumps(meta, indent=2))
    print(json.dumps(meta))


if __name__ == "__main__":
    main()

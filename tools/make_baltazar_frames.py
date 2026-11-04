#!/usr/bin/env python3
"""Kadry z filmu „Lend me your eyes, Baltazars” (rez. Dóra Elek) do galerii zespołu Baltazar.

Wycina z pliku wideo (1920x1080) wybrane klatki bez wypalonych napisów, przycina do 3:2
i zapisuje jako public/assets/img/teatr/baltazar/1..6.webp (1200x800). Wymaga ffmpeg i Pillow.

    python tools/make_baltazar_frames.py "D:/Download/Lend-me-your-eyes-Baltazars_001_1080p.mp4"
"""
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "assets" / "img" / "teatr" / "baltazar"

# (sekunda filmu, lewy margines przycięcia 0..300 px; 150 = środek)
FRAMES = [
    (1440, 150),  # spotkanie w Indiach: aktorka z kobietami w czerwieni
    (243, 150),   # scena: zespół w sari i kurtach
    (2680, 150),  # plaża o wschodzie słońca
    (63, 150),    # garderoba: makijaż przed spektaklem
    (325, 60),    # scena: aktor z rozłożonymi ramionami
    (1437, 150),  # grupa w czerwieni
]


def main(video: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for i, (sec, left) in enumerate(FRAMES, 1):
            png = Path(tmp) / f"{i}.png"
            subprocess.run(
                ["ffmpeg", "-v", "error", "-y", "-ss", str(sec), "-i", video, "-frames:v", "1", str(png)],
                check=True,
            )
            im = Image.open(png).convert("RGB")
            im = im.crop((left, 0, left + 1620, 1080)).resize((1200, 800), Image.LANCZOS)
            im.save(OUT / f"{i}.webp", "WEBP", quality=82)
            print(f"{sec}s -> {OUT / f'{i}.webp'}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])

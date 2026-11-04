#!/usr/bin/env python3
"""Kadry ze spektaklu „LaVieEnRose / OtherDances” (Mały Teatr NCA, Erywań) do galerii zespołu NCA.

Wycina z pliku wideo (1920x1080) wybrane klatki bez wypalonych napisów, przycina do 3:2
i zapisuje jako public/assets/img/teatr/nca/1..7.webp (1200x800). Wymaga ffmpeg i Pillow.

    python tools/make_nca_frames.py "D:/Download/LaVieEnRose/LaVieEnRose (1080p_24fps_H264-128kbit_AAC).mp4"
"""
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "assets" / "img" / "teatr" / "nca"

# (sekunda filmu, lewy margines przycięcia 0..300 px; 150 = środek)
FRAMES = [
    (2320, 150),  # suknia i srebrne balony
    (360, 150),   # zespół na scenie w niebieskim świetle
    (1500, 150),  # zespół w czerwonym świetle
    (1460, 150),  # tancerka z uniesionymi rękami
    (2820, 150),  # zespół w czerwonych okularach
    (2920, 300),  # tancerka w okularach (kadr przesunięty w prawo)
    (2980, 150),  # finał z konfetti
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

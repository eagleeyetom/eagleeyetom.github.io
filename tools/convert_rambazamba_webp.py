import os
from PIL import Image

def convert_folder(folder: str):
    converted = []
    for name in sorted(os.listdir(folder)):
        path = os.path.join(folder, name)
        if not os.path.isfile(path):
            continue
        ext = os.path.splitext(name)[1].lower()
        if ext not in (".jpg", ".jpeg", ".png"):
            continue
        base = os.path.splitext(name)[0]
        out = os.path.join(folder, f"{base}.webp")
        im = Image.open(path).convert("RGB")
        im.save(out, "WEBP", quality=85, method=6)
        converted.append((name, os.path.basename(out)))
    print("Converted:")
    for src, dst in converted:
        print(f"{src} -> {dst}")

if __name__ == "__main__":
    convert_folder(os.path.join("assets", "img", "teatr", "rambazamba"))

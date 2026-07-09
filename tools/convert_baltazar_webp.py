#!/usr/bin/env python3
import os
from PIL import Image

# Konwersja zdjęć Baltazar z JPG na WebP
source_dir = "../assets/img/teatr/baltazar"
output_dir = "../assets/img/teatr/baltazar"

for i in [1, 2, 3]:
    jpg_file = os.path.join(source_dir, f"{i}.jpg")
    webp_file = os.path.join(output_dir, f"{i}.webp")
    
    if os.path.exists(jpg_file):
        img = Image.open(jpg_file)
        img.save(webp_file, "WEBP", quality=85)
        print(f"✅ Skonwertowano: {jpg_file} → {webp_file}")
    else:
        print(f"❌ Plik nie znaleziony: {jpg_file}")

print("\n🎬 Konwersja Baltazar zakończona!")

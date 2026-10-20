# Grafiki źródłowe

Tu leżą pliki, z których powstają grafiki strony. Do `public/` trafiają tylko gotowe warianty.

| Plik | Co to |
|---|---|
| `source/plakat-2026.webp` | pełny plakat bieżącej edycji |
| `source/masska-stamp.webp` | wycięty napis „MASSKA” (przezroczyste tło) |
| `source/plakaty/<rok>.jpg` | skany plakatów z poprzednich lat (np. `2024.jpg`, `2025.jpg`); skrypt zamienia je na `plakaty/<rok>.webp` o szerokości 900 px (przycięcie marginesu skanu: `ARCHIVE_TRIM` w skrypcie) |
| `source/lettering/<nazwa>.png` | (opcjonalnie) własne wycięcia napisów: `xxv`, `jubileuszowy`, `przeglad-teatralny`, `2026`. Bez nich napisy są wycinane z plakatu |

Po zmianie któregoś pliku uruchom (wymaga Pillow):

```bash
python tools/build_graphics.py
```

Skrypt odtwarza: napisy do nagłówka i tablicy w hero (`public/assets/img/lettering/`), plakat i jego ilustrację
(`plakaty/2026*.webp`), obraz do udostępniania (`og-masska-2026.jpg`), teksturę tuszu (`texture/ink-edge.webp`)
oraz ikony i favicon (`public/assets/icons/`, `public/favicon.ico`). Wyniki są w repozytorium, więc build strony
nie wymaga Pythona.

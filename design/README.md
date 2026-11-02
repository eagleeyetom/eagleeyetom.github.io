# Grafiki źródłowe

Tu leżą pliki, z których powstają grafiki strony. Do `public/` trafiają tylko gotowe warianty.

| Plik | Co to |
|---|---|
| `source/plakat-2026.jpg` | pełny plakat bieżącej edycji (melonik, napisy, pasek logotypów na dole) |
| `source/plakaty/<rok>.jpg` | skany plakatów z poprzednich lat (np. `2024.jpg`, `2025.jpg`); skrypt zamienia je na `plakaty/<rok>.webp` o szerokości 900 px (przycięcie marginesu skanu: `ARCHIVE_TRIM` w skrypcie) |

Z plakatu skrypt wycina: tytuł (blok „Międzynarodowy Jubileuszowy Przegląd Teatralny”), napis „MASSKA”,
świeczki „25” i postać bez napisów (hero). Logotypy partnerów są wycinane z dolnego paska według
współrzędnych w `PARTNERS` w skrypcie; jeśli w nowej wersji plakatu pasek się zmieni, trzeba je poprawić.

Po zmianie któregoś pliku uruchom (wymaga Pillow):

```bash
python tools/build_graphics.py
```

Skrypt odtwarza: napisy (`public/assets/img/lettering/`), plakat i postać do hero (`plakaty/2026*.webp`),
logotypy partnerów do stopki (`partners/`), zdjęcia zastępcze zespołów (`teatr/placeholder-*.webp`),
obraz do udostępniania (`og-masska-2026.jpg`), rastrową krawędź ciemnych sekcji (`texture/ink-edge.webp`)
oraz ikony i favicon (`public/assets/icons/`, `public/favicon.ico`). Wyniki są w repozytorium, więc build strony
nie wymaga Pythona.

## Angielski napis tytułowy
Napis z plakatu jest polski, więc angielska wersja strony ma własny: `python tools/lettering_en.py` składa
„International Anniversary Theatre Review” czcionkami Anton i Oswald (`tools/fonts`, licencja SIL OFL) w stylu
plakatu i zapisuje `public/assets/img/lettering/title-en.webp`.

## Pliki do pobrania dla mediów
Plakat do internetu (JPG) i do druku (PDF, 70 × 100 cm) leżą w `public/assets/press/` i są linkowane ze strony
„Dla mediów” (`src/components/PressPage.astro`). Nowy plakat: podmień oba pliki, nazwy zostaw.

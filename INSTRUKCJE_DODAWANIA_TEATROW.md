# Instrukcje: zespoły i spektakle na scenie online (MASSKA.org, Astro)

Strona **Scena online** (`/pl/online.html`, `/en/online.html`) i podstrony zespołów powstają same z plików
Markdown. Nie edytujesz HTML, menu ani listy zespołów: wszystko (kafel na scenie online, filtr regionów, flagi
w nagłówku, menu zespołów, lista na dole podstron, tagi `hreflang`) generuje się z jednego pliku na język.

---

## Struktura plików

```
src/content/theatres/
├── pl/[slug].md      <- wersja polska
└── en/[slug].md      <- wersja angielska
```

Nazwa pliku (slug) to adres podstrony: `pl/teatr-baltazar.md` → `/pl/teatr-baltazar.html`.
Wersje PL i EN łączy pole `id`, które musi być **identyczne** w obu plikach (na tej podstawie działa przełącznik
języka).

---

## Wpisy zastępcze (zaślepki)

Dopóki program nie jest zatwierdzony, w kolekcji leży 10 zespołów z polem `placeholder: true`
(`zespol-xx.md` / `ensemble-xx.md`: Japonia, Brazylia, Kenia, Australia, Argentyna, Indie, Niemcy, Gruzja, RPA, Polska).
Takie wpisy:

- mają na stronie żółty pasek „Wpis zastępczy” i znacznik „Zaślepka” na kaflu,
- mają `noindex` i nie trafiają do sitemapy, więc Lorem Ipsum nie wejdzie do Google,
- używają zdjęć `public/assets/img/teatr/placeholder-1…5.webp` (kadry z plakatu, generuje je
  `python tools/build_graphics.py`).

**Zamiana zaślepki na prawdziwy zespół:** usuń parę plików `zespol-xx.md` + `ensemble-xx.md` i dodaj nowy wpis
według kroków niżej (z `placeholder: false` albo bez tego pola). Dane zespołów z edycji 2025 leżą w
`design/archive/theatres-2025/` (razem ze zdjęciami), poza buildem.

---

## Dodawanie zespołu

### Krok 1: zdjęcia (opcjonalnie)
1. Folder `public/assets/img/teatr/[slug]/`, min. 3 zdjęcia 3:2 (np. 1200×800 px), nazwane `1.webp`, `2.webp`, `3.webp`.
2. Format **WebP**. Bez zdjęć strona działa: kafel i galeria pokażą kadr zastępczy lub nic.

### Krok 2: flaga kraju
Flaga pochodzi z `public/assets/icons/flags/[kod].svg` i reguły `.fi-[kod]` w `public/assets/styles.css`.
Są już: `ar au br de es ge hu in jp ke lt pl ru ua uz za`. Dla nowego kraju skopiuj plik SVG (4×3, np. z pakietu
`flag-icons`, licencja MIT) i dopisz jedną linię `.fi-xx { background-image: url('icons/flags/xx.svg'); }`.

### Krok 3: profil PL (`src/content/theatres/pl/[slug].md`)

```yaml
---
id: "baltazar"                 # takie samo w pliku EN
name: "Teatr Baltazar"
showTitle: "Dmuchawiec i Kurz"
countryCode: "hu"              # kod ISO (flaga)
country: "Węgry"               # kraj tak, jak ma być wypisany na stronie
region: "europe"               # europe | asia | americas | africa | oceania (filtr na scenie online)
placeholder: false             # true = zaślepka (noindex, pasek „Wpis zastępczy”)
availability: "16–20 listopada 2026"   # opcjonalnie: kiedy spektakl jest dostępny online
badgeText: "Węgry · Teatr integracyjny"
genre: "Teatr integracyjny, dramat"
duration: "29 minut"
subtitles: "EN / PL"
city: "Budapeszt, Węgry"
language: "węgierski"          # opcjonalnie
accessibility: "Napisy w języku angielskim i polskim"   # opcjonalnie
videoYtId: "KUTkck5tqtU"       # opcjonalnie; bez niego strona pokaże „Nagranie pojawi się tutaj”
videoTitle: "Dmuchawiec i Kurz – Teatr Baltazar"
recordingUrl: "https://youtu.be/KUTkck5tqtU"   # opcjonalnie
quote: "Ten teatr nie jest z litości – jest dla kreatywności."   # opcjonalnie
gallery:                       # opcjonalnie (może być pusta)
  - src: "/assets/img/teatr/baltazar/1.webp"     # ścieżki od /assets/
    alt: "Teatr Baltazar – taniec aktorów"
credits:                       # opcjonalnie
  title: "Zespół"
  items:
    - label: "Reżyseria"
      value: "Dorka Farkas"
synopsis: |
  <p>Krótki opis w górnej części strony (dozwolone tagi HTML).</p>
aboutShow: |
  <p>Dłuższy opis spektaklu.</p>
about: |                       # opcjonalnie
  <p>O zespole.</p>
history: |                     # opcjonalnie
  <p>Historia zespołu.</p>
contactEmail: "kontakt@baltazar.hu"   # opcjonalnie (+ contactName, contactRole, contactSocialText, contactSocialUrl)
---
```

### Krok 4: profil EN (`src/content/theatres/en/[slug].md`)
Ten sam szablon po angielsku. **`id`, `countryCode` i `region` identyczne jak w PL**; `country`, `genre`,
`city`, teksty i `availability` przetłumaczone. Slug EN może się różnić od PL (np. `baltazar.md`).

### Krok 5: weryfikacja
```bash
npm run dev      # podgląd: http://localhost:4321/pl/online.html
npm run build    # strony statyczne trafiają do dist/
```
Błędne pole w nagłówku pliku zatrzyma build z komunikatem (walidacja Zod w `src/content/config.ts`).

---

## Co dzieje się automatycznie
- **Scena online**: kafel z pierwszym zdjęciem galerii, flagą, krajem, tytułem, gatunkiem, czasem trwania i napisami;
  filtr regionów, liczniki (spektakle, kraje) i „ściana flag” w nagłówku liczą się z danych.
- **Podstrona zespołu**: informacje o spektaklu, galeria (przewijana palcem), wideo YouTube ładowane dopiero po zgodzie
  lub kliknięciu, poprzedni/następny spektakl (w kolejności: kraj, nazwa) i lista wszystkich zespołów.
- **Menu zespołów w nagłówku** i **SEO** (canonical, hreflang, dane strukturalne) dla każdej podstrony.
- Zespoły są sortowane po kraju, potem po nazwie.

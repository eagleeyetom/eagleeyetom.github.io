# 📋 INSTRUKCJE DODAWANIA NOWYCH TEATRÓW - MASSKA.ORG (Astro SSG)

Dzięki migracji serwisu do frameworka **Astro**, proces dodawania nowych teatrów został maksymalnie uproszczony. **Nie musisz już ręcznie edytować plików HTML, kopiować list partnerów, synchronizować menu rozwijanych ani aktualizować podstron "Online"**. Wszystkie te elementy generują się automatycznie na podstawie plików Markdown!

---

## 🎭 Struktura plików w projekcie

Każdy profil teatru składa się z dwóch plików Markdown umieszczonych w kolekcjach danych:
```
src/content/theatres/
├── pl/
│   └── [slug].md      <- Wersja polska (np. teatr-baltazar.md lub trupa-mtt.md)
└── en/
    └── [slug].md      <- Wersja angielska (np. baltazar.md lub troupe-mtt.md)
```
*Nazwa pliku `.md` (slug) bezpośrednio definiuje końcowy adres URL podstrony (np. `/pl/teatr-baltazar.html` lub `/en/baltazar.html`).*

---

## ✅ KROKI DODAWANIA NOWEGO TEATRU

### KROK 1: Przygotowanie zdjęć
1. Utwórz folder dla zdjęć zespołu w: `public/assets/img/teatr/[unikalny-slug]/` (np. `public/assets/img/teatr/baltazar/`).
2. Przygotuj min. 3 zdjęcia spektaklu (preferowane wymiary: 800x560px), nazwij je kolejno: `1.webp`, `2.webp`, `3.webp`.
3. Skonwertuj pliki do zoptymalizowanego formatu **WebP**.

---

### KROK 2: Tworzenie profilu PL
Utwórz plik `src/content/theatres/pl/[nazwa-pliku].md`. 

**Szablon profilu PL:**
```yaml
---
id: "unikalne-id-zespolu" # IDENTYCZNE jak w pliku EN (np. "baltazar")
name: "Teatr Baltazar"
showTitle: "Dmuchawiec i Kurz"
countryCode: "hu" # Dwuliterowy kod ISO kraju (flaga), np. pl, ua, de, hu
badgeText: "Węgry · Teatr integracyjny" # Tekst wyświetlany na odznace obok flagi
genre: "Teatr integracyjny, dramat"
duration: "29 minut"
subtitles: "ang./pol." # Informacja o napisach
city: "Budapeszt, Węgry"
accessibility: "Angielskie napisy wypalone, napisy polskie dostępne na YouTube"
videoYtId: "KUTkck5tqtU" # ID wideo YouTube (np. z linku watch?v=KUTkck5tqtU)
videoTitle: "Dmuchawiec i Kurz – Teatr Baltazar"
recordingUrl: "https://youtu.be/KUTkck5tqtU" # Opcjonalnie: link bezpośredni do filmu
gallery:
  - src: "/assets/img/teatr/baltazar/1.webp" # Ścieżki muszą zaczynać się od /assets/
    alt: "Teatr Baltazar – taniec aktorów"
  - src: "/assets/img/teatr/baltazar/2.webp"
    alt: "Teatr Baltazar – fragment spektaklu"
  - src: "/assets/img/teatr/baltazar/3.webp"
    alt: "Teatr Baltazar – skład zespołu"
synopsis: "<strong>Dmuchawiec i Kurz</strong> to dwuczęściowy, metateatralny dialog o ulotności..." # Krótki opis w sekcji Hero (akceptuje tagi HTML)
aboutShow: |
  <p>„Dmuchawiec” otwiera wieczór jak wspomnienie...</p>
  <p>„Kurz” zagęszcza atmosferę...</p>
about: |
  <p><strong>Teatr Baltazar</strong>, założony w 1998 roku...</p>
  <p>Od samego początku celem...</p>
history: | # Opcjonalnie: Sekcja historii zespołu
  <p>Historia zespołu sięga...</p>
quote: "Ten teatr nie jest z litości – jest dla kreatywności." # Opcjonalnie: cytat wyciągnięty (pull-quote)
contactRole: "Reżyserka" # Opcjonalnie: rola osoby kontaktowej
contactName: "Dorka Farkas" # Opcjonalnie: imię osoby kontaktowej
contactEmail: "kontakt@baltazar.hu" # Opcjonalnie: email kontaktowy
contactSocialText: "Facebook" # Opcjonalnie: nazwa linku social media
contactSocialUrl: "https://facebook.com/baltazarszinhaz" # Opcjonalnie: url social media
---
```

---

### KROK 3: Tworzenie profilu EN
Utwórz plik `src/content/theatres/en/[nazwa-pliku].md`. 

**Ważne przy wersji EN:**
- **`id` musi być DOKŁADNIE TAKIE SAMO jak w pliku PL** – to na jego podstawie system automatycznie łączy wersje językowe w przełączniku języków!
- Wszystkie teksty i metadane powinny zostać przetłumaczone na język angielski.
- Nazwa pliku `.md` nie musi mieć przedrostka `teatr-` (np. `baltazar.md`), dopasowując się do oryginalnej struktury URL-i EN.

---

### KROK 4: Kompilacja i weryfikacja
1. Aby przetestować wygląd lokalnie w przeglądarce, uruchom:
   ```bash
   npm run dev
   ```
   Strona będzie dostępna pod adresem: `http://localhost:4321/pl/`
2. Zbuduj wersję produkcyjną (strony statyczne HTML zostaną wygenerowane w folderze `dist/`):
   ```bash
   npm run build
   ```

---

## 💡 CO DZIEJE SIĘ AUTOMATYCZNIE (BEZ TWOJEJ INGERENCJI)?
- **Menu Dropdown (Header)**: Nowy teatr automatycznie pojawi się na liście wyboru we wszystkich nagłówkach stron.
- **Lista zespołów (Accordion)**: Na dole każdej podstrony spektaklu lista zespołów festiwalowych rozwinie się o nowy wpis.
- **Siatka Online (online.html)**: Nowy kafel z obrazkiem galerii, nazwą teatru, flagą państwa i tytułem spektaklu automatycznie wyrenderuje się w programie online.
- **Sekcja partnerów (Stopka)**: Logotypy sponsorów są zunifikowanym komponentem i dołączają się automatycznie.
- **SEO & Hreflang**: Generowanie tagów kanonicznych oraz alternatywnych wersji językowych dla robotów wyszukiwarek (Google) jest w pełni zautomatyzowane.

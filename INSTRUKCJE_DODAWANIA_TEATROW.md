# 📋 INSTRUKCJE DODAWANIA NOWYCH TEATRÓW - MASSKA.ORG

## 📊 Struktura plików (wzorzec)

```
POLSKI (PL)                    ANGIELSKI (EN)
├─ teatr-[id].html             ├─ [id].html
└─ (pozostałe strony w pl/)    └─ (pozostałe strony w en/)
```

## 🎭 Zespoły i pliki — uwagi

- Ten dokument ma charakter ogólny i nie utrzymuje listy konkretnych zespołów.
- Każdy nowy teatr powinien stosować poniższe wzorce nazewnictwa, struktur i sekcji.
- Przy aktualizacji nawigacji (dropdown) i list zespołów, uwzględnij wszystkie istniejące zespoły oraz nowe wpisy.
- **WAŻNE:** Tytuły spektakli muszą być napisane DUŻYMI literami dla nazwisk bohaterów (np. "Jaskier i Kurz" — gdzie "Kurz" to postać), ale bez "slash" (/) — używaj " i " (PL) lub " & " (EN).
- **SPÓJNOŚĆ NAZW:** Wszystkie nazwy zespołów w nav-dropdown, sekcji zespołów i online.html muszą być identyczne (pisownia, formatowanie).

---

## ✅ CHECKLIST DODAWANIA NOWEGO TEATRU

### KROK 1: Przygotowanie zasobów

- [ ] Folder: `/assets/img/teatr/[skrot_male]/` (np. `tsb/`)
- [ ] Zdjęcia spektaklu (minimum 3-4): `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg` (800x560px)
- [ ] Konwersja zdjęć do formatu WebP (używając narzędzia Python `convert_[nazwa]_webp.py`)

### KROK 2: Tworzenie pliku PL (pl/teatr-[id].html lub pl/[skrot].html)

**KONWENCJE NAZEWNICTWA:**
- PL: `teatr-[id].html` (id bez spacji/znaków specjalnych)
- EN: `[id].html` (ten sam id co w PL, bez prefixu `teatr-`)

**STRUKTURA (szablon do użycia):**

#### HEAD sekcja:

```html
<meta charset="utf-8">
<meta name="description" content="[NAZWA] ([KRAJ], [JĘZYK]) · spektakl \"[TYTUŁ]\" · [OPIS].">
<title>[SKRÓT] · [TYTUŁ SPEKTAKLU] · MASSKA</title>

<!-- Canonical & hreflang -->
<link rel="canonical" href="https://masska.org/pl/teatr-[id].html">
<link rel="alternate" href="https://masska.org/pl/teatr-[id].html" hreflang="pl">
<link rel="alternate" href="https://masska.org/en/[en-id].html" hreflang="en">
<link rel="alternate" href="https://masska.org/pl/teatr-[id].html" hreflang="x-default">
```

#### Navigation dropdown (wzorzec):

```html
<div class="nav-dropdown">
    <span class="nav-link is-active" aria-current="page">[NOWA NAZWA] <span class="fi fi-[kod]"></span></span>
    <div class="nav-dropdown-menu">
        <!-- Wstaw pełną listę zespołów istniejących na festiwalu -->
        <a href="teatr-[ensemblA-id].html" class="nav-dropdown-item">[ZESPÓŁ A] <span class="fi fi-[kodA]"></span></a>
        <a href="teatr-[ensemblB-id].html" class="nav-dropdown-item">[ZESPÓŁ B] <span class="fi fi-[kodB]"></span></a>
        <a href="teatr-[ensemblC-id].html" class="nav-dropdown-item">[ZESPÓŁ C] <span class="fi fi-[kodC]"></span></a>
        <a href="teatr-[id].html" class="nav-dropdown-item is-active">[NOWA NAZWA] <span class="fi fi-[kod]"></span></a>
        <!-- Jeśli zespół ma kilka spektakli, dodaj osobne wpisy dla każdego tytułu -->
        <!-- <a href="teatr-[id-spektakl-2].html" class="nav-dropdown-item">[NOWA NAZWA] – [TYTUŁ 2] <span class="fi fi-[kod]"></span></a> -->
    </div>
</div>
```

**Kody krajów (flag-icons):**
- 🇵🇱 `fi-pl` - Polska
- 🇺🇦 `fi-ua` - Ukraina
- 🇱🇹 `fi-lt` - Litwa

#### Language switcher (linie 93-99):

```html
<a class="language-link" href="../en/[en-id].html" data-language="en">
    <img class="lang-icon" src="../assets/icons/flag-gb.svg" alt="" aria-hidden="true" /> English
</a>
<a class="language-link is-active" href="../pl/teatr-[id].html" data-language="pl">
    <img class="lang-icon" src="../assets/icons/flag-pl.svg" alt="" aria-hidden="true" /> Polski
</a>
```

#### Hero section (linie 109-133):

```html
<section class="page-section">
    <div class="section-inner two-column">
        <div>
            <span class="badge">[KRAJ] <span class="fi fi-[kod]"></span> · Teatr integracyjny</span>
            <h1>[PEŁNA NAZWA TEATRU]</h1>
            <p>[OPIS - 2-3 zdania o zespole]</p>
            <div class="hero-actions">
                <a class="button primary" href="[LINK_YOUTUBE]" target="_blank" rel="noopener">Odtwórz spektakl</a>
                <a class="button secondary" href="online.html">Wróć do programu online</a>
            </div>
            <ul class="chip-row" role="list">
                <li class="chip" role="listitem">[TYP TEATRU]</li>
                <li class="chip" role="listitem">[CZAS]</li>
                <li class="chip" role="listitem">Napisy: [JĘZYKI]</li>
            </ul>
        </div>
        <aside class="info-panel" aria-label="Szczegóły spektaklu">
            <h2>Przegląd spektaklu</h2>
            <dl>
                <div><dt>Tytuł</dt><dd>[TYTUŁ SPEKTAKLU]</dd></div>
                <div><dt>Miasto</dt><dd>[MIASTO], [KRAJ]</dd></div>
                <div><dt>Gatunek</dt><dd>[GATUNEK 1], [GATUNEK 2]</dd></div>
                <div><dt>Czas trwania</dt><dd>[CZAS SPEKTAKLU]</dd></div>
                <div><dt>Dostępność</dt><dd>[NAPISY/AUDIODESKRYPCJA]</dd></div>
            </dl>
        </aside>
    </div>
</section>
```

**⚠️ UWAGA:** Panel `<aside class="info-panel">` MUSI być wewnątrz `<div class="section-inner two-column">`, obok głównego `<div>`, NIE w osobnej sekcji!

#### Sekcje zawartości:
- **Synopsis** (linie 142-153): Streszczenie spektaklu
- **Video** (linie 155-161): YouTube ID z `data-yt-id="[ID]"`
- **Gallery** (linie 163-193): 4 zdjęcia z `../assets/img/teatr/[skrot]/[1-4].jpg`
- **About ensemble** (linie 195-222): Historia, założyciele, opis zespołu
- **Ensemble list**: **WSPÓLNE DLA WSZYSTKICH** — zawiera pełną listę zespołów festiwalowych (wszystkie dostępne), w tym osobne wpisy dla kilku spektakli jednego zespołu.
- **Partners section** (linie ~240-280): **KOMPLETNA SEKCJA PARTNERÓW** - musi zawierać WSZYSTKICH partnerów

#### Sekcja partnerów (WYMAGANA PEŁNA STRUKTURA):

```html
<section class="page-section" aria-labelledby="partners-title">
    <div class="section-inner">
        <h2 id="partners-title">Partnerzy festiwalu</h2>
        <div class="partners" role="list">
            <div class="partner-text">ORGANIZATORZY:</div>
            <figure role="listitem"><a href="https://ekspresja.org" target="_blank" rel="noopener noreferrer"><img src="../assets/img/na-drodze-ekspresji.webp" alt="Stowarzyszenie Na Drodze Ekspresji"></a></figure>
            <figure role="listitem"><a href="https://bip.sopot.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/prezydent-sopotu.webp" alt="Honorowy patronat Prezydenta Miasta Sopotu"></a></figure>
            <div class="partner-text">WSPÓŁPRACA:</div>
            <figure role="listitem"><a href="https://pkps.org.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/pkps.webp" alt="Polski Komitet Pomocy Społecznej"></a></figure>
            <figure role="listitem"><a href="https://bart.sopot.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/bart.webp" alt="Bałtycka Agencja Artystyczna BART"></a></figure>
            <figure role="listitem"><a href="https://www.facebook.com/mamuszki14" target="_blank" rel="noopener noreferrer"><img src="../assets/img/mamuszki-14.webp" alt="Mamuszki 14"></a></figure>
            <figure role="listitem"><a href="https://teatrwybrzeze.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/teatr-wybrzeze.webp" alt="Teatr Wybrzeże"></a></figure>
            <div class="partner-text">PATRONAT MEDIALNY:</div>
            <figure role="listitem"><a href="https://radiogdansk.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/RadioGdansk.webp" alt="Radio Gdańsk"></a></figure>
        </div>
        <div class="partners-wide" role="list">
            <figure role="listitem" class="partner-wide"><a href="https://sopot.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/sopot.webp" alt="Dofinansowane przez Miasto Sopot">
                <figcaption>Dofinansowane przez Miasto Sopot</figcaption>
            </a></figure>
            <figure role="listitem" class="partner-wide"><a href="https://www.pomorskie.eu/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/urzad-marszalkowski.webp" alt="Urząd Marszałkowski Województwa Pomorskiego">
                <figcaption>oraz Urząd Marszałkowski Województwa Pomorskiego</figcaption>
            </a></figure>
        </div>
    </div>
</section>
```

**⚠️ KRYTYCZNE:** Sekcja partnerów musi zawierać:
1. `<div class="partners">` z TRZEMA kategoriami: ORGANIZATORZY, WSPÓŁPRACA, PATRONAT MEDIALNY
2. `<div class="partners-wide">` z DWOMA dużymi logami: Sopot i Urząd Marszałkowski
3. Skopiuj CAŁĄ sekcję z innej strony teatru (np. teatr-tur.html), nie skracaj!

#### Sekcja zespołów (zawsze ta sama struktura — wzorzec):

```html
<section class="page-section" aria-labelledby="ensemble-list-title">
    <div class="section-inner">
        <h2 id="ensemble-list-title">Zespoły festiwalowe</h2>
        <details class="info-panel">
            <summary>Rozwiń listę zespołów</summary>
            <ul class="meta-list">
                <li><a href="teatr-[ensemblA-id].html">[ZESPÓŁ A] <span class="fi fi-[kodA]"></span></a></li>
                <li><a href="teatr-[ensemblB-id].html">[ZESPÓŁ B] <span class="fi fi-[kodB]"></span></a></li>
                <li><a href="teatr-[ensemblC-id].html">[ZESPÓŁ C] <span class="fi fi-[kodC]"></span></a></li>
                <li><a href="teatr-[id].html">[NOWY ZESPÓŁ] <span class="fi fi-[kod]"></span></a></li>
                <!-- Jeśli zespół ma kilka spektakli: -->
                <!-- <li><a href="teatr-[id-spektakl-2].html">[NOWY ZESPÓŁ] – [TYTUŁ 2] <span class="fi fi-[kod]"></span></a></li> -->
            </ul>
        </details>
    </div>
</section>
```

**Standard sekcji zespołów (PL/EN):**
- Atrybut `aria-labelledby` zawsze wskazuje na identyfikator `ensemble-list-title`.
- Nagłówek sekcji to `Zespoły festiwalowe` (PL) lub `Festival ensembles` (EN) z id `ensemble-list-title`.
- `details.info-panel` zawiera `summary` z tekstem: `Rozwiń listę zespołów` (PL) lub `Expand ensemble list` (EN).
- Lista (`ul.meta-list`) powinna zawierać aktualny, pełny zestaw zespołów (w tym osobne wpisy dla kilku spektakli jednego zespołu – patrz sekcja „Wiele spektakli jednego zespołu”).

**⚠️ WAŻNE:** Po dodaniu nowego teatru, ZAKTUALIZUJ tę sekcję na WSZYSTKICH aktualnych stronach PL/EN (wszystkie istniejące teatry w pl/ i en/).

#### Sekcja partnerów EN (WYMAGANA PEŁNA STRUKTURA):

```html
<section class="page-section" aria-labelledby="partners-title">
    <div class="section-inner">
        <h2 id="partners-title">Festival partners</h2>
        <div class="partners" role="list">
            <div class="partner-text">ORGANIZERS:</div>
            <figure role="listitem"><a href="https://ekspresja.org" target="_blank" rel="noopener noreferrer"><img src="../assets/img/na-drodze-ekspresji.webp" alt="Na Drodze Ekspresji Association"></a></figure>
            <figure role="listitem"><a href="https://bip.sopot.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/prezydent-sopotu.webp" alt="Honorary patronage of the Mayor of Sopot"></a></figure>
            <div class="partner-text">COLLABORATION:</div>
            <figure role="listitem"><a href="https://pkps.org.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/pkps.webp" alt="Polish Committee for Social Assistance"></a></figure>
            <figure role="listitem"><a href="https://bart.sopot.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/bart.webp" alt="Baltic Artistic Agency BART"></a></figure>
            <figure role="listitem"><a href="https://www.facebook.com/mamuszki14" target="_blank" rel="noopener noreferrer"><img src="../assets/img/mamuszki-14.webp" alt="Mamuszki 14"></a></figure>
            <figure role="listitem"><a href="https://teatrwybrzeze.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/teatr-wybrzeze.webp" alt="Wybrzeże Theatre"></a></figure>
            <div class="partner-text">MEDIA PATRONAGE:</div>
            <figure role="listitem"><a href="https://radiogdansk.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/RadioGdansk.webp" alt="Radio Gdańsk"></a></figure>
        </div>
        <div class="partners-wide" role="list">
            <figure role="listitem" class="partner-wide"><a href="https://sopot.pl/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/sopot.webp" alt="Co-financed by the City of Sopot">
                <figcaption>Co-financed by the City of Sopot</figcaption>
            </a></figure>
            <figure role="listitem" class="partner-wide"><a href="https://www.pomorskie.eu/" target="_blank" rel="noopener noreferrer"><img src="../assets/img/urzad-marszalkowski.webp" alt="Marshal's Office of the Pomeranian Voivodeship">
                <figcaption>and the Marshal's Office of the Pomeranian Voivodeship</figcaption>
            </a></figure>
        </div>
    </div>
</section>
```

**⚠️ KRYTYCZNE:** W wersji EN sekcja partnerów jest IDENTYCZNA pod względem struktury, różnią się tylko teksty w `partner-text` i atrybuty `alt`/`figcaption`.

---

### KROK 3: Tworzenie pliku EN (en/[id].html)

**Nazewnictwo:**
- PL: `teatr-[id].html` → EN: `[id].html` (bez prefixu `teatr-`)

**IDENTYCZNE kroki co PL, ale:**
- `lang="en"` zamiast `lang="pl"`
- Wszystkie teksty w języku angielskim
- Meta description w angielsku
- Canonical: `https://masska.org/en/[id].html`
- Hreflang PL: `https://masska.org/pl/teatr-[pl-id].html`
- Language switcher: odwrotnie (English aktywny, Polski link)
- Navigation text w angielsku

**Sekcja zespołów (EN - identyczna struktura):**

```html
<section class="page-section" aria-labelledby="ensemble-list-title">
    <div class="section-inner">
        <h2 id="ensemble-list-title">Festival ensembles</h2>
        <details class="info-panel">
            <summary>Expand ensemble list</summary>
            <ul class="meta-list">
                <li><a href="parostky.html">Folk Amateur Theatre – Studio PAROSTKI <span class="fi fi-ua"></span></a></li>
                <li><a href="troupe-mtt.html">MTT Musical Theatre Troupe <span class="fi fi-lt"></span></a></li>
                <li><a href="tur.html">Poor Theatre of Emotions – TUR <span class="fi fi-pl"></span></a></li>
                <li><a href="[en-id].html">[NEW THEATRE NAME] <span class="fi fi-[code]"></span></a></li>
            </ul>
        </details>
    </div>
</section>
```

---

### KROK 4: Aktualizacja sekcji zespołów na WSZYSTKICH istniejących stronach

- Zaktualizuj sekcję „Zespoły festiwalowe” na wszystkich stronach teatrów w folderach `pl/` i `en/`.
- Każda strona powinna zawierać pełną, spójną listę zespołów festiwalowych (łącznie z nowo dodanym zespołem oraz dodatkowymi spektaklami, jeśli występują).

**Struktura PL do skopiowania na każdą stronę:**

```html
<section class="page-section" aria-labelledby="ensemble-list-title">
    <div class="section-inner">
        <h2 id="ensemble-list-title">Zespoły festiwalowe</h2>
        <details class="info-panel">
            <summary>Rozwiń listę zespołów</summary>
            <ul class="meta-list">
                <li><a href="teatr-[ensemblA-id].html">[ZESPÓŁ A] <span class="fi fi-[kodA]"></span></a></li>
                <li><a href="teatr-[ensemblB-id].html">[ZESPÓŁ B] <span class="fi fi-[kodB]"></span></a></li>
                <li><a href="teatr-[ensemblC-id].html">[ZESPÓŁ C] <span class="fi fi-[kodC]"></span></a></li>
                <li><a href="teatr-[id].html">[NOWY ZESPÓŁ] <span class="fi fi-[kod]"></span></a></li>
                <!-- Opcjonalnie: dodatkowe spektakle tego samego zespołu -->
                <!-- <li><a href="teatr-[id-spektakl-2].html">[NOWY ZESPÓŁ] – [TYTUŁ 2] <span class="fi fi-[kod]"></span></a></li> -->
            </ul>
        </details>
    </div>
</section>
```

**Struktura EN do skopiowania na każdą stronę:**

```html
<section class="page-section" aria-labelledby="ensemble-list-title">
    <div class="section-inner">
        <h2 id="ensemble-list-title">Festival ensembles</h2>
        <details class="info-panel">
            <summary>Expand ensemble list</summary>
            <ul class="meta-list">
                <li><a href="[ensemblA-en-id].html">[ENSEMBLE A] <span class="fi fi-[codeA]"></span></a></li>
                <li><a href="[ensemblB-en-id].html">[ENSEMBLE B] <span class="fi fi-[codeB]"></span></a></li>
                <li><a href="[ensemblC-en-id].html">[ENSEMBLE C] <span class="fi fi-[codeC]"></span></a></li>
                <li><a href="[en-id].html">[NEW THEATRE NAME] <span class="fi fi-[code]"></span></a></li>
                <!-- Optional: multiple performances for one ensemble -->
                <!-- <li><a href="[en-id-performance-2].html">[NEW THEATRE NAME] – [TITLE 2] <span class="fi fi-[code]"></span></a></li> -->
            </ul>
        </details>
    </div>
</section>
```

Po aktualizacji dodaj brakujące wpisy tak, aby KAŻDA strona teatru zawierała pełną listę zespołów dostępnych na festiwalu (wszystkie istniejące teatry oraz dodatkowe spektakle tego samego zespołu, jeśli występują).

---

## 🔗 WSZYSTKIE MIEJSCA, GDZIE POJAWIA SIĘ TEATR

### 1. **Navigation dropdown** (linie ~48-55 w każdym pliku)
   - ❌ WYMAGA: Aktualizacji na wszystkich 6 plikach HTML
   - Dodaj `<a href="...">NAZWA <span class="fi fi-[kod]"></span></a>`

### ✅ Wiele spektakli jednego zespołu (multi-entry)
- Jeśli jeden zespół ma kilka spektakli, dodaj OSOBNE pozycje w dwóch miejscach na KAŻDEJ stronie teatru PL/EN:
    - w dropdownie nawigacji: osobny wpis dla każdego tytułu (np. `[ZESPÓŁ] – [TYTUŁ 2]`).
    - w sekcji „Zespoły festiwalowe” / „Festival ensembles”: osobny `<li>` dla każdego tytułu zespołu.
- Zaktualizuj stronę macierzystą zespołu (PL/EN), aby dropdown i lista zespołów zawierały linki do WSZYSTKICH jego spektakli.
- Zachowaj spójne flagi (`fi-[kod kraju]`) i nazewnictwo w PL/EN.

### 2. **Sekcja zespołów** (linie ~224-238 w PL, ~240-254 w EN)
   - ❌ WYMAGA: Aktualizacji na wszystkich 6 plikach HTML
   - Dodaj `<li><a href="...">NAZWA <span class="fi fi-[kod]"></span></a></li>`

### 3. **Własna strona teatru** (1 plik PL + 1 plik EN)
   - ✅ Nowe pliki: `pl/teatr-[id].html` i `en/[id].html`

### 4. **Katalog zdjęć** (1 katalog)
   - ✅ Nowy folder: `assets/img/teatr/[skrot]/`

### 5. **Strona online (grid z kartami)** (`pl/online.html`, `en/online.html`)
   - ❌ WYMAGA: Dodania karty w sekcji `<div class="theater-grid">` w obu plikach

**Przykład karty teatru PL:**
```html
<a href="teatr-[id].html" class="theater-card">
    <figure>
        <img src="../assets/img/teatr/[skrot]/1.webp" alt="[NAZWA TEATRU] – [TYTUŁ SPEKTAKLU]">
    </figure>
    <div class="card-body">
        <p class="theater-name">[NAZWA TEATRU]</p>
        <p class="theater-flag"><span class="fi fi-[kod]"></span></p>
        <h4>[TYTUŁ SPEKTAKLU]</h4>
    </div>
</a>
```

**Przykład karty teatru EN:**
```html
<a href="[en-id].html" class="theater-card">
    <figure>
        <img src="../assets/img/teatr/[skrot]/1.webp" alt="[THEATRE NAME] – [PERFORMANCE TITLE]">
    </figure>
    <div class="card-body">
        <p class="theater-name">[THEATRE NAME]</p>
        <p class="theater-flag"><span class="fi fi-[kod]"></span></p>
        <h4>[PERFORMANCE TITLE]</h4>
    </div>
</a>
```
   - ❌ WYMAGA: Aktualizacji na obu stronach „Online” (dodanie karty zespołu w sekcji `theater-grid`)
   - Dodaj `<a href="..." class="theater-card">` z obrazem `../assets/img/teatr/[skrot]/1.webp`, nazwą zespołu, flagą (`<span class="fi fi-[kod]"></span>`) i tytułem spektaklu jako `<h4>`
   - Linki: PL → `pl/teatr-[id].html`, EN → `en/[id].html`

---

## 🎨 ATRYBUTY FLAGI (flag-icons)

```html
<span class="fi fi-pl"></span>  <!-- Polska -->
<span class="fi fi-ua"></span>  <!-- Ukraina -->
<span class="fi fi-lt"></span>  <!-- Litwa -->
<span class="fi fi-gb"></span>  <!-- UK/Angielski -->
<span class="fi fi-de"></span>  <!-- Niemcy -->
<span class="fi fi-fr"></span>  <!-- Francja -->
<span class="fi fi-es"></span>  <!-- Hiszpania -->
<!-- itd. - wszystkie kody ISO 3166-1 alpha-2 -->
```

---

## 📝 Wzorzec prompta — dodanie nowego teatru

Użyj poniższego wzorca. Wypełnij wszystkie pola, aby uniknąć dopowiedzeń.

```
Dodaj nowy teatr:
ID: [id]                      # identyfikator (slug), bez spacji
PL FILE: teatr-[id].html      # wynikowy plik PL
EN FILE: [id].html            # wynikowy plik EN
PL NAME: [pełna nazwa]
EN NAME: [full name]
CITY: [miasto]
COUNTRY: [kraj]
FLAG: fi-[kod kraju]
GENRES: [gatunek1, gatunek2]
DURATION: [xx min]
SUBTITLES: [języki] / [brak]
YOUTUBE_ID: [xxxxxxxxxxx]
GALLERY: [liczba zdjęć, min 3]
TYPE: [typ teatru]

MULTI-ENTRY (opcjonalnie):
- TITLE 2 PL: [tytuł]
- TITLE 2 EN: [title]
- FILE 2 PL: teatr-[id-2].html
- FILE 2 EN: [id-2].html

TASKS:
- Utwórz strony PL/EN z pełną strukturą (hero, info-panel, synopsis, video, gallery, ensemble list, partners).
- Zaktualizuj dropdowny i listy zespołów na wszystkich stronach PL/EN.
- Dodaj kartę na pl/online.html i en/online.html.
- Dodaj obrazy do assets/img/teatr/[id]/ i skonwertuj do WebP.
- Ustaw canonical + hreflang (PL/EN/x-default).
- Zaktualizuj sitemap.xml (url + lastmod).
```

---

## ⚡ Szybka lista do pamiętania

✅ **Zawsze aktualizuj razem:**
- `pl/teatr-[id].html` i `en/[id].html` — pełna struktura strony.
- `pl/online.html` i `en/online.html` — karta zespołu w `theater-grid`.
- Wszystkie istniejące strony teatrów w `pl/` i `en/` — dropdown + „Zespoły festiwalowe”.
- `assets/img/teatr/[id]/` — obrazy (min. 3) w WebP.
- `sitemap.xml` — dodaj nowe URL-e + zaktualizuj `lastmod`.

✅ **Sekcja partnerów:** kopiuj kompletną strukturę z istniejącej strony (nie skracaj).
✅ **Info panel:** `<aside class="info-panel">` musi być w `two-column` obok hero.
❌ **Nie zmieniaj:** nazw istniejących plików, struktury HTML/CSS/JS.

---

## 🚨 CZĘSTE BŁĘDY I JAK ICH UNIKNĄĆ

### ❌ BŁĄD 1: Brak karty w sekcji online
**Objaw:** Teatr nie pojawia się na pl/online.html i en/online.html  
**Rozwiązanie:** Dodaj kartę z obrazem, nazwą, flagą i tytułem w `<div class="theater-grid">`

### ❌ BŁĄD 2: Niekompletna sekcja partnerów
**Objaw:** Brak logo WSPÓŁPRACA (PKPS, BART, Mamuszki, Teatr Wybrzeże) lub brak dużych logo Sopot/Pomorskie  
**Rozwiązanie:** Skopiuj CAŁĄ sekcję z teatr-tur.html, nie próbuj pisać ręcznie

### ❌ BŁĄD 3: Panel "Przegląd spektaklu" w osobnej sekcji
**Objaw:** Layout się rozjeżdża, panel nie jest obok hero  
**Rozwiązanie:** `<aside class="info-panel">` musi być wewnątrz `<div class="section-inner two-column">`, jako drugie dziecko obok głównego `<div>`

### ❌ BŁĄD 4: Niezaktualizowany nav-dropdown
**Objaw:** Teatr nie pojawia się w menu dropdown na innych stronach  
**Rozwiązanie:** Dodaj `<a href="..." class="nav-dropdown-item">NAZWA <span class="fi fi-[kod]"></span></a>` na wszystkich stronach teatrów w `pl/` i `en/`.

### ❌ BŁĄD 5: Tytuł spektaklu ze slashem (/) zamiast " i " (PL) lub " & " (EN)
**Objaw:** Tytuł to "Jaskier/Pył" — niepoprawny format  
**Rozwiązanie:** Zmień na "Jaskier i Kurz" (PL) lub "Dandelion & Dust" (EN)  
**Gdzie zmienić:**
- Meta description w HEAD
- Page title (`<title>`)
- Hero sekcja (strong tag)
- Info panel `<dd>`
- Video section `data-title`
- Karta online.html `<h4>`
- Wszystkie występy tego tytułu na każdej ze stron!

### ❌ BŁĄD 6: Niezgodne nazwy zespołów w różnych miejscach
**Objaw:** W nav-dropdown "RambaZamba Theater", ale w sekcji zespołów "RambaZamba" — nazwa zespołu musi być IDENTYCZNA  
**Rozwiązanie:** Grep wszystkie okregi nazwy zespołu i upewnij się, że:
- Pisownia jest spójna (capitalization, spacing)
- Jeśli zespół ma wiele spektakli, każda strona zawiera osobne wpisy dla każdego tytułu
- Flagi są identyczne (fi-pl, fi-de, etc.)

### ❌ BŁĄD 7: Brak nowego zespołu w liście zespołów na ISTNIEJĄCYCH stronach
**Objaw:** Nowy teatr dodany, ale stara strona teatru (np. teatr-parostky.html) nie zawiera go w sekcji "Zespoły festiwalowe"  
**Rozwiązanie:** Po dodaniu nowego teatru, zaktualizuj sekcję zespołów na WSZYSTKICH istniejących stronach (wszystkie pliki w pl/ i en/)  
**Ścieżka:** Szukaj `<section id="ensemble-list-title">` lub `<h2 id="ensemble-list-title">` i dodaj nowy zespół na KOŃCU listy

### ❌ BŁĄD 8: Format obrazów galerii (JPG zamiast WebP)
**Objaw:** Obrazy ładują się, ale format nie jest WebP  
**Rozwiązanie:** Skonwertuj wszystkie zdjęcia z JPG na WebP używając skryptu Python (convert_[nazwa]_webp.py)

### ❌ BŁĄD 9: Duplikacja zespołów w liście (np. MTT pojawia się dwa razy)
**Objaw:** Sekcja zespołów zawiera duplikaty  
**Rozwiązanie:** Sprawdź czy lista jest kopią z poprzedniego dodania — jeśli tak, usuń duplikaty i upewnij się że każdy zespół pojawia się DOKŁADNIE RAZ (chyba że ma kilka spektakli)

### ❌ BŁĄD 10: Info-panel w osobnej sekcji zamiast w two-column
**Objaw:** Info panel pojawia się poniżej hero zamiast obok niego  
**Rozwiązanie:**  
```html
<!-- ✅ POPRAWNIE -->
<section class="page-section">
    <div class="section-inner two-column">
        <div><!-- hero content --></div>
        <aside class="info-panel"><!-- info --></aside>
    </div>
</section>

<!-- ❌ ŹRÓDZO -->
<section class="page-section">
    <div class="section-inner two-column">
        <div><!-- hero content --></div>
    </div>
</section>
<section class="page-section">
    <aside class="info-panel"><!-- BŁĄD! --></aside>
</section>
```

---

## 🐛 DEBUG - Jak sprawdzić czy wszystko OK?

1. **Navbar dropdown** — wszystkie zespoły widoczne?
2. **Sekcja zespołów** — pełna lista zespołów z linkami? Czy lista na nowej stronie pokrywa się z listą na innych stronach?
3. **Navigation cross-links** - linki nie zawierają błędów 404?
4. **Zdjęcia galerii** - ścieżka `../assets/img/teatr/[skrot]/[1-4].webp` OK? (Format WebP!)
5. **Hreflang** - canonical i alternate hrefs poprawne?
6. **Language switcher** - polski/angielski link wskazuje na prawidłowy plik?
7. **Spójność NAZW:**
   - Tytuł spektaklu w info-panel (dt/dd) 
   - Tytuł w hero sekcji (strong)
   - Tytuł w meta description
   - Tytuł na stronie online.html
   - Tytuł w video section data-title
   - Czy używasz "/" zamiast " i " (PL) lub " & " (EN)? ❌ Nie! Popraw!
8. **Spójność NAZW ZESPOŁÓW:**
   - Nav dropdown (all pages)
   - Sekcja "Zespoły festiwalowe" (all pages)
   - Karta online.html
   - Czy nazwa zespołu jest identyczna wszędzie? Sprawdź pisownię "RambaZamba Theater", "MTT Musical Theatre Troupe", etc.
9. **Kanoniczne linki PL:**
   - Czy wszystkie strony PL mają navbar zawierający Baltazara/Krąg II?
   - Czy lista zespołów na stronie pl/teatr-parostky.html zawiera Baltazara na końcu?
10. **Kanoniczne linki EN:**
   - Czy wszystkie strony EN mają navbar zawierający Baltazara/Krug II?
   - Czy lista zespołów zawiera wszystkie 10 zespołów?

---

## � AKTUALNA LISTA ZESPOŁÓW FESTIWALU (stan na 2025-12-31)

**Wszystkie zespoły muszą pojawić się na KAŻDEJ stronie w sekcji "Zespoły festiwalowe" w następującej kolejności:**

### PL (Polska):
1. `teatr-parostky.html` - Ludowy Amatorski Teatr – Studio PAROSTKI 🇺🇦
2. `teatr-parostky-szczesliwi-wygnancy.html` - PAROSTKI – Szczęśliwi wygnańcy 🇺🇦
3. `trupa-mtt.html` - MTT Muzyczna Trupa Teatralna 🇱🇹
4. `teatr-tur.html` - Teatr Ubogi Relacji – TUR 🇵🇱
5. `teatr-otczapy.html` - Teatr Otczapy 🇵🇱
6. `teatr-rambazamba.html` - RambaZamba Theater 🇩🇪
7. `teatr-krug-ii.html` - Teatr zintegrowany Krąg II 🇷🇺
8. `teatr-lik.html` - Teatr Ruchu LIK 🇺🇿
9. `teatr-danza-mobile.html` - Compañía Danza Mobile 🇪🇸
10. `teatr-baltazar.html` - Teatr Baltazar 🇭🇺

### EN (English):
1. `parostky.html` - Folk Amateur Theatre – Studio PAROSTKI 🇺🇦
2. `parostky-happy-exiles.html` - PAROSTKI – Happy Exiles 🇺🇦
3. `troupe-mtt.html` - MTT Musical Theatre Troupe 🇱🇹
4. `tur.html` - Poor Theatre of Emotions – TUR 🇵🇱
5. `otczapy-theater.html` - Otczapy Theatre 🇵🇱
6. `rambazamba.html` - RambaZamba Theater 🇩🇪
7. `krug-ii.html` - Integrated Theatre Krug II 🇷🇺
8. `lik.html` - LIK Movement Theater 🇺🇿
9. `danza-mobile.html` - Compañía Danza Mobile 🇪🇸
10. `baltazar.html` - Baltazar Theatre 🇭🇺

**UWAGA:** Jeśli dodasz nowy zespół, zaktualizuj tę listę!

---

## 📌 NOTES

- Wszystkie HTML pliki znajdują się w: `/pl/` i `/en/`
- Wszystkie zdjęcia w: `/assets/img/teatr/`
- CSS i JS w: `/assets/`
- Sekcja zespołów jest **najczęściej zmienianym elementem** przy dodaniu nowego teatru
- Zawsze kopiuj cały blok HTML, nie edytuj na manju - ryzyko błędów tagów
- **BRAK HALLUCYNACJI:** Wszystkie dane (opisy, zespoły, spektakle) muszą pochodzić wyłącznie z archiwum lub podanych źródeł
- **SPÓJNOŚĆ:** Po każdym dodaniu nowego teatru uruchom grep na "Zespoły festiwalowe" aby upewnić się że lista jest identyczna na wszystkich stronach
- **PULA ODPOWIEDZIALNOŚCI:** Zmiana jednego zespołu lub tytułu spektaklu = zmiany w 10+ plikach (każdy teatr ma nav dropdown + ensemble list)

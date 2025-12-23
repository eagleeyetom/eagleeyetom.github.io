# 📋 INSTRUKCJE DODAWANIA NOWYCH TEATRÓW - MASSKA.ORG

## 📊 STRUKTURA OBECNYCH TEATRÓW

```
POLSKI (PL)                    ANGIELSKI (EN)
├─ teatr-tur.html              ├─ tur.html
├─ teatr-parostky.html         ├─ parostky.html
└─ trupa-mtt.html              └─ troupe-mtt.html
```

## 🎭 BIEŻĄCE TEATRY

| Skrót | PL Nazwa | EN Nazwa | Flaga | PL Plik | EN Plik | Katalog img |
|-------|----------|----------|-------|---------|---------|-------------|
| TUR | Teatr Ubogi Relacji – TUR | Poor Theatre of Emotions – TUR | 🇵🇱 | teatr-tur.html | tur.html | tur/ |
| PAROSTKI | Ludowy Amatorski Teatr – Studio PAROSTKI | Folk Amateur Theatre – Studio PAROSTKI | 🇺🇦 | teatr-parostky.html | parostky.html | parostky/ |
| MTT | MTT Muzyczna Trupa Teatralna | MTT Musical Theatre Troupe | 🇱🇹 | trupa-mtt.html | troupe-mtt.html | mtt/ |
| OTCZAPY | Teatr Otczapy | Otczapy Theatre | 🇵🇱 | teatr-otczapy.html | otczapy-theater.html | otczapy/ |
| RAMBAZAMBA | RambaZamba Theater | RambaZamba Theater | 🇩🇪 | teatr-rambazamba.html | rambazamba.html | rambazamba/ |

---

## ✅ CHECKLIST DODAWANIA NOWEGO TEATRU

### KROK 1: Przygotowanie zasobów

- [ ] Folder: `/assets/img/teatr/[skrot_male]/` (np. `tsb/`)
- [ ] Zdjęcia spektaklu (minimum 3-4): `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg` (800x560px)
- [ ] Konwersja zdjęć do formatu WebP (używając narzędzia Python `convert_[nazwa]_webp.py`)

### KROK 2: Tworzenie pliku PL (pl/teatr-[id].html lub pl/[skrot].html)

**KONWENCJE NAZEWNICTWA:**
- Skrót w URL: `teatr-parostky.html` (skrót+litery) lub `teatr-tur.html`
- Dla nowego: `teatr-[skrot_bez_spacji].html` (np. `teatr-tsb.html`)

**STRUKTURA (kopiuj z teatr-tur.html i modyfikuj):**

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

#### Navigation dropdown (linie 47-55):

```html
<div class="nav-dropdown">
    <span class="nav-link is-active" aria-current="page">[SKRÓT PEŁNY] <span class="fi fi-[kod_kraju]"></span></span>
    <div class="nav-dropdown-menu">
        <a href="teatr-parostky.html" class="nav-dropdown-item">PAROSTKI <span class="fi fi-ua"></span></a>
        <a href="trupa-mtt.html" class="nav-dropdown-item">MTT <span class="fi fi-lt"></span></a>
        <a href="teatr-tur.html" class="nav-dropdown-item">Teatr Ubogi Relacji <span class="fi fi-pl"></span></a>
        <a href="teatr-[nowy-id].html" class="nav-dropdown-item is-active">[NOWA NAZWA] <span class="fi fi-[kod]"></span></a>
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
- **Ensemble list** (linie 224-238): **WSPÓLNE DLA WSZYSTKICH** - zawiera linki do 3 zespołów
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

#### Sekcja zespołów (zawsze ta sama struktura):

```html
<section class="page-section" aria-labelledby="ensemble-list-title">
    <div class="section-inner">
        <h2 id="ensemble-list-title">Zespoły festiwalowe</h2>
        <details class="info-panel">
            <summary>Rozwiń listę zespołów</summary>
            <ul class="meta-list">
                <li><a href="teatr-parostky.html">Ludowy Amatorski Teatr – Studio PAROSTKI <span class="fi fi-ua"></span></a></li>
                <li><a href="trupa-mtt.html">MTT Muzyczna Trupa Teatralna <span class="fi fi-lt"></span></a></li>
                <li><a href="teatr-tur.html">Teatr Ubogi Relacji – TUR <span class="fi fi-pl"></span></a></li>
                <li><a href="teatr-[nowy-id].html">[NOWA NAZWA PEŁNA] <span class="fi fi-[kod]"></span></a></li>
            </ul>
        </details>
    </div>
</section>
```

**⚠️ WAŻNE:** Po dodaniu nowego teatru, ZAKTUALIZUJ tę sekcję na WSZYSTKICH 6 stronach (3 PL + 3 EN)!

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
- Jeśli PL: `teatr-parostky.html` → EN: `parostky.html` (bez "teatr-")
- Przykład: `teatr-tur.html` → `tur.html`

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

### KROK 4: Aktualizacja sekcji zespołów na WSZYSTKICH istnieją stronach

**Edytuj sekcję zespołów na 6 plikach:**

1. `pl/teatr-parostky.html`
2. `pl/trupa-mtt.html`
3. `en/parostky.html`
4. `en/troupe-mtt.html`
5. `en/tur.html` (jeśli mamy TUR na liście)
6. `pl/teatr-tur.html` (jeśli mamy TUR na liście)

**Struktura PL do skopiowania na każdą stronę:**

```html
<section class="page-section" aria-labelledby="ensemble-list-title">
    <div class="section-inner">
        <h2 id="ensemble-list-title">Zespoły festiwalowe</h2>
        <details class="info-panel">
            <summary>Rozwiń listę zespołów</summary>
            <ul class="meta-list">
                <li><a href="teatr-parostky.html">Ludowy Amatorski Teatr – Studio PAROSTKI <span class="fi fi-ua"></span></a></li>
                <li><a href="trupa-mtt.html">MTT Muzyczna Trupa Teatralna <span class="fi fi-lt"></span></a></li>
                <li><a href="teatr-tur.html">Teatr Ubogi Relacji – TUR <span class="fi fi-pl"></span></a></li>
                <li><a href="teatr-[nowy-id].html">[NOWA NAZWA] <span class="fi fi-[kod]"></span></a></li>
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

## 🔗 WSZYSTKIE MIEJSCA, GDZIE POJAWIA SIĘ TEATR

### 1. **Navigation dropdown** (linie ~48-55 w każdym pliku)
   - ❌ WYMAGA: Aktualizacji na wszystkich 6 plikach HTML
   - Dodaj `<a href="...">NAZWA <span class="fi fi-[kod]"></span></a>`

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

## 📝 PROMPT SKRÓT DO SZYBKIEGO DODAWANIA

Gdy musisz dodać nowy teatr, użyj tego prompta zamiast długich wyjaśnień:

```
Dodaj nowy teatr:
SKRÓT: [skrót]
PL ID: teatr-[id].html
EN ID: [id].html
PL NAZWA: [pełna nazwa]
EN NAZWA: [full name]
KRAJ: [kraj]
FLAGA: fi-[kod]
YOUTUBE: [ID]
SPEKTAKL: [tytuł]
TYP: [typ teatru]

Aktualizuj sekcję zespołów na wszystkich 6 stronach.
```

Przykład:
```
Dodaj nowy teatr:
SKRÓT: TSB
PL ID: teatr-tsb.html
EN ID: tsb.html
PL NAZWA: Teatr Statku Białego
EN NAZWA: White Ship Theatre
KRAJ: Polska
FLAGA: fi-pl
YOUTUBE: abc123def456
SPEKTAKL: Historia Morska
TYP: Teatr dramatyczny

Aktualizuj sekcję zespołów na wszystkich 6 stronach.
```

---

## ⚡ SZYBKA LISTA DO PAMIĘTANIA

✅ **ZAWSZE updatuj razem:**
1. `pl/teatr-[id].html` - NOWY (ze wszystkimi sekcjami!)
2. `en/[id].html` - NOWY (ze wszystkimi sekcjami!)
3. **`pl/online.html`** - dodaj kartę teatru do `<div class="theater-grid">`
4. **`en/online.html`** - dodaj kartę teatru do `<div class="theater-grid">`
5. `pl/teatr-parostky.html` - sekcja zespołów + nav dropdown
6. `pl/teatr-tur.html` - sekcja zespołów + nav dropdown
7. `pl/trupa-mtt.html` - sekcja zespołów + nav dropdown
8. `pl/teatr-otczapy.html` - sekcja zespołów + nav dropdown
9. `en/parostky.html` - sekcja zespołów + nav dropdown
10. `en/tur.html` - sekcja zespołów + nav dropdown
11. `en/troupe-mtt.html` - sekcja zespołów + nav dropdown
12. `en/otczapy-theater.html` - sekcja zespołów + nav dropdown

✅ **ZAWSZE dodaj folder:** `assets/img/teatr/[skrot]/` z 3-4 zdjęciami w formacie WebP (1.webp-4.webp)

✅ **ZAWSZE skopiuj KOMPLETNĄ sekcję partnerów** z innego teatru (teatr-tur.html) - nie skracaj!

✅ **ZAWSZE umieść `<aside class="info-panel">` w `two-column`** obok hero, NIE w osobnej sekcji!

❌ **NIGDY nie zmieniaj:** Nazw plików istniejących stron, struktury HTML, CSS, JS

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
**Rozwiązanie:** Dodaj `<a href="..." class="nav-dropdown-item">NAZWA <span class="fi fi-[kod]"></span></a>` we WSZYSTKICH 6 plikach

---

## 🐛 DEBUG - Jak sprawdzić czy wszystko OK?

1. **Navbar dropdown** - wszystkie 3 zespoły widoczne?
2. **Sekcja zespołów** - wszystkie 3 zespoły z linkami?
3. **Navigation cross-links** - linki nie zawierają błędów 404?
4. **Zdjęcia galerii** - ścieżka `../assets/img/teatr/[skrot]/[1-4].jpg` OK?
5. **Hreflang** - canonical i alternate hrefs poprawne?
6. **Language switcher** - polski/angielski link wskazuje na prawidłowy plik?

---

## 📌 NOTES

- Wszystkie HTML pliki znajdują się w: `/pl/` i `/en/`
- Wszystkie zdjęcia w: `/assets/img/teatr/`
- CSS i JS w: `/assets/`
- Sekcja zespołów jest **najczęściej zmienianym elementem** przy dodaniu nowego teatru
- Zawsze kopiuj cały blok HTML, nie edytuj na manju - ryzyko błędów tagów

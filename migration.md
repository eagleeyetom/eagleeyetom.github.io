# Plan migracji serwisu MASSKA.org do generatora statycznego (SSG) – Rekomendacja Astro

Niniejszy dokument przedstawia plan migracji serwisu **MASSKA.org** na nowoczesną architekturę opartą o generator stron statycznych (SSG). Po głębszej analizie kodu i instrukcji dodawania treści, jako najbardziej optymalne narzędzie wybrano **Astro**.

---

## 1. Analiza stanu obecnego i problemy

Obecnie strona jest zestawem czystych plików HTML z osobną strukturą dla języka polskiego (`pl/`) i angielskiego (`en/`). Główne problemy to:

1. **Duplikacja kodu sekcji wspólnych:** Nagłówek (`<header>`), stopka (`<footer>`), baner cookies (`.cookie-notice`) oraz rozbudowana sekcja partnerów (`.partners`) są powielone w każdym pliku HTML.
2. **Trudność w utrzymaniu spójności danych:** 
   - Dodanie nowego teatru wymaga edycji dropdownu nawigacyjnego we **wszystkich** plikach teatrów (obecnie ponad 20 plików).
   - Ręczna edycja siatki w `online.html` (PL i EN) oraz sekcji szczegółów na dole każdego profilu teatru.
   - Instrukcja `INSTRUKCJE_DODAWANIA_TEATROW.md` nakłada surowe reguły formatowania (np. kody krajów, flagi, identyczne nazwy), które przy ręcznym wprowadzaniu są podatne na błędy ludzkie.
3. **Zarządzanie dwujęzycznością (i18n):** Brak automatycznych linków alternatywnych (`hreflang` i `canonical`) łączących odpowiedniki stron PL i EN.

---

## 2. Porównanie i wybór technologii: Dlaczego Astro jest najlepszy?

W celu automatyzacji i uproszczenia wdrożono porównanie wiodących rozwiązań SSG:

| Cecha / Narzędzie | Eleventy (11ty) | Next.js / Gatsby | **Astro** (Rekomendowane) |
| :--- | :--- | :--- | :--- |
| **Główna zaleta** | Bardzo prosta składnia zbliżona do HTML. | Ogromny ekosystem i komponentowość React. | **Komponenty bez JS, natywne i18n, typowane kolekcje danych.** |
| **Walidacja danych** | Brak. Błędny front-matter (YAML) przejdzie bez błędu. | Możliwa poprzez GraphQL/TypeScript (trudne). | **Wbudowana i automatyczna walidacja (Zod). Błędne dane zatrzymają build.** |
| **Wsparcie dla i18n** | Wymaga wtyczek i pisania własnych filtrów. | Wbudowane, ale generuje ciężki JS na kliencie. | **Natywne `astro:i18n` (od wersji 3.x/4.x) z automatycznymi tagami SEO.** |
| **Integracja z CSS/JS** | Bezpośrednia. | Wymaga przepisania na moduły CSS/JS. | **Bezpośrednia (pliki w `/public` działają bez zmian).** |

### Dlaczego rekomendujemy Astro zamiast Eleventy?
Chociaż Eleventy jest prostym i skutecznym narzędziem, **Astro oferuje dwie kluczowe funkcje**, które idealnie rozwiązują problemy MASSKA.org:
1. **Content Collections z walidacją Zod:** Możemy zdefiniować schemat (schema) dla teatru. Jeśli dodasz nowy teatr i zapomnisz podać np. kodu flagi kraju, czasu trwania spektaklu, lub wprowadzisz niepoprawny adres e-mail, **Astro odrzuci build i wskaże dokładne miejsce błędu**. Chroni to przed łamaniem reguł opisanych w instrukcjach dla autorów.
2. **Natywne i18n (Umiędzynarodowienie):** Astro automatycznie generuje poprawne tagi `hreflang` i `canonical` oraz zarządza routingiem `/pl/` i `/en/` bez potrzeby instalowania zewnętrznych bibliotek i pisania własnych skryptów w JS.

---

## 3. Proponowana struktura katalogów (Astro)

Konfigurujemy Astro tak, aby pliki statyczne (CSS, JS, WebP) znajdowały się w folderze `public/`, co pozwoli nam zachować plik `assets/app.js` i style CSS w 100% bez zmian.

```text
masska/
├── public/                       # Zasoby kopiowane 1:1 do folderu wynikowego
│   └── assets/                   # Dotychczasowe CSS, JS, ikony i obrazy
│       ├── styles.css
│       ├── styles-mobile.css
│       ├── app.js
│       └── img/
├── src/                          # Kod źródłowy aplikacji
│   ├── content/                  # Dane strukturyzowane (baza danych w Markdown)
│   │   ├── config.ts             # Definicja schematu walidacji teatrów
│   │   └── theatres/             # Profile teatrów jako czysty Markdown
│   │       ├── pl/               # Profile po polsku
│   │       │   ├── baltazar.md
│   │       │   └── ...
│   │       └── en/               # Profile po angielsku
│   │           ├── baltazar.md
│   │           └── ...
│   ├── components/               # Komponenty wielokrotnego użytku
│   │   ├── Header.astro          # Nagłówek z dynamicznym dropdownem
│   │   ├── Footer.astro          # Stopka z mapą
│   │   ├── Partners.astro        # Sekcja partnerów i sponsorów
│   │   └── CookieConsent.astro   # Baner cookies
│   ├── layouts/                  # Szablony stron
│   │   ├── BaseLayout.astro      # Główny szablon strony
│   │   └── TheatreLayout.astro   # Szablon dedykowany dla profili teatrów
│   └── pages/                    # Podstrony (pliki .astro generujące routing)
│       ├── index.astro           # Splash page (wybór języka)
│       ├── pl/
│       │   ├── index.astro       # Główna strona PL
│       │   ├── kontakt.astro
│       │   ├── cookies.astro
│       │   ├── online.astro      # Dynamiczna siatka spektakli PL
│       │   ├── program.astro
│       │   └── teatr-[slug].astro # Dynamiczny generator stron teatrów PL
│       └── en/
│           ├── index.astro       # Główna strona EN
│           ├── contact.astro
│           ├── cookies.astro
│           ├── online.astro      # Dynamiczna siatka spektakli EN
│           ├── program.astro
│           └── [slug].astro       # Dynamiczny generator stron teatrów EN
├── astro.config.mjs              # Konfiguracja Astro (i18n, adaptery)
├── package.json                  # Zależności i skrypty npm
└── tsconfig.json                 # Konfiguracja TypeScript (dla walidacji schematów)
```

---

## 4. Szczegóły techniczne wdrożenia

### A. Definicja i walidacja schematu danych teatrów (`src/content/config.ts`)
Używamy biblioteki **Zod** (wbudowanej w Astro), aby wymusić strukturę danych wymaganą przez festiwal:

```typescript
import { z, defineCollection } from 'astro:content';

const theatresCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    showTitle: z.string(),
    countryCode: z.string().length(2), // Wymusza 2 znaki (np. "pl", "hu", "ua")
    badgeText: z.string(),
    genre: z.string(),
    duration: z.string(),
    subtitles: z.string(),
    city: z.string(),
    accessibility: z.string(),
    videoYtId: z.string(),
    videoTitle: z.string(),
    recordingUrl: z.string().url().optional(),
    quote: z.string().optional(),
    // Dane kontaktowe zespołu
    contactRole: z.string().optional(),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(), // Walidacja formatu email
    contactSocialText: z.string().optional(),
    contactSocialUrl: z.string().url().optional(), // Walidacja formatu URL
  })
});

export const collections = {
  'theatres': theatresCollection,
};
```

### B. Przykładowy plik profilu teatru (`src/content/theatres/pl/baltazar.md`)
Czysty plik danych. Brak jakiegokolwiek kodu HTML odpowiedzialnego za układ strony:

```markdown
---
id: "baltazar"
name: "Teatr Baltazar"
showTitle: "Dmuchawiec i Kurz"
countryCode: "hu"
badgeText: "Węgry · teatr integracyjny"
genre: "teatr ruchu / dramat"
duration: "45 min"
subtitles: "PL, EN"
city: "Budapeszt, Węgry"
accessibility: "Napisy PL/EN"
videoYtId: "XYZ12345"
videoTitle: "Zwiastun spektaklu Dmuchawiec i Kurz"
recordingUrl: "https://youtube.com/watch?v=XYZ12345"
quote: "W ruchu odnajdujemy to, co niewypowiedziane."
contactRole: "Reżyser"
contactName: "János Kovács"
contactEmail: "baltazar@example.com"
contactSocialText: "Facebook"
contactSocialUrl: "https://facebook.com/teatrbaltazar"
---

Tutaj znajduje się **opis spektaklu** (sekcja Synopsis). Można używać formatowania Markdown (pogrubienia, akapity).

---

Tutaj znajduje się **historia zespołu** (sekcja O zespole) oraz dodatkowe szczegóły.
```

### C. Dynamiczne generowanie stron w Astro (`src/pages/pl/teatr-[slug].astro`)
Astro generuje wszystkie polskie podstrony teatrów na podstawie jednego pliku szablonu:

```astro
---
import { getCollection } from 'astro:content';
import TheatreLayout from '../../layouts/TheatreLayout.astro';

// Pobierz wszystkie podstrony z kolekcji
export async function getStaticPaths() {
  const plTheatres = await getCollection('theatres', ({ id }) => id.startsWith('pl/'));
  return plTheatres.map(entry => ({
    params: { slug: entry.slug.replace('pl/', '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---
<TheatreLayout frontmatter={entry.data} lang="pl">
  <Content />
</TheatreLayout>
```

Dla wersji angielskiej tworzymy analogiczny plik `src/pages/en/[slug].astro` filtrujący kolekcję po `id.startsWith('en/')` i kierujący do `en/[slug].html` (zgodnie z dotychczasową strukturą URL bez prefiksu `teatr-`).

---

## 5. Przewodnik krok po kroku po procesie migracji

### Krok 1: Instalacja i inicjalizacja Astro
W głównym katalogu projektu instalujemy Astro za pomocą npm (z flagą `--help` / automatyczne generowanie):
```powershell
npm create astro@latest ./ -- --template minimal --install --no-git --typescript strict
```

### Krok 2: Konfiguracja `astro.config.mjs` dla i18n
Edytujemy konfigurację Astro w celu dodania automatycznej lokalizacji oraz wskazania formatu wyjściowego jako w pełni statyczny HTML (`output: 'static'`):

```javascript
import { defineConfig } from 'astro:config';

export default defineConfig({
  output: 'static',
  build: {
    format: 'file' // Wymusza generowanie plików teatr-baltazar.html zamiast folderu teatr-baltazar/index.html
  },
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: {
      prefixDefaultLocale: false // pl/index.html będzie pod adresem /pl/, a nie /
    }
  }
});
```

### Krok 3: Przeniesienie zasobów statycznych
Przenosimy aktualny folder `assets` oraz pliki `.htaccess` i `robots.txt` do katalogu `public/`. Dzięki temu linki w stylu `<link rel="stylesheet" href="../assets/styles.css">` lub skrypty w `app.js` będą odpytywały serwer dokładnie tak samo jak dotychczas.

### Krok 4: Wyodrębnienie szablonów wspólnych
Tworzymy komponenty `.astro` w `src/components/`, kopiując do nich odpowiednie bloki kodu:
- `Header.astro` – zawiera kod `<header>`. Menu rozwijane dla teatrów pobiera dane z kolekcji `getCollection('theatres')` i generuje linki za pomocą pętli `map()`.
- `Footer.astro` – zawiera kod `<footer>` z mapą Google.
- `Partners.astro` – zawiera sekcję partnerów i sponsorów.
- `CookieConsent.astro` – baner cookies.

### Krok 5: Migracja profili teatrów do Markdown
1. Dla każdego pliku HTML teatru (np. `pl/teatr-baltazar.html`) wyodrębniamy zmienne do nagłówka YAML.
2. Zapisujemy plik jako `src/content/theatres/pl/baltazar.md`.
3. Treść tekstową wklejamy pod nagłówkiem YAML.

### Krok 6: Konfiguracja dynamicznej siatki na stronie "Oglądaj online"
Strona `src/pages/pl/online.astro` pobiera listę teatrów z kolekcji i renderuje je za pomocą pętli:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const theatres = await getCollection('theatres', ({ id }) => id.startsWith('pl/'));
---
<BaseLayout title="MASSKA Online" lang="pl">
  <div class="theater-grid">
    {theatres.map(theatre => (
      <a href={`/pl/teatr-${theatre.slug.replace('pl/', '')}.html`} class="theater-card">
        <figure>
          <img src={theatre.data.gallery[0]?.src} alt={theatre.data.name} />
        </figure>
        <div class="card-body">
          <p class="theater-name">{theatre.data.name}</p>
          <p class="theater-flag"><span class={`fi fi-${theatre.data.countryCode}`}></span></p>
          <h4>{theatre.data.showTitle}</h4>
        </div>
      </a>
    ))}
  </div>
</BaseLayout>
```

---

## 6. Korzyści z wyboru Astro dla MASSKA.org

1. **Gwarancja spójności danych (Brak błędów):** Proces walidacji schematu upewnia się, że nikt nie doda profilu teatru bez wymaganych pól lub z błędnym adresem URL.
2. **Koniec z ręcznym edytowaniem plików:** Dodając plik `baltazar.md`, automatycznie aktualizujesz dropdown w menu nawigacyjnym, siatkę na podstronie online oraz akordeon podsumowujący.
3. **Pojedynczy punkt edycji komponentów:** Zmiana logotypu sponsora czy linku w stopce odbywa się wyłącznie w jednym pliku komponentu Astro.
4. **Brak wpływu na optymalizację SEO:** Astro generuje czyste, tradycyjne pliki HTML, które ładują się błyskawicznie. Adresacja URL (np. `/pl/teatr-baltazar.html` i `/en/baltazar.html`) pozostaje niezmieniona, co chroni pozycję w wyszukiwarce Google.

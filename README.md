# MASSKA – strona festiwalu

Statyczna strona Międzynarodowego Przeglądu Teatralnego MASSKA (Astro, PL i EN). Produkcja: masska.org
(Apache, `public/.htaccess`; na serwerze musi zostać katalog `/archive/`).
Staging: eagleeyetom.github.io (GitHub Pages).

## Wymagania
- Node.js **22.23.4 lub nowszy** (CI używa Node 24) i npm.
- Python 3 z Pillow tylko do grafik (`tools/build_graphics.py`, `tools/promo/assets.py`), ffmpeg tylko do klipów.

## Polecenia
| Polecenie | Co robi |
|---|---|
| `npm ci` | instaluje zależności |
| `npm run dev` | serwer deweloperski na http://localhost:4321 |
| `npm run build` | buduje stronę do `dist/` (Astro + `tools/postbuild.cjs`) |
| `npm test` | build, testy statyczne i przeglądarkowe (opis: `tests/README.md`) |

## Gdzie co jest
- `src/pages/` – strony (`pl/`, `en/`), `src/components/`, `src/layouts/`
- `src/content/theatres/{pl,en}/*.md` – zespoły sceny online (opis: `INSTRUKCJE_DODAWANIA_TEATROW.md`)
- `src/data/edition.ts` – daty, miejsca i teksty edycji
- `public/assets/` – style, `app.js`, obrazki; `public/404.html`, `public/.htaccess`
- `tools/` – generatory grafik, klipów promocyjnych (`tools/promo`) i grafik YouTube (`tools/youtube`)
- `design/` – materiały źródłowe (plakat) i opis grafik

## Przyciski „Oglądaj online”
Do pierwszego dnia festiwalu (`edition.days[0]`, od północy) są ukryte; odsłania je skrypt w `<head>`
(`BaseLayout.astro`), więc nie trzeba przebudowywać strony. Elementy oznacza atrybut `data-online`.
**Tryb debug:** dopisz `?debug` do adresu dowolnej strony (np. `/pl/index.html?debug`) – przyciski są
widoczne, w rogu pojawia się czerwony znaczek DEBUG, a ustawienie zostaje zapamiętane w tej przeglądarce.
Wyłączenie: `?debug=0`. Sama strona `online.html` działa pod bezpośrednim adresem przez cały czas.

## Wdrożenie
Push na `master` uruchamia `.github/workflows/deploy.yml` (build, testy statyczne, GitHub Pages) i
`tests.yml` (testy przeglądarkowe).

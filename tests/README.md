# Testy strony

Wszystkie testy działają na zbudowanej stronie (`dist/`).

| Polecenie | Co robi |
|---|---|
| `npm run test:static` | szybkie sprawdzenie plików: martwe linki i kotwice, brakujące obrazy i fonty, `alt`, jeden `h1`, canonical/hreflang, sitemapa, `noindex` zaślepek, brak ścieżek bezwzględnych (strona ma działać z dysku) |
| `npm run test:browser` | prawdziwa przeglądarka (Playwright): axe WCAG 2.2 AA (zwykły i wysoki kontrast), błędy w konsoli, brak poziomego przewijania (320–1280 px), odliczanie na podstawie zegara, przekierowanie języka, przyciski A+/kontrast, baner zgód, filtr sceny online, galeria, menu na telefonie, otwieranie z dysku (`file://`) |
| `npm test` | build, a potem oba zestawy |

Przed pierwszym uruchomieniem testów przeglądarkowych: `npm ci`. Lokalnie używana jest zainstalowana
przeglądarka Chrome; w CI Chromium pobierane przez `npx playwright install chromium`.

Na GitHubie `deploy.yml` uruchamia testy statyczne przed publikacją (błąd zatrzymuje wdrożenie), a `tests.yml`
osobno testy przeglądarkowe (błąd to czerwony znaczek, nie blokuje publikacji).

## Dopisywanie testów
- nowa strona: dopisz jej adres do listy `PAGES` w `tests/browser.spec.mjs` (dostanie axe, sprawdzenie konsoli
  i przewijania);
- zmiana terminu festiwalu: popraw daty w testach odliczania (`tests/browser.spec.mjs`, sekcja `countdown`) i
  w teście danych strukturalnych (`tests/static.test.mjs`).

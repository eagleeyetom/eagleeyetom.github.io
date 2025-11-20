# Poprawki SEO - Google Search Console

## ✅ Wykonane zmiany (16 listopada 2025)

### 1. Utworzono robots.txt

- Dodano jawne dyrektywy dla crawlerów Google
- Wskazano lokalizację sitemap.xml
- Wykluczono z indeksowania szablony (`/pl/template.html`, `/en/template.html`)

### 2. Zaktualizowano sitemap.xml

- ✅ Dodano brakujące strony: `/pl/kontakt.html` i `/en/contact.html`
- ✅ Zaktualizowano wszystkie daty `lastmod` do 16.11.2025
- ✅ Ustawiono priorytet 0.7 dla stron kontaktowych

### 3. Ujednolicono tagi hreflang i canonical

**Problem:** Niespójne x-default powodowały błędy "Duplikat użytkownika" i "Alternatywna strona z prawidłowym tagiem kanonicznym"

**Rozwiązanie:** Każda para stron ma teraz spójny x-default wskazujący na polską wersję:

| Strona        | x-default (domyślna)                 |
| ------------- | ------------------------------------ |
| Strona główna | `https://masska.org/`                |
| Program       | `https://masska.org/pl/program.html` |
| Online        | `https://masska.org/pl/online.html`  |
| Kontakt       | `https://masska.org/pl/kontakt.html` |
| Cookies       | `https://masska.org/pl/cookies.html` |

---

## 📋 Kroki po wdrożeniu

### 1. Prześlij robots.txt i sitemap.xml do Google

1. Wejdź na https://search.google.com/search-console
2. Wybierz właściwość `masska.org`
3. W menu po lewej: **Pliki Sitemap**
4. Kliknij **Dodaj nową mapę witryny**
5. Wpisz: `sitemap.xml` → **Prześlij**
6. Poczekaj 1-2 dni na pełne przeindeksowanie

### 2. Wymuś ponowne przeskanowanie kluczowych stron

1. W Search Console → **Inspekcja adresów URL**
2. Wprowadź kolejno każdy URL i kliknij **Poproś o indeksowanie**:
   - `https://masska.org/`
   - `https://masska.org/pl/`
   - `https://masska.org/en/`
   - `https://masska.org/pl/program.html`
   - `https://masska.org/en/program.html`
   - `https://masska.org/pl/kontakt.html`
   - `https://masska.org/en/contact.html`
   - `https://masska.org/pl/online.html`
   - `https://masska.org/en/online.html`

### 3. Zweryfikuj robots.txt

1. W Search Console → **Ustawienia** → **Narzędzie do testowania robots.txt**
2. Sprawdź, czy:
   - ✅ `sitemap.xml` jest dostępna
   - ✅ Strony główne są dozwolone (Allow: /)
   - ✅ Szablony są zablokowane

### 4. Sprawdź tagi hreflang

1. W Search Console → **Międzynarodowe targetowanie**
2. Sprawdź raport **hreflang** za 7-14 dni
3. Powinny zniknąć błędy:
   - ❌ Duplikat użytkownika bez oznaczenia kanonicznej
   - ❌ Alternatywna strona z prawidłowym tagiem kanonicznym
   - ❌ Strona zeskanowana, ale nie zaindeksowana

---

## 🔍 Oczekiwane rezultaty

Po 7-14 dniach:

- ✅ Wszystkie strony zaindeksowane poprawnie
- ✅ Brak duplikatów w wynikach wyszukiwania
- ✅ Poprawne wyświetlanie wersji językowych
- ✅ Spadek liczby błędów w Search Console do 0

---

## 📊 Monitorowanie

Regularnie sprawdzaj (co tydzień przez miesiąc):

1. **Search Console → Pokrycie** - liczba zaindeksowanych stron
2. **Search Console → Wydajność** - kliknięcia i wyświetlenia
3. **Search Console → Ulepszenia** - błędy użyteczności mobilnej

---

## ⚠️ Uwagi

- Szablony (`template.html`) są wykluczony z indeksowania przez robots.txt - to poprawne
- Jeśli dodasz nowe podstrony, pamiętaj o aktualizacji `sitemap.xml`
- x-default zawsze powinien wskazywać na polską wersję (główny język witryny)

# Srebro Gorzów — galeria projektów

## Aktualna produkcja — 28.10.2026

Edytuj deployment/jdm-public/, nie historyczną galerię dist/. Przeczytaj docs/STATIC-RUNTIME-20261016.md i docs/PRODUCTION.md. Aktualna wersja ma 26 statycznych stron, osobne artykuły, politykę prywatności, zdjęcia WebP i faviconę Ag. Kalkulator zaczyna z pustą wagą; granulat ustawia próbę 999,9.

Testy: npm test. Podgląd statyczny: python -m http.server 8766 --directory deployment/jdm-public (bez wykonywania PHP i wysyłki SMTP). npm start uruchamia historyczną galerię.

Hasła SMTP, klucz Turnstile i prywatna konfiguracja pozostają na hostingu. Nie dodawaj ich do repo ani nie nadpisuj podczas publikacji. Źródłem prawdy jest deployment/jdm-public/, a datowane paczki są kopiami do FileZilli.

Aktualna wersja produkcyjna strony jest w deployment/jdm-public/. Przed kontynuacją przeczytaj docs/PRODUCTION.md — poniższy opis galerii i danych demonstracyjnych jest historyczny i nie opisuje działającego formularza SMTP.

Repozytorium: https://github.com/angsm111-dot/srebro-gorzow-studio (prywatne).

## Odtworzenie na innym komputerze

Potrzebny jest Node.js 20 lub nowszy. Nie ma bibliotek do instalowania ani kompilacji.

```sh
git clone https://github.com/angsm111-dot/srebro-gorzow-studio.git
cd srebro-gorzow-studio
npm start
```

Otwórz http://127.0.0.1:8765/#13. Gdy port jest zajęty: `npm start -- --port 8766`. Zatrzymanie: Ctrl+C. Alternatywnie otwórz `dist/index.html` bezpośrednio w przeglądarce (schowek może wtedy wymagać ręcznego kopiowania). Czcionki Google Fonts potrzebują internetu; bez niego działają fonty zastępcze.

## Kontynuowanie w innym Codexie

Otwórz sklonowany folder jako projekt i wklej:

> Kontynuujemy projekt strony skupu srebra w Gorzowie. Przeczytaj AGENTS.md, README.md, docs/CONTEXT.md, docs/DESIGNS.md i VALIDATION.md. Uruchom galerię przez npm start. Zachowaj wszystkie poprzednie projekty i numerację. Kolejne propozycje dopisuj do tej samej galerii. Preferuję czyste jasne strony bez czerwieni, bordo i czarnych paneli, kompletne z menu, kalkulatorami monet/sztabek/złomu, wykresem, kontaktem i stopką. Najpierw poznaj aktualny stan, potem wykonaj moje następne polecenie.

Repo zawiera wszystkie obrazy, źródła i uporządkowany zapis kontekstu, ale nie przenosi zalogowania, kont, uprawnień ani wewnętrznej pamięci starej sesji. docs/CONTEXT.md jest podsumowaniem, nie pełnym transkryptem.

## Pliki i sprawdzenie

- `dist/` — źródła działającej galerii i 13 PNG; nie jest katalogiem do usuwania podczas kompilacji.
- `docs/CONTEXT.md` — wymagania, decyzje, historia i ograniczenia.
- `docs/DESIGNS.md` — katalog wszystkich 15 projektów.
- `docs/ASSETS.md` — pochodzenie obrazów i brief zdjęcia.
- `archive/initial-inline.html` — pierwsze trzy proste szkice sprzed makiet PNG; zachowany fragment korzystający z hosta Visualize.
- `archive/test-silver-original.cjs` — historyczny skrypt Playwright ze ścieżkami starego komputera, nieprzenośny i nieużywany przez npm test.
- `scripts/serve.mjs` — przenośny serwer localhost bez zależności.
- `scripts/verify.mjs` — sprawdzenie zasobów, składni i obliczeń; uruchom `npm test`.
- `.openai/hosting.json` — historyczny identyfikator nieopublikowanego projektu Sites, bez sekretów; niepotrzebny do lokalnego uruchomienia.

`dist/index.html` to przeglądarka wszystkich projektów. Projekty 01–12 są zachowanymi makietami graficznymi, a 13–15 to kompletne interaktywne demonstracje. Strzałki i lista wyboru przełączają projekty. Otwarte wersje pozostają w pamięci strony, zachowując stan kalkulatora i pozycję przewijania.

## Kolejne propozycje

Dopisuj nowe wpisy do `dist/variants.js`. Nie usuwaj ani nie zmieniaj numerów wcześniejszych wpisów. Nowe interaktywne wersje powinny otrzymać własny plik lub nowy wariant z zachowaniem starszych reguł. Zawsze aktualizuj tę samą galerię i ten sam projekt Sites, wskazany w `.openai/hosting.json`.

## Dane demonstracyjne

Wszystkie stawki i wykres są przykładowe, bez połączenia ze źródłem rynku. Kalkulator: masa netto × próba / 1000 × 3 PLN. Dla monet i sztabek masa jednej sztuki mnożona jest przez ilość. Wycena nie uwzględnia wartości numizmatycznej. Cennik i kalkulator mają wspólną stałą bazową. Wykres jest deterministyczną symulacją do 29.09.2026, niezależną od rzeczywistego kursu.

Kontakt zawiera przykładowy adres, nieczynny numer i zarezerwowany przykładowy e-mail. Formularz przygotowuje treść lokalnie, niczego nie wysyła. Mapa wskazuje miasto. Nie ma analityki. Google Fonts jest opcjonalną zewnętrzną zależnością; dostępne są fonty zastępcze.

## Uruchomienie właściwej strony

Potrzebne są rzeczywiste dane firmy, zasady wyceny i stawki; uzgodnione źródło historycznych cen; integracja formularza i odpowiednia polityka prywatności. Domena użytkownika nie jest podłączona do tej prywatnej demonstracji.

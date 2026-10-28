# Instrukcje dla kolejnego Codexa

1. Przeczytaj README.md, docs/CONTEXT.md, docs/DESIGNS.md i VALIDATION.md przed zmianami.
2. Rozmawiaj po polsku. Cel: strona skupu srebra w Gorzowie Wielkopolskim; użytkownik posiada www.skupsrebragorzow.pl.
3. Preferencje: czyste, jasne, nowoczesne i proste strony ze zdjęciami srebra. Bez czerwieni, bordo i czarnych paneli. Popiel z żółcią jest akceptowany, lecz kolejne propozycje mają różnić się koncepcją, nie tylko kolorem.
4. Zachowuj wcześniejsze projekty. 01–12 to makiety PNG, 13–15 to działające strony. Dopisuj do dist/variants.js; nie nadpisuj i nie przenumerowuj. Nowe projekty najlepiej mają własne pliki. Zmiana wspólnego CSS/JS nie powinna zmieniać starych wariantów bez polecenia.
5. Zachowaj galerię ze strzałkami, wyborem wersji i stanem otwartych stron. Stan kalkulatora żyje tylko do odświeżenia/zamknięcia.
6. Kompletna strona: menu, zdjęcia, monety/sztabki/złom, kalkulator i wspólna wycena, cennik, wykres, FAQ, kontakt, stopka. Nie zastępuj działających stron obrazkami bez polecenia.
7. Stawki, wykres i kontakt są demonstracyjne. Użytkownik wyraźnie zaakceptował przykładowe dane kontaktowe. Formularz tylko przygotowuje tekst, nie wysyła. Nie prezentuj symulacji jako rzeczywistej oferty.
8. npm start i npm test; Node >=20, brak zależności do instalacji. dist/ jest kodem źródłowym — nie usuwaj go jak katalogu kompilacji.
9. Lokalna galeria działa bez Sites, ImageGen, konta OpenAI i kluczy API. .openai/hosting.json zachowuje historyczny, niesekretny identyfikator nieopublikowanego projektu. Jeśli wróci publikacja przez Sites, najpierw sprawdź ten identyfikator, nie twórz duplikatu.
10. Nie zapisuj tokenów, haseł, profilu Codexa ani prywatnych logów. Repo przenosi pliki i opisany kontekst, nie wewnętrzny stan sesji.

## Aktualna produkcja i publikacja

Dla bieżącej strony nadrzędny aktualny opis jest w docs/STATIC-RUNTIME-20261016.md i docs/PRODUCTION.md. Edytuj deployment/jdm-public/, a nie historyczną galerię dist/. Polecenie użytkownika dodania artykułu i opublikowania go obejmuje HTML artykułu, listę bloga, sitemap, testy i push do main. Push plików produkcyjnych automatycznie publikuje na JDM przez Actions. Zawsze sprawdź wynik dla konkretnego SHA. Nie wysyłaj sekretów, private-config ani backendu PHP w ramach publikacji treści.

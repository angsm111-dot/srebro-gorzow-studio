# Studio 2 — kontynuowanie pracy

Aktualny projekt wybrany przez użytkownika: **wersja 02 / Silver Studio**.
Stan: 29.09.2026. Wszystkie pliki i zdjęcia są w tej kopii, razem z pozostałymi 14 projektami.

## Uruchomienie

Rozpakuj studio-2.zip do osobnego folderu. Otwórz ten folder w Codexie.
Potrzebny jest Node.js 20 lub nowszy; nie trzeba instalować bibliotek.

```sh
npm start
```

Otwórz http://127.0.0.1:8765/#2 (galeria) lub http://127.0.0.1:8765/studio.html (Studio 2).
Jeżeli port jest zajęty: `npm start -- --port 8766`.
Sprawdzenie plików i obliczeń: `npm test`.

## Prompt dla nowego Codexa

> Kontynuujemy Studio 2, stronę skupu srebra w Gorzowie dla skupsrebragorzow.pl. Przeczytaj STUDIO-2.md, AGENTS.md i docs/CONTEXT.md. Aktualnym projektem jest dist/studio.html, wersja 02 w galerii. Zachowaj osobne podstrony, menu mobilne, srebrzyste szarości, grafitowy tekst i jasną miętę na głównych przyciskach i wyróżnieniach. Bez niebieskich, czerwonych, bordowych i czarnych paneli. Nie zmieniaj innych wariantów. Uruchom lokalnie i wykonaj moje kolejne polecenie. Dane i wykres pozostają demonstracyjne, dopóki nie podam prawdziwych.

## Pliki aktualnej wersji

- `dist/studio.html` — wejście strony.
- `dist/site.js`, `dist/site.css` — wspólny silnik kalkulatorów i podstawowe style, używane także przez 13–15; nie zmieniaj ich bez sprawdzenia pozostałych wersji.
- `dist/studio.js`, `dist/studio.css` — styl Studio, szybki kalkulator, mobilne menu.
- `dist/studio-pages.js` — podstrony `?page=start`, `oferta`, `kalkulator`, `cennik`, `wykres`, `faq`, `kontakt`; historia przeglądarki i stan wyceny w pamięci.
- `dist/studio-modern.css` — nowoczesne komponenty i układy.
- `dist/studio-silver.css` — końcowa paleta srebrzystych szarości i jasnej mięty; ładowana ostatnia.
- `dist/variants.js`, `dist/gallery.*`, `dist/index.html` — galeria, nie zmieniaj numeracji.
- `dist/assets/` — wszystkie zdjęcia i oryginalne makiety. Oryginalna makieta 02 dostępna też z linku w stopce Studio.

## Co działa

Osobne widoki z adresami, nawigacja mobilna, szybka i pełna wycena, monety/sztabki/złom, próby, masa, ilość, odliczenia, koszyk wspólnej wyceny, cennik, wykres 7/30/90 dni, FAQ, przygotowanie wiadomości do skopiowania, stopka i okno prywatności.

Stawka 3 PLN/g czystego srebra oraz wykres są przykładowe. Kontakt jest fikcyjny na życzenie użytkownika. Formularz niczego nie wysyła. Dane wpisane do kalkulatorów nie są trwale zapisywane. Fotografie wygenerowano AI. Google Fonts są opcjonalną zależnością sieciową.

## Publikacja i kopia

Prywatny podgląd: https://srebro-gorzow-studio.angsm111.chatgpt.site/#2
Projekt Sites: `appgprj_6abb792ab0088191823e76f6330e55f3`, zachowany w `.openai/hosting.json`. Nie twórz duplikatu przy aktualizacji. Domena użytkownika nie jest podłączona.

**studio-2.zip jest pełną aktualną kopią źródeł.** Starsze pliki w głównym katalogu repozytorium GitHub mogą przedstawiać wcześniejszy stan; zacznij od tego archiwum. Nie zawiera loginów, tokenów ani wewnętrznej pamięci Codexa. Historia publikacji Sites i historia GitHuba są niezależne — nie wykonuj force push.

Instrukcje o tym, że 02 jest wyłącznie PNG lub Sites jest nieopublikowany, w starszych dokumentach są historyczne. Ten dokument i końcowe aktualizacje docs/CONTEXT.md opisują aktualny stan.

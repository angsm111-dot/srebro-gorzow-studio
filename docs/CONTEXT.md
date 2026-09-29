# Kontekst projektu — 29.09.2026

## Cel i preferencje

Użytkownik chce stronę skupu srebra w Gorzowie Wielkopolskim, posiada domenę www.skupsrebragorzow.pl. Na początku prosił o projekty i inne narzędzia AI; potem wielokrotnie zamawiał po trzy nowe koncepcje. Nie wybrał ostatecznego projektu.

Strona ma być nowoczesna, designerska, ale prosta; ważne są fotografie srebra i kompletna funkcjonalność. Każda seria powinna zmieniać kompozycję, typografię i sposób prezentacji, nie tylko kolor. Odrzucił czerwień i bordo. Preferuje czyste, jasne strony bez czarnych paneli. Popiel z żółcią ocenił pozytywnie jako przykład, nie jako obowiązkową paletę. Starsze ciemne/czerwone projekty pozostają w archiwum.

## Historia

1. Pierwsze 3 proste szkice inline: Silver Minimal, Atelier, Szybka wycena. Zachowane w archive/initial-inline.html; oryginalny fragment korzysta z hosta Visualize i nie jest samodzielną główną galerią.
2. Cztery serie po 3 makiety graficzne: projekty 01–12. Wszystkie PNG są zapisane lokalnie w repo.
3. Użytkownik następnie poprosił o 3 kompletne, klikalne strony: menu, kalkulatory, wykres, monety, sztabki, złom, kontakt, stopka; możliwość powrotu lewo/prawo do poprzednich projektów także przy kolejnych seriach.
4. Powstała galeria 01–15: makiety 01–12 plus działające strony 13–15.
5. Zapytany o adres/telefon/godziny, użytkownik polecił użyć na razie przykładowych danych. Są jawnie oznaczone.
6. Obecne zadanie: repozytorium na GitHubie z kontekstem i wszystkimi projektami do odtworzenia na innym komputerze i w innym Codexie. Konto potwierdzone przez połączenie GitHub: angsm111-dot. Przyjęto repo prywatne.

## Architektura i stan

Statyczny HTML/CSS/JS bez frameworka i backendu. dist/ to edytowalny kod źródłowy. index.html + gallery.* to przeglądarka; variants.js to stabilny rejestr. Każdy otwarty wariant interaktywny pozostaje w osobnej ramce iframe, zachowując dane do zamknięcia/odświeżenia. Hash #13 wybiera projekt; site.html?v=13 otwiera go osobno.

Wersje 13–15 mają wspólną funkcjonalność i odrębny wygląd .v13/.v14/.v15. Są kalkulatory wag/prób/ilości/odliczeń, wspólna wycena, tabela cen, symulowany wykres 7/30/90 dni z tabelą i odczytem punktu, FAQ, formularz przygotowania zapytania, kontakt i stopka.

## Ograniczenia

- Stawka 3 PLN/g czystego srebra jest przykładem, nie kursem. Wykres jest deterministyczną symulacją do 29.09.2026.
- Wycena obejmuje metal, nie premię handlową ani wartość numizmatyczną.
- Formularz tworzy treść lokalnie, nie wysyła danych. Kontakt: ul. Przykładowa 12, +48 000 000 000, kontakt@example.com. Mapa wskazuje miasto.
- Grafiki wygenerowano AI; nie przedstawiają towaru ani punktu użytkownika.
- Google Fonts jest zewnętrzną zależnością wizualną; bez internetu działają fallbacki.
- Publikacja Sites nie została ukończona: w trakcie pracy przestał istnieć wymagany katalog pluginu/skrypt. Zachowano ID w .openai/hosting.json. Domena użytkownika nie jest podłączona.
- Nie wykonano pełnego audytu dostępności ani prawdziwej wysyłki wiadomości. Dokładne sprawdzenia opisano w VALIDATION.md.

## Dalsza praca

Możliwe następne zadania: dopisać 16–18, rozwinąć wybrany wariant, wdrożyć produkcyjnie po uzyskaniu danych. Nie zakładaj ostatecznego wyboru ani zgody na zakup usług. Zachowuj stare projekty.

To uporządkowane podsumowanie jawnych wymagań, nie pełny surowy transkrypt. Nie zawiera rozumowania, ukrytych instrukcji, tokenów, logowania ani wewnętrznej pamięci modelu.

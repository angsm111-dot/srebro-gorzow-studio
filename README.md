# Srebro Gorzów — Studio 2

Repozytorium zawiera jedną aktualną stronę: Silver Studio, ze srebrzystymi szarościami i jasną miętą. Źródła odtworzono z najnowszej kopii studio-2.zip. Starsze projekty usunięto z bieżących plików; pozostają w historii Git.

## Uruchomienie

Wymagany Node.js >=20. Brak zależności i kompilacji.

```sh
npm start
npm test
```

Strona główna: http://127.0.0.1:8765/ . Podstrony: studio.html?page=oferta, kalkulator, cennik, wykres, faq, kontakt. Gdy port jest zajęty: npm start -- --port 8766.

dist/ jest kodem źródłowym, nie katalogiem do usuwania podczas kompilacji. Studio korzysta z site.js/site.css i plików studio*. Menu, kalkulatory, wycena, wykres i formularz działają lokalnie. Google Fonts są opcjonalne.

Stawki (3 PLN/g czystego srebra), wykres i kontakt są demonstracyjne. Formularz przygotowuje tekst, niczego nie wysyła. Domena użytkownika nie jest podłączona. Historyczny projekt Sites jest zapisany w .openai/hosting.json; zmiany GitHuba nie publikują go automatycznie.

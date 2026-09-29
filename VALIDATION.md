# Sprawdzenie demonstracji

Sprawdzone w przeglądarce aplikacji:

- Złom 100 g, próba 925: 277,50 PLN; po odjęciu 10 g pozostałych części: 249,75 PLN.
- Dwie sztabki 100 g, próba 999: 599,40 PLN; suma z poprzednią pozycją: 849,15 PLN.
- Moneta 31,1034768 g, próba 999: 93,22 PLN.
- Ujemna waga blokuje dodanie pozycji.
- Wykres przełącza 7 i 90 wierszy danych.
- Formularz przygotowuje treść bez wysyłania; menu mobilne otwiera się i zamyka po wyborze sekcji.
- Przełączenie projektu zachowuje wpisaną wagę.
- Widoki o szerokości 390 i 320 px: brak poziomego przewijania w sprawdzonych układach.
- Archiwum 12 widoczne w galerii. Wszystkie 12 lokalnych plików zachowanych.
- WebMCP: poprawny przykład 599,40 PLN i błędna masa odliczenia sprawdzone; błąd nie zmienia poprzedniego wyniku.
- Sprawdzona składnia plików JavaScript.

Automatyczny test Playwright w osobnym procesie nie uruchomił się z powodu odmowy uruchomienia przeglądarki; powyższe interakcje sprawdzono przez przeglądarkę aplikacji. Nie jest to pełny audyt dostępności ani test wysyłki wiadomości (demonstracja jej nie implementuje).

Publikacja Sites pozostała nieukończona: po rejestracji projektu katalog z wymaganym skryptem site-workflow.mjs przestał być dostępny. Identyfikator zachowano w .openai/hosting.json; ponowna publikacja powinna użyć tego samego projektu. Nie podłączono domeny użytkownika.

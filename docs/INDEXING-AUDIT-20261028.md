# Audyt indeksowania — 28.10.2026

Zakres: 27 adresów w sitemap, bieżący kod deployment/jdm-public oraz odczyt plików publicznych z JDM przez SSH. Audyt HTTP z GitHub Actions został zapisany w access-audit.json na gałęzi jdm-public-comparison dla wersji 3f261a9. Nie odczytywano prywatnej konfiguracji ani nie zmieniano reguł Cloudflare/JDM.

## Wyniki techniczne

- 27/27 adresów z sitemap odpowiedziało 200 w teście HTTP. W odpowiedziach nie występował X-Robots-Tag zabraniający indeksowania. To wynik z jednego źródła i chwili, nie historia dostępności Googlebota.
- W kodzie: index,follow, unikalne tytuły, dokładnie jeden prawidłowy canonical na podstronę, jedno H1. Wszystkie canonicale odpowiadają adresom sitemap.
- Artykuły są statycznym HTML, nie wymagają wykonania JS do odczytu treści. Nie są osierocone: mają linki HTML z bloga i/lub innych artykułów. Informacja GSC „nie wykryto strony odsyłającej” nie dowodzi braku linków w obecnym kodzie.
- Publiczny robots.txt zwrócił 200, text/plain. Zawierał komentarze o content signals, bez reguł Disallow. Na originie nie ma własnego robots.txt. Brak własnego pliku nie stanowi sam w sobie zakazu indeksowania.
- HTTP bez www i HTTPS bez www zwróciły 200 bez przekierowania do https://www.skupsrebragorzow.pl/. To niespójność wersji adresu; canonicale stanowią sygnał konsolidacji. Warto skonfigurować przekierowanie 301/308 do wersji głównej po sprawdzeniu istniejących reguł. Nie ustalono, że ta niespójność powoduje obecny status GSC.
- Wcześniejsze 403 nie powtórzyły się w bieżącym teście. Udany test Google Search Console dla artykułu o cenniku potwierdzał dostęp i możliwość indeksowania tego adresu. Nie dowodzi to dostępności wszystkich stron w przeszłości ani braku reguł zależnych od klienta.

## Treści

16 wcześniejszych artykułów ma 150–265 słów, nowy poradnik pielęgnacji ma 1952 słowa. Nie istnieje uniwersalna minimalna liczba słów wymagana do indeksacji. Problemem jest mała ilość informacji specyficznych dla tematu i powtarzane akapity, a nie sama długość.

Przykład: blog-aktualny-cennik-skupu-srebra.html zawiera 218 słów. Dwa końcowe akapity (55 i 52 słowa) są identyczne także w sześciu innych artykułach. Tylko część tekstu dotyczy bezpośrednio cennika. Inne pary mają zbliżony temat, np. granulat/sprzedaż granulatu, sztućce/wycena starych sztućców, złom biżuterii/pojedyncze przedmioty. Podobieństwo tematu nie oznacza automatycznie konieczności usunięcia strony.

Zalecenie: zastąpić wspólne akapity konkretnymi informacjami dla danego pytania, przykładami sposobu obliczeń z jawnie przykładowymi stawkami, ograniczeniami i praktyczną checklistą. Rozdzielić intencje zbliżonych tematów; łączyć dopiero rzeczywiście redundantne treści po wyborze docelowego adresu i przekierowaniach. Nie dodawać kolejnych powtórzeń fraz SEO ani nie wydłużać tekstów tylko dla liczby słów.

## Granice diagnozy i dalsze kroki

Status „wykryta — obecnie niezindeksowana” oznacza, że Google zna adres, ale nie ma w raporcie jego skanowania. Nie można na tej podstawie potwierdzić, że Google ocenił treść jako niskiej jakości. Bez danych Search Console i zweryfikowanych logów Googlebota nie da się ustalić dokładnej przyczyny ani terminu indeksacji.

Priorytety: poprawa oryginalnej wartości starszych artykułów; konsolidacja wariantów domeny i protokołu; obserwacja daty skanowania i statystyk indeksowania w GSC. Nie powtarzać bez końca próśb o indeksowanie. Nie obiecywać indeksacji po zmianach ani utożsamiać sukcesu live testu z obecnością w indeksie.

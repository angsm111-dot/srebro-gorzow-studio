# Porównanie SEO — 06.11.2026

Cel użytkownika: fraza „skup srebra Gorzów”. Zakres obejmuje publiczne HTML obu domen, odpowiedzi HTTP, sitemap, robots, przekierowania i kod własnej strony. Brak dostępu do Google Search Console, zweryfikowanych logów Googlebota i danych linkowych. Nie potwierdzono pozycji w Google ani liczby URL w indeksie. Nie należy utożsamiać liczby wpisów sitemap z liczbą zindeksowanych stron.

## Wyniki przed poprawkami

- Skupsrebragorzow.pl: 35 URL w sitemap. Bieżący audyt: wszystkie zwróciły HTTP 200; test 12 wariantów przekierowań zakończył się poprawnie. Brak wskazanej blokady noindex/canonical w 35 HTML. Strony mają statyczne treści i wewnętrzne linki.
- Srebrogorzow.pl przekierowuje do www.srebrogorzow.pl, sitemap zawiera 28 URL. To nie jest odczyt indeksu Google. Strona główna zwróciła 200.
- Obie witryny opisują SEZAM, Pocztowa 11, Gorzów Wielkopolski i telefon 601 775 146. Mają nakładającą się intencję lokalnej usługi. Google może wybierać jedną domenę dla danego zapytania; nie udowodniono przyczyny konkretnej pozycji. Nie stwierdzono „kary za duplikaty”.
- Druga strona zawierała wyraźne sekcje usługowe oraz WebSite/LocalBusiness. Na skupsrebragorzow.pl dominowały kalkulator, opinie i kurs, bez danych uporządkowanych firmy na stronie głównej. Sama obecność schema nie dowodzi przyczyny różnic rankingu.
- Siedem podstron deklarowało preload zdjęcia hero, którego nie wyświetlały: zbędne pobranie około 295 KB na takie wejście, zależnie od cache i decyzji przeglądarki. Nie wykonano pomiaru rzeczywistych Core Web Vitals.
- Statyczny HTML zawierał ceny i aktualizację z 04.10. Skrypt cen zastępował je po uruchomieniu, lecz HTML bez JS mógł prezentować je jako aktualne.

## Wprowadzone zmiany

1. Jednoznaczne H1 usługa/miasto i tytuł strony głównej; opis lokalizacji w hero.
2. Unikalna, widoczna sekcja o kategoriach srebra, przygotowaniu do oględzin, zasadach orientacyjnej wyceny oraz adresie i telefonie. Bez niepotwierdzonych obietnic cen, czasu obsługi czy bezpłatności.
3. Bezpośrednie linki do kontaktu, cennika, kalkulatora i trzech poradników z odpowiednimi intencjami.
4. WebSite/LocalBusiness na głównej i kontakcie, oparte na widocznych danych firmy. Bez fikcyjnego AggregateRating, godzin, współrzędnych ani gwarancji efektu SEO.
5. Własny robots.txt z deklaracją sitemap, bez zakazów. Dotychczasowy brak pliku nie był sam w sobie blokadą.
6. Usunięcie siedmiu zbędnych preloadów hero. Usunięcie historycznych cen/daty z początkowego HTML; zachowane bieżące API i identyfikatory elementów. Bez JS cennik kieruje do potwierdzenia ceny telefonicznie.
7. Przed publikacją walidator sprawdza również zgodność canonical z URL mapy i brak noindex.

## Walidacja

Przeglądarka Chromium/Playwright: 320, 390 i 1366 px; brak poziomego overflow, widoczny nowy tekst i schema, działający link do formularza kontaktowego. Z kontrolowaną odpowiedzią API sprawdzono wyświetlenie cen na głównej i cenniku oraz przejście ceny 925 do kalkulatora. Dane fixture nie są realnym kursem i nie zostały zapisane na stronie. Standardowe testy repo i 35 podstron przeszły. Nie testowano prawdziwej wysyłki wiadomości ani danych użytkownika.

## Dalsza diagnoza wymaga danych

W GSC dla każdej domeny: Skuteczność → zapytanie „skup srebra Gorzów”, rozbicie według stron, porównanie okresów oraz urządzeń; raport Strony z powodami wykluczeń i datami skanowania. Potrzebne są również dane wybranego przez Google canonical dla przykładowego URL. Ranking zależy także od lokalizacji, linków, historii domeny i profilu firmy; nie da się ich rzetelnie zastąpić dodawaniem kolejnych tekstów.

Nie łączono domen, nie zmieniano cross-domain canonical ani DNS. Decyzja o jednej głównej domenie dla tej samej usługi wymaga osobnego planu migracji i oceny obu działających witryn. Nie obiecywać terminu indeksowania ani pozycji po tych poprawkach.

## Korekta na polecenie użytkownika

Usunięto widoczny blok home-local-details („Wycena srebra na miejscu…”), ponieważ nie odpowiadał oczekiwanemu prostemu układowi strony głównej. Usunięto również jego dedykowany CSS. Pozostałe poprawki zachowano, w tym nagłówek, dane strukturalne, ochronę indeksowania, robots/sitemap, poprawki cen i liczbę ponad 300 opinii. Nie przywracać długiej sekcji SEO na stronie głównej bez wyraźnego polecenia. Przyczyna różnicy pozycji między domenami nadal nie została potwierdzona; konkurencja domen była hipotezą, nie ustaleniem.

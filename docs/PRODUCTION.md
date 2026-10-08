# Aktualna strona produkcyjna — 09.10.2026

Aktualne pliki do hostingu JDM znajdują się w deployment/jdm-public/. To jest wersja produkcyjna, a nie wcześniejszy podgląd z dist/ lub deployment/public/.

Adres główny: https://www.skupsrebragorzow.pl/
Tytuł: Skup Srebra w Gorzowie - sprawdź ofertę.

Osobne strony: index.html, co-kupujemy.html, cennik.html, wycena.html, wykres.html, faq.html, blog.html, kontakt.html i regulamin.html. Regulamin jest dostępny w stopce, nie w głównym menu. sitemap.xml zawiera wszystkie dziewięć adresów. Strony mają statyczną treść HTML, własne tytuły, opisy i adresy canonical. Menu wykorzystuje History API, aby zachować wycenę między widokami; bezpośrednie adresy również otwierają właściwą treść.

Skrypty z prefiksem studio- są nadal wymaganymi zasobami; nazwa pliku skryptu nie jest adresem podstrony. studio.html jest historycznym plikiem i nie należy go wysyłać przy nowej publikacji. Nie usuwaj plików studio-*.js ani CSS.

Wysyłka formularza: studio-contact-smtp-20261007.js i send-message-smtp-20261007.php, PHPMailer w vendor/phpmailer/. SMTP JDM, port 587, STARTTLS. Formularz wykorzystuje Cloudflare Turnstile i ograniczenie liczby prób. Hasło SMTP i klucz Turnstile NIE są w repozytorium. Katalog private-config na działającym serwerze musi pozostać nietknięty. Nie zastępuj jego plików kopiami z GitHub.

Ceny są pobierane przez ceny-live.php. Nie myl starej dokumentacji demonstracyjnej galerii z aktualnym działaniem produkcyjnym. Kopie galerii i wcześniejszych koncepcji są zachowane.

Ostatnia zmiana lokalna: podsumowanie wyceny jest opisane jako orientacyjne, bez określeń demonstracyjnych; okno Informacje o stronie ma aktualny opis formularza. Publikacja zmian wymaga ręcznego wgrania właściwych plików do /home/smxkojwd/public_html.

Google Search Console: własność prefiksu https://www.skupsrebragorzow.pl/ została potwierdzona. Użytkownik zgłosił główną do indeksowania i sitemap.xml. W chwili zapisu raport mapy nadal wskazywał błąd pobrania, mimo poprawnego XML, odpowiedzi 200 i pozytywnego testu dostępu Google. Nie prezentuj indeksacji ani odczytu mapy jako potwierdzonych.

Sprawdzenie kodu: node scripts/verify.mjs (odpowiednik npm test). Testy lokalne objęły dziewięć adresów, widoczną treść bez JavaScript, mobilne linki i historię, zachowanie koszyka oraz zerowanie. Nie zmieniaj działającej poczty przy poprawkach wyglądu.

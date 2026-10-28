# Aktualna strona produkcyjna — 09.10.2026

Aktualizacja 16.10.2026: przed pracą przeczytaj docs/STATIC-RUNTIME-20261016.md. Produkcja ma teraz zwykłe statyczne podstrony, 16 osobnych artykułów i politykę prywatności (26 adresów). Poniższy opis History API jest historyczny.

Aktualne pliki do hostingu JDM znajdują się w deployment/jdm-public/. To jest wersja produkcyjna, a nie wcześniejszy podgląd z dist/ lub deployment/public/.

Adres główny: https://www.skupsrebragorzow.pl/
Tytuł: Skup Srebra w Gorzowie - sprawdź ofertę.

Osobne strony: index.html, co-kupujemy.html, cennik.html, wycena.html, wykres.html, faq.html, blog.html, kontakt.html i regulamin.html. Regulamin jest dostępny w stopce, nie w głównym menu. sitemap.xml zawiera wszystkie dziewięć adresów. Strony mają statyczną treść HTML, własne tytuły, opisy i adresy canonical. Menu wykorzystuje History API, aby zachować wycenę między widokami; bezpośrednie adresy również otwierają właściwą treść.

Skrypty z prefiksem studio- są nadal wymaganymi zasobami; nazwa pliku skryptu nie jest adresem podstrony. studio.html jest historycznym plikiem i nie należy go wysyłać przy nowej publikacji. Nie usuwaj plików studio-*.js ani CSS.

Wysyłka formularza: studio-contact-smtp-20261007.js i send-message-smtp-20261007.php, PHPMailer w vendor/phpmailer/. SMTP JDM, port 587, STARTTLS. Formularz wykorzystuje Cloudflare Turnstile i ograniczenie liczby prób. Hasło SMTP i klucz Turnstile NIE są w repozytorium. Katalog private-config na działającym serwerze musi pozostać nietknięty. Nie zastępuj jego plików kopiami z GitHub.

Ceny są pobierane przez ceny-live.php. Nie myl starej dokumentacji demonstracyjnej galerii z aktualnym działaniem produkcyjnym. Kopie galerii i wcześniejszych koncepcji są zachowane.

Ostatnia zmiana lokalna: podsumowanie wyceny jest opisane jako orientacyjne, bez określeń demonstracyjnych; okno Informacje o stronie ma aktualny opis formularza. Publikacja zmian odbywa się automatycznie po push do main; konfigurację opisano poniżej.

Google Search Console: własność prefiksu https://www.skupsrebragorzow.pl/ została potwierdzona. Użytkownik zgłosił główną do indeksowania i sitemap.xml. W chwili zapisu raport mapy nadal wskazywał błąd pobrania, mimo poprawnego XML, odpowiedzi 200 i pozytywnego testu dostępu Google. Nie prezentuj indeksacji ani odczytu mapy jako potwierdzonych.

Sprawdzenie kodu: node scripts/verify.mjs (odpowiednik npm test). Testy lokalne objęły dziewięć adresów, widoczną treść bez JavaScript, mobilne linki i historię, zachowanie koszyka oraz zerowanie. Nie zmieniaj działającej poczty przy poprawkach wyglądu.

## Automatyczna publikacja GitHub → JDM

Push na `main`, który zmienia `deployment/jdm-public/`, uruchamia workflow **JDM — compare or deploy**. Aktualizacja konfiguracji publikacji też uruchamia wdrożenie. Ręczne `workflow_dispatch` nadal pozwala wybrać `compare` (bez zapisów) lub `deploy`. Wymagany sekret: `JDM_SSH_PASSWORD`.

Przed publikacją wykonywane są `npm test` oraz `python3 scripts/verify-production.py`: mapa strony, istnienie podstron, jedno H1 i lokalne linki/zasoby. Wysyłka przez SSH na `web15.jdm.pl:2233`, użytkownik `smxkojwd`, katalog `/home/smxkojwd/public_html/`. Zasoby idą przed HTML, a sitemap na końcu. Po publikacji rsync ponownie porównuje sumy kontrolne; niezgodność kończy zadanie błędem.

Nie kasuje się dodatkowych plików serwera ani nie zmienia ich uprawnień. Wykluczone: `private-config`, `.env*`, `.git`, PHP, `vendor`, pliki weryfikacyjne Google, historyczny `studio.html` i sześć dawnych skryptów różniących się od JDM, których aktualna strona nie ładuje. Dzięki temu publikowanie artykułów nie nadpisuje backendu cen, SMTP ani konfiguracji serwera. Zmiany PHP wymagają osobnego zadania i świadomej publikacji.

SSH stosuje `StrictHostKeyChecking=accept-new`: pierwszy klucz jest przyjmowany, zmiana zapamiętanego klucza odrzucana. Każdy nowy runner zaczyna bez klucza; możliwe przyszłe przypięcie zweryfikowanego klucza JDM. Wynik bieżącego wdrożenia jest zapisywany w `deployment.json` na osobnej gałęzi `jdm-deployment-status`; porównanie publicznych zasobów ma osobną gałąź `jdm-public-comparison`. Raport zawsze należy powiązać z SHA wdrażanej wersji.

Dodając artykuł: przygotuj jego HTML w `deployment/jdm-public/`, link na `blog.html` i wpis w `sitemap.xml`; sprawdź zasoby i publikuj commit na `main`. Nie odtwarzaj dawnych generatorów ukrytych sekcji. Po push sprawdź wynik Actions i dostępność adresu. Sukces sum kontrolnych potwierdza zapis plików, nie dostarczenie wiadomości, pobranie cen ani indeksację Google. W przypadku awarii nie zgłaszaj sukcesu publikacji.

## Błąd aktualizacji rsync i trwała poprawka — 28.10.2026

Przy aktualizacji istniejącego blog.html standardowa transmisja różnicowa kończyła się `failed verification -- update discarded` i kodem 23. Sam wybór MD5 nie rozwiązał problemu. W kontrolowanym teście na JDM odtworzono błąd aktualizacji różnicowej na kopii blog.html w osobnym katalogu /tmp. W tej samej sesji aktualizacja pełnego pliku powiodła się; lokalny i zdalny SHA-256 były identyczne. Klient zgłaszał rsync 3.2.7/protokół 31, serwer rsync 3.2.7/protokół 32. Jest to potwierdzony problem ścieżki różnicowej w tej kombinacji środowisk; dokładny defekt wewnętrzny serwerowej implementacji nie został ustalony.

W scripts/jdm-sync.sh **należy zachować `--whole-file`**: przesyłane są całe zmienione pliki, a nie bloki do rekonstrukcji. Pliki identyczne nadal są pomijane dzięki `--checksum`. Weryfikacja rsync jest włączona, a po publikacji ponownie porównuje się sumy. `--checksum-choice=md5` ustala wspólny algorytm rsync; transport chroni SSH. SHA-256 jest dodatkową, niezależną kontrolą w teście.

Przed każdym wdrożeniem scripts/test-jdm-transfer.sh sprawdza rzeczywistą aktualizację pliku w nowym katalogu tymczasowym poza public_html, odnotowuje wynik starego trybu i wymaga poprawnej aktualizacji whole-file z zgodnym SHA-256. Katalog testowy jest sprzątany. Oczekiwany błąd badanego trybu różnicowego nie jest uznawany za udany transfer; produkcja korzysta wyłącznie z whole-file. Tryb compare nie uruchamia testu z zapisami. scripts/test-jdm-sync.py sprawdza argumenty, wykluczenia, kolejność etapów i odrzucanie niezgodnej weryfikacji końcowej. Log testu zapisuje się w transfer-test.log na gałęzi jdm-deployment-status.

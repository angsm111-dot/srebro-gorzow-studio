# Statyczna wersja produkcyjna — 16.10.2026

Aktualny kod: deployment/jdm-public/. Paczka publikacyjna: deployment/static-release-20261016/. Zastępuje wcześniejszą paczkę blog-osobne-adresy-20261016.

Każdy HTML zawiera wyłącznie swoją treść. Nie ładuje dawnych studio-site.js, studio-pages-20261004.js ani studio-enhancements-20261004-price-contact.js. Stare pliki pozostają w projekcie jako kopia, nie są zależnościami nowej wersji.

Moduły: site-runtime-20261016.js (menu i ustawienia), site-prices-20261016.js (publiczne ceny co 5 minut), site-calculator-20261016.js (tylko główna i wycena), site-charts-20261016.js (tylko główna i wykres). studio-contact-smtp-20261007.js uruchamia się tylko w Kontakcie, więc Turnstile nie ładuje się na innych podstronach. Backend SMTP, hasło i klucz Turnstile nie zostały zmienione.

Wycena i przejściowy szkic wiadomości korzystają z sessionStorage danej karty. Odświeżenie czyści roboczy stan; przejścia między adresami zachowują go. Stan może być przywrócony przez funkcje przywracania sesji przeglądarki. Po udanej wysyłce szkic jest usuwany. Nie przechowuj w repo prawdziwych danych klientów.

Blog: 16 stron artykułów oraz lista blog.html. Treści edytujemy teraz w odpowiednich HTML. Stare generatory mają blokadę przed ponownym nadpisaniem statycznej wersji. W razie dodania artykułu trzeba przygotować jego plik, link na liście i wpis sitemap, a nie przywracać generatora ukrytych sekcji.

Polityka prywatności: polityka-prywatnosci.html, link w stopce i przy formularzu. Opisuje administratora, cele i podstawy, usługodawców, pamięć przeglądarki, prawa i skargę do Prezesa UODO. Nie jest zatwierdzeniem przez UODO ani certyfikatem zgodności. Okres przechowywania opisano kryteriami związanymi z obsługą sprawy i odpowiednimi obowiązkami; właściciel musi potwierdzić zgodność tych kryteriów z rzeczywistym postępowaniem w skrzynce i ustalić retencję z hostingiem. Nie dopisano arbitralnej liczby dni ani nie ustawiono automatycznego kasowania poczty.

Sitemap ma 26 adresów: 9 podstron, 16 artykułów, polityka prywatności. Publikacja: najpierw zasoby (JS, CSS, assets), następnie HTML, sitemap.xml na końcu. Nie wysyłać private-config, nie nadpisywać backendu SMTP ani pliku weryfikacyjnego Google.

Testy: 26 stron z jednym widocznym H1 i bez ukrytych sekcji; 26 stron bez JavaScript; działanie cennika i zakładek, kalkulatora i wykresów przy 320/390/1366 px; zachowanie wyceny między podstronami i czyszczenie po odświeżeniu; przekazanie podsumowania do Kontaktu; lokalny mock wysyłki SMTP (bez prawdziwego maila); Turnstile tylko w Kontakcie. node scripts/verify.mjs nadal sprawdza zachowaną galerię i podstawy kodu.


# Osobne adresy artykułów — 16.10.2026

Blog ma 16 osobnych plików HTML. Każdy zawiera pełny tekst bez JavaScript, własny tytuł, opis, canonical, zdjęcie, datę i dane BlogPosting. Lista blog.html zawiera zwykłe linki do artykułów zamiast przycisków rozwijania tekstu. Mapa sitemap.xml zawiera 25 adresów. Nie dodawano przekierowań ani nie zmieniano endpointów poczty.

Teksty i dotychczasowe daty publikacji zachowano. Artykuły korzystają z istniejących zdjęć w assets/. Podstrony korzystają z tych samych interaktywnych zasobów; blog jest ponownie renderowany przy powrocie z menu, aby nie pozostawał widok pojedynczego artykułu.

Generowanie: node scripts/build-blog-pages.cjs. Dane artykułów pozostają w studio-enhancements-20261004-price-contact.js. Po dodaniu nowych artykułów należy również dopisać ich unikalne articlePaths i zaktualizować kontrolę liczby w generatorze. Generator wymaga lokalnego narzędzia apply_patch z aplikacji Codex, nie dotyka prywatnych konfiguracji. dist/index.html nadal jest galerią i nie jest plikiem produkcyjnym.

Pliki artykułów:

- blog-aktualny-cennik-skupu-srebra.html
- blog-granulat-srebrny.html
- blog-monety-srebrne-wartosc.html
- blog-naczynia-srebro-czy-posrebrzanie.html
- blog-porownanie-wyceny-bizuterii.html
- blog-proba-925-bizuteria.html
- blog-przygotowanie-srebra-do-wyceny.html
- blog-skup-bizuterii-pojedyncze-przedmioty.html
- blog-sprzedaz-granulatu-srebrnego.html
- blog-srebrne-sztucce-zastawy.html
- blog-wspolna-wycena-srebra.html
- blog-wycena-starych-sztuccow.html
- blog-wycena-swiecznikow.html
- blog-wycena-sztabek-srebra.html
- blog-zatarta-punca-srebra.html
- blog-zlom-srebra-bizuteria.html

Publikacja ręczna: wgrać pliki ze specjalnie przygotowanego folderu deployment/blog-osobne-adresy-20261016/ do public_html. Najpierw nowe pliki blog-*.html, potem zasoby JS/CSS i bazowe HTML, a sitemap.xml na końcu. Folder nie zawiera haseł ani prywatnej konfiguracji.


# Weryfikacja pobierania i indeksowalności — 07.11.2026

## Aktualna strona

Audyt HTTP na żywo potwierdził „Ponad 300 opinii” oraz brak usuniętego bloku home-local-details. Nie zmieniano ponownie frontu. Mapa sitemap.xml: 200, text/xml, poprawny namespace urlset, 35 unikalnych adresów zgodnych z repozytorium. Wszystkie 35 odpowiedzi HTML: 200, jeden H1, canonical identyczny z adresem mapy, brak noindex w meta i X-Robots-Tag. Dwa losowe nieistniejące adresy: prawidłowe 404. Dwanaście testów przekierowań protokołu/domeny: poprawne. To potwierdza wynik z jednego klienta i chwili, a nie pełną historię dostępności każdego robota.

## Dostępne logi hostingu

Odczytano metadane access.log i czterech rotacji. W końcowej analizie około 1900 wpisów znaleziono 90 żądań z deklaracją Googlebot. 88 miało źródłowy adres IPv4 zgodny z aktualnymi, opublikowanymi przez Google zakresami Googlebot (170 zakresów). Weryfikacja odbyła się na hostingu; nie eksportowano adresów IP ani pełnych logów. Współdzielony/proxy log wymaga ostrożnej interpretacji hosta; raport dotyczy logów własnego konta i znanych publicznych ścieżek. IPv6 i nierozpoznane źródła nie są uznawane za zweryfikowane.

Zweryfikowane odpowiedzi: 69×200, 2×304, 16×404 i 1×499. Odpowiedzi 404 dotyczyły wyłącznie /robots.txt (03–06.11). Dla robots.txt odnotowano też 200 dnia 06.11 i 304 dnia 07.11. Brak robots.txt z odpowiedzią 404 nie jest sam w sobie zakazem indeksowania. Obecnie plik istnieje i deklaruje mapę.

Googlebot otrzymał 200 dla co najmniej **21 różnych publicznych adresów HTML** z dozwolonej listy, m.in. strony głównej, kontaktu, cennika, FAQ, wyceny, wykresu, bloga i kilku nowych poradników. Dla artykułu o popularnych monetach bulionowych oraz o aktualnym cenniku zapisano udane pobrania 06.11. Dla sitemap.xml zapisano 200 dnia 03.11. Brak późniejszego wpisu w logach originu nie wyklucza pobrania obsłużonego z cache Cloudflare. Jeden 499 oznacza przerwanie połączenia przez klienta; nie przypisano go żadnej konkretnej stronie i nie stanowi dowodu ogólnej blokady.

**Wniosek:** liczba URL zaindeksowanych w GSC nie odpowiada liczbie stron, które Google zdołał pobrać. Obecne dowody przeczą tezie, że serwer pozwala pobrać tylko około siedmiu stron. Nie dowodzą jednak, dlaczego Google wybiera do indeksu określony podzbiór ani czy raport GSC jest aktualny.

## Ograniczenia i kolejny potrzebny dowód

Do rozstrzygnięcia: aktualny raport konkretnego wykluczonego URL w Search Console — dokładny powód, data ostatniego skanowania, canonical wskazany i wybrany przez Google, data raportu. Odpowiedź użytkownika potwierdziła ogólnie wykrycie URL i małą liczbę indeksacji, bez bieżącego szczegółowego raportu. Nie ma podstaw do wymuszania kolejnych zmian wyglądu, przekierowań ani hurtowego przepisywania artykułów.

Nowa umiejętność cloud-desktop jest dostępna instrukcyjnie, ale dla środowiska ccarenv_b64_Y2NhcmVudl84YjdmOGM1MzljYjg4MTkxYmIzY2U2NTVmYjlmYTdhZQ status podał capabilities=[]; brak narzędzia cua_repl.js lub odpowiednika i brak celu cloud-desktop w open_in_codex. Nie uzyskano dostępu do zalogowanej Search Console. Nie twierdzić, że odczytano prywatny raport Google.

## Ochrona danych

Automatyczna kontrola odrzuciła transfer pełnych access logs do runnera. Zastosowano bezpieczniejszy wariant: skrypt awk działa bezpośrednio na hostingu, weryfikuje IP względem przesłanych publicznych zakresów Google i zwraca tylko liczniki, dni oraz ścieżki z wcześniej zatwierdzonej publicznej listy. Pozostałe ścieżki są grupowane. Brak adresów IP, parametrów URL, refererów i surowych user agentów w raporcie. Nie obchodzić tej ochrony ani nie zapisywać surowych logów w repozytorium. Automatyczna kontrola zaakceptowała wariant serwerowy.

(() => {
  const API = '/ceny-live.json?site=silver';
  const format = value => new Intl.NumberFormat('pl-PL', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Number(value));
  const dateTime = value => new Intl.DateTimeFormat('pl-PL', {dateStyle: 'short', timeStyle: 'short'}).format(new Date(value));

  function useLivePrices(payload) {
    const silver = payload?.metals?.silver;
    if (!silver?.purities) throw new Error('Panel nie zwrócił cennika srebra.');
    window.silverLivePrices = Object.fromEntries(Object.entries(silver.purities).map(([purity, item]) => [purity, Number(item.price)]));
    window.silverLiveProducts = {coins: payload.products?.silverCoins || [], bars: payload.products?.silverBars || []};
    const purities = Object.keys(window.silverLivePrices).map(Number).sort((a, b) => b - a);
    ['purity', 'quick-purity'].forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      const chosen = field.value;
      field.replaceChildren(...purities.map(purity => new Option(id === 'quick-purity' ? `Próba ${purity}` : purity, purity, false, String(purity) === chosen)));
      if (!field.value) field.value = purities.includes(925) ? '925' : String(purities[0]);
    });

    const p999 = window.silverLivePrices['999'];
    const bar = document.getElementById('silver-rate-bar');
    if (bar) bar.innerHTML = `Cena skupu srebra 999: <strong>${format(p999)} zł / g</strong> <span aria-hidden="true">•</span> aktualizacja: ${dateTime(payload.fetchedAt)}`;
    const heading = document.getElementById('base-price');
    if (heading) heading.textContent = `${format(p999)} zł / g`;

    const rows = document.getElementById('price-rows');
    if (rows) {
      rows.innerHTML = Object.entries(window.silverLivePrices).sort(([a], [b]) => Number(b) - Number(a)).map(([purity, price]) => `<tr><td><b>${purity}</b></td><td>${format(Number(purity) / 10)}%</td><td>${format(price)} zł</td><td><button class="text-button" type="button" data-live-price="${purity}">Wyceń</button></td></tr>`).join('');
      rows.querySelectorAll('[data-live-price]').forEach(button => button.addEventListener('click', () => {
        configureCategory('scrap');
        document.getElementById('purity').value = button.dataset.livePrice;
        updateCalc();
        if (typeof studioNavigate === 'function') studioNavigate('kalkulator');
      }));
    }

    document.querySelectorAll('.demo-tag').forEach(tag => { tag.textContent = 'Ceny ze wspólnego panelu'; });
    const intro = document.querySelector('.pricing-intro > p');
    if (intro) intro.innerHTML = 'Aktualna stawka skupu<br>za gram srebra próby 999.';
    const caption = document.querySelector('#cennik caption');
    if (caption) caption.textContent = 'Aktualny cennik srebra';
    const basketTitle = document.querySelector('.basket-total > span');
    if (basketTitle) basketTitle.textContent = 'Łączna orientacyjna wycena';
    const quickDescription = document.querySelector('.quick-heading > p');
    if (quickDescription) quickDescription.textContent = 'Szybka wycena według aktualnego cennika.';
    const quickLabel = document.querySelector('.quick-total > small');
    if (quickLabel) quickLabel.textContent = 'Wartość orientacyjna';
    const note = document.querySelector('#cennik > .small-note');
    if (note) note.textContent = `Cennik jest połączony ze wspólnym panelem cen. Ostatnia aktualizacja: ${dateTime(payload.fetchedAt)}. Ostateczna oferta wymaga weryfikacji produktu.`;
    document.querySelector('#cennik .section-head > p').innerHTML = 'Aktualne stawki pobierane ze wspólnego panelu.<br>Ten cennik zasila kalkulator.';
    quickValue();
    updateCalc();
    document.body.dataset.prices = 'live';
  }

  async function loadPrices() {
    try {
      const response = await fetch(API, {cache: 'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      useLivePrices(await response.json());
    } catch (error) {
      console.warn('Nie udało się pobrać cen ze wspólnego panelu.', error);
      const bar = document.getElementById('silver-rate-bar');
      if (bar) bar.textContent = 'Cennik chwilowo niedostępny — pokazujemy ceny zapasowe.';
      document.body.dataset.prices = 'fallback';
    }
  }

  loadPrices();
  window.setInterval(loadPrices, 300000);
})();

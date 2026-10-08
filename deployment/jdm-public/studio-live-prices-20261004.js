(() => {
  // Na hostingu JDM pobieramy dane przez lokalny mostek PHP. Dzięki temu
  // przeglądarka nie blokuje odpowiedzi panelu cen jako połączenia z obcej domeny.
  const API = '/ceny-live.php?site=silver';
  document.body.dataset.prices = 'loading';
  // Nie pokazujemy zapasowego, demonstracyjnego cennika w trakcie pobierania.
  document.querySelector('#cennik caption')?.remove();
  document.querySelectorAll('#cennik .demo-tag').forEach(tag => tag.remove());
  document.getElementById('price-rows')?.replaceChildren();
  const initialIntro = document.querySelector('.pricing-intro > p');
  if (initialIntro) initialIntro.textContent = 'Aktualne ceny skupu srebra.';
  const initialHeading = document.querySelector('#cennik .section-head > p');
  if (initialHeading) initialHeading.textContent = 'Aktualne stawki dla popularnych prób srebra.';
  const initialChartPrice = document.getElementById('chart-last');
  if (initialChartPrice) initialChartPrice.textContent = '—';
  const initialBasePrice = document.getElementById('base-price');
  if (initialBasePrice) initialBasePrice.textContent = '—';
  const format = value => new Intl.NumberFormat('pl-PL', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Number(value));
  const dateTime = value => new Intl.DateTimeFormat('pl-PL', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'}).format(new Date(value));

  let nextPriceRefresh = Date.now() + 300000;
  function updateHomeStatus() {
    const change = Number(window.silverMarket?.change);
    const badge = document.querySelector('[data-home-change]');
    if (badge && Number.isFinite(change)) {
      badge.className = 'home-rate-change ' + (change >= 0 ? 'up' : 'down');
      badge.textContent = (change >= 0 ? '▲ ' : '▼ ') + format(Math.abs(change)) + '%';
    }
    const countdown = document.querySelector('[data-home-countdown]');
    const seconds = Math.max(0, Math.ceil((nextPriceRefresh - Date.now()) / 1000));
    if (countdown) countdown.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  }
  function updateHomePrices() {
    document.querySelectorAll('[data-home-purity]').forEach(field => {
      const price = window.silverLivePrices?.[field.dataset.homePurity];
      field.textContent = Number.isFinite(price) ? format(price) + ' zł/g' : '—';
    });
  }

  // Ostatnio potwierdzone stawki są widoczne od razu. Aktualne dane z panelu
  // zastępują je w tle, dzięki czemu tabela nie czeka na odpowiedź sieciową.
  const bootstrap = {fetchedAt: '2026-10-03T22:00:32.684Z', spot: 7.56, change: -0.02333, purities: {600: 2.27, 800: 3.02, 830: 3.14, 835: 3.16, 875: 3.31, 900: 3.40, 925: 4.20, 960: 4.72, 999: 6.04}};
  const bootstrapProducts = {coins: [{id:'silver-krugerrand-1oz',name:'Krugerrand 1 oz',purity:999.9,grossWeight:31.1,price:223.39},{id:'silver-philharmonic-1oz',name:'Filharmonik 1 oz',purity:999.9,grossWeight:31.1,price:223.39},{id:'silver-maple-leaf-1oz',name:'Kanadyjski Liść Klonowy 1 oz',purity:999.9,grossWeight:31.1,price:223.39},{id:'silver-britannia-1oz',name:'Brytyjska Britannia 1 oz',purity:999.9,grossWeight:31.1,price:223.39},{id:'silver-american-eagle-1oz',name:'Amerykański Orzeł 1 oz',purity:999.9,grossWeight:31.1,price:223.39},{id:'silver-kangaroo-1oz',name:'Australijski Kangur 1 oz',purity:999.9,grossWeight:31.1,price:223.39},{id:'silver-lunar-2oz',name:'Australijski Lunar 2 oz',purity:999.9,grossWeight:62.21,price:446.79},{id:'silver-kookaburra-1kg',name:'Australijska Kookaburra 1 kg',purity:999.9,grossWeight:1000,price:6842.12},{id:'custom-silver-coin-1oz',name:'Inne monety 1 uncja',purity:999.9,grossWeight:31.1,price:223.39},{id:'custom-silver-coin-2oz',name:'Inne monety 2 uncje',purity:999.9,grossWeight:62.2,price:423.20},{id:'custom-silver-coin-1kg',name:'Inne monety 1 kg',purity:999.9,grossWeight:1000,price:6842.12}],bars: [{id:'silver-bar-31g',name:'Sztabka 1 uncja',purity:999.9,grossWeight:31.1,price:211.64},{id:'silver-bar-50g',name:'Sztabka 50 g',purity:999.9,grossWeight:50,price:338.36},{id:'silver-bar-100g',name:'Sztabka 100 g',purity:999.9,grossWeight:100,price:680.43},{id:'silver-bar-250g',name:'Sztabka 250 g',purity:999.9,grossWeight:250,price:1644.41},{id:'silver-bar-500g',name:'Sztabka 500 g',purity:999.9,grossWeight:500,price:3288.75},{id:'silver-bar-1000g',name:'Sztabka 1 kg',purity:999.9,grossWeight:1000,price:6577.51}]};
  function showBootstrap() {
    window.silverLivePrices = {...bootstrap.purities};
    window.silverLiveProducts = bootstrapProducts;
    updateHomePrices();
    window.silverMarket = {spot: bootstrap.spot, change: bootstrap.change, fetchedAt: bootstrap.fetchedAt};
    const up = bootstrap.change >= 0;
    const bar = document.getElementById('silver-rate-bar');
    if (bar) bar.innerHTML = `<span class="rate-label">Kurs srebra</span><strong>${format(bootstrap.spot)} zł/g</strong><span class="rate-change ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${format(Math.abs(bootstrap.change))}%</span><span class="rate-time">aktualizacja: ${dateTime(bootstrap.fetchedAt)}</span>`;
    const heading = document.getElementById('base-price');
    if (heading) heading.textContent = `${format(bootstrap.purities[999])} zł / g`;
    const rows = document.getElementById('price-rows');
    if (rows) rows.innerHTML = Object.entries(bootstrap.purities).sort(([a], [b]) => Number(a) - Number(b)).map(([purity, price]) => `<tr><td><b>${purity}</b></td><td>${format(Number(purity) / 10)}%</td><td>${format(price)} zł</td><td><button class="text-button" type="button" data-live-price="${purity}">Wyceń</button></td></tr>`).join('');
  }
  showBootstrap();

  function useLivePrices(payload) {
    const silver = payload?.metals?.silver;
    if (!silver?.purities) throw new Error('Panel nie zwrócił cennika srebra.');
    window.silverLivePrices = Object.fromEntries(Object.entries(silver.purities).map(([purity, item]) => [purity, Number(item.price)]));
    updateHomePrices();
    window.silverLiveProducts = {coins: payload.products?.silverCoins || [], bars: payload.products?.silverBars || []};
    if (typeof presets !== 'undefined') {
      const toPreset = (item, fallback) => {const purity=Number(item.purity)>=999?999:Math.round(Number(item.purity)),weight=Number(item.grossWeight)===31.1?'31.10':Number(item.grossWeight);return [item.id || fallback, `${item.name} · próba ${String(item.purity).replace('.',',')}`,weight,purity,Number(item.price)];};
      presets.coins = window.silverLiveProducts.coins.map((item, i) => toPreset(item, `coin-${i}`)).concat([['custom','Własna moneta — podaj parametry',null,null]]);
      presets.bars = window.silverLiveProducts.bars.map((item, i) => toPreset(item, `bar-${i}`)).concat([['custom','Własna sztabka — podaj parametry',null,null]]);
      if (typeof kind !== 'undefined' && typeof configureCategory === 'function' && (kind === 'coins' || kind === 'bars')) configureCategory(kind);
    }
    const purities = Object.keys(window.silverLivePrices).map(Number).sort((a, b) => a - b);
    ['purity', 'quick-purity'].forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      const chosen = field.value;
      field.replaceChildren(...purities.map(purity => new Option(id === 'quick-purity' ? `Próba ${purity === 999 ? '999,9' : purity}` : purity === 999 ? '999,9' : purity, purity, false, String(purity) === chosen)));
      if (!field.value) field.value = purities.includes(925) ? '925' : String(purities[0]);
    });

    const p999 = window.silverLivePrices['999'];
    window.silverMarket = {spot: Number(silver.spot), change: Number(silver.change), fetchedAt: payload.fetchedAt};
    const bar = document.getElementById('silver-rate-bar');
    if (bar) { const up = Number(silver.change) >= 0; bar.className = 'demo silver-rate-bar'; bar.innerHTML = `<span class="rate-label">Kurs srebra</span><strong>${format(silver.spot)} zł/g</strong><span class="rate-change ${up?'up':'down'}">${up?'▲':'▼'} ${format(Math.abs(silver.change))}%</span><span class="rate-time">aktualizacja: ${dateTime(payload.fetchedAt)}</span>`; }
    const heading = document.getElementById('base-price');
    if (heading) heading.textContent = `${format(p999)} zł / g`;

    const rows = document.getElementById('price-rows');
    if (rows) {
      rows.innerHTML = Object.entries(window.silverLivePrices).sort(([a], [b]) => Number(a) - Number(b)).map(([purity, price]) => `<tr><td><b>${purity}</b></td><td>${format(Number(purity) / 10)}%</td><td>${format(price)} zł</td><td><button class="text-button" type="button" data-live-price="${purity}">Wyceń</button></td></tr>`).join('');
      rows.querySelectorAll('[data-live-price]').forEach(button => button.addEventListener('click', () => {
        configureCategory('scrap');
        document.getElementById('purity').value = button.dataset.livePrice;
        updateCalc();
        if (typeof studioNavigate === 'function') studioNavigate('kalkulator');
      }));
    }

    document.querySelectorAll('#cennik .demo-tag').forEach(tag => tag.remove());
    const intro = document.querySelector('.pricing-intro > p');
    if (intro) intro.innerHTML = 'Aktualna stawka skupu<br>za gram srebra próby 999.';
    const caption = document.querySelector('#cennik caption');
    if (caption) caption.remove();
    const basketTitle = document.querySelector('.basket-total > span');
    if (basketTitle) basketTitle.textContent = 'Łączna orientacyjna wycena';
    const quickDescription = document.querySelector('.quick-heading > p');
    if (quickDescription) quickDescription.textContent = 'Szybka wycena według aktualnego cennika.';
    const quickLabel = document.querySelector('.quick-total > small');
    if (quickLabel) quickLabel.textContent = 'Wartość orientacyjna';
    const note = document.querySelector('#cennik > .small-note');
    if (note) note.remove();
    document.querySelector('#cennik .section-head > p').innerHTML = 'Aktualne stawki dla popularnych prób srebra.';
    quickValue();
    updateCalc();
    document.body.dataset.prices = 'live';
    document.dispatchEvent(new CustomEvent('silver-prices-ready', {detail: payload}));
  }

  async function loadPrices() {
    nextPriceRefresh = Date.now() + 300000;
    try {
      const response = await fetch(API, {cache: 'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      useLivePrices(await response.json());
    } catch (error) {
      console.warn('Nie udało się pobrać cen ze wspólnego panelu.', error);
      document.body.dataset.prices = 'cached';
    }
  }

  loadPrices();
  window.setInterval(loadPrices, 300000);
  updateHomeStatus();
  window.setInterval(updateHomeStatus, 1000);
})();

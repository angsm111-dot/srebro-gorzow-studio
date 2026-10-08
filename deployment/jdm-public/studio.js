document.body.className='studio';
document.title='Silver Studio — skup srebra w Gorzowie';
document.querySelector('h1').innerHTML='Odkryj wartość<br><em>swojego srebra.</em>';
document.querySelector('.hero-copy>p').textContent='Biżuteria, monety, sztabki i srebro użytkowe. Poznaj orientacyjną wartość swoich przedmiotów i przygotuj je do wyceny w Gorzowie.';
document.querySelector('.hero-meta').innerHTML='<span>SREBRO ŁĄCZY POKOLENIA</span>';
document.querySelector('.hero .eyebrow').textContent='GORZÓW WIELKOPOLSKI';
document.querySelector('.offer h2').innerHTML='Srebro w wielu formach.';

const quick=document.createElement('form');
quick.className='quick-quote wrap';
quick.noValidate=true;
quick.setAttribute('aria-label','Szybka wycena srebra');
quick.innerHTML='<div class="quick-heading"><h2>Kalkulator srebra</h2><p>Szybka, demonstracyjna wycena.</p></div><label>Waga (g)<input id="quick-weight" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" placeholder="Wpisz wagę"></label><label>Próba<select id="quick-purity"><option value="" disabled>Wybierz próbę srebra</option><option value="999">Próba 999</option><option value="925" selected>Próba 925</option><option value="900">Próba 900</option><option value="875">Próba 875</option><option value="835">Próba 835</option><option value="830">Próba 830</option><option value="800">Próba 800</option></select></label><div class="quick-total"><small>Wartość orientacyjna</small><output id="quick-result" aria-live="polite">Wpisz wagę</output></div><button class="button primary">Pełna wycena</button><p class="quick-error" id="quick-error" role="alert" hidden></p>';
document.querySelector('.hero').after(quick);

const qw=document.getElementById('quick-weight');
const qp=document.getElementById('quick-purity');
const qe=document.getElementById('quick-error');
const qr=document.getElementById('quick-result');
function quickValue(){
  if(!qw.value.trim()){qr.textContent='Wpisz wagę';qe.hidden=true;return null;}
  try{const value=calculate('scrap',Number(qw.value),Number(qp.value),1,0);qr.textContent=money(value.value);qe.hidden=true;return value;}
  catch(error){qr.textContent='—';qe.textContent=error.message;qe.hidden=false;return null;}
}
qw.addEventListener('input',quickValue);
qp.addEventListener('change',quickValue);
quick.addEventListener('submit',event=>{
  event.preventDefault();
  if(!quickValue())return;
  configureCategory('scrap');
  document.getElementById('weight').value=qw.value;
  document.getElementById('purity').value=qp.value;
  updateCalc();
  document.getElementById('kalkulator').scrollIntoView({behavior:'smooth'});
  document.getElementById('weight').focus({preventScroll:true});
});
quickValue();

const menu=document.getElementById('menu-toggle');
const navigation=document.getElementById('nav');
function menuState(open,returnFocus=false){
  navigation.classList.toggle('open',open);
  menu.setAttribute('aria-expanded',String(open));
  menu.innerHTML='<span class="menu-icon" aria-hidden="true"><i></i><i></i></span>'+(open?'Zamknij':'Menu');
  if(returnFocus)menu.focus();
}
menuState(false);
menu.onclick=event=>{event.stopPropagation();menuState(menu.getAttribute('aria-expanded')!=='true');};
navigation.querySelectorAll('a').forEach(link=>link.onclick=()=>menuState(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')menuState(false,true);});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))menuState(false);});
matchMedia('(min-width:801px)').addEventListener('change',()=>menuState(false));

const mobile=document.createElement('div');
mobile.className='mobile-cta';
mobile.innerHTML='<span>Poznaj wartość<br>swojego srebra</span><a class="button primary" href="#kalkulator">Wyceń srebro</a>';
document.body.append(mobile);

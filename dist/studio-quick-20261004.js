document.body.className='studio';
document.title='Skup Srebra w Gorzowie - sprawdź ofertę';
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
mobile.innerHTML='<a class="button primary mobile-call" href="tel:+48601775146">ZADZWOŃ</a><a class="button whatsapp-button" href="https://wa.me/48601775146" target="_blank" rel="noopener"><svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16 3A13 13 0 0 0 4.7 22.4L3 29l6.8-1.8A13 13 0 1 0 16 3Zm0 23.5a10.5 10.5 0 0 1-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4A10.5 10.5 0 1 1 16 26.5Zm5.9-7.9-2.2-1c-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a9 9 0 0 1-4.3-3.7c-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-1-2.3c-.3-.6-.5-.6-.7-.6h-.6c-.3 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.1.2 2.2 3.5 5.4 4.9 2.1.9 3 .8 3.8.8.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.4Z"/></svg>WHATSAPP</a>';
document.body.append(mobile);

const studioPages={start:'Strona główna',oferta:'Oferta',kalkulator:'Wycena srebra',cennik:'Cennik',wykres:'Wykres srebra',faq:'Pytania i odpowiedzi',kontakt:'Kontakt'};
const studioMain=document.querySelector('main');
const breadcrumb=document.createElement('nav');
breadcrumb.className='page-breadcrumb wrap';
breadcrumb.setAttribute('aria-label','Ścieżka strony');
studioMain.before(breadcrumb);

const intro=document.createElement('div');
intro.className='home-links wrap';
intro.innerHTML='<a href="studio.html?page=oferta"><span>01 / OFERTA</span><h2>Zobacz co można sprzedać</h2><p>Biżuteria, monety, sztabki i srebro użytkowe.</p></a><a href="studio.html?page=cennik"><span>02 / CENNIK</span><h2>Sprawdź aktualny cennik online</h2><p>Porównaj stawki dla popularnych prób srebra.</p></a><a href="studio.html?page=kontakt"><span>03 / KONTAKT</span><h2>Masz pytanie?</h2><p>Przygotuj zapytanie lub sprawdź kontakt do punktu.</p></a>';
quick.after(intro);

const reviews=document.createElement('section');
reviews.className='google-reviews wrap';
reviews.innerHTML='<div class="google-review-card"><div><span class="google-word" aria-label="Google"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span><h2>Opinie Google</h2><p>Tu pojawią się opinie klientów po podłączeniu wizytówki firmy w Google.</p><span class="google-review-note">Sekcja informacyjna — bez pobierania ani tworzenia opinii.</span></div><div class="review-stars" aria-label="Miejsce na ocenę Google">★★★★★</div></div>';
intro.after(reviews);

document.querySelectorAll('.header nav,.footer-top nav').forEach(nav=>{
  nav.innerHTML=Object.entries(studioPages).map(([id,label])=>`<a href="studio.html?page=${id}" data-page="${id}">${id==='start'?'Start':id==='kalkulator'?'Wycena':id==='wykres'?'Wykres':id==='faq'?'FAQ':label}</a>`).join('');
});
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  const target=link.getAttribute('href').slice(1);
  link.href='studio.html?page='+(studioPages[target]?target:'start');
});

function studioNavigate(page,push=true,focus=true){
  if(!studioPages[page])page='start';
  if(push)history.pushState({page},'',`studio.html?page=${page}`);
  document.body.dataset.page=page;
  document.querySelector('.hero').hidden=page!=='start';
  quick.hidden=page!=='start';
  intro.hidden=page!=='start';
  reviews.hidden=page!=='start';
  document.querySelectorAll('#content>section').forEach(section=>section.hidden=section.id!==page);
  document.querySelectorAll('[data-page]').forEach(link=>{if(link.dataset.page===page)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  breadcrumb.hidden=page==='start';
  breadcrumb.innerHTML=`<a href="studio.html?page=start">Strona główna</a><span aria-hidden="true">/</span><span>${studioPages[page]}</span>`;
  document.title=studioPages[page]+' — Srebro / Gorzów';
  document.querySelectorAll('#content .section-head h1').forEach(h=>{const next=document.createElement('h2');next.innerHTML=h.innerHTML;h.replaceWith(next);});
  const title=document.querySelector(`#${page} .section-head h2`) || (page==='faq'?document.querySelector('#faq h2'):null);
  if(title){const h=document.createElement('h1');h.innerHTML=title.innerHTML.replace(/<br\s*\/?\s*>/gi,' ');title.replaceWith(h);}
  menuState(false);
  window.scrollTo({top:0,behavior:'instant'});
  if(page==='wykres')drawChart();
  if(focus){const heading=page==='start'?document.querySelector('.hero h1'):document.querySelector(`#${page} h1`);if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
  mobile.hidden=page==='kalkulator';
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a');
  if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  const url=new URL(link.href,location.href);
  if(url.origin===location.origin&&url.pathname.endsWith('/studio.html')&&url.searchParams.has('page')){event.preventDefault();studioNavigate(url.searchParams.get('page'));}
});
window.addEventListener('popstate',()=>studioNavigate(new URLSearchParams(location.search).get('page')||'start',false));
quick.addEventListener('submit',()=>{if(quickValue())studioNavigate('kalkulator');});
document.querySelectorAll('[data-category],[data-price]').forEach(button=>button.addEventListener('click',()=>studioNavigate('kalkulator')));
document.getElementById('ask-quote').addEventListener('click',()=>studioNavigate('kontakt'));
studioNavigate(new URLSearchParams(location.search).get('page')||'start',false,false);

// Separate addressable views; keep the quotation in memory while navigating.
const studioPages={start:'Strona główna',oferta:'Oferta',kalkulator:'Wycena srebra',cennik:'Cennik',wykres:'Wykres srebra',faq:'Pytania i odpowiedzi',kontakt:'Kontakt'};
const studioMain=document.querySelector('main');
const breadcrumb=document.createElement('nav');breadcrumb.className='page-breadcrumb wrap';breadcrumb.setAttribute('aria-label','Ścieżka strony');studioMain.before(breadcrumb);
const intro=document.createElement('div');intro.className='home-links wrap';intro.innerHTML='<a href="studio.html?page=oferta"><span>01 / OFERTA</span><h2>Co chcesz sprzedać?</h2><p>Monety, sztabki, biżuteria i srebro użytkowe.</p></a><a href="studio.html?page=cennik"><span>02 / CENNIK</span><h2>Poznaj stawki</h2><p>Porównaj przykładowe ceny dla różnych prób.</p></a><a href="studio.html?page=kontakt"><span>03 / KONTAKT</span><h2>Porozmawiajmy</h2><p>Sprawdź dane punktu i przygotuj zapytanie.</p></a>';quick.after(intro);
document.querySelectorAll('.header nav,.footer-top nav').forEach(nav=>{nav.innerHTML=Object.entries(studioPages).map(([id,label])=>`<a href="studio.html?page=${id}" data-page="${id}">${id==='start'?'Start':id==='kalkulator'?'Wycena':id==='wykres'?'Wykres':id==='faq'?'FAQ':label}</a>`).join('');});
document.querySelectorAll('a[href^="#"]').forEach(a=>{const target=a.getAttribute('href').slice(1);a.href='studio.html?page='+(studioPages[target]?target:'start');});
function studioNavigate(page,push=true,focus=true){
  if(!studioPages[page])page='start';
  if(push)history.pushState({page},'',`studio.html?page=${page}`);
  document.body.dataset.page=page;
  document.querySelector('.hero').hidden=page!=='start';quick.hidden=page!=='start';intro.hidden=page!=='start';
  document.querySelectorAll('#content>section').forEach(section=>section.hidden=section.id!==page);
  document.querySelectorAll('[data-page]').forEach(a=>{if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  breadcrumb.hidden=page==='start';breadcrumb.innerHTML=`<a href="studio.html?page=start">Strona główna</a><span aria-hidden="true">/</span><span>${studioPages[page]}</span>`;
  document.title=studioPages[page]+' — Srebro / Gorzów';
  document.querySelectorAll('#content .section-head h1').forEach(h=>{const n=document.createElement('h2');n.innerHTML=h.innerHTML;h.replaceWith(n);});
  const title=document.querySelector(`#${page} .section-head h2`) || (page==='faq'?document.querySelector('#faq h2'):null);
  if(title){const h=document.createElement('h1');h.innerHTML=title.innerHTML.replace(/<br\s*\/?\s*>/gi," ");title.replaceWith(h);}
  menuState(false);window.scrollTo({top:0,behavior:'instant'});
  if(page==='wykres')drawChart();
  if(focus){const heading=page==='start'?document.querySelector('.hero h1'):document.querySelector(`#${page} h1`);if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
  mobile.hidden=page==='kalkulator';
}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;const url=new URL(a.href,location.href);if(url.origin===location.origin&&url.pathname.endsWith('/studio.html')&&url.searchParams.has('page')){e.preventDefault();studioNavigate(url.searchParams.get('page'));}});
window.addEventListener('popstate',()=>studioNavigate(new URLSearchParams(location.search).get('page')||'start',false));
quick.addEventListener('submit',()=>{if(quickValue())studioNavigate('kalkulator');});
document.querySelectorAll('[data-category],[data-price]').forEach(button=>button.addEventListener('click',()=>studioNavigate('kalkulator')));
document.getElementById('ask-quote').addEventListener('click',()=>studioNavigate('kontakt'));
studioNavigate(new URLSearchParams(location.search).get('page')||'start',false,false);

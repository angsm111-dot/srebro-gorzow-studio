const studioPages={start:'Strona główna',oferta:'Co kupujemy',kalkulator:'Wycena srebra',cennik:'Cennik',wykres:'Wykres srebra',faq:'Pytania i odpowiedzi',blog:'Blog',kontakt:'Kontakt',regulamin:'Regulamin'};
const studioPaths={start:'/',oferta:'/co-kupujemy.html',kalkulator:'/wycena.html',cennik:'/cennik.html',wykres:'/wykres.html',faq:'/faq.html',blog:'/blog.html',kontakt:'/kontakt.html',regulamin:'/regulamin.html'};
function studioCurrentPage(){return Object.keys(studioPaths).find(key=>studioPaths[key]===location.pathname)||new URLSearchParams(location.search).get('page')||document.body.dataset.initialPage||'start';}
const studioMain=document.querySelector('main');
const breadcrumb=document.createElement('nav');
breadcrumb.className='page-breadcrumb wrap';
breadcrumb.setAttribute('aria-label','Ścieżka strony');
studioMain.before(breadcrumb);

const intro=document.createElement('div');
intro.className='home-links wrap';
intro.innerHTML='<a href="/co-kupujemy.html"><span>OFERTA</span><h2>Zobacz co można sprzedać</h2><p>Biżuteria, monety, sztabki, sztućce, zastawy, granulat i srebro użytkowe.</p></a><a href="/cennik.html"><span>CENNIK</span><h2>Sprawdź aktualny cennik online</h2><p>Porównaj stawki dla popularnych prób srebra.</p></a><a href="/kontakt.html"><span>KONTAKT</span><h2>Masz pytanie?</h2><p>Przygotuj zapytanie lub sprawdź kontakt do punktu.</p></a>';
quick.after(intro);

const blog=document.createElement('section');
blog.id='blog';
blog.className='section wrap blog-page';
blog.hidden=true;
document.getElementById('content').querySelector('.footer').before(blog);
const terms=document.createElement('section');
terms.id='regulamin';terms.className='section wrap terms-page';terms.hidden=true;
terms.innerHTML='<div class="section-head"><div><span class="eyebrow">INFORMACJE</span><h2>Regulamin serwisu</h2></div></div><article><h3>1. Informacje ogólne</h3><p>Serwis prezentuje informacje o skupie srebra, orientacyjne cenniki i kalkulator pomocniczy. Właścicielem koncepcji serwisu jest PUH SEZAM Sp. z o.o., ul. Pocztowa 11, 66-400 Gorzów Wlkp.</p><h3>2. Cennik i wycena</h3><p>Widoczne ceny mają charakter informacyjny. Ostateczna oferta zależy od badania próby, masy, rodzaju przedmiotu oraz aktualnych warunków rynkowych i jest przedstawiana w punkcie.</p><h3>3. Kalkulator</h3><p>Kalkulator stanowi narzędzie orientacyjne i nie jest ofertą zawarcia umowy. W przypadku monet wartości kolekcjonerskie wymagają odrębnej oceny.</p><h3>4. Prawa autorskie</h3><p>Układ, treści, zdjęcia oraz design serwisu są chronione. Ich kopiowanie, rozpowszechnianie lub wykorzystywanie bez zgody PUH SEZAM Sp. z o.o. jest zabronione.</p><h3>5. Kontakt</h3><p>Pytania dotyczące serwisu można kierować telefonicznie do punktu przy ul. Pocztowej 11 w Gorzowie Wlkp.</p></article>';
document.getElementById('content').querySelector('.footer').before(terms);

const reviews=document.createElement('section');
reviews.className='google-reviews wrap';
reviews.innerHTML='<div class="google-review-card"><div><span class="google-word" aria-label="Google"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span><h2>Opinie Google</h2><p>Zobacz opinie o obsłudze SEZAM przy ul. Pocztowej 11 w Gorzowie.</p><a class="text-link google-reviews-link" href="https://www.google.com/maps/search/?api=1&amp;query=Lombard+SEZAM+Pocztowa+11+Gorz%C3%B3w+Wielkopolski" target="_blank" rel="noopener">Zobacz opinie Google →</a></div><div class="review-stars" aria-label="Opinie Google">★★★★★</div></div>';
intro.after(reviews);

document.querySelectorAll('.header nav,.footer-top nav').forEach(nav=>{
  nav.innerHTML=Object.entries(studioPages).filter(([id])=>!nav.closest('.header')||id!=='regulamin').map(([id,label])=>`<a href="${studioPaths[id]}" data-page="${id}">${id==='start'?'Start':id==='kalkulator'?'Wycena':id==='wykres'?'Wykres':id==='faq'?'FAQ':label}</a>`).join('');
});
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  const target=link.getAttribute('href').slice(1);
  link.href=studioPaths[studioPages[target]?target:'start'];
});

function studioNavigate(page,push=true,focus=true){
  if(!studioPages[page])page='start';
  if(push)history.pushState({page},'',studioPaths[page]);
  document.body.dataset.page=page;
  document.querySelector('.hero').hidden=page!=='start';
  quick.hidden=page!=='start';
  intro.hidden=page!=='start';
  reviews.hidden=page!=='start';
  document.querySelectorAll('#content>section').forEach(section=>section.hidden=section.id!==page);
  document.querySelectorAll('[data-page]').forEach(link=>{if(link.dataset.page===page)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  breadcrumb.hidden=page==='start';
  breadcrumb.innerHTML=`<a href="/">Strona główna</a><span aria-hidden="true">/</span><span>${studioPages[page]}</span>`;
  document.title=page==='start'?'Skup Srebra w Gorzowie - sprawdź ofertę':studioPages[page]+' — Skup srebra Gorzów';
  const canonical=document.querySelector('link[rel=canonical]');
  if(canonical)canonical.href='https://www.skupsrebragorzow.pl'+studioPaths[page];
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
  if(url.origin===location.origin&&(Object.values(studioPaths).includes(url.pathname)||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/studio.html'))){event.preventDefault();studioNavigate(Object.keys(studioPaths).find(key=>studioPaths[key]===url.pathname)||url.searchParams.get('page')||'start');}
});
window.addEventListener('popstate',()=>studioNavigate(studioCurrentPage(),false));
quick.addEventListener('submit',()=>{if(quickValue())studioNavigate('kalkulator');});
document.querySelectorAll('[data-category],[data-price]').forEach(button=>button.addEventListener('click',()=>studioNavigate('kalkulator')));
document.getElementById('ask-quote').addEventListener('click',()=>studioNavigate('kontakt'));
studioNavigate(studioCurrentPage(),false,false);

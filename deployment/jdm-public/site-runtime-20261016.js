(function siteRuntime(){
  'use strict';
  const mode=performance.getEntriesByType('navigation')[0]?.type;
  if(mode==='reload'){try{sessionStorage.removeItem('silver-valuation');sessionStorage.removeItem('silver-intent');sessionStorage.removeItem('silver-contact-draft');}catch{}}
  const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('nav');
  function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.innerHTML='<span class="menu-icon" aria-hidden="true"><i></i><i></i></span>Menu';}
  toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.innerHTML='<span class="menu-icon" aria-hidden="true"><i></i><i></i></span>'+(open?'Zamknij':'Menu');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  document.querySelectorAll('a[href="#start"]').forEach(a=>a.href='/');
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{try{sessionStorage.setItem('silver-intent',JSON.stringify({kind:button.dataset.category}));}catch{}location.href='/wycena.html';}));
  document.getElementById('privacy-open')?.addEventListener('click',()=>location.href='/polityka-prywatnosci.html');
  document.querySelector('.cookie-accept')?.addEventListener('click',()=>{try{localStorage.setItem('sezam-cookies','accepted');}catch{}document.querySelector('.cookie-consent').hidden=true;});
  const cookies=document.querySelector('.cookie-consent');if(cookies){let accepted=false;try{accepted=localStorage.getItem('sezam-cookies')==='accepted';}catch{}cookies.hidden=accepted;}
  document.querySelector('.cookie-settings')?.addEventListener('click',()=>location.href='/polityka-prywatnosci.html#ustawienia-lokalne');
  const message=document.getElementById('contact-message');if(message){try{const draft=sessionStorage.getItem('silver-contact-draft');if(draft)message.value=draft;}catch{}}
})();


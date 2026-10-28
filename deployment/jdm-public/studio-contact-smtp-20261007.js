(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const name = document.getElementById('contact-name');
  const email = document.getElementById('contact-email');
  const message = document.getElementById('contact-message');
  const status = document.getElementById('message-status');
  const button = form.querySelector('button[type="submit"]');
  const description = form.querySelector('p');
  const emailLabel = email?.closest('label');
  const formStarted = Date.now();
  const siteKey = '0x4AAAAAAFQqB7EPo-8kX3Mr';
  let turnstileToken = '';
  let turnstileWidget;

  if (emailLabel) emailLabel.hidden = false;
  if (email) email.required = true;
  if (description) description.textContent = 'Napisz wiadomość — trafi bezpośrednio do naszego punktu.';
  if (button) button.textContent = 'Wyślij wiadomość';
  if (status && button) button.after(status);

  const trap = document.createElement('input');
  trap.name = 'company';
  trap.tabIndex = -1;
  trap.autocomplete = 'off';
  trap.setAttribute('aria-hidden', 'true');
  trap.style.cssText = 'position:absolute;left:-9999px;opacity:0';
  form.append(trap);

  const turnstileBox = document.createElement('div');
  turnstileBox.className = 'turnstile-box';
  turnstileBox.setAttribute('aria-label', 'Ochrona antyspamowa');
  button?.before(turnstileBox);

  const renderTurnstile = () => {
    if (!window.turnstile || turnstileWidget !== undefined) return;
    turnstileWidget = window.turnstile.render(turnstileBox, {
      sitekey: siteKey,
      callback: token => { turnstileToken = token; },
      'expired-callback': () => { turnstileToken = ''; },
      'error-callback': () => { turnstileToken = ''; },
    });
  };
  const turnstileScript = document.createElement('script');
  turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  turnstileScript.async = true;
  turnstileScript.onload = renderTurnstile;
  document.head.append(turnstileScript);

  form.onsubmit = async event => {
    event.preventDefault();
    if (!form.reportValidity() || !button) return;
    const token = turnstileToken || form.querySelector('[name="cf-turnstile-response"]')?.value || '';
    if (!token) {
      status.textContent = 'Poczekaj na potwierdzenie ochrony antyspamowej i spróbuj ponownie.';
      return;
    }
    button.disabled = true;
    button.textContent = 'Wysyłanie…';
    status.textContent = 'Wysyłanie wiadomości…';
    try {
      const body = new URLSearchParams({name: name.value.trim(), email: email.value.trim(), message: message.value.trim(), company: trap.value, form_started: String(formStarted), 'cf-turnstile-response': token});
      const response = await fetch('send-message-smtp-20261007.php', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body});
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error('Serwer formularza zwrócił nieprawidłową odpowiedź. Spróbuj ponownie za chwilę lub zadzwoń.');
      }
      if (!response.ok || !result.ok) throw new Error(result.message || 'Nie udało się wysłać wiadomości.');
      status.textContent = result.message;
      form.reset();
      try { sessionStorage.removeItem('silver-contact-draft'); } catch {}
      turnstileToken = '';
      if (window.turnstile && turnstileWidget !== undefined) window.turnstile.reset(turnstileWidget);
    } catch (error) {
      status.textContent = error.message || 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.';
    } finally {
      button.disabled = false;
      button.textContent = 'Wyślij wiadomość';
    }
  };
})();

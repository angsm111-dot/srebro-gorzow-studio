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

  if (emailLabel) emailLabel.hidden = false;
  if (email) email.required = true;
  if (description) description.textContent = 'Napisz wiadomość — trafi bezpośrednio do naszego punktu.';
  if (button) button.textContent = 'Wyślij wiadomość';
  // Komunikat musi być widoczny także wtedy, gdy dawny podgląd wiadomości jest ukryty.
  if (status && button) button.after(status);

  const trap = document.createElement('input');
  trap.name = 'company';
  trap.tabIndex = -1;
  trap.autocomplete = 'off';
  trap.setAttribute('aria-hidden', 'true');
  trap.style.cssText = 'position:absolute;left:-9999px;opacity:0';
  form.append(trap);

  form.onsubmit = async event => {
    event.preventDefault();
    if (!form.reportValidity() || !button) return;
    button.disabled = true;
    button.textContent = 'Wysyłanie…';
    status.textContent = 'Wysyłanie wiadomości…';
    try {
      const body = new URLSearchParams({name: name.value.trim(), email: email.value.trim(), message: message.value.trim(), company: trap.value});
      const response = await fetch('send-message.php', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body});
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || 'Nie udało się wysłać wiadomości.');
      status.textContent = result.message;
      form.reset();
    } catch (error) {
      status.textContent = error.message || 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.';
    } finally {
      button.disabled = false;
      button.textContent = 'Wyślij wiadomość';
    }
  };
})();

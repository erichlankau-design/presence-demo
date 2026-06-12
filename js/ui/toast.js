// Sanfte, sparsame Benachrichtigungen (Calm by default)
export function toast(msg, ms = 2600) {
  const root = document.getElementById('toasts');
  while (root.children.length >= 2) root.firstChild.remove(); // Calm: nie mehr als 2 gleichzeitig
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 300ms ease';
    setTimeout(() => el.remove(), 320);
  }, ms);
}

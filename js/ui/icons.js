// Inline-SVG-Icons (Lucide-Stil: 24er-Grid, Stroke 2, rund). Kein CDN, keine Fonts.
// Nutzung: icon('sparkles', 20) — Farbe erbt via currentColor.
const PATHS = {
  // Tabbar
  radar:    '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/>',
  sparkles: '<path d="M12 4l1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7L12 4z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>',
  vault:    '<rect x="4" y="6" width="16" height="14" rx="3"/><path d="M4 10h16M10 14h4"/>',
  user:     '<circle cx="12" cy="9" r="3.5"/><path d="M5.5 20c1.2-3.2 3.6-4.8 6.5-4.8s5.3 1.6 6.5 4.8"/>',
  // Chrome & Aktionen
  sliders:  '<path d="M5 7h9M18 7h1M5 12h2M11 12h8M5 17h9M18 17h1"/><circle cx="16" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="17" r="2"/>',
  chevR:    '<path d="M9.5 6l6 6-6 6"/>',
  chevD:    '<path d="M6 9.5l6 6 6-6"/>',
  x:        '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  plus:     '<path d="M12 5.5v13M5.5 12h13"/>',
  check:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  // Inhalte
  flame:    '<path d="M12 3.5c.6 2.8 2.1 4.3 3.7 6 1.5 1.6 2.3 3 2.3 4.9A6 6 0 0 1 6 14.4c0-1.6.6-2.9 1.7-4.2.4 1 .9 1.7 1.8 2.3-.3-3.6.9-6.6 2.5-9z"/>',
  eyeOff:   '<path d="M4 4l16 16M9.9 5.2A9.8 9.8 0 0 1 12 5c5 0 8.6 3.6 10 7- .5 1.2-1.3 2.5-2.4 3.6M6.3 6.3C4.4 7.6 3 9.4 2 12c1.4 3.4 5 7 10 7 1.5 0 2.9-.3 4.1-.9"/><path d="M9.5 9.6a3.4 3.4 0 0 0 4.8 4.8"/>',
  shield:   '<path d="M12 3.5l7 2.8v5.2c0 4.6-3 7.8-7 9-4-1.2-7-4.4-7-9V6.3l7-2.8z"/>',
  phone:    '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M10.5 18.5h3"/>',
  sprout:   '<path d="M12 20.5v-7"/><path d="M12 13.5c0-3.5-2.5-6-6.5-6 0 3.8 2.7 6 6.5 6zM12 11c0-3.2 2.3-5.5 6.5-5.5 0 3.6-2.6 5.5-6.5 5.5z"/>',
  send:     '<path d="M20 4L4 11l6 2.5L12.5 20 20 4z"/><path d="M10 13.5L20 4"/>',
  bell:     '<path d="M18 9.5a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10.3 19.5a2 2 0 0 0 3.4 0"/>',
  lock:     '<rect x="5.5" y="11" width="13" height="9" rx="2.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
};

export function icon(name, size = 20, cls = '') {
  const p = PATHS[name];
  if (!p) return '';
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

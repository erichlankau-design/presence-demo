// Bottom-Sheet: Kreis-Wechsler
import { S, setS, visiblePresence } from '../state.js';
import { toast } from './toast.js';
import { closeSheet } from './presence.js';

export function openCirclesSheet() {
  const root = document.getElementById('sheet-root');
  const st = S();
  const rows = Object.values(st.circles).map(c => {
    const present = c.members.filter(id => visiblePresence(id)).length;
    const active = c.id === st.meta.activeCircle;
    return `
      <button class="row circle-row ${active ? 'on' : ''}" data-circle="${c.id}" style="width:100%">
        <span style="font-size:26px">${c.emoji}</span>
        <span class="grow" style="text-align:left">
          <div style="font-weight:700; font-size:15px">${c.name}</div>
          <div class="tiny">${present} von ${c.members.length} gerade da · 🔥 ${c.glut}</div>
        </span>
        ${active ? '<span class="chip" style="background:rgba(15,118,110,0.10); color:var(--teal)">Aktiv</span>' : '<span class="chev" style="color:var(--muted)">›</span>'}
      </button>`;
  }).join('');

  root.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet">
      <div class="h-display h2" style="margin-bottom:2px">Deine Kreise</div>
      <div class="tiny" style="margin-bottom:10px">Klein und echt — Kreise wachsen organisch, nie über Fremde.</div>
      ${rows}
      <button class="btn ghost" style="margin-top:14px" id="new-circle">＋ Neuen Kreis starten (ab 2 Personen)</button>
    </div>`;

  root.querySelector('[data-close]').addEventListener('click', closeSheet);
  root.querySelectorAll('[data-circle]').forEach(b => b.addEventListener('click', () => {
    setS({ meta: { ...S().meta, activeCircle: b.dataset.circle } });
    closeSheet();
  }));
  root.querySelector('#new-circle').addEventListener('click', () => {
    closeSheet();
    toast('Ein Link genügt — kein Adressbuch nötig.');
    document.querySelector('#tabbar button[data-tab="me"]').click();
    const ob = document.querySelector('button[data-nav="onboarding"]');
    if (ob) ob.click();
  });
}

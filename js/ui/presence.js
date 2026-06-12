// Bottom-Sheet: Signal setzen — Ein-Tap-Philosophie, Pflicht-Ablauf, Glut-Belohnung
import { S, setS, reignite } from '../state.js';
import { MODES, ENERGIES } from '../data.js';
import { toast } from './toast.js';

const DURATIONS = [
  { mins: 60,  label: '1 h' },
  { mins: 240, label: '4 h' },
  { mins: 480, label: '8 h (Max)' },
];

let pick = { mode: null, energy: null, mins: 240 };

export function openPresenceSheet() {
  const root = document.getElementById('sheet-root');
  const my = S().presence.me;
  pick = { mode: my.mode || 'sofa', energy: my.energy || 'e1', mins: 240 };

  root.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet">
      <div class="h-display h2" style="margin-bottom:2px">Signal setzen</div>
      <div class="tiny" style="margin-bottom:14px">Dein Kreis sieht nur das hier — nie deinen Standort. Läuft automatisch ab.</div>

      <div class="sub" style="font-weight:700; margin-bottom:8px">Modus</div>
      <div class="mode-grid">
        ${MODES.map(m => `<button class="mode-tile" data-mode="${m.id}"><span>${m.emoji}</span>${m.label}</button>`).join('')}
      </div>

      <div class="sub" style="font-weight:700; margin:16px 0 8px">Kontaktenergie</div>
      <div class="energy-list">
        ${ENERGIES.map(e => `
          <button class="energy-row ${e.id}" data-energy="${e.id}">
            <span class="dot"></span>
            <span class="grow" style="text-align:left">
              <div style="font-weight:600; font-size:14px">${e.label}</div>
              <div class="tiny">${e.hint}</div>
            </span>
          </button>`).join('')}
      </div>

      <div class="sub" style="font-weight:700; margin:16px 0 8px">Läuft ab nach</div>
      <div class="dur-row">
        ${DURATIONS.map(d => `<button class="dur-pill" data-mins="${d.mins}">${d.label}</button>`).join('')}
      </div>

      <button class="btn" id="set-presence" style="margin-top:18px">Signal setzen</button>
      <button class="btn ghost" id="clear-presence" style="margin-top:8px">Kein Signal (einfach weg sein ist okay)</button>
    </div>`;

  const paint = () => {
    root.querySelectorAll('.mode-tile').forEach(b => b.classList.toggle('on', b.dataset.mode === pick.mode));
    root.querySelectorAll('.energy-row').forEach(b => b.classList.toggle('on', b.dataset.energy === pick.energy));
    root.querySelectorAll('.dur-pill').forEach(b => b.classList.toggle('on', Number(b.dataset.mins) === pick.mins));
  };
  paint();

  root.querySelectorAll('.mode-tile').forEach(b => b.addEventListener('click', () => { pick.mode = b.dataset.mode; paint(); }));
  root.querySelectorAll('.energy-row').forEach(b => b.addEventListener('click', () => { pick.energy = b.dataset.energy; paint(); }));
  root.querySelectorAll('.dur-pill').forEach(b => b.addEventListener('click', () => { pick.mins = Number(b.dataset.mins); paint(); }));
  root.querySelector('[data-close]').addEventListener('click', closeSheet);

  root.querySelector('#set-presence').addEventListener('click', () => {
    const st = S();
    setS({ presence: { ...st.presence, me: { mode: pick.mode, energy: pick.energy, until: st.clock + pick.mins } } });
    reignite(st.meta.activeCircle, 'Erik', 6);
    closeSheet();
    if (pick.energy === 'e4') {
      toast('Dein Kreis bekommt ein sanftes Zeichen, dass du jemanden brauchst. 💛');
    } else {
      toast('Signal gesetzt — die Glut eures Kreises glüht etwas heller.');
    }
  });

  root.querySelector('#clear-presence').addEventListener('click', () => {
    const st = S();
    setS({ presence: { ...st.presence, me: { mode: null, energy: null, until: 0 } } });
    closeSheet();
    toast('Kein Signal. Niemand sieht ein „zuletzt online" — versprochen.');
  });
}

export function closeSheet() {
  document.getElementById('sheet-root').innerHTML = '';
}

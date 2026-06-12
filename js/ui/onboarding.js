// Onboarding: Claim → 16+-Gate → Einstieg (2er-Kreis per Link ODER Demo-Kreise).
// Sim pausiert währenddessen, damit nichts unter den Fingern re-rendert.
import { setS, S } from '../state.js';
import { stopSim, startSim } from '../sim.js';
import { toast } from './toast.js';

let step = 1;
let year = '';
let entered = false;

export function renderOnboarding(el) {
  if (!entered) { entered = true; step = 1; year = ''; stopSim(); }

  const YEARS = [];
  for (let y = 2014; y >= 1980; y--) YEARS.push(y);
  const age = year ? (2026 - Number(year)) : null;

  const steps = {
    1: `
      <div class="ob-hero">
        <div class="ob-logo">◉</div>
        <div class="h-display h1" style="margin-top:14px">Presence</div>
        <p class="sub" style="margin:10px 0 26px; line-height:1.6">Wer aus deinem echten Kreis ist gerade da —<br>und du dockst ohne Druck an.</p>
        <button class="btn" data-ob="2">Los geht's</button>
        <p class="tiny" style="margin-top:14px">Kein Feed. Keine Likes. Kein Standort.</p>
      </div>`,
    2: `
      <div class="ob-hero">
        <div style="font-size:38px">🎂</div>
        <div class="h-display h2" style="margin-top:10px">Wann bist du geboren?</div>
        <p class="tiny" style="margin:8px 0 18px">Presence ist ab 16. In der echten App prüfen das App-Store-Signale<br>und die EU-Altersnachweis-App — ohne Ausweis-Upload.</p>
        <select id="ob-year" class="ob-select">
          <option value="">Geburtsjahr wählen…</option>
          ${YEARS.map(y => `<option value="${y}" ${String(y) === year ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
        ${age !== null && age < 16 ? `
          <div class="card" style="margin-top:16px; text-align:left">
            <div style="font-weight:700">Noch nicht — aber bald. 💛</div>
            <div class="tiny" style="margin-top:6px; line-height:1.55">Presence ist ab 16. Das ist kein Misstrauen, sondern Schutz — versprochen, wir sind dann immer noch da. Bis dahin: Deine Leute freuen sich auch über eine echte Nachricht.</div>
          </div>
          <button class="btn ghost" data-ob="1" style="margin-top:14px">Zurück</button>`
        : `<button class="btn" data-ob="3" style="margin-top:18px" ${age === null ? 'disabled' : ''}>Weiter</button>`}
      </div>`,
    3: `
      <div class="ob-hero">
        <div style="font-size:38px">🫶</div>
        <div class="h-display h2" style="margin-top:10px">Dein erster Kreis</div>
        <p class="tiny" style="margin:8px 0 18px">Es braucht nur EINE Person, die dir wichtig ist.<br>Kein Adressbuch-Upload — der Link reicht.</p>
        <div class="card" style="text-align:left">
          <div style="font-weight:700; font-size:14px">2er-Kreis starten</div>
          <div class="ob-link">presence.app/k/erik-7f3a</div>
          <button class="btn small" data-ob-copy style="margin-top:10px">Link kopieren & teilen</button>
        </div>
        <button class="btn" data-ob="done" style="margin-top:14px">Demo-Kreise laden</button>
        <p class="tiny" style="margin-top:12px">In der echten App wartet der Kreis, bis dein Mensch klickt.</p>
      </div>`,
  };

  el.innerHTML = `<section class="screen ob">${steps[step]}</section>`;

  const sel = el.querySelector('#ob-year');
  if (sel) sel.addEventListener('change', () => { year = sel.value; renderOnboarding(el); });
}

// Wird von app.js (Delegation) aufgerufen
export function onboardingAction(action, el) {
  if (action === 'done') {
    entered = false;
    setS({ meta: { ...S().meta, onboarded: true } });
    startSim();
    toast('Willkommen bei Presence. Dein Kreis wartet schon.');
    return 'dashboard';
  }
  step = Number(action);
  renderOnboarding(document.getElementById('app'));
  return null;
}

export function onboardingCopy() {
  toast('Link kopiert — in der echten App teilst du ihn jetzt per WhatsApp.');
}

export function onboardingExit() {
  // Beim Tab-Wechsel raus aus dem Onboarding: Sim wieder anwerfen
  if (entered) { entered = false; startSim(); }
}

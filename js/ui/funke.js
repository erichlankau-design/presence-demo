// „Der Funke": tägliches, druckfreies Synchron-Ritual (AP11).
// BeReal-Magie (alle gleichzeitig, knappes Fenster, „wer taucht auf?") — aber um VERFÜGBARKEIT
// statt Content. Markt-Scan-Justierungen: Anti-Ghost-Town (startet nie leer) + DFA-/Fatigue-sicher
// (genau 1×, keine FOMO-/Streak-/Countdown-Drohung, Verpassen folgenlos).
import { S, setS, reignite, visiblePresence } from '../state.js';
import { PEOPLE } from '../data.js';
import { toast } from './toast.js';

const WINDOW_MIN = 60; // Demo-Minuten Fensterlänge

export function fireFunke() {
  const st = S();
  if (st.funke.active) return; // läuft schon — nicht doppelt
  const circle = st.circles[st.meta.activeCircle];
  const others = circle.members.filter(id => id !== 'me');
  // Anti-Ghost-Town: jemand ist schon da (bevorzugt eine gerade verfügbare Person)
  const available = others.filter(id => visiblePresence(id));
  const seed = (available[0] ? [available[0]] : others.slice(0, 1));
  setS({ funke: { active: true, until: st.clock + WINDOW_MIN, here: seed, firedToday: true, expired: false } });
  toast('🔥 Der Funke ist da — wer hat gerade Zeit?' + (seed.length ? ' ' + PEOPLE[seed[0]].name + ' ist schon dabei.' : ''));
  // Weitere tauchen über echte Sekunden auf → das Fenster lebt, fühlt sich nie leer an
  const more = others.filter(id => !seed.includes(id)).slice(0, 2);
  more.forEach((id, i) => setTimeout(() => {
    const s = S();
    if (!s.funke.active || s.funke.here.includes(id)) return;
    setS({ funke: { ...s.funke, here: [...s.funke.here, id] } });
  }, 3500 + i * 3200 + Math.random() * 1500));
}

export function joinFunke() {
  const st = S();
  if (!st.funke.active || st.funke.here.includes('me')) return;
  setS({ funke: { ...st.funke, here: [...st.funke.here, 'me'] } });
  reignite(st.meta.activeCircle, 'Erik', 6, 12); // dabei sein entfacht die Glut — kollektiv
  toast('Du bist beim Funke dabei — schau, wer noch da ist.');
}

// Fensterende: verglüht still und FOLGENLOS (kein „verpasst", kein Streak-Verlust)
export function maybeExpireFunke() {
  const st = S();
  if (st.funke.active && st.funke.until <= st.clock) {
    setS({ funke: { ...st.funke, active: false, expired: true, here: [] } });
  }
}

export function funkeCardHTML() {
  const st = S();
  const f = st.funke;
  if (!f.active) return '';
  const left = Math.max(0, Math.round(f.until - st.clock));
  const meHere = f.here.includes('me');
  const faces = f.here.map(id => `<span class="funke-face" style="background:${PEOPLE[id].color}">${PEOPLE[id].name.slice(0, 2)}</span>`).join('');
  return `
    <div class="funke-card">
      <div class="funke-top">
        <span class="funke-flame">🔥</span>
        <span class="grow">
          <div class="funke-title">Der Funke ist da</div>
          <div class="funke-sub">${f.here.length} ${f.here.length === 1 ? 'ist' : 'sind'} gerade hier · noch ${left} Min offen</div>
        </span>
      </div>
      <div class="funke-faces">${faces || '<span class="tiny" style="color:rgba(255,255,255,.85)">deine Leute kommen gerade dazu …</span>'}</div>
      ${meHere
        ? '<div class="funke-joined">Du bist dabei ✓ — sag Hi oder startet was</div>'
        : '<button class="btn funke-join" data-funke-join>🙌 Bin da</button>'}
      <div class="funke-foot">Verpassen ist okay — der Funke verglüht einfach.</div>
    </div>`;
}

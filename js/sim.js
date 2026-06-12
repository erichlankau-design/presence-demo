// Zeitraffer-Simulation: 1 echte Sekunde = `speed` Demo-Minuten.
// Szenarien sind Event-Listen [{at: clockMinute, run}] auf frischem Preset.
import { S, setS, resetDemo } from './state.js';
import { suggest } from './butler.js';
import { toast } from './ui/toast.js';

let timer = null;
let events = [];
let fired = new Set();

const P = (mode, energy, until) => ({ mode, energy, until });

const SCENARIOS = {
  feierabend: {
    startClock: 0, // 18:00
    preset(st) {
      return {
        presence: {
          me:    P('sofa', 'e1', 240),
          lisa:  P('gym', 'e0', 150),
          max:   P('gaming', 'e0', 200),
          jonas: P('fokus', 'e3', 120),
          sara:  P(null, null, 0),
          mara:  P('unterwegs', 'e2', 90),
          tom:   P(null, null, 0),
        },
        moments: [{ id: 'm1', circle: 'gym', title: 'Feierabend-Pump um 18:30?', by: 'lisa', ttlUntil: 90, joined: ['lisa', 'max'], echo: null }],
      };
    },
    events: [
      { at: 5,  run: st => patchPresence('sara', P('unterwegs', 'e1', st.clock + 180)) },
      { at: 12, run: st => patchPresence('jonas', P('sofa', 'e0', st.clock + 240)) },
      { at: 20, run: () => suggest('gym', 'Lisa und Max sind gerade offen — kleiner Feierabend-Call um Viertel vor?', { title: 'Feierabend-Call 18:45', joined: ['lisa', 'max'], ttl: 90 }) },
      { at: 40, run: st => patchPresence('mara', P('sofa', 'e0', st.clock + 240)) },
      { at: 70, run: () => suggest('duo', 'Ihr seid beide im Sofa-Modus — Lust auf einen Abendspaziergang?', { title: 'Abendspaziergang', joined: ['lisa'], ttl: 60 }) },
      { at: 8,  run: () => toast('💭 Lisa denkt an dich.') },
    ],
  },
  gymtag: {
    startClock: 0,
    preset(st) {
      return {
        presence: {
          me:    P(null, null, 0),
          lisa:  P('gym', 'e0', 220),
          max:   P('gym', 'e0', 220),
          jonas: P('unterwegs', 'e2', 100),
          sara:  P(null, null, 0),
          mara:  P(null, null, 0),
          tom:   P(null, null, 0),
        },
        moments: [],
      };
    },
    events: [
      { at: 6,  run: () => suggest('gym', 'PR-Freitag startet um 19:00 — Lisa und Max sind schon im Gym-Modus. Dabei?', { title: 'PR-Freitag 19:00', joined: ['lisa', 'max'], ttl: 120 }) },
      { at: 30, run: st => { patchPresence('sara', P('gym', 'e0', st.clock + 180)); autoJoin('sara', 'gym'); } },
      { at: 55, run: st => patchPresence('jonas', P('gym', 'e1', st.clock + 150)) },
      { at: 12, run: () => toast('💪 Max schickt dir ein Zeichen — PR-Tag!') },
    ],
  },
  nacht: {
    startClock: 450, // 01:30
    preset(st) {
      return {
        presence: {
          me:    P('nacht', 'e1', 450 + 180),
          lisa:  P(null, null, 0),
          max:   P('gaming', 'e0', 450 + 150),
          jonas: P(null, null, 0),
          sara:  P(null, null, 0),
          mara:  P(null, null, 0),
          tom:   P(null, null, 0),
        },
        moments: [],
      };
    },
    events: [
      { at: 456, run: st => { patchPresence('mara', P('nacht', 'e4', st.clock + 120)); toast('Mara ist wach und könnte Gesellschaft brauchen. 💛'); } },
      { at: 462, run: () => suggest('wg', 'Mara ist wach und auf Empfang — ein kurzes Zeichen würde sie sicher freuen.', { title: 'Kurz für Mara da sein', joined: [], ttl: 90 }) },
      { at: 475, run: st => setS({ moments: [...S().moments, { id: 'mn1', circle: 'gym', title: 'Nachtlobby offen — wer joint?', by: 'max', ttlUntil: st.clock + 120, joined: ['max'], echo: null }] }) },
      { at: 480, run: () => toast('👋 Max: noch wach?') },
    ],
  },
};

function patchPresence(personId, p) {
  setS({ presence: { ...S().presence, [personId]: p } });
}

function autoJoin(personId, circleId) {
  const st = S();
  setS({ moments: st.moments.map(m => (m.circle === circleId && m.ttlUntil > st.clock && !m.joined.includes(personId)) ? { ...m, joined: [...m.joined, personId] } : m) });
}

export function loadScenario(name) {
  const sc = SCENARIOS[name];
  if (!sc) return;
  document.getElementById('sheet-root').innerHTML = '';
  resetDemo(); // frischer Seed als Basis
  const st = S();
  setS({ scenario: name, clock: sc.startClock, butler: [], meta: { ...st.meta, calmBudgetUsed: 0 }, ...sc.preset(st) });
  events = sc.events;
  fired = new Set();
}

export function setSpeed(n) {
  setS({ speed: n });
}

function tick() {
  const st = S();
  const next = st.clock + st.speed;
  // Glut glimmt langsam herunter (nie unter 15 — sie erlischt NIE ganz)
  let circles = st.circles;
  if (Math.floor(next / 30) > Math.floor(st.clock / 30)) {
    circles = Object.fromEntries(Object.entries(st.circles).map(([id, c]) => [id, { ...c, glut: Math.max(15, c.glut - 1) }]));
  }
  setS({ clock: next, circles });
  // Szenario-Events feuern (alle, deren Zeitpunkt erreicht/überschritten ist)
  events.forEach((ev, i) => {
    if (!fired.has(i) && ev.at <= next) {
      fired.add(i);
      ev.run(S());
    }
  });
}

export function startSim() {
  if (timer) return;
  timer = setInterval(tick, 1000);
}

export function stopSim() {
  clearInterval(timer);
  timer = null;
}

export function restartScenario() {
  loadScenario(S().scenario);
}

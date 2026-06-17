// Mitglieder-Sheet: Ein-Tap-Signale an Personen (Masterplan Kap. 6.2 — Reziprozität).
// Regeln: nur positive Signale, kein Chat, kein Verlauf, Energie-Stufen werden respektiert.
import { S, setS, reignite, visiblePresence } from '../state.js';
import { PEOPLE, MODES, ENERGIES } from '../data.js';
import { avatarHTML } from './dashboard.js';
import { closeSheet } from './presence.js';
import { toast } from './toast.js';

const cool = {}; // personId -> true, solange ein Signal "unterwegs" ist (Modul-Gedächtnis, Anti-Spam ohne Strafe)

function signalsFor(personId, vp) {
  const name = PEOPLE[personId].name;
  if (!vp) return [{ e: '💭', l: 'Denk an dich', sub: 'wartet still, bis ' + name + ' zurück ist' }];
  switch (vp.energy) {
    case 'e0':
    case 'e1':
      return [
        { e: '👋', l: 'Bin da', sub: 'kleines Winken, keine Verpflichtung' },
        { e: '☕', l: 'Kurz quatschen?', sub: 'lockere Einladung — Nein ist okay' },
        { e: '💭', l: 'Denk an dich', sub: 'einfach so' },
      ];
    case 'e2':
      return [
        { e: '💭', l: 'Denk an dich', sub: 'braucht keine Antwort' },
        { e: '🤍', l: 'Schulterklopfen', sub: 'warme Anerkennung' },
      ];
    case 'e3':
      return [{ e: '💭', l: 'Denk an dich', sub: 'kommt leise an, wenn ' + name + ' wieder offen ist', dim: true }];
    case 'e4':
      return [
        { e: '💛', l: 'Bin für dich da', sub: name + ' sieht: du bist erreichbar' },
        { e: '📞', l: 'Ruf an, wann immer du willst', sub: 'ohne Zeitdruck' },
      ];
    default:
      return [{ e: '💭', l: 'Denk an dich', sub: '' }];
  }
}

export function openMemberSheet(personId) {
  const root = document.getElementById('sheet-root');
  const p = PEOPLE[personId];
  const vp = visiblePresence(personId);
  const mode = vp ? MODES.find(m => m.id === vp.mode) : null;
  const energy = vp ? ENERGIES.find(e => e.id === vp.energy) : null;

  const body = cool[personId]
    ? `<div class="signal-sent">✓ Signal unterwegs — mehr braucht es nicht.</div>`
    : `<div class="signal-grid">
        ${signalsFor(personId, vp).map(s => `
          <button class="signal-btn ${s.dim ? 'dim' : ''}" data-signal="${personId}|${s.e}|${s.l}">
            <span class="se">${s.e}</span>
            <span class="grow">${s.l}${s.sub ? `<span class="sub">${s.sub}</span>` : ''}</span>
          </button>`).join('')}
      </div>`;

  root.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet">
      <div class="member-head">
        ${avatarHTML(personId, { name: false })}
        <span class="grow">
          <div class="h-display h2">${p.name}</div>
          <div class="tiny">${vp ? mode.emoji + ' ' + mode.label + ' · ' + energy.label : 'Gerade kein Signal — das ist okay'}</div>
        </span>
      </div>
      ${vp && vp.energy === 'e4' ? `<div class="tiny" style="margin:4px 0 8px; color:var(--sos-text)">💛 ${p.name} könnte gerade jemanden brauchen — dein Zeichen zählt doppelt.</div>` : ''}
      ${body}
      <p class="tiny" style="text-align:center; margin-top:14px; line-height:1.6">
        Kein Chat hier — fürs Reden habt ihr eure echten Kanäle.<br>
        Mehr als den Moment zeigen wir nicht: Presence kennt kein Gestern.
      </p>
      <button class="member-safety" data-block="${personId}">Stummschalten · Melden · Blockieren</button>
    </div>`;

  root.querySelector('[data-close]').addEventListener('click', closeSheet);
  root.querySelectorAll('[data-signal]').forEach(b => b.addEventListener('click', () => {
    const [pid, emoji, label] = b.dataset.signal.split('|');
    sendSignal(pid, emoji, label);
  }));
  const sb = root.querySelector('[data-block]');
  if (sb) sb.addEventListener('click', () => openBlockSheet(sb.dataset.block));
}

// Trust/Safety: Stummschalten · Melden · Blockieren (App-Store-Pflicht für UGC; zentrales Vertrauensargument)
export function openBlockSheet(personId) {
  const root = document.getElementById('sheet-root');
  const p = PEOPLE[personId];
  root.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet">
      <div class="h-display h2" style="margin-bottom:2px">${p.name}</div>
      <div class="tiny" style="margin-bottom:12px">Deine Grenze, deine Entscheidung — leise und ohne Erklärung.</div>
      <button class="signal-btn" data-do-mute="${personId}"><span class="se">🔕</span><span class="grow">Stummschalten<span class="sub">Du siehst ${p.name} weiter, aber ohne Signale</span></span></button>
      <button class="signal-btn" data-do-report="${personId}"><span class="se">⚑</span><span class="grow">Melden<span class="sub">Geht vertraulich an unser Safety-Team</span></span></button>
      <button class="signal-btn dim" data-do-block="${personId}"><span class="se">⛔</span><span class="grow">Blockieren<span class="sub">${p.name} verschwindet für dich — gegenseitig, lautlos</span></span></button>
      <button class="btn ghost" data-close style="margin-top:12px">Abbrechen</button>
    </div>`;
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeSheet));
  const act = (kind) => {
    const st = S();
    closeSheet();
    if (kind === 'block') {
      if (!(st.blocked || []).includes(personId)) setS({ blocked: [...(st.blocked || []), personId] });
      toast(p.name + ' ist blockiert — für euch beide unsichtbar, lautlos.');
    } else if (kind === 'mute') {
      toast(p.name + ' ist stummgeschaltet — du siehst keine Signale mehr.');
    } else {
      toast('Danke. Deine Meldung geht vertraulich an unser Safety-Team.');
    }
  };
  root.querySelector('[data-do-mute]').addEventListener('click', () => act('mute'));
  root.querySelector('[data-do-report]').addEventListener('click', () => act('report'));
  root.querySelector('[data-do-block]').addEventListener('click', () => act('block'));
}

export function sendSignal(personId, emoji, label) {
  const st = S();
  const p = PEOPLE[personId];
  const vp = visiblePresence(personId);
  cool[personId] = true;
  reignite(st.meta.activeCircle, 'Erik', 4, 10); // Signal = gemeinsame Aktion -> Glut & kollektive XP

  if (vp && vp.energy === 'e3') {
    toast(emoji + ' Signal an ' + p.name + ' — kommt leise an, wenn sie/er wieder offen ist.');
    // Respekt: keine simulierte Antwort, kein Druck
  } else {
    toast(emoji + ' Signal an ' + p.name + ' ist unterwegs.');
    const delay = 4000 + Math.random() * 4000; // echte Sekunden, unabhängig vom Sim-Tempo
    setTimeout(() => {
      window.__lastReply = p.name;
      toast(p.name + ' hat dein Signal erwidert ' + emoji);
      cool[personId] = false;
      if (!visiblePresence(personId) && Math.random() < 0.34) {
        // Variable soziale Belohnung sichtbar: die Person taucht im Radar auf
        const stt = S();
        setS({ presence: { ...stt.presence, [personId]: { mode: 'sofa', energy: 'e1', until: stt.clock + 120 } } });
      }
    }, delay);
  }
  openMemberSheet(personId); // Sheet in den "unterwegs"-Zustand bringen
}

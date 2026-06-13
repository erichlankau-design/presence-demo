// Kreis-Dashboard: Energy Radar (Menschen im Zentrum), Glut, Momente-Vorschau, Level dezent.
import { S, visiblePresence, fmtLeft } from '../state.js';
import { PEOPLE, MODES, ENERGIES, DORMANT } from '../data.js';
import { butlerCardsHTML } from '../butler.js';
import { icon } from './icons.js';

const modeById = id => MODES.find(m => m.id === id);

// „Hab Zeit – Bock was zu machen?“ — der entstigmatisierte Verfügbarkeits-Status (Audit Kap. 4).
function habZeitHTML() {
  const open = visiblePresence('me')?.energy === 'e0';
  return `
    <button class="habzeit-cta ${open ? 'on' : ''}" data-habzeit>
      <span class="hz-emoji">${open ? '🙌' : '⏱️'}</span>
      <span class="hz-label">${open
        ? 'Du hast Zeit — dein Kreis sieht es. Kein Druck.'
        : 'Hab Zeit – Bock was zu machen?'}</span>
    </button>`;
}

// Reaktivierung: „erreiche deine Leute, ohne Überwindung“ (Audit Kap. 1.3).
function reviveHTML() {
  const pinged = S().dormantPinged || [];
  const rows = DORMANT.map(d => {
    const sent = pinged.includes(d.id);
    return `
      <div class="row revive-row">
        <span class="revive-ava" style="background:${d.color}">${d.name.slice(0, 2)}</span>
        <span class="grow">
          <div style="font-weight:600; font-size:13.5px">${d.name}</div>
          <div class="tiny">${d.since}</div>
        </span>
        ${sent
          ? '<span class="revive-sent">Zeichen unterwegs ✓</span>'
          : `<button class="btn small ghost" data-revive="${d.id}">👋 Mal wieder?</button>`}
      </div>`;
  }).join('');
  return `
    <div class="card" style="margin-top:12px">
      <div class="sub" style="margin-bottom:4px"><b>Wen hast du länger nicht gesehen?</b></div>
      <div class="tiny" style="margin-bottom:6px">Ein Zeichen genügt — niemand sieht, ob jemand antwortet.</div>
      ${rows}
    </div>`;
}

export function avatarHTML(personId, opts = {}) {
  const person = PEOPLE[personId];
  const vp = visiblePresence(personId);
  const eClass = vp ? vp.energy : 'eoff';
  const mode = vp ? modeById(vp.mode) : null;
  const size = opts.size || 1;
  return `
    <div class="avatar ${eClass}" data-person="${personId}" style="transform: scale(${size})">
      <div class="ava-ring">
        <div class="ava-core" style="background:${person.color}">${person.name.slice(0, 2)}</div>
      </div>
      ${mode ? `<div class="ava-mode" title="${mode.label}">${mode.emoji}</div>` : ''}
      ${opts.name === false ? '' : `<div class="ava-name">${person.name}</div>`}
    </div>`;
}

function radarHTML(circle) {
  const others = circle.members.filter(id => id !== 'me');
  const n = others.length;
  // Halbkreis: 200°..340° (oben), Radius nach Anzahl
  const nodes = others.map((id, i) => {
    const angle = Math.PI * (1 + (i + 1) / (n + 1)); // PI..2PI (oberer Halbkreis)
    const r = 118;
    const x = 50 + (Math.cos(angle) * r) / 3.5;      // % relativ zur Kartenbreite
    const yPx = 165 + Math.sin(angle) * r;           // px vom Container-Top
    return `<div class="radar-node" style="position:absolute; left:${x}%; top:${yPx}px; transform:translate(-50%,-50%)">${avatarHTML(id)}</div>`;
  }).join('');
  return `
    <div class="radar">
      <div class="radar-halo"></div>
      ${nodes}
      <div class="radar-me">${avatarHTML('me', { size: 1.12 })}</div>
    </div>`;
}

function momentsPreviewHTML(circle) {
  const ms = S().moments.filter(m => m.circle === circle.id && m.ttlUntil > S().clock);
  if (!ms.length) {
    return `<div class="tiny" style="padding:6px 2px">Gerade kein offener Moment — euer Radar zeigt, wann sich einer anbietet.</div>`;
  }
  return ms.map(m => {
    const faces = m.joined.map(id => `<span class="mini" style="background:${PEOPLE[id].color}">${PEOPLE[id].name.slice(0, 2)}</span>`).join('');
    const joined = m.joined.includes('me');
    return `
      <div class="moment-card" data-moment="${m.id}">
        <div class="mc-top">
          <span class="mc-title">${m.title}</span>
          <span class="mc-ttl" data-left="${m.ttlUntil}">${fmtLeft(m.ttlUntil)}</span>
        </div>
        <div class="mc-bottom">
          <div class="moment-faces">${faces}</div>
          <button class="btn small ${joined ? 'ghost' : ''}" data-join="${m.id}">${joined ? 'Dabei ✓' : 'Ein Tap: dabei'}</button>
        </div>
      </div>`;
  }).join('');
}

export function renderDashboard(el) {
  const st = S();
  const circle = st.circles[st.meta.activeCircle];
  const myP = st.presence.me;
  const myVisible = visiblePresence('me');
  const myMode = myVisible ? modeById(myVisible.mode) : null;
  const myEnergy = myVisible ? ENERGIES.find(e => e.id === myVisible.energy) : null;
  const presentCount = circle.members.filter(id => visiblePresence(id)).length;
  const glutLow = circle.glut < 35;

  el.innerHTML = `
    <section class="screen">
      <div class="dash-header">
        <button class="dash-circle-btn" data-sheet="circles">
          <span class="emoji">${circle.emoji}</span>
          <span>
            <div class="h-display h2">${circle.name}</div>
            <div class="tiny">${presentCount} von ${circle.members.length} gerade da</div>
          </span>
          <span class="chev">${icon('chevD', 15)}</span>
        </button>
        <span class="glut ${glutLow ? 'low' : ''}" title="Glut des Kreises — erlischt nie, jede:r kann sie neu entfachen">
          <span class="flame">${icon('flame', 13)}</span> ${circle.glut} · von ${circle.glutBy}
        </span>
      </div>

      <div class="card">
        <div class="sub" style="display:flex; justify-content:space-between">
          <span><b>Energy Radar</b></span>
          <span class="tiny">Verfügbarkeit, nie Standort</span>
        </div>
        ${radarHTML(circle)}
        <div class="tiny" style="text-align:center">Tipp auf eine Person, um ihr ein Zeichen zu geben</div>
      </div>

      ${butlerCardsHTML(circle.id)}

      <div class="dash-actions">
        <button class="presence-cta" data-sheet="presence">
          <span class="pc-emoji">${myMode ? myMode.emoji : '◌'}</span>
          <span class="pc-label">
            <div style="font-weight:700; font-size:14.5px">${myMode ? myMode.label + ' · ' + myEnergy.short : 'Kein Signal gesetzt'}</div>
            <div class="pc-timer" ${myVisible ? `data-left="${myP.until}" data-suffix=" · läuft automatisch ab"` : ''}>${myVisible ? fmtLeft(myP.until) + ' · läuft automatisch ab' : 'Ein Tap, und dein Kreis weiß, woran er ist'}</div>
          </span>
          <span class="chev">${icon('chevR', 17)}</span>
        </button>
        ${habZeitHTML()}
      </div>

      ${reviveHTML()}

      <div class="card" style="margin-top:12px">
        <div class="sub" style="display:flex; justify-content:space-between; margin-bottom:8px">
          <span><b>Momente</b></span>
          <span class="tiny">${circle.ritual.emoji} ${circle.ritual.name} · ${circle.ritual.next}</span>
        </div>
        ${momentsPreviewHTML(circle)}
      </div>

      <div class="card" style="margin-top:12px; padding:12px 16px">
        <div class="level-strip">
          <span>Kapitel: <b>${circle.levelName}</b> · Level ${circle.level}</span>
          <div class="level-bar"><i style="width:${Math.round((circle.xp / circle.xpNext) * 100)}%"></i></div>
          <span class="tiny">${circle.xp}/${circle.xpNext}</span>
        </div>
        <div class="tiny" style="margin-top:6px">XP gibt es nur für gemeinsame Aktionen — niemand wird einzeln gemessen.</div>
      </div>
    </section>`;
}

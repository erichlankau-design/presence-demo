// Mini-Router + App-Bootstrap. Klicks laufen DELEGIERT über #app,
// damit der Sekunden-Tick der Simulation keine Handler verliert.
import { S, setS, sub, fmtClock, fmtLeft, reignite, visiblePresence } from './state.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderMoments } from './ui/moments.js';
import { renderVault } from './ui/vault.js';
import { renderMe, openSafetySheet, openEngineSheet } from './ui/me.js';
import { renderWidget } from './ui/widget.js';
import { renderOnboarding, onboardingAction, onboardingCopy, onboardingExit } from './ui/onboarding.js';
import { openPresenceSheet } from './ui/presence.js';
import { openCirclesSheet } from './ui/circles.js';
import { openMemberSheet } from './ui/member.js';
import { toast } from './ui/toast.js';
import { butlerAccept, butlerDismiss } from './butler.js';
import { startSim, loadScenario, setSpeed, restartScenario } from './sim.js';
import { icon } from './ui/icons.js';

// UI-Chrome: Lucide-Icons statt Glyphen (DESIGN.md: Emoji nur als Nutzer-Ausdruck)
const TAB_ICONS = { dashboard: 'radar', moments: 'sparkles', vault: 'vault', me: 'user' };
document.querySelectorAll('#tabbar button').forEach(b => {
  const el = b.querySelector('.tab-ico');
  if (el) el.innerHTML = icon(TAB_ICONS[b.dataset.tab] || 'radar', 22);
});
document.getElementById('regie-fab').innerHTML = icon('sliders', 22);

const app = document.getElementById('app');
const sheets = { presence: openPresenceSheet, circles: openCirclesSheet, safety: openSafetySheet, engine: openEngineSheet };

const screens = {
  dashboard: renderDashboard,
  moments: renderMoments,
  vault: renderVault,
  me: renderMe,
  widget: renderWidget,
  onboarding: renderOnboarding,
};

let current = 'dashboard';
let lastSig = '';

// Signatur der SICHTBAREN Zustände: Re-Render nur, wenn sich hier etwas ändert.
// Der Sekunden-Tick der Uhr allein löst KEIN Re-Render mehr aus (Anti-Flicker).
function computeSig() {
  const st = S();
  const p = Object.keys(st.presence).map(id => { const v = visiblePresence(id); return id + (v ? v.mode + v.energy : '-'); }).join(',');
  const m = st.moments.map(x => x.id + x.joined.length + (x.ttlUntil > st.clock ? 'a' : 'x') + (x.echo ? 'e' : '')).join(',');
  const b = st.butler.map(x => x.id).join(',');
  const c = Object.values(st.circles).map(x => x.id + Math.round(x.glut / 5) + x.xp + x.vault.length).join(',');
  return [current, st.meta.activeCircle, st.scenario, st.invisible.me ? 1 : 0, p, m, b, c].join('|');
}

export function nav(name) {
  if (!screens[name]) return;
  if (current === 'onboarding' && name !== 'onboarding') onboardingExit();
  current = name;
  render(true);
  document.querySelectorAll('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === current));
}

function render(animate = false) {
  screens[current](app);
  if (!animate) {
    const s = app.querySelector('.screen');
    if (s) s.classList.add('noanim');
  }
  lastSig = computeSig();
}

// Countdown-Texte in-place aktualisieren — ohne DOM-Neuaufbau
function patchCountdowns() {
  app.querySelectorAll('[data-left]').forEach(el => {
    el.textContent = fmtLeft(Number(el.dataset.left)) + (el.dataset.suffix || '');
  });
}

// ---- Zentrale Aktionen (delegiert) ----
function joinMoment(id) {
  const st = S();
  const m = st.moments.find(x => x.id === id);
  if (!m || m.joined.includes('me') || m.ttlUntil <= st.clock) return;
  setS({ moments: st.moments.map(x => x.id === id ? { ...x, joined: [...x.joined, 'me'] } : x) });
  reignite(m.circle, 'Erik', 8);
  toast('Du bist dabei. ' + m.joined.length + ' aus deinem Kreis freuen sich.');
}

function echoMoment(id) {
  const st = S();
  const m = st.moments.find(x => x.id === id);
  if (!m) return;
  const c = st.circles[m.circle];
  const entry = { week: 'Heute', text: '„' + m.title + '“ — ' + m.joined.length + ' waren dabei.', emoji: '✦' };
  setS({
    circles: { ...st.circles, [m.circle]: { ...c, vault: [entry, ...c.vault] } },
    moments: st.moments.map(x => x.id === id ? { ...x, echo: true } : x),
  });
  reignite(m.circle, 'Erik', 4, 30);
  toast('Als Erinnerung im Vault gespeichert. ✦');
}

app.addEventListener('click', e => {
  const find = attr => { const el = e.target.closest('[' + attr + ']'); return el && el.getAttribute(attr); };
  const person = find('data-person');
  if (person) return person === 'me' ? openPresenceSheet() : openMemberSheet(person);
  const navTo = find('data-nav');      if (navTo) return nav(navTo);
  const sheet = find('data-sheet');    if (sheet && sheets[sheet]) return sheets[sheet]();
  const join = find('data-join');      if (join) return joinMoment(join);
  const echo = find('data-echo');      if (echo) return echoMoment(echo);
  const ok = find('data-butler-ok');
  if (ok) {
    const m = butlerAccept(ok);
    if (m) { reignite(m.circle, 'Erik', 10); toast('Moment erstellt — dein Kreis sieht ihn jetzt.'); }
    return;
  }
  const no = find('data-butler-no');   if (no) return butlerDismiss(no);
  if (e.target.closest('[data-toggle-invisible]')) {
    const st = S();
    const on = !st.invisible.me;
    setS({ invisible: { ...st.invisible, me: on } });
    toast(on ? 'Du bist unsichtbar — für alle wie ein abgelaufenes Signal.' : 'Du bist wieder sichtbar.');
    return;
  }
  if (e.target.closest('[data-ob-copy]')) return onboardingCopy();
  const ob = find('data-ob');
  if (ob) {
    const target = onboardingAction(ob);
    if (target) nav(target);
    return;
  }
});

// ---- Tabbar & Regie-Leiste (einmalig gebunden) ----
document.querySelectorAll('#tabbar button').forEach(b => {
  b.addEventListener('click', () => nav(b.dataset.tab));
});

const scenarioSel = document.getElementById('ctl-scenario');
scenarioSel.disabled = false;
scenarioSel.value = S().scenario;
scenarioSel.addEventListener('change', () => {
  loadScenario(scenarioSel.value);
  nav('dashboard');
  toast('Szenario geladen: ' + scenarioSel.options[scenarioSel.selectedIndex].text);
});

document.querySelectorAll('#ctl-speed button').forEach(b => {
  b.disabled = false;
  b.addEventListener('click', () => {
    setSpeed(Number(b.dataset.speed));
    document.querySelectorAll('#ctl-speed button').forEach(x => x.classList.toggle('on', x === b));
  });
});

document.getElementById('ctl-reset').addEventListener('click', () => {
  restartScenario();
  nav('dashboard');
  toast('Szenario neu gestartet.');
});

// Mobile Demo-Regie als Sheet (Desktop nutzt die Topbar)
function openRegieSheet() {
  const root = document.getElementById('sheet-root');
  const st = S();
  const scen = [['feierabend', 'Feierabend'], ['gymtag', 'Gym-Tag'], ['nacht', 'Nacht']];
  root.innerHTML = `
    <div class="sheet-backdrop" data-rclose></div>
    <div class="sheet">
      <div class="h-display h2" style="margin-bottom:2px">Demo-Regie</div>
      <div class="tiny" style="margin-bottom:12px">Simulierte Demo-Zeit: ${fmtClock()} · 1 Sekunde = ${st.speed} Demo-Minute${st.speed > 1 ? 'n' : ''}</div>
      <div class="sub" style="font-weight:700; margin-bottom:8px">Szenario</div>
      <div class="dur-row">
        ${scen.map(([id, label]) => `<button class="dur-pill ${st.scenario === id ? 'on' : ''}" data-rscen="${id}">${label}</button>`).join('')}
      </div>
      <div class="sub" style="font-weight:700; margin:14px 0 8px">Tempo</div>
      <div class="dur-row">
        ${[1, 10, 60].map(n => `<button class="dur-pill ${st.speed === n ? 'on' : ''}" data-rspeed="${n}">${n}×</button>`).join('')}
      </div>
      <button class="btn ghost" data-rreset style="margin-top:16px">↺ Szenario neu starten</button>
    </div>`;
  root.querySelector('[data-rclose]').addEventListener('click', () => { root.innerHTML = ''; });
  root.querySelectorAll('[data-rscen]').forEach(b => b.addEventListener('click', () => {
    loadScenario(b.dataset.rscen);
    document.getElementById('ctl-scenario').value = b.dataset.rscen;
    root.innerHTML = '';
    nav('dashboard');
    toast('Szenario geladen: ' + b.textContent);
  }));
  root.querySelectorAll('[data-rspeed]').forEach(b => b.addEventListener('click', () => {
    setSpeed(Number(b.dataset.rspeed));
    root.querySelectorAll('[data-rspeed]').forEach(x => x.classList.toggle('on', x === b));
  }));
  root.querySelector('[data-rreset]').addEventListener('click', () => {
    restartScenario();
    root.innerHTML = '';
    nav('dashboard');
    toast('Szenario neu gestartet.');
  });
}
document.getElementById('regie-fab').addEventListener('click', openRegieSheet);

function syncStageClock() {
  document.getElementById('stage-clock').textContent = fmtClock();
  document.querySelectorAll('#ctl-speed button').forEach(x => x.classList.toggle('on', Number(x.dataset.speed) === S().speed));
}

sub(() => {
  if (computeSig() !== lastSig) {
    render();
  } else {
    patchCountdowns();
  }
  syncStageClock();
});

// Boot: Szenario frisch laden (Events ab 18:00 bzw. 01:30), Sim starten
loadScenario(S().scenario);
startSim();
render(true);
syncStageClock();
console.log('[presence-demo] AP3 bereit — Szenario:', S().scenario);

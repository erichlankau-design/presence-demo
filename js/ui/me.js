// „Du“-Tab: Unsichtbar-Modus, Safety-Center, Rhythm-Engine-Transparenz, Widget & Onboarding.
import { S, setS, visiblePresence } from '../state.js';
import { MODES } from '../data.js';
import { avatarHTML } from './dashboard.js';
import { closeSheet } from './presence.js';

export function renderMe(el) {
  const st = S();
  const invisible = !!st.invisible.me;
  const vp = visiblePresence('me');
  const mode = vp ? MODES.find(m => m.id === vp.mode) : null;

  el.innerHTML = `
    <section class="screen">
      <div style="padding:6px 2px 10px">
        <div class="h-display h1">Du</div>
        <div class="tiny">Deine Sichtbarkeit gehört dir — in jedem Kreis, jederzeit.</div>
      </div>

      <div class="card">
        <div class="row" style="border:none">
          <span style="font-size:22px">🕶️</span>
          <span class="grow">
            <div style="font-weight:700; font-size:14.5px">Unsichtbar-Modus</div>
            <div class="tiny">Nicht erkennbar — wirkt exakt wie ein abgelaufenes Signal</div>
          </span>
          <button class="toggle ${invisible ? 'on' : ''}" data-toggle-invisible aria-label="Unsichtbar umschalten"><i></i></button>
        </div>
        <div class="ghost-preview">
          <div class="tiny" style="margin-bottom:6px"><b>So sehen dich andere gerade:</b></div>
          <div style="display:flex; align-items:center; gap:14px">
            ${avatarHTML('me', { name: false })}
            <span class="tiny">${vp
              ? 'Erik · ' + mode.emoji + ' ' + mode.label + ' — sichtbar'
              : 'Erik — kein Signal. Ob unsichtbar, abgelaufen oder nie gesetzt: von außen <b>identisch</b>. Niemand kann fragen, „vor wem du dich versteckst“.'}</span>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <button class="row" style="border:none; width:100%" data-sheet="safety">
          <span style="font-size:22px">🛟</span>
          <span class="grow" style="text-align:left">
            <div style="font-weight:700; font-size:14.5px">Safety-Center</div>
            <div class="tiny">Lautloser Austritt · Schutz vor Kontrolle · Hilfe-Nummern</div>
          </span><span class="chev" style="color:var(--muted)">›</span>
        </button>
        <button class="row" style="width:100%" data-sheet="engine">
          <span style="font-size:22px">✦</span>
          <span class="grow" style="text-align:left">
            <div style="font-weight:700; font-size:14.5px">Was die Rhythm Engine weiß</div>
            <div class="tiny">KI-Kennzeichnung · on-device · max. 2 Vorschläge am Tag</div>
          </span><span class="chev" style="color:var(--muted)">›</span>
        </button>
        <button class="row" style="width:100%" data-nav="widget">
          <span style="font-size:22px">📱</span>
          <span class="grow" style="text-align:left">
            <div style="font-weight:700; font-size:14.5px">Widget-Vorschau</div>
            <div class="tiny">Dein Kreis auf dem Homescreen — ohne die App zu öffnen</div>
          </span><span class="chev" style="color:var(--muted)">›</span>
        </button>
        <button class="row" style="width:100%" data-nav="onboarding">
          <span style="font-size:22px">🌱</span>
          <span class="grow" style="text-align:left">
            <div style="font-weight:700; font-size:14.5px">Onboarding ansehen</div>
            <div class="tiny">Der Einstieg neuer Nutzer:innen — inkl. 16+-Check</div>
          </span><span class="chev" style="color:var(--muted)">›</span>
        </button>
      </div>

      <p class="tiny" style="text-align:center; margin-top:14px; line-height:1.6">
        Kein „zuletzt online“. Keine Lesebestätigungen. Keine Standortdaten. Keine Historie.<br>
        Was es nicht gibt, kann niemand gegen dich verwenden.
      </p>
    </section>`;
}

export function openSafetySheet() {
  const root = document.getElementById('sheet-root');
  root.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet">
      <div class="h-display h2">Safety-Center</div>
      <div class="tiny" style="margin-bottom:12px">Presence ist für Nähe gebaut — und gegen Kontrolle gehärtet.</div>
      <div class="row" style="border:none"><span style="font-size:20px">🚪</span><span class="grow">
        <div style="font-weight:700; font-size:14px">Lautloser Austritt</div>
        <div class="tiny">Du kannst jeden Kreis ohne Benachrichtigung verlassen — für die anderen „pausiert“ er nur. Auf Wunsch werden alle gemeinsamen Daten bei dir gelöscht.</div></span></div>
      <div class="row"><span style="font-size:20px">🛡️</span><span class="grow">
        <div style="font-weight:700; font-size:14px">Schutz vor einseitigem Beobachten</div>
        <div class="tiny">Schaut jemand auffällig oft nach dir, ohne je selbst Signale zu setzen, zeigen wir DIR diskret Schutz-Optionen. Die andere Person erfährt nie davon.</div></span></div>
      <div class="row"><span style="font-size:20px">📞</span><span class="grow">
        <div style="font-weight:700; font-size:14px">Hilfe, die wirklich hilft</div>
        <div class="tiny">Hilfetelefon Gewalt gegen Frauen: <b>116 016</b> (24/7, anonym) · TelefonSeelsorge: <b>0800 111 0 111</b>. Unsere Engine spielt nie Therapeutin — bei ernsten Signalen verbinden wir mit Menschen.</div></span></div>
      <button class="btn ghost" data-close style="margin-top:14px">Schließen</button>
    </div>`;
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeSheet));
}

export function openEngineSheet() {
  const root = document.getElementById('sheet-root');
  root.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet">
      <span class="ai-tag" style="margin-bottom:8px">✦ Rhythm Engine — KI</span>
      <div class="h-display h2" style="margin-top:6px">Was sie weiß. Was sie nie tut.</div>
      <div class="row" style="border:none"><span style="font-size:20px">📈</span><span class="grow">
        <div style="font-weight:700; font-size:14px">Sie lernt euren Rhythmus</div>
        <div class="tiny">Wann euer Kreis empfänglich ist und welche Vorschläge ihr mögt — als abstrakte Muster, direkt auf deinem Gerät. Roh-Verhalten verlässt dein Telefon nicht.</div></span></div>
      <div class="row"><span style="font-size:20px">🤫</span><span class="grow">
        <div style="font-weight:700; font-size:14px">Sie ist bewusst still</div>
        <div class="tiny">Maximal 2 Vorschläge pro Tag und Kreis. „Heute nicht“ ist folgenlos — kein Nachhaken, kein Zähler, keine Schuld.</div></span></div>
      <div class="row"><span style="font-size:20px">🚫</span><span class="grow">
        <div style="font-weight:700; font-size:14px">Rote Linien</div>
        <div class="tiny">Sie erwähnt nie, wer fehlt. Sie hat keinen Namen, kein Gesicht, keine Gefühle — sie organisiert Menschen, sie ersetzt keine. Jeder Vorschlag ist als KI gekennzeichnet.</div></span></div>
      <button class="btn ghost" data-close style="margin-top:14px">Alles klar</button>
    </div>`;
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeSheet));
}

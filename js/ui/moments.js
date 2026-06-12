// Momente-Tab: aktive Anlass-Karten (alle Kreise) + vergangene mit Echo-ins-Vault.
import { S, fmtLeft } from '../state.js';
import { PEOPLE } from '../data.js';

function faces(m) {
  return m.joined.map(id => `<span class="mini" style="background:${PEOPLE[id].color}">${PEOPLE[id].name.slice(0, 2)}</span>`).join('');
}

export function renderMoments(el) {
  const st = S();
  const active = st.moments.filter(m => m.ttlUntil > st.clock);
  const past = st.moments.filter(m => m.ttlUntil <= st.clock && !m.echo);

  const activeHTML = active.length ? active.map(m => {
    const joined = m.joined.includes('me');
    const c = st.circles[m.circle];
    return `
      <div class="moment-card" style="margin-top:10px">
        <div class="mc-top">
          <span class="mc-title">${c.emoji} ${m.title}</span>
          <span class="mc-ttl" data-left="${m.ttlUntil}">${fmtLeft(m.ttlUntil)}</span>
        </div>
        <div class="mc-bottom">
          <div class="moment-faces">${faces(m)}</div>
          <button class="btn small ${joined ? 'ghost' : ''}" data-join="${m.id}">${joined ? 'Dabei ✓' : 'Ein Tap: dabei'}</button>
        </div>
      </div>`;
  }).join('') : `
    <div class="placeholder" style="padding:28px 16px">
      <span class="ph-emoji">🕯️</span>
      <p class="sub">Gerade kein offener Moment.<br>Kein Druck — wenn sich Energien überlappen, schlägt eure Rhythm Engine einen vor.</p>
    </div>`;

  const pastHTML = past.length ? past.map(m => {
    const c = st.circles[m.circle];
    return `
      <div class="row">
        <span style="font-size:20px">${c.emoji}</span>
        <span class="grow">
          <div style="font-weight:600; font-size:13.5px">${m.title}</div>
          <div class="tiny">${m.joined.length} waren dabei · vorbei</div>
        </span>
        <button class="btn small ghost" data-echo="${m.id}">Echo in den Vault</button>
      </div>`;
  }).join('') : '';

  el.innerHTML = `
    <section class="screen">
      <div style="padding:6px 2px 10px">
        <div class="h-display h1">Momente</div>
        <div class="tiny">Kurzlebige Anlässe statt ewiger Feeds — jede Karte läuft von selbst ab.</div>
      </div>
      <div class="card"><div class="sub"><b>Jetzt offen</b></div>${activeHTML}</div>
      ${past.length ? `<div class="card" style="margin-top:12px"><div class="sub" style="margin-bottom:4px"><b>Vorbei — als Erinnerung sichern?</b></div>${pastHTML}</div>` : ''}
    </section>`;
}

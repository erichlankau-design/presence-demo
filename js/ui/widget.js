// Widget-Vorschau: Homescreen-Mock mit Kreis-Wetter-Widget + Live Activity.
// Das Investoren-Visual für „Widget-first“ (Masterplan Kap. 4.5).
import { S, visiblePresence } from '../state.js';
import { PEOPLE } from '../data.js';
import { icon } from './icons.js';

const DUMMIES = ['📷', '🎧', '💬', '🗺️', '📅', '☁️', '🏦', '🍿'];

export function renderWidget(el) {
  const st = S();
  const c = st.circles[st.meta.activeCircle];
  const present = c.members.filter(id => visiblePresence(id));
  const liveMoment = st.moments.find(m => m.ttlUntil > st.clock && m.circle === c.id);

  const minis = c.members.map(id => {
    const vp = visiblePresence(id);
    return `<span class="wmini ${vp ? vp.energy : 'eoff'}" style="background:${PEOPLE[id].color}">${PEOPLE[id].name.slice(0, 2)}</span>`;
  }).join('');

  el.innerHTML = `
    <section class="screen">
      <div style="display:flex; align-items:center; gap:8px; padding:6px 2px 10px">
        <button class="chip" data-nav="me">‹ Zurück</button>
        <span class="grow"></span>
        <span class="tiny">So lebt Presence auf dem Homescreen</span>
      </div>

      <div class="home-mock">
        ${liveMoment ? `
        <div class="live-activity">
          <span class="la-dot"></span>
          <span class="grow" style="text-align:left">
            <b>${liveMoment.title}</b><br>
            <span style="opacity:0.75">${liveMoment.joined.length} sind da · Live Activity</span>
          </span>
          <span style="font-size:16px">${c.emoji}</span>
        </div>` : ''}

        <div class="pwidget">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <span style="font-weight:700; font-size:13px">${c.emoji} ${c.name}</span>
            <span class="glut ${c.glut < 35 ? 'low' : ''}" style="padding:3px 9px; font-size:11px"><span class="flame">${icon('flame', 11)}</span>${c.glut}</span>
          </div>
          <div class="wminis">${minis}</div>
          <div class="tiny" style="margin-top:6px">${present.length ? present.length + ' gerade da — tippen zum Andocken' : 'Gerade ist Ruhe — auch schön.'}</div>
        </div>

        <div class="home-icons">
          ${DUMMIES.map(d => `<span class="home-icon">${d}</span>`).join('')}
        </div>
        <div class="home-dock">
          <span class="home-icon">📞</span><span class="home-icon">🌐</span>
          <span class="home-icon pres">◉</span><span class="home-icon">✉️</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="sub"><b>Warum das zählt</b></div>
        <div class="tiny" style="margin-top:6px; line-height:1.6">
          Das Widget aktualisiert sich über Push-Timelines — <b>0 % zusätzlicher Akku</b>, null App-Öffnungszwang.
          Locket hat mit diesem Muster über 9 Mio. tägliche Nutzer:innen gebunden.
          Presence darf benutzt werden, ohne geöffnet zu werden: Das ist Calm Technology — und der beste Gesprächsstarter („Was ist das auf deinem Homescreen?“).
        </div>
      </div>
    </section>`;
}

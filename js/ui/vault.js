// Memory Vault: das private Gruppengedächtnis — Kapitel, Einträge, Wrapped-Teaser.
import { S } from '../state.js';

export function renderVault(el) {
  const st = S();
  const c = st.circles[st.meta.activeCircle];
  const entries = c.vault.length ? c.vault.map(v => `
    <div class="row">
      <span style="font-size:20px">${v.emoji}</span>
      <span class="grow">
        <div style="font-weight:600; font-size:13.5px; line-height:1.4">${v.text}</div>
        <div class="tiny">${v.week}</div>
      </span>
    </div>`).join('') : `
    <div class="placeholder" style="padding:24px 12px">
      <span class="ph-emoji">✦</span>
      <p class="sub">Noch leer — sichert euren ersten Moment als Echo,<br>dann beginnt hier eure Geschichte.</p>
    </div>`;

  el.innerHTML = `
    <section class="screen">
      <div style="padding:6px 2px 10px">
        <div class="h-display h1">Memory Vault</div>
        <div class="tiny">${c.emoji} ${c.name} · nur für euch · E2E-verschlüsselt</div>
      </div>

      <div class="card">
        <div class="level-strip">
          <span>Kapitel: <b>${c.levelName}</b> · Level ${c.level}</span>
          <div class="level-bar"><i style="width:${Math.round((c.xp / c.xpNext) * 100)}%"></i></div>
          <span class="tiny">${c.xp}/${c.xpNext}</span>
        </div>
        <div class="tiny" style="margin-top:6px">Jedes Quartal schließt ein Kapitel mit einem Rückblick — kein endloses Grinden.</div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="sub" style="margin-bottom:4px"><b>Eure Momente</b></div>
        ${entries}
      </div>

      <div class="card wrapped-teaser" style="margin-top:12px">
        <div style="display:flex; align-items:center; gap:12px">
          <span style="font-size:30px">🎁</span>
          <span class="grow">
            <div style="font-weight:700; font-size:15px">Circle Wrapped</div>
            <div class="tiny" style="color:rgba(255,255,255,0.85)">Im Dezember: euer Jahr als Geschichte — und auf Wunsch als gedrucktes Jahrbuch.</div>
          </span>
        </div>
      </div>

      <p class="tiny" style="text-align:center; margin-top:12px">Export jederzeit · Löschen löscht wirklich · gehört dem Kreis, nicht uns</p>
    </section>`;
}

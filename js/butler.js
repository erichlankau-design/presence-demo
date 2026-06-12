// Rhythm Engine: respektvolle, GEKENNZEICHNETE Vorschläge — max 2 pro Demo-Tag (Calm-Budget).
// Regeln: nie Abwesende erwähnen, nie Schuld, Ablehnen ist still und folgenlos.
import { S, setS } from './state.js';

let nextId = 1;

export function suggest(circleId, text, momentDraft) {
  const st = S();
  if (st.meta.calmBudgetUsed >= 2) return; // Knappheit hält Vorschläge wertvoll
  const card = { id: 'b' + (nextId++), circle: circleId, text, draft: momentDraft, at: st.clock };
  setS({
    butler: [...st.butler, card],
    meta: { ...st.meta, calmBudgetUsed: st.meta.calmBudgetUsed + 1 },
  });
}

export function butlerCardsHTML(circleId) {
  const cards = S().butler.filter(b => b.circle === circleId);
  if (!cards.length) return '';
  return cards.map(b => `
    <div class="card butler-card" style="margin-top:12px">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
        <span class="ai-tag">✦ Rhythm Engine</span>
        <span class="tiny">Vorschlag ${S().meta.calmBudgetUsed} von max. 2 heute</span>
      </div>
      <div style="font-size:14.5px; font-weight:600; line-height:1.4">${b.text}</div>
      <div style="display:flex; gap:8px; margin-top:10px">
        <button class="btn small" data-butler-ok="${b.id}">Klingt gut</button>
        <button class="btn small ghost" data-butler-no="${b.id}">Heute nicht</button>
      </div>
    </div>`).join('');
}

export function butlerAccept(id) {
  const st = S();
  const b = st.butler.find(x => x.id === id);
  if (!b) return null;
  const moment = {
    id: 'm' + Date.now(),
    circle: b.circle,
    title: b.draft.title,
    by: 'me',
    ttlUntil: st.clock + (b.draft.ttl || 90),
    joined: [...new Set(['me', ...(b.draft.joined || [])])],
    echo: null,
  };
  setS({ butler: st.butler.filter(x => x.id !== id), moments: [...st.moments, moment] });
  return moment;
}

export function butlerDismiss(id) {
  // Still und folgenlos — kein Zähler, keine Nachfrage, kein „bist du sicher?"
  setS({ butler: S().butler.filter(x => x.id !== id) });
}

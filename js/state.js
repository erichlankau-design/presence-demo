// Zentraler Store: S() lesen, setS(patch) schreiben (merge, persist, notify), sub(fn) abonnieren.
import { seed } from './data.js';

const KEY = 'presence-demo-v1';
let state = load();
const subs = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.circles) return parsed;
    }
  } catch (e) { /* defekter Storage -> seed */ }
  return seed();
}

export function S() { return state; }

export function setS(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* voll/privat -> egal */ }
  subs.forEach(fn => fn(state));
}

export function sub(fn) { subs.add(fn); return () => subs.delete(fn); }

export function resetDemo() {
  try { localStorage.removeItem(KEY); } catch (e) {}
  state = seed();
  subs.forEach(fn => fn(state));
}

// ---- Zeit-Helfer: clock = Minuten seit 18:00 ----
export function fmtClock(mins = state.clock) {
  const total = (18 * 60 + Math.floor(mins)) % (24 * 60);
  const h = String(Math.floor(total / 60)).padStart(2, '0');
  const m = String(total % 60).padStart(2, '0');
  return h + ':' + m;
}

export function minsLeft(until) {
  return Math.max(0, Math.round(until - state.clock));
}

export function fmtLeft(until) {
  const left = minsLeft(until);
  if (left <= 0) return 'abgelaufen';
  if (left < 60) return 'noch ' + left + ' Min';
  const h = Math.floor(left / 60), m = left % 60;
  return 'noch ' + h + ' h' + (m ? ' ' + m + ' Min' : '');
}

// Glut neu entfachen + kollektive XP (es gibt KEINE Einzel-XP)
export function reignite(circleId, byName, glutPlus = 12, xpPlus = 20) {
  const c = state.circles[circleId];
  if (!c) return;
  const circles = {
    ...state.circles,
    [circleId]: {
      ...c,
      glut: Math.min(100, Math.round(c.glut + glutPlus)),
      glutBy: byName,
      xp: Math.min(c.xpNext, c.xp + xpPlus),
    },
  };
  setS({ circles });
}

// Sichtbare Presence einer Person (Konzept: Unsichtbar & abgelaufen sind IDENTISCH nicht unterscheidbar)
export function visiblePresence(personId) {
  const p = state.presence[personId];
  if (!p || !p.mode) return null;
  if (state.invisible[personId]) return null;
  if (p.until <= state.clock) return null;
  return p;
}

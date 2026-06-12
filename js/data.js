// Demo-Daten & Konstanten — Quelle: Masterplan Kap. 4 (Presence 2.0)

export const MODES = [
  { id: 'gym',      label: 'Gym',       emoji: '🏋️' },
  { id: 'gaming',   label: 'Gaming',    emoji: '🎮' },
  { id: 'sofa',     label: 'Sofa',      emoji: '🛋️' },
  { id: 'fokus',    label: 'Fokus',     emoji: '🎯' },
  { id: 'unterwegs',label: 'Unterwegs', emoji: '🚶' },
  { id: 'nacht',    label: 'Nacht',     emoji: '🌙' },
  { id: 'kreativ',  label: 'Kreativ',   emoji: '🎨' },
  { id: 'eigene',   label: 'Eigene',    emoji: '✨' },
];

export const ENERGIES = [
  { id: 'e0', label: 'Offen für alles',        short: 'Offen',        hint: 'Komm vorbei, ruf an, alles gut' },
  { id: 'e1', label: 'Quatschen ja, Pläne nein', short: 'Quatschen',  hint: 'Locker schreiben ist willkommen' },
  { id: 'e2', label: 'Nur Reaktionen',          short: 'Reaktionen',  hint: 'Daumen & Herzen, kein Talk' },
  { id: 'e3', label: 'Bitte nicht stören',      short: 'Nicht stören',hint: 'Bin da, aber für mich' },
  { id: 'e4', label: 'Brauch jemanden',         short: 'SOS',         hint: 'Sanftes Signal an den Kreis' },
];

export const PEOPLE = {
  me:    { id: 'me',    name: 'Erik',  color: '#0F766E' },
  lisa:  { id: 'lisa',  name: 'Lisa',  color: '#8B7FD7' },
  max:   { id: 'max',   name: 'Max',   color: '#0EA5E9' },
  jonas: { id: 'jonas', name: 'Jonas', color: '#F59E0B' },
  sara:  { id: 'sara',  name: 'Sara',  color: '#EC4899' },
  mara:  { id: 'mara',  name: 'Mara',  color: '#10B981' },
  tom:   { id: 'tom',   name: 'Tom',   color: '#6366F1' },
};

// clock = Minuten seit 18:00 des Demo-Tags. until = clock-Minute, zu der das Signal abläuft.
export function seed() {
  return {
    clock: 0,
    speed: 1,
    scenario: 'feierabend',
    meta: { activeCircle: 'gym', onboarded: true, calmBudgetUsed: 0 },
    circles: {
      gym: {
        id: 'gym', name: 'Gym Legends', emoji: '🏋️', members: ['me', 'lisa', 'max', 'jonas', 'sara'],
        level: 18, levelName: 'Gym Legends', xp: 2340, xpNext: 5000,
        glut: 78, glutBy: 'Lisa',
        ritual: { name: 'PR-Freitag', next: 'Fr 17:00', emoji: '🏆' },
        vault: [
          { week: 'KW 22', text: 'Max hat 140 kg gezogen — der ganze Kreis war live dabei.', emoji: '🎉' },
          { week: 'KW 21', text: 'Erstes gemeinsames Frühtraining. 6:30 Uhr. Nie wieder. (Doch.)', emoji: '🌅' },
        ],
      },
      duo: {
        id: 'duo', name: 'Erik & Lisa', emoji: '🫶', members: ['me', 'lisa'],
        level: 7, levelName: 'Eingespielt', xp: 610, xpNext: 1000,
        glut: 92, glutBy: 'Erik',
        ritual: { name: 'Sonntags-Check', next: 'So 19:00', emoji: '☕' },
        vault: [
          { week: 'KW 22', text: 'Spontaner Abendspaziergang nach dem Sofa-Signal.', emoji: '🌇' },
        ],
      },
      wg: {
        id: 'wg', name: 'WG Sonnenallee', emoji: '🏠', members: ['me', 'mara', 'tom'],
        level: 11, levelName: 'Eingelebt', xp: 1480, xpNext: 2500,
        glut: 41, glutBy: 'Mara',
        ritual: { name: 'Mittwoch-Kochabend', next: 'Mi 19:30', emoji: '🍝' },
        vault: [
          { week: 'KW 22', text: 'Kochabend: Maras Pasta hat offiziell Legendenstatus.', emoji: '🍝' },
        ],
      },
    },
    // Presence je Person: mode, energy, until (clock-Minute) — null = kein Signal
    presence: {
      me:    { mode: 'sofa',      energy: 'e1', until: 240 },
      lisa:  { mode: 'gym',       energy: 'e0', until: 150 },
      max:   { mode: 'gaming',    energy: 'e0', until: 200 },
      jonas: { mode: 'fokus',     energy: 'e3', until: 120 },
      sara:  { mode: null,        energy: null, until: 0 },
      mara:  { mode: 'unterwegs', energy: 'e2', until: 90 },
      tom:   { mode: null,        energy: null, until: 0 },
    },
    invisible: {},            // personId -> true (AP4: nicht detektierbar — wirkt wie abgelaufen)
    moments: [
      { id: 'm1', circle: 'gym', title: 'Feierabend-Pump um 18:30?', by: 'lisa', ttlUntil: 90, joined: ['lisa', 'max'], echo: null },
    ],
    butler: [],               // AP3: Vorschlagskarten der Rhythm Engine
  };
}

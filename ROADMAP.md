# Presence — Herz-und-Nieren-Verdikt & Build-Backlog (17.06.2026)

Konsolidiert aus 4 parallelen Audit-Agents (Feature-Gap, Markt/Integrität, Design/UX, Unternehmer-Ship-Gap).
Persistenter Resume-Anker: hier steht, was geprüft wurde, was gebaut wird, was offen ist.

## VERDIKT (Kurzfassung)

1. **Kernidee — TEILWEISE intakt (noch ok, aber Drift-Risiko).** Der ruhige Anwesenheits-Layer ist marktrelevanter denn je (Calm-/„slow friendship"-Trend, 41 % Gen Z einsam). ABER die SUMME der Ergänzungen verschiebt den Schwerpunkt subtil von *passivem Sehen* („wer ist da") zu *aktivem Aktivitätswunsch* („lass uns was machen") — genau die 2026 überfüllte „who's-free-to-hang-out"-Commodity (I'm In, LetsGather, WeekOf …). BeReal starb dokumentiert an „featureitis". **Leitplanke: Jede Funktion muss den Anwesenheits-Layer RUHIGER machen, nicht eine Aktivität hinzufügen.** „Hab Zeit?"-Status nur als druckfreier Sub-Zustand halten; Gym-Cross-App in die Eisbox.
2. **Design — Politur, kein Redesign (Note 7/10).** Fundament stark (warmes Blauschwarz, Aurora-Hauch, Ember-Signature, Figtree, Motion). Fehlt: Hierarchie/Mut. Fixes: Hero-Radar statt „Wand aus Karten", AA-Kontrast, Emoji→Lucide, Display-Typo, sichtbarere Card-Borders.
3. **Ship-Gap (Unternehmer-Brille) — die Demo ist eine „Filmkulisse".** Limitierender Faktor ist NICHT Code/Design/Geld, sondern **fehlender Retention-Beweis in echten Kreisen**. Höchster Hebel: **Concierge-Funke-Test mit 10–25 echten WhatsApp-Kreisen VOR jedem MVP** (taucht abends wirklich jemand gleichzeitig auf?). Dann Invite-Loop als Produktkern, dann dünnster MVP (Auth + Realtime-Presence + Push + Funke + Invite).

> Ehrliche Konsequenz: Die Demo ist als Vision/Pitch-Asset jetzt reich genug. Weitere Demo-Features bringen abnehmenden Grenznutzen — der nächste WIRKLICHE Schritt ist der Concierge-Retention-Test, nicht mehr Features. Diese Runde baut nur noch KERN-STÄRKENDE Features (Trust, Belohnung, Verständlichkeit) + Design-Politur; alles „Aktivitäts"-Nahe wird bewusst geparkt.

## BUILD-BACKLOG

### Diese Runde (AP12) — kern-stärkend + Design-Politur
- [ ] **Design P0:** AA-Kontrast (`--text-3` ≥ #8A90A4; Energie-Farben nie als Fließtext), Card-Border 0.07→0.10, `--accent-fill` 0.14→0.20, Tabbar Icons 20px/Labels --text-2. (tokens.css/base.css)
- [ ] **Block/Report/Mute-Flow** (P0, Trust): `state.blocked[]`; `visiblePresence()` filtert; Sheet im Member-Sheet + Safety-Center. Zentrales Investoren-/Vertrauensargument.
- [ ] **Schulterklopfen/Badges** (P0, kollektiv, anti-Ranking): warme Anerkennung, `circle.badges[]`, `.chip`-CSS, via `reignite`-Hook. Die versprochene druckfreie Belohnung.
- [ ] **Benachrichtigungs-Inbox** (P0, schlank/calm): `state.notifs[]` sammelt Signale/Echos/Funke; Glocke + Liste; KEIN Feed/Endlos-Scroll, kein Druck-Zähler.
- [ ] **Design P0 (light):** Energy-Radar etwas größer/„Hero"-iger (Höhe, zweite Glow-Ebene).

### Geparkt — bewusst NICHT bauen (Drift-Risiko / abnehmender Nutzen)
- Eigene Moment-Erstellung durch Nutzer → driftet Richtung Planungs-Tool (Markt-Warnung). Erst wenn Kern bewiesen.
- Cross-App „frei/belegt"/„heute trainiert" → Eisbox (verwässert „Layer über Freundeskreisen").

### Nächste Design-Welle (P1, falls gewünscht)
- Voller Bento-Layout-Umbau Dashboard, Display-Typo-Stufe (clamp 38–52px), Emoji→Lucide flächendeckend, Empty-States mit SVG+Copy+CTA, Funke/Glut visuell entkoppeln.

### Feature P1/P2 (Demo, später)
- Circle Wrapped als echter Flow (Dezember-Story, virales Visual) · Glut-/Kapitel-Detailansicht · Rituale interaktiv · Profil/„max 1 Profilbild" · 2er-Kreis als gelebter Modus · echte Kreis-Erstellung · Funke→Vault-Eintrag · SOS-Empfänger-Sicht.

## DER EIGENTLICHE NÄCHSTE SCHRITT (jenseits der Demo)
**Concierge-Funke-Test, 14 Tage, 10–25 echte WhatsApp-Kreise** (Gym-Crew, WG, alte Schulgruppe): täglich 19:00 manueller „Funke" („Wer hat heute Abend Zeit? 👋 30-Min-Fenster"). Gate: ≥40 % der Kreise mit ≥2 Auftauchenden an D7 → MVP bauen; sonst Konzept iterieren. Das liefert die einzige Zahl, die Investoren 2026 sehen wollen — und kostet 0 € Code.

## POSITIONIERUNG (schärfen, nicht wechseln)
Weg von „Aktivität", hin zu „Anwesenheit + Ruhe + echte Leute". Claim-Kandidaten:
„Da sein, ohne online sein zu müssen." · „Sieh, wer gerade ansprechbar ist — bei den Menschen, die zählen." · „Kein Feed. Kein Druck. Nur deine Leute, wenn sie Zeit haben."

## Quellen-Briefs (flüchtig, /tmp): presence_feature_audit · presence_integrity_market · presence_design_review · presence_ship_gap

"use strict";
// In Golden Flame Act 1 — Powered By LANCER campaign supplement.
// Authors: Vex, Psicrystal, and Cruye. Item prefix: igfa1.
//
// Source LCP also ships npc_classes, npc_features, and backgrounds
// JSON files that this site doesn't currently render — they are
// intentionally omitted here so the bundle only carries data we
// actually look up. Drop additional imports below when / if NPC or
// background UI is added later.

import b from "./bonds.json";
import g from "./pilot_gear.json";
import sk from "./skills.json";
import s from "./systems.json";
import w from "./weapons.json";

const data = {
	bonds: b,
	pilot_gear: g,
	skills: sk,
	systems: s,
	weapons: w,
};

export default data;

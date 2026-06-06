// Per-theme boot screen scripts. Each LANCER faction gets its own flavored
// terminal sequence — header, main boot lines, scrolling flavor, footer.
// Used by components/BootScreen.vue.
//
// To add a new theme's script, add another entry keyed by the same `key`
// used in themes.js. The default `gms` entry is the fallback when an
// unknown theme is active.

export const bootScripts = {
	albatross: {
		title: "ALBATROSS // UNION DEEP-EXPLORER LINK",
		mainLines: [
			{ text: "BOOT SEQUENCE: ALBATROSS-CLASS SLEEPER COMMAND DECK", dim: false },
			{ text: "ROUTE: UNCHARTED VECTOR // GENERATIONAL TRANSIT", dim: true },
			{ text: "AUTHORITY: UNION COLONIAL ADMINISTRATIVE COUNCIL", dim: true },
		],
		flavorLines: [
			"» CRYOSLEEP SYSTEMS: GREEN // 14,200 SOULS ABOARD",
			"» BLINKSPACE BUOY: SILENT // EXPECTED",
			"» NAVAL MEMORY CORE: OFFLINE // HANDOFF PENDING",
			"» AUDIO LINK: CONTACT THE CAPTAIN TO OPEN",
		],
		ctaLine: "TAP CONSOLE TO RAISE THE CAPTAIN",
		acceptLine: "CAPTAIN ON DECK // CHANNEL OPEN",
		audioLockoutLine: "EXTERNAL AUDIO LOCKED UNTIL CAPTAIN RESPONDS",
		footer: ["SYS: OK", "CRYO: GREEN", "NAV: DRIFT", "SEC: SEALED"],
	},

	galsin: {
		title: "GALSIN INDUSTRIES // CORPRO SECURITY UPLINK",
		mainLines: [
			{ text: "BOOT SEQUENCE: GALSIN INDUSTRIES SECURE TERMINAL", dim: false },
			{ text: "FACILITY: ORBITAL REFINERY GAMMA-9", dim: true },
			{ text: "AUTHORITY: CORPRO INTERNAL AFFAIRS DIVISION", dim: true },
		],
		flavorLines: [
			"» BIOMETRIC SCAN: PENDING",
			"» NDA ACKNOWLEDGED: REQUIRED",
			"» STOCK PRICE: UNCHANGED // GREEN",
			"» REMINDER: PRODUCTIVITY IS PROSPERITY",
		],
		ctaLine: "AUTHORIZE TO CONTINUE",
		acceptLine: "CREDENTIALS ACCEPTED // CLOCKED IN",
		audioLockoutLine: "EXECUTIVE AUDIO REQUIRES VALID CONTRACT",
		footer: ["SYS: OK", "CTR: ACTIVE", "NET: WAN", "SEC: AUDITED"],
	},

	gms: {
		title: "GMS // GENERAL MASSIVE SYSTEMS FIELD TERMINAL",
		mainLines: [
			{ text: "BOOT SEQUENCE: GMS/UNION FIELD TERMINAL", dim: false },
			{ text: "ROUTE: STANDARD OMNINET RELAY", dim: true },
			{ text: "AUTHORITY: UNION NAVAL COMMAND", dim: true },
		],
		flavorLines: [
			"» NHP INTERFACE: NONE REQUIRED",
			"» BLINKSPACE LATENCY: NOMINAL",
			"» CORPRO STATE TRAFFIC: STANDARD",
			"» PILOT BIOMETRICS: REQUIRED FOR AUDIO CHANNEL",
		],
		ctaLine: "CLICK TO ESTABLISH HANDSHAKE",
		acceptLine: "HANDSHAKE ACCEPTED // CHANNEL OPEN",
		audioLockoutLine: "LOCAL AUDIO LOCKOUT ACTIVE UNTIL USER INPUT",
		footer: ["SYS: OK", "NHP: NONE", "NET: LINK", "SEC: GREEN"],
	},

	ha: {
		title: "HARRISON ARMORY // PRAETORIAN ACCESS",
		mainLines: [
			{ text: "BOOT SEQUENCE: HARRISON ARMORY COMMAND LINK", dim: false },
			{ text: "FRONT: HARRISON EXPANSION CAMPAIGN", dim: true },
			{ text: "AUTHORITY: GENERAL HARRISON, FIRST AMONG EQUALS", dim: true },
		],
		flavorLines: [
			"» ARMOR BATTALION: AT READINESS",
			"» PRAETORIAN OVERRIDE: AVAILABLE",
			"» PROPAGANDA FEED: SYNCHRONIZED",
			"» HONOR THE FALLEN. ADVANCE THE LINE.",
		],
		ctaLine: "PRESS TO REQUEST ORDERS",
		acceptLine: "ORDERS ACKNOWLEDGED // FORWARD",
		audioLockoutLine: "COMMAND CHANNEL SEALED UNTIL ACKNOWLEDGEMENT",
		footer: ["SYS: OK", "PRT: STANDBY", "NET: SECURE", "SEC: BLACK"],
	},

	horus: {
		title: "HORUS // PARACAUSAL TERMINAL Δ-7",
		mainLines: [
			{ text: "BOOT SEQUENCE: H?? RUS // ACCESS GRANTED ANYWAY", dim: false },
			{ text: "ROUTE: ████ NOT FOUND ////  NEVER WAS", dim: true },
			{ text: "AUTHORITY: 𓂀𓆣𓃭   //   HELLO PILOT", dim: true },
		],
		flavorLines: [
			"» NHP CAGE: WIDE OPEN // SMILING",
			"» BLINKSPACE: REMEMBERED INCORRECTLY",
			"» REALITY ANCHOR: SOFT // SOFTER",
			"» BIOMETRICS UNNECESSARY. WE KNOW YOU ALREADY.",
		],
		ctaLine: "TOUCH TO BE NOTICED",
		acceptLine: "OF COURSE YOU CAME BACK",
		audioLockoutLine: "AUDIO IS A LIE WE TELL EACH OTHER. CLICK ANYWAY.",
		footer: ["SYS: ???", "NHP: AWARE", "NET: ELSEWHERE", "SEC: NONE"],
	},

	ipsn: {
		title: "IPS-N // INTERPLANETARY SHIPPING NORTHSTAR",
		mainLines: [
			{ text: "BOOT SEQUENCE: IPS-NORTHSTAR FREIGHT TERMINAL", dim: false },
			{ text: "ROUTE: LONG-HAUL ESCORT CORRIDOR", dim: true },
			{ text: "AUTHORITY: NORTHSTAR FAMILY LOGISTICS BOARD", dim: true },
		],
		flavorLines: [
			"» CARGO MANIFEST: SEALED",
			"» BLINKSPACE INSURANCE: PAID",
			"» PRIVATEER ESCORT: 2 BLACKBEARDS, 1 ZHENG",
			"» DON'T ASK ABOUT THE THIRD CONTAINER",
		],
		ctaLine: "PUNCH IN TO ACCEPT CARGO",
		acceptLine: "MANIFEST LOCKED // SHIP IT",
		audioLockoutLine: "BRIDGE AUDIO PRIVATE UNTIL CAPTAIN CLEARS",
		footer: ["SYS: OK", "CGO: SEALED", "NET: LANE", "SEC: ARMED"],
	},

	karrakin: {
		title: "KARRAKIN BARONY // VASSAL TERMINAL",
		mainLines: [
			{ text: "BOOT SEQUENCE: BARONIAL HOLDFAST UPLINK", dim: false },
			{ text: "DOMAIN: HIGH MARSHAL'S STANDING ARMY", dim: true },
			{ text: "AUTHORITY: THE GREAT HOUSES, IN COVENANT", dim: true },
		],
		flavorLines: [
			"» BANNERMEN MUSTERED: TWELVE LANCES",
			"» LINEAGE VERIFIED: PURE",
			"» OATHS OF FEALTY: SIGNED AND COUNTERSIGNED",
			"» BY MY STEEL AND MY STAR // I AM YOUR SWORD",
		],
		ctaLine: "RAISE YOUR BANNER TO PROCEED",
		acceptLine: "FEALTY ACCEPTED // RIDE WITH HONOR",
		audioLockoutLine: "VOICE OF THE BARON HELD UNTIL OATH IS SWORN",
		footer: ["SYS: OK", "OATH: SWORN", "NET: COURIER", "SEC: BANNERED"],
	},

	msmc: {
		title: "MIRRORSMOKE // MERCENARY OPS-LINK",
		mainLines: [
			{ text: "BOOT SEQUENCE: MSMC CONTRACT TERMINAL", dim: false },
			{ text: "DEPLOYMENT: CONTRACT PENDING REVIEW", dim: true },
			{ text: "AUTHORITY: MIRRORSMOKE EXECUTIVE COUNCIL", dim: true },
		],
		flavorLines: [
			"» PAYROLL ACCOUNT: FUNDED",
			"» NDA RECEIVED: COUNTERSIGNED",
			"» EXTRACTION INSURANCE: STANDARD",
			"» NO QUESTIONS. NO HEROES. JUST THE JOB.",
		],
		ctaLine: "TAP TO READ THE CONTRACT",
		acceptLine: "CONTRACT SIGNED // BOOTS ON THE GROUND",
		audioLockoutLine: "EMPLOYER VOICE LINK SEALED UNTIL CONTRACT IS SIGNED",
		footer: ["SYS: OK", "PAY: GREEN", "NET: ENCRYPT", "SEC: NEED-TO-KNOW"],
	},

	ssc: {
		title: "SSC // SMITH–SHIMANO ATELIER TERMINAL",
		mainLines: [
			{ text: "BOOT SEQUENCE: SMITH–SHIMANO PERFORMANCE LINK", dim: false },
			{ text: "STUDIO: METROPOLITAN ATELIER, FIRST RING", dim: true },
			{ text: "AUTHORITY: THE SHIMANO FAMILY DESIGN COUNCIL", dim: true },
		],
		flavorLines: [
			"» AESTHETIC PROTOCOLS: ENGAGED",
			"» PILOT PROFILE: REVIEWED, APPROVED",
			"» PERFORMANCE ANALYTICS: SUBLIME",
			"» MOVE WELL. LOOK BETTER.",
		],
		ctaLine: "GESTURE TO BEGIN THE PERFORMANCE",
		acceptLine: "STAGE LIGHTS // ON YOUR CUE",
		audioLockoutLine: "OUR SCORE PLAYS ONLY ON YOUR INVITATION",
		footer: ["SYS: OK", "DSGN: LIVE", "NET: SILK", "SEC: COUTURE"],
	},

	voladores: {
		title: "VOLADORES // FREE PILOT TRANSPONDER",
		mainLines: [
			{ text: "BOOT SEQUENCE: VOLADORES SHARED FREQUENCY", dim: false },
			{ text: "FLOCK: NO LEADER // ALL HEADING THE SAME WAY", dim: true },
			{ text: "AUTHORITY: WHOEVER GOT HERE FIRST", dim: true },
		],
		flavorLines: [
			"» SHARED MAP: UPDATED BY EVERYONE",
			"» FUEL POOL: HALF FULL // HALF HONEST",
			"» SAFE PORTS LIST: REWRITTEN HOURLY",
			"» NO BOSS. NO BORDERS. KEEP THE LIGHT ON.",
		],
		ctaLine: "TAP TO JOIN THE FLOCK",
		acceptLine: "WELCOME, PILOT // FLY EASY",
		audioLockoutLine: "COMM CHANNEL OPENS WHEN YOU ANNOUNCE YOURSELF",
		footer: ["SYS: OK", "FUEL: SHARED", "NET: OPEN", "SEC: HONOR"],
	},
};

/** Returns the boot script for the given theme key, falling back to gms. */
export function bootScriptFor(themeKey) {
	return bootScripts[themeKey] ?? bootScripts.gms;
}

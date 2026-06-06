<template>
	<BootScreen
		v-if="showBootScreen"
		:theme-key="themePrefs.theme"
		@done="onBootDone"
	/>
	<div class="page-wrapper">
		<Header :planet-path="planetPath" :class="{ animate: animate }" :header="header" />
		<Sidebar :animate="animate" :class="{ animate: animate }" @open-settings="openSettings" />
	</div>
	<div id="router-view-container">
		<router-view :animate="animate" :initial-slug="initialSlug" :missions="missions" :events="events"
			:pilots="pilots" :clocks="clocks" :reserves="reserves" />
	</div>
	<svg style="visibility: hidden; position: absolute" width="0" height="0" xmlns="http://www.w3.org/2000/svg"
		version="1.1">
		<defs>
			<filter id="round">
				<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
				<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -5"
					result="goo" />
				<feComposite in="SourceGraphic" in2="goo" operator="atop" />
			</filter>
		</defs>
	</svg>
	<audio ref="startupAudio" preload="auto">
		<source src="/startup.ogg" type="audio/ogg" />
	</audio>
</template>

<script>
import BootScreen from "./components/BootScreen.vue";
import Header from "./components/layout/Header.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import SettingsModal from "./components/modals/SettingsModal.vue";
import Config from "@/assets/info/general-config.json";
import { themeColorInt } from "@/assets/themes";

const THEME_STORAGE_KEY = "theme-prefs";
const DEFAULT_PREFS = { theme: "gms", mode: "light" };

// Vanta config builder. The mesh color tracks the user's chosen theme
// palette so the background animation matches the rest of the UI. Only
// the backgroundColor stays mode-driven — light surfaces want a white
// canvas behind the globe, dark surfaces want a near-black canvas.
const VANTA_BASE = {
	el: "body",
	mouseControls: false,
	touchControls: false,
	gyroControls: false,
	minHeight: 200.0,
	minWidth: 200.0,
	scale: 1.0,
	scaleMobile: 1.0,
	size: 2.0,
	sphereRotation: -0.002,
	meshRotation: 0.004,
};

function buildVantaConfig({ theme, mode }) {
	const primary = themeColorInt(theme);
	return {
		...VANTA_BASE,
		color: primary,
		color2: primary,
		backgroundColor: mode === "dark" ? 0x0c090d : 0xffffff,
	};
}

export default {
	components: {
		BootScreen,
		Header,
		Sidebar,
	},

	data() {
		return {
			animate: Config.animate,
			initialSlug: Config.initialSlug,
			planetPath: Config.planetPath,
			header: Config.header,
			pilotSpecialInfo: Config.pilotSpecialInfo,
			themePrefs: this.loadThemePrefs(),
			// Boot screen runs on first load. Set `bootScreen: false` in
			// general-config.json to skip it.
			showBootScreen: Config.bootScreen !== false,
			vantaEffect: null,
			clocks: [],
			events: [],
			missions: [],
			pilots: [],
			reserves: [],
			bonds: [],
		};
	},
	created() {
		this.setTitleFavicon(Config.defaultTitle + " MISSION BRIEFING", Config.icon);
		// Apply theme attributes before any child component renders to avoid
		// a flash of the wrong palette on first paint.
		this.applyThemeAttributes(this.themePrefs);
		this.importMissions(import.meta.glob("@/assets/missions/*.md", { query: '?raw', import: 'default' }));
		this.importEvents(import.meta.glob("@/assets/events/*.md", { query: '?raw', import: 'default' }));
		this.importClocks(import.meta.glob("@/assets/clocks/*.json"));
		this.importReserves(import.meta.glob("@/assets/reserves/*.json"));
		this.importPilots(import.meta.glob("@/assets/pilots/*.json"));
	},
	mounted() {
		this.initVanta();

		// Most browsers block <audio autoplay> without prior user interaction.
		// Start playback on the first click/keydown/touchstart and clean up.
		const playStartup = () => {
			const audio = this.$refs.startupAudio;
			if (audio && audio.paused) {
				audio.play().catch(() => {});
			}
			window.removeEventListener("pointerdown", playStartup);
			window.removeEventListener("keydown", playStartup);
		};
		window.addEventListener("pointerdown", playStartup, { once: true });
		window.addEventListener("keydown", playStartup, { once: true });
	},
	beforeUnmount() {
		if (this.vantaEffect) {
			this.vantaEffect.destroy();
			this.vantaEffect = null;
		}
	},
	watch: {
		themePrefs: {
			deep: true,
			handler(newPrefs) {
				this.applyThemeAttributes(newPrefs);
				this.persistThemePrefs(newPrefs);
				// Both the mesh color (driven by theme) and the canvas
				// background (driven by mode) can change here, so rebuild
				// the effect on any change. Vanta has no in-place recolor
				// API; destroy + recreate is the supported path.
				this.rebuildVanta(newPrefs);
			},
		},
	},
	methods: {
		loadThemePrefs() {
			try {
				const stored = localStorage.getItem(THEME_STORAGE_KEY);
				if (stored) {
					const parsed = JSON.parse(stored);
					return {
						theme: parsed.theme || DEFAULT_PREFS.theme,
						mode: parsed.mode === "dark" ? "dark" : "light",
					};
				}
			} catch {
				// localStorage disabled / quota / parse error — fall through to defaults.
			}
			return { ...DEFAULT_PREFS };
		},
		persistThemePrefs(prefs) {
			try {
				localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(prefs));
			} catch {
				// Best-effort persistence; ignore failures.
			}
		},
		applyThemeAttributes({ theme, mode }) {
			const root = document.documentElement;
			root.setAttribute("data-theme", theme);
			root.setAttribute("data-mode", mode);
		},
		initVanta() {
			// vanta.globe.min.js is loaded as a module script in index.html and
			// may not have evaluated by the time mounted() runs. Poll briefly.
			if (!window.VANTA || !window.VANTA.GLOBE) {
				setTimeout(this.initVanta, 50);
				return;
			}
			this.vantaEffect = window.VANTA.GLOBE(buildVantaConfig(this.themePrefs));
		},
		rebuildVanta(prefs) {
			if (this.vantaEffect) {
				this.vantaEffect.destroy();
				this.vantaEffect = null;
			}
			if (window.VANTA && window.VANTA.GLOBE) {
				this.vantaEffect = window.VANTA.GLOBE(buildVantaConfig(prefs));
			}
		},
		onBootDone() {
			this.showBootScreen = false;
		},
		openSettings() {
			this.$oruga.modal.open({
				component: SettingsModal,
				custom: true,
				trapFocus: true,
				props: {
					theme: this.themePrefs.theme,
					mode: this.themePrefs.mode,
				},
				events: {
					"update:theme": (value) => { this.themePrefs.theme = value; },
					"update:mode":  (value) => { this.themePrefs.mode  = value; },
				},
				class: "settings-modal",
				width: "min(640px, 92vw)",
			});
		},
		setTitleFavicon(title, favicon) {
			document.title = title;
			let headEl = document.querySelector('head');
			let faviconEl = document.createElement('link');
			faviconEl.setAttribute('rel', 'shortcut icon');
			faviconEl.setAttribute('href', favicon);
			headEl.appendChild(faviconEl);
		},
		parseFrontmatter(raw) {
			// Minimal YAML-frontmatter parser. Accepts:
			//   ---
			//   key: value
			//   ---
			//   markdown body...
			// Values are trimmed; surrounding quotes are stripped. No nested objects.
			const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
			if (!match) return { data: {}, content: raw };
			const data = {};
			match[1].split(/\r?\n/).forEach(line => {
				const idx = line.indexOf(":");
				if (idx === -1) return;
				const key = line.slice(0, idx).trim();
				const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
				if (key) data[key] = value;
			});
			return { data, content: match[2] };
		},
		async importMissions(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(raw => {
				const { data, content } = this.parseFrontmatter(raw);
				this.missions = [...this.missions, {
					slug: data.slug || "",
					name: data.name || "",
					status: data.status || "",
					content,
				}];
			});
			this.missions = this.missions.sort((a, b) => b.slug - a.slug);
		},
		async importEvents(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(raw => {
				const { data, content } = this.parseFrontmatter(raw);
				this.events = [...this.events, {
					title: data.title || "",
					location: data.location || "",
					time: data.time || "",
					thumbnail: data.thumbnail || "",
					content,
				}];
			});
			this.events = this.events.reverse();
		},
		async importClocks(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				const parsed = JSON.parse(JSON.stringify(content)).default;
				// Decap CMS writes the file as `{ "clocks": [...] }` because
				// root-level arrays can't be modeled by its `list` widget.
				// Legacy files were a raw array — accept both shapes.
				this.clocks = Array.isArray(parsed) ? parsed : (parsed?.clocks ?? []);
			});
		},
		async importReserves(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				const parsed = JSON.parse(JSON.stringify(content)).default;
				this.reserves = Array.isArray(parsed) ? parsed : (parsed?.reserves ?? []);
			});
		},
		async importPilots(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				let pilotFromJson = JSON.parse(JSON.stringify(content));
				// In case the pilot was added from a copy on compcon via sharecode, remove the "reference mark" symbol
				pilotFromJson.name = pilotFromJson.name.replace("※", "");
				pilotFromJson.callsign = pilotFromJson.callsign.replace("※", "");
				let pilotFromVue = this.pilotSpecialInfo[pilotFromJson.callsign.toUpperCase()];
				let pilot = {
					...pilotFromJson,
					...pilotFromVue,
				};
				this.pilots = [...this.pilots, pilot];
				pilot.clocks.forEach(content => {
					let clock = {};
					clock["type"] = `Pilot Project // ${pilot.callsign}`;
					clock["result"] = "";
					clock["name"] = content.title;
					clock["description"] = content.description;
					clock["value"] = content.progress;
					clock["max"] = content.segments;
					clock["color"] = "#3CB043";
					this.clocks = [...this.clocks, clock];
				});

				pilot.reserves.forEach(content => {
					let reserve = {};
					reserve["type"] = content.type;
					reserve["name"] = content.name;
					reserve["description"] = content.description;
					reserve["label"] = content.label;
					reserve["cost"] = content.cost;
					reserve["notes"] = content.notes;
					reserve["callsign"] = pilot.callsign.toUpperCase();
					this.reserves = [...this.reserves, reserve];
				});
			});
		},
	},
};
</script>

<style>
#app {
	min-height: 100vh;
	overflow: hidden !important;
	/* border-right: 1px solid #ff0;
	border-bottom: 1px solid #ff0; */
}
</style>

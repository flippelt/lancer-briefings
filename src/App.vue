<template>
	<div class="page-wrapper">
		<Header :planet-path="planetPath" :class="{ animate: animate }" :header="header" />
		<Sidebar :animate="animate" :class="{ animate: animate }" />
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
import Header from "./components/layout/Header.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import Config from "@/assets/info/general-config.json";

export default {
	components: {
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
		this.importMissions(import.meta.glob("@/assets/missions/*.md", { query: '?raw', import: 'default' }));
		this.importEvents(import.meta.glob("@/assets/events/*.md", { query: '?raw', import: 'default' }));
		this.importClocks(import.meta.glob("@/assets/clocks/*.json"));
		this.importReserves(import.meta.glob("@/assets/reserves/*.json"));
		this.importPilots(import.meta.glob("@/assets/pilots/*.json"));
	},
	mounted() {
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
	methods: {
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
				this.clocks = JSON.parse(JSON.stringify(content)).default;
			});
		},
		async importReserves(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				this.reserves = JSON.parse(JSON.stringify(content)).default;
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

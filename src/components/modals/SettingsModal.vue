<template>
	<div class="settings-card" @click.stop>
		<div class="settings-header-container">
			<div class="section-header clipped-medium-backward">
				<i class="filter-icon" style="--icon-url: url('/icons/protocol.svg')"></i>
				<h2>Configurações</h2>
			</div>
		</div>
		<div class="settings-body">
			<section class="settings-group">
				<h3>Modo</h3>
				<div class="mode-toggle">
					<button
						type="button"
						class="mode-option"
						:class="{ active: selectedMode === 'light' }"
						@click="selectMode('light')">
						Claro
					</button>
					<button
						type="button"
						class="mode-option"
						:class="{ active: selectedMode === 'dark' }"
						@click="selectMode('dark')">
						Escuro
					</button>
				</div>
			</section>

			<section class="settings-group">
				<h3>Tema</h3>
				<div class="theme-grid">
					<button
						v-for="t in themes"
						:key="t.key"
						type="button"
						class="theme-swatch"
						:class="{ active: selectedTheme === t.key }"
						:style="{ '--swatch-color': t.color }"
						:title="t.label"
						@click="selectTheme(t.key)">
						<span class="swatch-dot"></span>
						<span class="swatch-label">{{ t.label }}</span>
					</button>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
import { themes } from "@/assets/themes";

export default {
	name: "SettingsModal",
	inheritAttrs: false,
	props: {
		theme: { type: String, required: true },
		mode:  { type: String, required: true },
	},
	emits: ["update:theme", "update:mode"],
	data() {
		return {
			themes,
			selectedTheme: this.theme,
			selectedMode:  this.mode,
		};
	},
	methods: {
		selectTheme(key) {
			this.selectedTheme = key;
			this.$emit("update:theme", key);
		},
		selectMode(mode) {
			this.selectedMode = mode;
			this.$emit("update:mode", mode);
		},
	},
};
</script>

<style scoped>
.settings-card {
	background: var(--secondary-color);
	border: 1px solid var(--primary-color);
	max-width: 640px;
	width: 100%;
	max-height: 90vh;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	position: relative;
	z-index: 1;
	pointer-events: auto;
	box-sizing: border-box;
}

.settings-header-container {
	display: flex;
}

.settings-body {
	padding: 1.5em 1.25em;
	display: flex;
	flex-direction: column;
	gap: 1.5em;
}

/* Title bar text — the global `section .section-header h2` rule only
   matches when the bar is inside a <section> ancestor; this modal uses
   a <div>, so we apply the same styling explicitly. */
.section-header h2 {
	font-size: 26px;
	margin: 0;
	align-self: center;
	font-family: "Big Shoulders Display", cursive;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--on-primary);
}

/* Group labels — match the Roboto pattern used by the buttons below,
   tracking --text-markdown-p so they flip light/dark with the mode. */
.settings-group h3 {
	font-family: "Roboto", sans-serif;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	font-size: 14px;
	margin: 0 0 0.75em 0;
	color: var(--text-markdown-p);
}

/* --- Mode toggle --- */
.mode-toggle {
	display: flex;
	gap: 0.5em;
}

.mode-option {
	flex: 1;
	padding: 0.75em 1em;
	background: transparent;
	border: 2px solid var(--primary-color);
	color: var(--text-markdown-p);
	font-family: "Roboto", sans-serif;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
	transition: background 0.15s ease, color 0.15s ease;
}

.mode-option:hover {
	background: var(--highlight-hover);
}

.mode-option.active {
	background: var(--primary-color);
	color: var(--on-primary);
}

/* --- Theme grid --- */
.theme-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
	gap: 0.6em;
}

.theme-swatch {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5em;
	padding: 0.75em 0.5em;
	background: transparent;
	border: 2px solid transparent;
	border-radius: 4px;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease;
	font-family: "Roboto", sans-serif;
	color: var(--text-markdown-p);
}

.theme-swatch:hover {
	background: var(--highlight-hover);
}

.theme-swatch.active {
	border-color: var(--primary-color);
}

.swatch-dot {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: var(--swatch-color);
	box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.swatch-label {
	font-size: 12px;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}

@media (max-width: 480px) {
	.settings-body { padding: 1em 0.75em; }
	.theme-grid { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); }
	.swatch-dot { width: 28px; height: 28px; }
}
</style>

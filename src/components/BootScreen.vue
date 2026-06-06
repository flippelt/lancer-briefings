<template>
	<div class="boot" :class="{ exiting }" @pointerdown.prevent="enter" @keydown.enter.prevent="enter" tabindex="0">
		<div class="monitor">
			<div class="hdr">
				<span class="dot"></span><span class="dot"></span><span class="dot"></span>
				<div class="title">{{ script.title }}</div>
			</div>

			<div class="body">
				<div class="scanlines" aria-hidden="true"></div>
				<div class="flicker" aria-hidden="true"></div>

				<div class="txt">
					<div v-for="(l, i) in typedMainLines" :key="`m-${i}`" class="line" :class="{ dim: l.dim }">
						{{ l.text }}
					</div>

					<div class="spacer"></div>

					<div class="flavor" ref="flavorEl">
						<div v-for="(l, i) in typedFlavorLines" :key="`f-${i}`" class="line dim">
							{{ l.text }}
						</div>
						<div class="line dim" v-if="!typedDone"><span class="caret"></span></div>
					</div>

					<div class="progress">
						<div class="bar" :class="{ booting }"></div>
					</div>

					<div class="line">{{ script.ctaLine }}</div>
					<div class="line" v-if="booting">{{ script.acceptLine }}</div>

					<div class="small dim">
						<span class="caret"></span>
						{{ script.audioLockoutLine }}
					</div>
				</div>
			</div>

			<div class="ftr dim">
				<span v-for="(label, i) in footerLabels" :key="`ft-${i}`">{{ label }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { bootScriptFor } from "@/assets/bootScripts.js";

export default {
	name: "BootScreen",
	emits: ["enter", "done"],
	props: {
		themeKey: { type: String, default: "gms" },
	},
	data() {
		return {
			booting: false,
			exiting: false,

			typedMainLines: [],
			typedFlavorLines: [],

			mainIndex: 0,
			flavorIndex: 0,
			charIndex: 0,
			section: "main",
			typedDone: false,
			timer: null,
		};
	},
	computed: {
		script() {
			// Faction-specific boot text comes from bootScripts.js, keyed by themeKey.
			// The active theme is set on <html data-theme="..."> by App.vue.
			return bootScriptFor(this.themeKey);
		},
		footerLabels() {
			return this.booting
				? this.script.footer.map((label) =>
					label.startsWith("NET:") ? "NET: LINK" : label,
				)
				: this.script.footer;
		},
	},
	mounted() {
		this.startTyping();
		// Focus so Enter triggers `enter()` for keyboard users.
		this.$el.focus?.();
	},
	beforeUnmount() {
		if (this.timer) window.clearTimeout(this.timer);
	},
	methods: {
		enter() {
			if (this.booting || this.exiting) return;

			this.booting = true;
			this.$emit("enter");

			if (this.timer) {
				window.clearTimeout(this.timer);
				this.timer = null;
			}

			window.setTimeout(() => {
				this.exiting = true;
				window.setTimeout(() => this.$emit("done"), 520);
			}, 850);
		},

		startTyping() {
			const minDelay = 14;
			const maxDelay = 34;
			const mainLines = this.script.mainLines;
			const flavorLines = this.script.flavorLines;

			const tick = async () => {
				if (this.typedDone || this.exiting) {
					this.timer = null;
					return;
				}

				if (this.section === "main") {
					if (this.mainIndex >= mainLines.length) {
						this.section = "flavor";
						this.charIndex = 0;
						this.timer = window.setTimeout(tick, 120);
						return;
					}

					const target = mainLines[this.mainIndex];
					if (this.typedMainLines.length <= this.mainIndex) {
						this.typedMainLines.push({ text: "", dim: target.dim });
					}

					this.typedMainLines[this.mainIndex].text = target.text.slice(0, this.charIndex + 1);
					this.charIndex += 1;

					if (this.charIndex >= target.text.length) {
						this.mainIndex += 1;
						this.charIndex = 0;
						this.timer = window.setTimeout(tick, 220);
						return;
					}
				} else {
					if (this.flavorIndex >= flavorLines.length) {
						this.typedDone = true;
						this.timer = null;
						return;
					}

					const target = flavorLines[this.flavorIndex];
					if (this.typedFlavorLines.length <= this.flavorIndex) {
						this.typedFlavorLines.push({ text: "" });
					}

					this.typedFlavorLines[this.flavorIndex].text = target.slice(0, this.charIndex + 1);
					this.charIndex += 1;

					await this.$nextTick();
					if (this.$refs.flavorEl) {
						this.$refs.flavorEl.scrollTop = this.$refs.flavorEl.scrollHeight;
					}

					if (this.charIndex >= target.length) {
						this.flavorIndex += 1;
						this.charIndex = 0;
						this.timer = window.setTimeout(tick, 220);
						return;
					}
				}

				const jitter = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));
				const extra = Math.random() < 0.06 ? 90 : 0;
				this.timer = window.setTimeout(tick, jitter + extra);
			};

			tick();
		},
	},
};
</script>

<style scoped>
/* Boot screen styling driven entirely by theme CSS vars from _base.css
   (--primary-color, --on-primary, --secondary-color). Each LANCER faction
   theme reuses the same component with its own palette + boot text. */
.boot {
	position: fixed;
	inset: 0;
	z-index: 99999;
	display: grid;
	place-items: center;
	cursor: pointer;
	user-select: none;
	background: radial-gradient(
		ellipse at center,
		color-mix(in srgb, var(--primary-color) 8%, #000 92%),
		#000 90%
	);
	color: var(--on-primary);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	opacity: 1;
	transition: opacity 520ms ease;
	outline: none;
}

.boot.exiting {
	opacity: 0;
	pointer-events: none;
}

.monitor {
	width: min(860px, 92vw);
	border-radius: 14px;
	border: 1px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
	background: linear-gradient(
		180deg,
		color-mix(in srgb, var(--primary-color) 5%, #000 95%),
		#000
	);
	overflow: hidden;
	box-shadow:
		0 0 0 1px color-mix(in srgb, var(--primary-color) 12%, transparent) inset,
		0 0 24px color-mix(in srgb, var(--primary-color) 18%, transparent),
		0 0 90px rgba(0, 0, 0, 0.6);
}

.hdr {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 14px;
	border-bottom: 1px solid color-mix(in srgb, var(--primary-color) 22%, transparent);
	background: rgba(0, 0, 0, 0.16);
}

.dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: color-mix(in srgb, var(--primary-color) 35%, transparent);
	box-shadow: 0 0 8px color-mix(in srgb, var(--primary-color) 22%, transparent);
}

.title {
	margin-left: 6px;
	font-size: 12px;
	opacity: 0.92;
	font-family: "Big Shoulders Display", "Roboto", sans-serif;
	letter-spacing: 0.1em;
}

.body {
	position: relative;
	padding: 28px 22px 26px;
	min-height: 260px;
}

.txt {
	position: relative;
	z-index: 2;
	font-family: "Inconsolata", "Courier New", monospace;
	font-size: 14px;
	line-height: 1.7;
	text-shadow: 0 0 10px color-mix(in srgb, var(--primary-color) 18%, transparent);
}

.line {
	margin: 2px 0;
}

.dim {
	opacity: 0.7;
}

.spacer {
	height: 10px;
}

.flavor {
	margin: 6px 0 2px;
	max-height: 110px;
	overflow-y: auto;
	padding-right: 6px;
}

.flavor::-webkit-scrollbar {
	width: 6px;
}
.flavor::-webkit-scrollbar-thumb {
	background: color-mix(in srgb, var(--primary-color) 25%, transparent);
	border-radius: 999px;
}
.flavor::-webkit-scrollbar-track {
	background: transparent;
}

.small {
	margin-top: 12px;
	font-size: 12px;
}

.caret {
	display: inline-block;
	width: 10px;
	height: 14px;
	margin-right: 8px;
	border-left: 2px solid var(--on-primary);
	animation: blink 1.1s infinite;
	transform: translateY(2px);
}

@keyframes blink {
	0%,
	45% {
		opacity: 1;
	}
	46%,
	100% {
		opacity: 0;
	}
}

.progress {
	margin: 14px 0 10px;
	height: 10px;
	border-radius: 999px;
	border: 1px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
	background: rgba(0, 0, 0, 0.34);
	overflow: hidden;
}

.bar {
	height: 100%;
	width: 0%;
	background: linear-gradient(
		90deg,
		color-mix(in srgb, var(--primary-color) 30%, transparent),
		var(--primary-color)
	);
	box-shadow: 0 0 18px color-mix(in srgb, var(--primary-color) 35%, transparent);
	transition: width 700ms ease;
}

.bar.booting {
	width: 100%;
}

.scanlines {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		to bottom,
		rgba(255, 255, 255, 0.02),
		rgba(255, 255, 255, 0.02) 1px,
		rgba(0, 0, 0, 0) 3px,
		rgba(0, 0, 0, 0) 6px
	);
	mix-blend-mode: overlay;
	opacity: 0.35;
	pointer-events: none;
}

.flicker {
	position: absolute;
	inset: -20%;
	background: radial-gradient(
		circle at 30% 20%,
		color-mix(in srgb, var(--primary-color) 12%, transparent),
		transparent 55%
	);
	animation: flicker 2.6s infinite;
	pointer-events: none;
	opacity: 0.9;
}

@keyframes flicker {
	0%,
	100% {
		transform: translate3d(0, 0, 0);
		opacity: 0.75;
	}
	10% {
		transform: translate3d(-1px, 1px, 0);
		opacity: 0.85;
	}
	20% {
		transform: translate3d(1px, -1px, 0);
		opacity: 0.7;
	}
	35% {
		transform: translate3d(0px, 2px, 0);
		opacity: 0.9;
	}
	60% {
		transform: translate3d(2px, 0px, 0);
		opacity: 0.78;
	}
}

.ftr {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 8px;
	padding: 10px 14px;
	border-top: 1px solid color-mix(in srgb, var(--primary-color) 22%, transparent);
	background: rgba(0, 0, 0, 0.16);
	font-size: 12px;
	font-family: "Inconsolata", "Courier New", monospace;
}

/* Mobile tuning — bate com o breakpoint ≤767px usado pelo _responsive.css
   global. Reduz padding/fonte pra caber em telas estreitas (≤360px é o
   piso real que tem que servir) sem espremer o conteúdo. */
@media (max-width: 767px) {
	.boot {
		letter-spacing: 0.05em;
	}
	.monitor {
		width: 96vw;
		border-radius: 10px;
	}
	.hdr {
		padding: 10px 12px;
		gap: 8px;
	}
	.title {
		font-size: 11px;
		letter-spacing: 0.08em;
	}
	.body {
		padding: 18px 14px 16px;
		min-height: 200px;
	}
	.txt {
		font-size: 13px;
		line-height: 1.6;
	}
	.flavor {
		max-height: 92px;
	}
	.small {
		font-size: 11px;
	}
	.ftr {
		padding: 8px 12px;
		font-size: 11px;
		gap: 6px;
	}
}

/* Telas muito baixas (landscape de celular). Sem o min-height alto, o
   monitor centraliza melhor e o flavor consegue rolar dentro do viewport. */
@media (max-height: 520px) {
	.body {
		min-height: 0;
	}
	.flavor {
		max-height: 70px;
	}
}
</style>

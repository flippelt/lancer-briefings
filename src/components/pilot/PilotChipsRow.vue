<template>
	<!-- One labeled chip group. Replaces three nearly-identical inline
	     blocks in Pilot.vue (skills / talents / licenses). The wrapper
	     <div class="col ..."> stays in Pilot.vue so the same component
	     can sit in a half-width col-share slot (skills + talents share
	     a row) or in a full-width col (licenses, on its own row). -->
	<div>
		<span>{{ heading }}</span>
		<br>
		<div class="chip-container" v-for="item in items" :key="item.id">
			<span class="chip">
				<i aria-hidden="true" class="notranslate cci" :class="`cci-${kind}`"></i>
				{{ formatItem(item) }}
			</span>
		</div>
	</div>
</template>

<script>
import lcp from "@/assets/LCPs";

const HEADINGS = {
	skill:   "PILOT SKILL TRIGGER AUDIT",
	talent:  "PILOT TALENT AUDIT",
	license: "PROCUREMENT LICENSE AUDIT",
};

export default {
	name: "PilotChipsRow",
	props: {
		kind: {
			type: String,
			required: true,
			validator: (k) => ["skill", "talent", "license"].includes(k),
		},
		items:      { type: Array,  required: true },
		// Only used by kind="license" — appended to the heading as
		// "PROCUREMENT LICENSE AUDIT: LEVEL X".
		pilotLevel: { type: Number, default: 0 },
	},
	computed: {
		heading() {
			const base = HEADINGS[this.kind];
			return this.kind === "license" ? `${base}: LEVEL ${this.pilotLevel}` : base;
		},
	},
	methods: {
		formatItem(item) {
			if (this.kind === "skill") {
				const sk = lcp.skills.find((x) => x.id === item.id);
				return sk ? `${sk.name} +${item.rank * 2}` : "";
			}
			if (this.kind === "talent") {
				const t = lcp.talents.find((x) => x.id === item.id);
				return t ? `${t.name} ${"I".repeat(item.rank)}` : "";
			}
			// license
			const frame = lcp.frames.find((x) => x.id === item.id);
			return frame ? `${frame.source} ${frame.name} ${"I".repeat(item.rank)}` : "";
		},
	},
};
</script>

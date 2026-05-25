<template>
	<!-- TODO: this component renders one row of "chip" pills. It covers
	     three call sites currently inlined in Pilot.vue:
	       - lines 35-42 (PILOT SKILL TRIGGER AUDIT) — skills
	       - lines 44-50 (PILOT TALENT AUDIT)       — talents
	       - lines 52-60 (PROCUREMENT LICENSE AUDIT) — licenses
	     The `kind` prop ("skill" | "talent" | "license") picks the
	     heading text and the cci-* glyph; `items` is the array off the
	     pilot (pilot.skills, pilot.talents, pilot.licenses).

	     The label-formatting helpers (getSkill, getTalent, getLicense)
	     in Pilot.vue methods should move into this component or into a
	     small `pilotFormatters.js` next to assets/themes.js so both
	     Pilot.vue and PilotModal can share them. -->
	<div class="chip-row">
		<span class="chip-row__heading">{{ heading }}</span>
		<div class="chip-container" v-for="item in items" :key="item.id">
			<span class="chip">
				<i aria-hidden="true" class="notranslate cci" :class="`cci-${kind}`"></i>
				{{ formatItem(item) }}
			</span>
		</div>
	</div>
</template>

<script>
const HEADINGS = {
	skill:   "PILOT SKILL TRIGGER AUDIT",
	talent:  "PILOT TALENT AUDIT",
	license: "PROCUREMENT LICENSE AUDIT",
};

export default {
	name: "PilotChipsRow",
	props: {
		kind:  { type: String, required: true, validator: (k) => ["skill", "talent", "license"].includes(k) },
		items: { type: Array,  required: true },
	},
	computed: {
		heading() { return HEADINGS[this.kind]; },
	},
	methods: {
		formatItem(item) {
			// TODO: replace this stub with the real formatter pulled from
			// Pilot.vue (getSkill / getTalent / getLicense). Each one
			// needs access to the merged lcp arrays — pass them in as
			// props or import directly from @/assets/LCPs.
			return item.id || "";
		},
	},
};
</script>

<style scoped>
/* TODO: move .chip-container, .chip, and chip cci-glyph styles from
   _base.css here. */
</style>

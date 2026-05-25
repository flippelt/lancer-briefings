<template>
	<!-- TODO: move the two-button block from Pilot.vue lines 72-98 here.
	     They are the BIOMETRIC RECORD button (opens PilotModal) and the
	     MECHANICAL BLUEPRINT button (opens MechModal). Each currently
	     calls a method (pilotModal / mechModal) that invokes
	     this.$oruga.modal.open(...) with the right component + props.

	     Once moved, this component should EMIT events upward
	     ("open-pilot-modal" / "open-mech-modal") and let Pilot.vue keep
	     the $oruga calls — that keeps the modal wiring centralized and
	     this component free of Oruga dependencies. -->
	<div class="modal-buttons flex-container-cols">
		<div class="row biometrics-container">
			<button type="button" class="biometrics flex-container-cols" @click="$emit('open-pilot-modal')">
				<div>
					<i aria-hidden="true" class="v-icon notranslate mdi mdi-fingerprint"></i>
				</div>
				<div>
					BIOMETRIC RECORD VALID [[{{ randomNumber(14, 22) }}PB]]<br />
					OHM C//{{ timeStamp(pilot.lastModified) }}
				</div>
			</button>
		</div>
		<div class="row biometrics-container">
			<button type="button" class="mech-record flex-container-cols" @click="$emit('open-mech-modal')">
				<div>
					MECHANICAL BLUEPRINT VALID [[{{ randomNumber(14, 22) }}TB]]<br />
					{{ activeMech.manufacturer }}-{{ activeMech.frame_name }} :: "{{ activeMech.name }}"
				</div>
				<div>
					<i aria-hidden="true" class="v-icon notranslate cci cci-reserve-mech larger"></i>
				</div>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: "PilotModalButtons",
	props: {
		pilot:      { type: Object, required: true },
		activeMech: { type: Object, required: true },
	},
	emits: ["open-pilot-modal", "open-mech-modal"],
	methods: {
		randomNumber(max, min) {
			// TODO: lift this (and timeStamp below) into a shared utility
			// file once the refactor lands — Pilot.vue, PilotModal.vue
			// and MechModal all reference similar formatting helpers.
			const rand = Math.random() * (max - min) + min;
			return Math.floor(rand * 100) / 100;
		},
		timeStamp(str) {
			const d = new Date(str);
			d.setFullYear(d.getFullYear() + 2990);
			return d.toISOString();
		},
	},
};
</script>

<style scoped>
/* TODO: move .biometrics, .mech-record, .biometrics-container,
   .modal-buttons rules from _base.css here. The :hover transition
   stays the same (background var(--highlight-hover)). */
</style>

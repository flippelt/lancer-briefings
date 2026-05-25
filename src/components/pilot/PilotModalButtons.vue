<template>
	<!-- BIOMETRIC RECORD and MECHANICAL BLUEPRINT buttons.
	     Emits up rather than calling $oruga directly so the parent
	     (Pilot.vue) keeps the modal wiring centralized and can pass
	     the full set of props each modal needs (talents/skills/frames
	     for PilotModal, systemsData/weaponsData for MechModal) without
	     this component knowing about them. -->
	<div class="flex-container-cols modal-buttons">
		<div class="row biometrics-container">
			<div class="biometrics flex-container-cols" @click="$emit('open-pilot-modal')">
				<div>
					<i aria-hidden="true" class="v-icon notranslate mdi mdi-fingerprint theme--dark grey--text text--darken-2"
						style="font-size: 36px; margin-top:36px;"></i>
				</div>
				<div style="width:100%">
					BIOMETRIC RECORD VALID [[{{ randomNumber(14, 22) }}PB]]<br />
					OHM C//{{ timeStamp(pilot.lastModified) }}
				</div>
			</div>
		</div>
		<div class="row biometrics-container">
			<div class="mech-record flex-container-cols" @click="$emit('open-mech-modal')">
				<div style="width:100%">
					MECHANICAL BLUEPRINT VALID [[{{ randomNumber(14, 22) }}TB]] <br />
					{{ activeMech.manufacturer.toUpperCase() }}-{{ activeMech.frame_name.toUpperCase() }} :: "{{ activeMech.name.toUpperCase() }}"
				</div>
				<div>
					<i aria-hidden="true"
						class="v-icon notranslate cci cci-reserve-mech theme--dark grey--text text--darken-2 larger"
						style="font-size: 42px; margin-top:1em;"></i>
				</div>
			</div>
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
			const rand = Math.random() * (max - min) + min;
			return Math.floor(rand * 100) / 100;
		},
		timeStamp(str) {
			const date = new Date(str);
			// Project lore offsets timestamps into the year 5000+ —
			// bump 2990 onto whatever the real lastModified is so the
			// rendered "OHM C//" stamp reads in-fiction.
			return new Date(
				date.getFullYear() + 2990,
				date.getMonth(),
				date.getDate(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
				date.getMilliseconds()
			).toISOString();
		},
	},
};
</script>

<style scoped>
.larger::before {
	margin-top: 9px;
}

.mdi::before {
	margin-top: 9px;
}

.mech-record {
	margin-left: auto;
	text-align: right;
}

.modal-buttons {
	margin-top: 5px;
}
</style>

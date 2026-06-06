<template>
	<div class="section-content-container" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" id="squads">
		<div v-if="squads.length === 0" class="empty">
			<p>Nenhum pelotão definido. Atribua o campo <code>squad</code> aos pilotos em <code>general-config.json</code> &rarr; <code>pilotSpecialInfo</code>.</p>
		</div>
		<div v-else class="squad-list-container">
			<SquadTile v-for="squad in squads" :key="squad.name" :squad="squad" @open="openSquad" />
		</div>
	</div>
</template>

<script>
import SquadTile from "@/components/SquadTile.vue";
import SquadModal from "@/components/modals/SquadModal.vue";

export default {
	components: { SquadTile },
	props: {
		animate: { type: Boolean, required: true },
		pilots: { type: Array, required: true },
	},
	data() {
		return {
			animateView: this.animate,
			animationDelay: "0s",
		};
	},
	computed: {
		squads() {
			const groups = new Map();
			for (const pilot of this.pilots) {
				const name = pilot.squad;
				if (!name) continue;
				if (!groups.has(name)) groups.set(name, { name, pilots: [] });
				groups.get(name).pilots.push(pilot);
			}
			return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
		},
	},
	methods: {
		openSquad(squad) {
			this.$oruga.modal.open({
				component: SquadModal,
				custom: true,
				trapFocus: true,
				props: { squad },
				class: 'custom-modal',
				width: 1600,
			});
		},
	},
};
</script>

<style scoped>
.squad-list-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
	gap: 1.2em;
	padding: 1em;
}

.section-content-container {
	border: 0 solid transparent;
}

.empty {
	padding: 2em;
	color: var(--secondary-color);
	background: rgba(0, 0, 0, 0.4);
	margin: 1em;
	border: 1px dashed var(--secondary-color);
}

.empty code {
	background: rgba(255, 255, 255, 0.15);
	padding: 0 0.3em;
	font-family: "Inconsolata", monospace;
}
</style>

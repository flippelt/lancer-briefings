<template>
	<div class="squad-modal">
		<div class="squad-header-container">
			<div class="section-header clipped-medium-backward-bio">
				<img src="/icons/squad.svg" />
				<h1>{{ squad.name.toUpperCase() }}</h1>
			</div>
			<div class="rhombus-back">&nbsp;</div>
		</div>
		<div class="squad-meta-bar">
			<span class="subtitle">{{ squad.pilots.length }} PILOTO{{ squad.pilots.length === 1 ? '' : 'S' }} REGISTRADO{{ squad.pilots.length === 1 ? '' : 'S' }}</span>
		</div>
		<div class="squad-scroll">
			<div class="squad-members-grid">
				<div
					v-for="pilot in squad.pilots"
					:key="pilot.callsign"
					class="member-card"
				>
					<div class="member-header">
						<img :src="`/pilots/${pilot.callsign.toUpperCase()}.webp`" class="member-portrait" @error="onMissingPortrait" />
						<div>
							<h3>{{ pilot.callsign.toUpperCase() }}</h3>
							<p class="name-line">{{ pilot.name }}</p>
						</div>
					</div>
					<div class="member-body">
						<p><strong>Status:</strong> {{ pilot.status || 'Active' }}</p>
						<p><strong>Background:</strong> {{ pilot.background || 'Unknown' }}</p>
						<p><strong>Nível:</strong> {{ pilot.level }}</p>
						<p v-if="pilot.role"><strong>Função:</strong> {{ pilot.role }}</p>
						<p v-if="activeMechName(pilot)"><strong>Mech ativo:</strong> {{ activeMechName(pilot) }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "SquadModal",
	inheritAttrs: false,
	props: {
		squad: { type: Object, required: true },
	},
	methods: {
		activeMechName(pilot) {
			if (!pilot.mechs || !pilot.mechs.length) return null;
			const active = pilot.mechs.find(m => m.id === pilot.state?.active_mech_id) || pilot.mechs[0];
			return active?.name || null;
		},
		onMissingPortrait(e) {
			e.target.style.visibility = 'hidden';
		},
	},
};
</script>

<style scoped>
.squad-modal {
	background: var(--secondary-color);
	color: var(--text-pilot-value);
	max-width: 1600px;
	min-height: 80vh;
	padding-bottom: 1rem;
	font-family: "Titillium Web", sans-serif;
}

.squad-meta-bar {
	padding: 0.5rem 1.5rem 1rem;
	border-bottom: 1px solid var(--location-separator);
}

.subtitle {
	color: var(--text-pilot-header);
	font-size: 1rem;
	letter-spacing: 0.06em;
}

.squad-scroll {
	max-height: calc(80vh - 200px);
	overflow-y: auto;
	padding: 1rem 1.5rem;
}

.squad-members-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
	gap: 1rem;
}

.member-card {
	border: 1px solid var(--primary-color);
	padding: 1rem;
	background: var(--secondary-color);
	transition: 0.15s ease-in-out;
}

.member-card:hover {
	background: var(--highlight-hover);
}

.member-header {
	display: flex;
	align-items: center;
	gap: 0.8rem;
	margin-bottom: 0.6rem;
	border-bottom: 1px solid var(--location-separator);
	padding-bottom: 0.6rem;
}

.member-portrait {
	width: 64px;
	height: 64px;
	object-fit: cover;
	border: 2px solid var(--primary-color);
}

.member-header h3 {
	margin: 0;
	color: var(--text-headers);
	font-family: "Big Shoulders Display", sans-serif;
	font-size: 1.4rem;
	letter-spacing: 0.05em;
}

.name-line {
	margin: 0;
	color: var(--text-pilot-header);
	font-size: 0.9rem;
}

.member-body p {
	margin: 0.2rem 0;
	font-size: 0.95rem;
}

.member-body strong {
	color: var(--primary-color);
	margin-right: 0.4rem;
}
</style>

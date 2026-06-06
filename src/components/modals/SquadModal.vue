<template>
	<div class="squad-modal">
		<div class="squad-header-container">
			<div class="section-header clipped-medium-backward-bio">
				<img src="/icons/squad.svg" />
				<h2>{{ squad.name.toUpperCase() }}</h2>
			</div>
			<div class="rhombus-back">&nbsp;</div>
		</div>

		<div class="squad-body">
			<div class="squad-meta-bar">
				<span class="subtitle">
					{{ squad.pilots.length }} PILOTO{{ squad.pilots.length === 1 ? '' : 'S' }} REGISTRADO{{ squad.pilots.length === 1 ? '' : 'S' }}
				</span>
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
							<p><strong>LL:</strong> {{ pilot.level }}</p>
							<p v-if="pilot.role"><strong>Função:</strong> {{ pilot.role }}</p>
							<p v-if="activeMechName(pilot)"><strong>Mech ativo:</strong> {{ activeMechName(pilot) }}</p>
						</div>
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
/* Layout reproduz o padrão visual do PilotModal — header bar primary +
   rhombus skewed, body branco/secundário com borda primary. As classes
   utilitárias (section-header, clipped-medium-backward-bio) vêm dos estilos
   globais; aqui só constrainho o que é específico do squad (ícone, body
   width, member grid). */
.squad-modal {
	position: relative;
	width: min(1100px, 92vw);
}

.squad-header-container {
	display: flex;
}

.squad-modal .section-header {
	background-color: var(--primary-color);
	border-color: var(--primary-color);
	height: 52px;
	display: inline-flex;
	gap: 15px;
	padding-left: 16px;
	margin-top: -38px;
	align-items: center;
}

.squad-modal .section-header img {
	width: 28px;
	height: 28px;
	filter: var(--icon-color);
}

.squad-modal .section-header h2 {
	margin: 0;
	font-family: "Big Shoulders Display", cursive;
	font-weight: 800;
	font-size: 26px;
	letter-spacing: 0.1em;
	color: var(--on-primary);
	text-transform: uppercase;
}

.squad-modal .rhombus-back {
	transform: skew(0.785398rad);
	background-color: var(--primary-color);
	border-color: var(--primary-color);
	width: 40px;
	height: 52px;
	display: inline-block;
	position: relative;
	left: -10px;
	top: -38px;
}

.squad-body {
	background-color: var(--secondary-color);
	border: 1px solid var(--primary-color);
	margin-top: -38px;
	color: var(--text-pilot-value);
	font-family: "Titillium Web", sans-serif;
	min-height: 60vh;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}

.squad-meta-bar {
	padding: 0.6rem 1.5rem;
	border-bottom: 1px solid var(--location-separator);
}

.subtitle {
	color: var(--text-pilot-header);
	font-size: 1rem;
	letter-spacing: 0.06em;
}

.squad-scroll {
	flex: 1;
	overflow-y: auto;
	padding: 1rem 1.5rem;
}

.squad-members-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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

/* Mobile tuning — fonte/padding menores, grade vira coluna única em
   telas estreitas, e o body pode usar a viewport quase toda. */
@media (max-width: 767px) {
	.squad-modal {
		width: 96vw;
	}
	.squad-modal .section-header h2 {
		font-size: 20px;
		letter-spacing: 0.06em;
	}
	.squad-modal .section-header img {
		width: 22px;
		height: 22px;
	}
	.squad-members-grid {
		grid-template-columns: 1fr;
	}
	.member-portrait {
		width: 52px;
		height: 52px;
	}
	.member-header h3 {
		font-size: 1.2rem;
	}
}
</style>

<template>
	<div class="squad-tile" @click="$emit('open', squad)">
		<div class="squad-header">
			<div class="squad-insignia">
				<span>{{ initials(squad.name) }}</span>
			</div>
			<div class="squad-meta">
				<h2>{{ squad.name }}</h2>
				<p class="count">{{ squad.pilots.length }} PILOTO{{ squad.pilots.length === 1 ? '' : 'S' }}</p>
			</div>
			<div class="chevron">▶</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "SquadTile",
	props: {
		squad: { type: Object, required: true },
	},
	emits: ["open"],
	methods: {
		initials(name) {
			return name
				.split(/\s+/)
				.map(p => p[0])
				.filter(Boolean)
				.slice(0, 3)
				.join("")
				.toUpperCase();
		},
	},
};
</script>

<style scoped>
.squad-tile {
	background: var(--secondary-color);
	border: 2px solid var(--primary-color);
	border-radius: 0;
	box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
	cursor: pointer;
	min-height: 130px;
	transition: 0.15s ease-in-out;
}

.squad-tile:hover {
	transform: scale(1.02);
	background: var(--highlight-hover);
}

.squad-header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	padding: 1rem 1.4rem;
	gap: 1.2rem;
}

.squad-insignia {
	width: 80px;
	height: 80px;
	border: 3px solid var(--primary-color);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.8rem;
	font-weight: 800;
	color: var(--primary-color);
	background: var(--secondary-color);
	font-family: "Big Shoulders Display", sans-serif;
	letter-spacing: 0.04em;
}

.squad-meta h2 {
	margin: 0;
	font-size: 2rem;
	color: var(--text-headers);
	letter-spacing: 0.05em;
	font-family: "Big Shoulders Display", sans-serif;
}

.count {
	margin-top: 0.3rem;
	font-size: 0.95rem;
	color: var(--text-pilot-header);
	font-family: "Titillium Web", sans-serif;
}

.chevron {
	font-size: 1.6rem;
	color: var(--primary-color);
}
</style>

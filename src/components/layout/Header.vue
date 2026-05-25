<template>
	<header>
		<div class="title clipped-x-large-forward">
			<i class="logo filter-icon" style="--icon-url: url('/faction-logos/union.svg')"></i>
			<div class="title-container">
				<div id="title-first-line" class="title-row">
					<span id="title-header">{{ header.headerTitle }}</span>
					<span id="title-subheader">{{ header.headerSubtitle }}</span>
				</div>
				<div class="title-row">
					<span id="subtitle-header">{{ header.subheaderTitle }}</span>
					<span id="subtitle-subheader">// {{ header.subheaderSubtitle }}</span>
				</div>
			</div>
		</div>
		<div class="rhombus"></div>
		<button
			type="button"
			class="settings-button"
			@click="$emit('open-settings')"
			aria-label="Configurações de tema">
			<i class="filter-icon" style="--icon-url: url('/icons/protocol.svg')"></i>
		</button>
		<div class="planet-location-container">
			<video autoplay muted loop width="90px" height="90px">
				<source :src="`${planetPath}`" type="video/webm" />
			</video>
			<div class="location-info">
				<div id="planet-year" class="location-row">
					<div id="year">
						<h4>Year</h4>
						<span class="subtitle">{{ header.year }}</span>
					</div>
					<div id="planet">
						<h4>Deployment Info</h4>
						<span class="subtitle">{{ header.planet }}</span>
					</div>
				</div>
				<div id="system-gate-ring" class="location-row">
					<div id="ring">
						<h4>Ring</h4>
						<span class="subtitle">{{ header.ring }}</span>
					</div>
					<div id="gate">
						<h4>Gate</h4>
						<span class="subtitle">{{ header.gate }}</span>
					</div>
					<div id="system">
						<h4>System</h4>
						<span class="subtitle">{{ header.system }}</span>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	components: {},
	props: {
		planetPath: {
			type: String,
			required: true,
		},
		header: {
			type: Object,
			required: true,
		},
	},
	emits: ["open-settings"],
};
</script>

<style scoped>
.settings-button {
	position: absolute;
	top: 12px;
	right: 12px;
	z-index: 6;
	width: 36px;
	height: 36px;
	padding: 6px;
	background: transparent;
	border: 1px solid var(--on-primary);
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.15s ease;
}

.settings-button:hover {
	background: rgba(255, 255, 255, 0.15);
}

.settings-button .filter-icon {
	width: 22px;
	height: 22px;
}

/* On mobile the hamburger lives at top-right; bump the settings button
   to the left of it so they don't overlap. */
@media (max-width: 767px) {
	.settings-button {
		right: 64px;
	}
}
</style>

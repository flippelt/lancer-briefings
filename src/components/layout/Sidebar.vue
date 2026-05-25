<template>
	<button
		class="sidebar-toggle"
		:class="{ open: isOpen }"
		@click="toggle"
		aria-label="Menu"
		:aria-expanded="isOpen">
		<span></span><span></span><span></span>
	</button>
	<div
		class="sidebar-overlay"
		:class="{ open: isOpen }"
		@click="close"></div>
	<div class="sidebar-page" :class="{ open: isOpen }">
		<section class="sidebar-layout">
			<o-sidebar
			  id="sidebar"
			  position="static"
			  :animate="animate"
			  :mobile="mobile"
			  :expand-on-hover="expandOnHover"
			  :reduce="reduce"
			  open>
				<router-link class="clipped-bottom-right" to="/status" @click="close">
					<i class="filter-icon" style="--icon-url: url('/icons/orbital.svg')"></i>
					<span>Status</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/pilots" @click="close">
					<i class="filter-icon" style="--icon-url: url('/icons/pilot.svg')"></i>
					<span>Pilotos</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/events" @click="close">
					<i class="filter-icon" style="--icon-url: url('/icons/events.svg')"></i>
					<span>Logs</span>
				</router-link>
				<button
					type="button"
					class="settings-link clipped-bottom-right"
					@click="onSettingsClick"
					aria-label="Configurações de tema">
					<i class="filter-icon" style="--icon-url: url('/icons/protocol.svg')"></i>
					<span>Tema</span>
				</button>
			</o-sidebar>
		</section>
	</div>
</template>

<script>
export default {
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
	},
	emits: ["open-settings"],
	data() {
		return {
			expandOnHover: false,
			mobile: "reduced",
			reduce: false,
			isOpen: false,
		};
	},
	methods: {
		toggle() {
			this.isOpen = !this.isOpen;
		},
		close() {
			this.isOpen = false;
		},
		onSettingsClick() {
			this.close();
			this.$emit("open-settings");
		},
	},
};
</script>

<style scoped>
/* Pin the settings entry to the bottom of the sidebar / drawer
   regardless of how many links are above it. */
.settings-link {
	margin-top: auto;
	background: transparent;
	border: none;
	color: inherit;
	font: inherit;
	cursor: pointer;
	padding: 0.5em 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25em;
	text-decoration: none;
	font-family: "Roboto", sans-serif;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	font-size: 12px;
	color: var(--on-primary);
	width: 100%;
}

.settings-link:hover {
	background: rgba(255, 255, 255, 0.15);
}

.settings-link .filter-icon {
	width: 48px;
	height: 48px;
}
</style>

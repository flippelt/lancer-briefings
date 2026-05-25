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
					<img src="/icons/orbital.svg" class="filter-icon"/>
					<span>Status</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/pilots" @click="close">
					<img src="/icons/pilot.svg" class="filter-icon"/>
					<span>Pilotos</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/events" @click="close">
					<img src="/icons/events.svg" class="filter-icon"/>
					<span>Logs</span>
				</router-link>
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
	},
};
</script>

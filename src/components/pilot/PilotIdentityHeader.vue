<template>
	<!-- TODO: move the .header block from Pilot.vue lines 3-9 here:
	     - The colored bar containing the callsign + (name)
	     - The Union faction logo on the right
	     The bar's background should keep using var(--primary-color) and
	     its text var(--on-primary) so it follows the active theme. -->
	<div class="header">
		<div class="col grow-max">
			<div class="heading h1">{{ pilot.callsign }}</div>
			<div class="heading h2">({{ pilot.name }})</div>
		</div>
		<div class="col">
			<i class="filter-icon" style="--icon-url: url('/faction-logos/union.svg')"></i>
		</div>
	</div>
</template>

<script>
export default {
	name: "PilotIdentityHeader",
	props: {
		pilot: { type: Object, required: true },
	},
};
</script>

<style scoped>
/* TODO: once the split lands, move the .pilot-identity .header rules
   (font sizes, padding, faction-logo dimensions) from _base.css into
   this scoped block — or leave them global if they're shared with
   PilotModal's header. */
</style>

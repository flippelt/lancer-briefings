<template>
	<!-- Red bar at the top of the pilot identity card: callsign,
	     (legal name), and the Union faction logo on the right.
	     Styling is driven by the global `.pilot-identity .header`
	     rules in _base.css — those still match because this markup
	     is rendered inside Pilot.vue's `.grid-item.pilot-identity`. -->
	<div class="header">
		<div class="col grow-max">
			<div class="heading h1">{{ pilot.callsign }}</div>
			<div class="heading h2">({{ pilot.name }}) </div>
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

<template>
	<!-- TODO: move the HASE stats row from Pilot.vue lines 26-33 here.
	     This is the
	       FRAME CONFIGURATION OPTIONS ("H.A.S.E" OMNINET VAULT REMIT)
	       [ HULL: X  AGI: Y  SYS: Z  ENG: W ]
	     block. Reads pilot.mechSkills (a 4-element array indexed
	     0..3 for HULL/AGI/SYS/ENG). -->
	<div class="pilot-stats-block">
		<div class="row caption">
			FRAME CONFIGURATION OPTIONS
			<span class="subtle--text">("H.A.S.E" OMNINET VAULT REMIT)</span>
		</div>
		<div class="row stats-row">
			<span class="stat">HULL <b>{{ pilot.mechSkills[0] }}</b></span>
			<span class="stat">AGI  <b>{{ pilot.mechSkills[1] }}</b></span>
			<span class="stat">SYS  <b>{{ pilot.mechSkills[2] }}</b></span>
			<span class="stat">ENG  <b>{{ pilot.mechSkills[3] }}</b></span>
		</div>
	</div>
</template>

<script>
export default {
	name: "PilotStatsBlock",
	props: {
		pilot: { type: Object, required: true },
	},
};
</script>

<style scoped>
/* TODO: relocate the inline styles currently set on the stats spans
   (font-size: 22px, line-height: 15px, font-size: 24px on the b) and
   the .stat-text / .accent--text rules from _base.css. */
</style>

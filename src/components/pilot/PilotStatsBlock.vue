<template>
	<!-- "FRAME CONFIGURATION OPTIONS" subhead followed by the HASE
	     stats row [ HULL: X  AGI: Y  SYS: Z  ENG: W ]. `mechSkills`
	     is a 4-element array indexed 0..3 => HULL, AGI, SYS, ENG.
	     Inline font-size / line-height preserve the original markup
	     verbatim so the row's visual weight is unchanged. -->
	<div>
		<div style="padding-top:5px">
			FRAME CONFIGURATION OPTIONS
			<span class="subtle--text">("H.A.S.E" OMNINET VAULT REMIT)</span>
		</div>
		<div class="row" style="padding-top:5px">
			<span style="font-size: 22px; line-height: 15px;">
				[ HULL: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[0] }} </span>
				AGI: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[1] }} </span>
				SYS: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[2] }} </span>
				ENG: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[3] }} </span> ]
			</span>
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

<template>
	<div class="pilot-modal">
		<div class="pilot-header-container">
			<div class="section-header clipped-medium-backward-bio">
				<i class="filter-icon" style="--icon-url: url('/icons/pilot.svg')"></i>
				<h2>{{ pilot.name }} [{{ pilot.callsign }}]</h2>
			</div>
			<div class="rhombus-back">&nbsp;</div>
		</div>
		<div class="pilot markdown">
			<div v-html="getHistory()"/>
		</div>
	</div>
	<div class="pilot-modal portrait">
		<div class="pilot-header-container">
			<div class="section-header clipped-medium-backward-pilot">
				<i class="filter-icon" style="--icon-url: url('/icons/portrait.svg')"></i>
				<h2>Pilot Artwork</h2>
			</div>
			<div class="rhombus-back">&nbsp;</div>
		</div>
		<div class="pilot">
			<img :src="pilotPortrait" class="portrait" loading="lazy" decoding="async" />
		</div>
	</div>
</template>

<script>
import { VueMarkdownIt } from '@f3ve/vue-markdown-it';
import { setupSwipeDots } from '@/composables/swipeDots';

export default {
	components: {
		VueMarkdownIt,
	},
	inheritAttrs: false,
	props: {
		pilot: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			markdownHtml: true,
			swipeDotsCleanup: null,
		};
	},
	computed: {
    pilotPortrait() {
      return `/pilots/${this.pilot.callsign.toUpperCase()}.webp`
    },
    mechPortrait() {
      return `/mechs/${this.pilot.callsign}.webp`
    },
	},
	mounted() {
		this.swipeDotsCleanup = setupSwipeDots(this.$el);
	},
	beforeUnmount() {
		if (this.swipeDotsCleanup) this.swipeDotsCleanup();
	},
	methods: {
		// COMP/CON writes untouched rich-text fields as "<p><br></p>" rather than
		// an empty string, so comparing against "" leaves a bare APPEARANCE or
		// HISTORY heading with nothing under it. Judge by the prose, not the tags.
		hasProse(html){
			return (html || "").replace(/<[^>]*>/g, "").replace(/&nbsp;|\s/g, "") !== "";
		},
		getHistory(){
			if (!this.hasProse(this.pilot.history) && !this.hasProse(this.pilot.text_appearance)){
				return `<p> <h2> [ERR: REDACTED] </h2> </p>`
			}

			let response = "<p>"

			if (this.hasProse(this.pilot.text_appearance)){
				response += `<h2>APPEARANCE</h2> ${this.pilot.text_appearance} </hr>`;
			}

			if (this.hasProse(this.pilot.history)){
				response += `<h2>HISTORY</h2> ${this.pilot.history} </hr>`;
			}

			response += "</p>"

			return response;
		}
	},
};
</script>
<template>
  <div class="grid-item pilot-identity" style="color:white!important">
    <PilotIdentityHeader :pilot="pilot" />
    <div class="body">
      <div class="add-padding"> Union Administrative RM-4 Pilot Identification Protocol (IDENT) Record
        {{ pilot.id }} </div>
      <div class="flex-container-rows">
        <div class="row add-padding">
          {{ reverse(this.pilot.name) }}:{{ pilot.id }}//NDL-C-BLIND-REACH
        </div>
        <div class="row flex-container-cols add-padding">
          <div class="col grow-max flex-container-rows" style="padding-top:5px">
            <div class="row flex-container-cols">
              <div class="col col-primary"><span class="flavor-text"> Callsign: <b class="accent--text">{{
                capitalize(pilot.callsign) }}</b><br> Name (or legal alias): <b class="accent--text">{{ pilot.name
                    }}</b><br> Background: <b class="accent--text"> {{ pilot.background }} </b></span></div>
              <div class="col">CALLSIGN AVAILABLE <br> IDENTITY
                VERIFIED <br> PH/HR DATA REGISTERED</div>
            </div>
            <PilotStatsBlock :pilot="pilot" />
            <div class="row flex-container-cols">
              <div class="col col-share">
                <PilotChipsRow kind="skill" :items="pilot.skills" />
              </div>
              <div class="col col-share">
                <PilotChipsRow kind="talent" :items="pilot.talents" />
              </div>
            </div>
            <div v-if="pilot.level > 0" class="row flex-container-cols">
              <div class="col" style="padding-top:5px">
                <PilotChipsRow kind="license" :items="pilot.licenses" :pilot-level="pilot.level" />
              </div>
            </div>
          </div>
          <div class="col">
            <div class="pilot-image-container">
              <div class="pilot-image-border">
                <img :src="pilotPortrait" class="portrait" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PilotModalButtons
        :pilot="pilot"
        :active-mech="activeMech"
        @open-pilot-modal="pilotModal"
        @open-mech-modal="mechModal" />
      <hr role="separator" aria-orientation="horizontal" class="ma-2 v-divider theme--dark">
      <div class="row row--dense"><span class="overline" style="line-height: 13px !important; opacity: 0.4;">
          Improper use of this IDENT record and/or its constituent data by the record holder or any other
          persons is punishable under the DoJ/HR A-645-c. This record is the property of the Union
          Administrative Office and the information herein must be transmitted on request under
          NDL-C-DISCORDANT-BREATH encryption protocols. This RM-4 record must be updated every five (5)
          Cradle
          Standard Years of objective time to retain GMS licensing rights. Far-field operatives that
          anticipate deployments lasting longer than five Cradle Standard Years that have not been issued
          a
          man-portable Omninet Hook should apply for the RM-11-B IDENT Supplemental (b) Extension. Contact
          your local Union Adminstrative Officer for any other matters regarding this
          record.  V-CDL//M-265-114-831 (A) </span></div>
    </div>
  </div>
</template>

<script>
import 'external-svg-loader'
import lancerData from '@massif/lancer-data'
import lcp from '@/assets/LCPs'

import PilotModal from '@/components/modals/PilotModal.vue'
import MechModal from '@/components/modals/MechModal.vue'

import Typer from '@/components/Typer.vue'

import ProgressBar from '@/components/ProgressBar.vue'
import Burden from '@/components/Burden.vue'

import PilotIdentityHeader from '@/components/pilot/PilotIdentityHeader.vue'
import PilotStatsBlock from '@/components/pilot/PilotStatsBlock.vue'
import PilotChipsRow from '@/components/pilot/PilotChipsRow.vue'
import PilotModalButtons from '@/components/pilot/PilotModalButtons.vue'

export default {
  components: {
    Burden,
    ProgressBar,
    Typer,
    PilotIdentityHeader,
    PilotStatsBlock,
    PilotChipsRow,
    PilotModalButtons,
  },
  props: {
    animate: {
      type: Boolean,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeMech: {},
      bond: {},
    }
  },
  computed: {
    pilotPortrait() {
      return `/pilots/${this.pilot.callsign.toUpperCase()}.webp`
    },
    mechPortrait() {
      return `/mechs/${this.pilot.callsign.toUpperCase()}.webp`
    },
    pilotGear() { return lcp.pilotGear },
    mechWeapons() { return lcp.weapons },
    mechSystems() { return lcp.systems },
    talents() { return lcp.talents },
    skills() { return lcp.skills },
    bonds() { return lcp.bonds },
    frames() { return lcp.frames },
    mechManufacturerIcon() {
      if (this.activeMech.manufacturer)
        return `/faction-logos/${this.activeMech.manufacturer.toLowerCase()}.svg`
      return ''
    },
    pilotCode() {
      const identNameParts = this.pilot.name.split(' ')
      const identFirstName = identNameParts[0]
      const identLastNameParts = identNameParts.slice(1)
      let identName = ''
      identLastNameParts.forEach((part) => {
        identName += `${part}.`
      })
      identName += identFirstName;
			return `Union Administrative RM-4 Pilot Identification Protocol (IDENT) Record ${identName}: ${this.pilot.id} // ${this.pilot.background} // LOADOUT ${this.pilot.loadout.id} - MECH ${this.pilot.mechs[0].id} // HARDPOINTS ${this.pilot.mechs[0].loadouts[0].id}`;
		},
    pilotInfo() {
      const info = this.pilot

      let resolveGear = (type, item, idx, arr) => {
        item = item || {id: "", flavorName: ""};
        const gear = this.pilotGear.find((obj) => { return item.id === obj.id }) || null;
        item.flavorName = gear?.name || "ERR: DATA NOT FOUND";
        arr[idx] = item;
      }

      info.loadout.armor.forEach((item, index, array) => resolveGear('armor', item, index, array));
      info.loadout.weapons.forEach((item, index, array) => resolveGear('weapon', item, index, array));
      info.loadout.gear.forEach((item, index, array) =>resolveGear('gear', item, index, array));

      return info;
    },
  },
  created() {
    this.getActiveMech();
    this.getBond();
  },
  methods: {
    getBond() {
      this.bond = this.bonds.find((obj) => {
        return obj.id === this.pilot.bondId
      })
    },
    getActiveMech() {
      const activeMechID = this.pilot.state.active_mech_id
      const mech = this.pilot.mechs.find((obj) => {
        return obj.id === activeMechID
      })

      if (mech) {
        this.activeMech = mech
      }
      else {
        // default to missing frame in case pilot has no mechs
        this.pilot.mechs[0] ? this.activeMech = this.pilot.mechs[0] : lancerData.frames.find((obj) => { return obj.id === 'missing_frame' })
      }

      let frame = this.frames.find((obj) => {
        return obj.id === this.activeMech.frame
      })

      if (!frame)
        frame = lancerData.frames[0]

      this.activeMech.frame_description = frame.description
      this.activeMech.frame_name = frame.name
      this.activeMech.manufacturer = frame.source
      this.activeMech.mechtype = frame.mechtype.join(' // ')
    },
    getHistory() {
      if (this.pilot.history === "") {
        return `<p> <h2> [ERR: REDACTED] </h2> </p>`
      }

      let response = "<p>"

      if (this.pilot.text_appearance !== "") {
        response += `<h2>APPEARANCE</h2> ${this.pilot.text_appearance} </hr>`;
      }

      if (this.pilot.history !== "") {
        response += `<h2>HISTORY</h2> ${this.pilot.history} </hr>`;
      }

      response += "</p>"

      return response;
    },
    capitalize(str) {
      return str.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    },
    reverse(str) {
      const words = str.split(' ')
      const reversed = words.reverse()
      const reversedResult = words.join('.')
      return reversedResult
    },
    pilotModal() {
      this.$oruga.modal.open({
        component: PilotModal,
        custom: true,
        trapFocus: true,
        props: {
          pilot: this.pilot,
          talents: this.talents,
          skills: this.skills,
          frames: this.frames,
        },
        class: 'custom-modal',
        width: 'min(1920px, 95vw)',
      })
    },
    mechModal() {
      this.$oruga.modal.open({
        component: MechModal,
        custom: true,
        trapFocus: true,
        props: {
          animate: this.animate,
          mech: this.activeMech,
          systemsData: this.mechSystems,
          weaponsData: this.mechWeapons,
          pilot: this.pilot,
        },
        class: 'custom-modal',
        width: 'min(1920px, 95vw)',
      })
    },
  },
}
</script>

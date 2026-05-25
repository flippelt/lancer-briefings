import lancerData from "@massif/lancer-data";
import ktbData from "lancer-ktb-data";
import nrfawData from "lancer-nrfaw-data";
import longrimData from "lancer-longrim-data";
import wallflowerData from "./wallflower-data-2.0.5";
import osrData from "./osr-data-1.2.0";
import sotwData from "./sotw-data-1.0.2";
import owsData from "./ows-data-1.0.0";
import dustgraveData from "./dustgrave-data-1.4.0";
import sirenData from "./siren-song-data";

// Order matters: lancer's canonical data first so its IDs win on any conflict.
const sources = [
	lancerData,
	ktbData,
	nrfawData,
	longrimData,
	wallflowerData,
	osrData,
	sotwData,
	owsData,
	dustgraveData,
	sirenData,
];

const collect = (key) =>
	sources.flatMap((src) => (Array.isArray(src?.[key]) ? src[key] : []));

export const weapons = collect("weapons");
export const systems = collect("systems");
export const frames = collect("frames");
export const talents = collect("talents");
export const skills = collect("skills");
export const bonds = collect("bonds");
export const pilotGear = collect("pilot_gear");
export const reserves = collect("reserves");
export const mods = collect("mods");

export default {
	weapons,
	systems,
	frames,
	talents,
	skills,
	bonds,
	pilotGear,
	reserves,
	mods,
};

// Single source of truth for theme palette options.
// Used by:
//   - App.vue                       to apply the matching primary color
//                                   to the Vanta background mesh
//   - components/modals/SettingsModal.vue
//                                   to render the color swatch grid

export const themes = [
	{ key: "albatross", label: "Albatross", color: "#ca1510" },
	{ key: "galsin",    label: "Galsin",    color: "#e36600" },
	{ key: "gms",       label: "GMS",       color: "#991e2a" },
	{ key: "ha",        label: "HA",        color: "#771675" },
	{ key: "horus",     label: "HORUS",     color: "#126127" },
	{ key: "ipsn",      label: "IPS-N",     color: "#1952a2" },
	{ key: "karrakin",  label: "Karrakin",  color: "#996414" },
	{ key: "msmc",      label: "MSMC",      color: "#7dbbbb" },
	{ key: "ssc",       label: "SSC",       color: "#d1920a" },
	{ key: "voladores", label: "Voladores", color: "#b87333" },
];

// Map "#1952a2" -> 0x1952a2 for Three.js / Vanta color args.
export function hexToInt(hex) {
	return parseInt(hex.replace(/^#/, ""), 16);
}

// Return the integer color for a theme key, falling back to the GMS red
// if the key is somehow unknown (e.g. stale localStorage value).
export function themeColorInt(key) {
	const found = themes.find((t) => t.key === key);
	return hexToInt(found ? found.color : "#991e2a");
}

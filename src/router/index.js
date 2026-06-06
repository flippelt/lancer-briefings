import { createMemoryHistory, createWebHistory, createRouter } from "vue-router";

import Config from "@/assets/info/general-config.json";

// Dynamic imports below let Vite split each route into its own chunk —
// the Pilots route in particular pulls in all the @massif/lancer-data
// and LCP bundles, which we don't want in the initial payload.
const DEFAULT_TITLE = Config.defaultTitle;
const routes = [
	{
		path: "/",
		redirect: "/status",
	},
	{
		path: "/status",
		name: "Mission Status",
		component: () => import("@/views/StatusView.vue"),
		props: true,
		meta: { title: `${DEFAULT_TITLE} MISSION STATUS` },
	},
	{
		path: "/pilots",
		name: "Pilots",
		component: () => import("@/views/PilotsView.vue"),
		props: true,
		meta: { title: `${DEFAULT_TITLE} PILOT ROSTER` },
	},
	{
		path: "/squads",
		name: "Squads",
		component: () => import("@/views/SquadsView.vue"),
		props: true,
		meta: { title: `${DEFAULT_TITLE} SQUAD ROSTER` },
	},
	{
		path: "/events",
		name: "Events",
		component: () => import("@/views/EventsView.vue"),
		props: true,
		meta: { title: `${DEFAULT_TITLE} EVENTS LOG` },
	},
];

const router = createRouter({
	history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return {
				el: to.hash,
				behavior: "smooth",
			};
		}
	},
});

router.beforeEach((to, from, next) => {
	// Use next tick to handle router history correctly
	// see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
	document.title = `${to.meta.title}`;
	next();
});

export default router;

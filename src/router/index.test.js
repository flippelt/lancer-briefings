import { describe, it, expect, beforeAll } from "vitest";
import router from "./index";

// As views reais puxam todo o @massif/lancer-data e os LCPs via import
// dinâmico. Para o teste do guard não queremos carregar isso, então
// substituímos cada rota nomeada por um stub vazio — preservando o `meta`,
// que é o que o guard global lê. O beforeEach real continua registrado.
const Stub = { template: "<div></div>" };

beforeAll(() => {
	for (const route of router.getRoutes()) {
		if (route.name) {
			router.addRoute({
				path: route.path,
				name: route.name,
				meta: route.meta,
				component: Stub,
			});
		}
	}
});

describe("router config", () => {
	it("expõe as rotas status, pilots e events com nome e título", () => {
		const byName = Object.fromEntries(
			router.getRoutes().map(r => [r.name, r])
		);

		expect(byName["Mission Status"].path).toBe("/status");
		expect(byName["Mission Status"].meta.title).toMatch(/MISSION STATUS$/);
		expect(byName["Pilots"].path).toBe("/pilots");
		expect(byName["Pilots"].meta.title).toMatch(/PILOT ROSTER$/);
		expect(byName["Events"].path).toBe("/events");
		expect(byName["Events"].meta.title).toMatch(/EVENTS LOG$/);
	});

	it("redireciona a raiz '/' para '/status'", async () => {
		await router.push("/");
		expect(router.currentRoute.value.path).toBe("/status");
	});
});

describe("beforeEach title guard", () => {
	it("sincroniza document.title com o meta.title da rota destino", async () => {
		await router.push("/pilots");
		expect(document.title).toBe(router.resolve("/pilots").meta.title);

		await router.push("/events");
		expect(document.title).toBe(router.resolve("/events").meta.title);
	});
});

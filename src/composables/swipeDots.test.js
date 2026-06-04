import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setupSwipeDots } from "./swipeDots";

// Mocka o matchMedia que o jsdom não implementa. `isDesktop` controla a query
// "(min-width: 1200px)" usada pelo composable para sair cedo em telas grandes.
function mockMatchMedia(isDesktop) {
	window.matchMedia = query => ({
		matches: isDesktop && query.includes("min-width: 1200px"),
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	});
}

// Monta um wrapper com N panes (como o Oruga faz no modal de swipe) e o anexa
// ao body. Define clientWidth/scrollLeft (o jsdom não faz layout) e um scrollTo
// observável.
function buildModal(paneCount, paneClass = "pilot-modal") {
	const wrapper = document.createElement("div");
	const panes = [];
	for (let i = 0; i < paneCount; i++) {
		const pane = document.createElement("div");
		pane.className = paneClass;
		wrapper.appendChild(pane);
		panes.push(pane);
	}

	let scrollLeft = 0;
	Object.defineProperty(wrapper, "clientWidth", { get: () => 100, configurable: true });
	Object.defineProperty(wrapper, "scrollLeft", {
		get: () => scrollLeft,
		set: v => {
			scrollLeft = v;
		},
		configurable: true,
	});
	wrapper.scrollTo = vi.fn();

	document.body.appendChild(wrapper);
	return { wrapper, root: panes[0], panes };
}

const dotsContainer = () => document.body.querySelector(".modal-swipe-dots");

describe("setupSwipeDots", () => {
	beforeEach(() => {
		mockMatchMedia(false); // mobile/tablet por padrão
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("retorna null quando o rootEl é nulo", () => {
		expect(setupSwipeDots(null)).toBeNull();
	});

	it("retorna null no desktop (≥ 1200px)", () => {
		mockMatchMedia(true);
		const { root } = buildModal(3);
		expect(setupSwipeDots(root)).toBeNull();
		expect(dotsContainer()).toBeNull();
	});

	it("retorna null quando o root não tem wrapper pai", () => {
		const orphan = document.createElement("div");
		orphan.className = "pilot-modal";
		expect(setupSwipeDots(orphan)).toBeNull();
	});

	it("retorna null com menos de 2 panes", () => {
		const { root } = buildModal(1);
		expect(setupSwipeDots(root)).toBeNull();
		expect(dotsContainer()).toBeNull();
	});

	it("cria um dot por pane, com o primeiro ativo e atributos de acessibilidade", () => {
		const { root } = buildModal(3);
		setupSwipeDots(root);

		const container = dotsContainer();
		expect(container).not.toBeNull();
		expect(container.getAttribute("role")).toBe("tablist");

		const dots = container.querySelectorAll(".modal-swipe-dot");
		expect(dots).toHaveLength(3);
		expect(dots[0].classList.contains("active")).toBe(true);
		expect(dots[1].classList.contains("active")).toBe(false);
		expect(dots[0].getAttribute("aria-label")).toBe("Página 1 de 3");
	});

	it("também reconhece panes .mech-modal", () => {
		const { root } = buildModal(2, "mech-modal");
		setupSwipeDots(root);
		expect(dotsContainer().querySelectorAll(".modal-swipe-dot")).toHaveLength(2);
	});

	it("destaca o dot correspondente ao snap point mais próximo ao rolar", () => {
		const { root, wrapper } = buildModal(3);
		setupSwipeDots(root);
		const dots = dotsContainer().querySelectorAll(".modal-swipe-dot");

		wrapper.scrollLeft = 100; // clientWidth = 100 → índice 1
		wrapper.dispatchEvent(new Event("scroll"));
		expect(dots[1].classList.contains("active")).toBe(true);
		expect(dots[0].classList.contains("active")).toBe(false);

		wrapper.scrollLeft = 190; // round(1.9) → índice 2
		wrapper.dispatchEvent(new Event("scroll"));
		expect(dots[2].classList.contains("active")).toBe(true);
		expect(dots[1].classList.contains("active")).toBe(false);
	});

	it("rola o wrapper para o pane correspondente ao clicar num dot", () => {
		const { root, wrapper } = buildModal(3);
		setupSwipeDots(root);
		const dots = dotsContainer().querySelectorAll(".modal-swipe-dot");

		dots[2].click();
		expect(wrapper.scrollTo).toHaveBeenCalledWith({ left: 200, behavior: "smooth" });
	});

	it("a função de cleanup remove o indicador e para de reagir ao scroll", () => {
		const { root, wrapper } = buildModal(3);
		const cleanup = setupSwipeDots(root);

		expect(dotsContainer()).not.toBeNull();

		cleanup();
		expect(dotsContainer()).toBeNull();

		// Sem o listener, um scroll posterior não deve lançar nem recriar nada.
		expect(() => {
			wrapper.scrollLeft = 100;
			wrapper.dispatchEvent(new Event("scroll"));
		}).not.toThrow();
		expect(dotsContainer()).toBeNull();
	});
});

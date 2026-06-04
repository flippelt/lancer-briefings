import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PilotChipsRow from "./PilotChipsRow.vue";

// Mocka o catálogo de LCPs com dados controlados — assim formatItem fica
// determinístico e independente dos pacotes reais do Lancer.
vi.mock("@/assets/LCPs", () => ({
	default: {
		skills: [{ id: "sk1", name: "Hack" }],
		talents: [{ id: "t1", name: "Nuclear Cavalier" }],
		frames: [{ id: "f1", source: "GMS", name: "Everest" }],
	},
}));

const mountRow = props => mount(PilotChipsRow, { props });

describe("PilotChipsRow", () => {
	describe("heading", () => {
		it("usa o título fixo para skill e talent", () => {
			expect(mountRow({ kind: "skill", items: [] }).vm.heading).toBe(
				"PILOT SKILL TRIGGER AUDIT"
			);
			expect(mountRow({ kind: "talent", items: [] }).vm.heading).toBe(
				"PILOT TALENT AUDIT"
			);
		});

		it("anexa o nível do piloto ao título de license", () => {
			const wrapper = mountRow({ kind: "license", items: [], pilotLevel: 2 });
			expect(wrapper.vm.heading).toBe("PROCUREMENT LICENSE AUDIT: LEVEL 2");
		});
	});

	describe("formatItem", () => {
		it("skill: nome + rank dobrado", () => {
			const wrapper = mountRow({ kind: "skill", items: [{ id: "sk1", rank: 3 }] });
			expect(wrapper.vm.formatItem({ id: "sk1", rank: 3 })).toBe("Hack +6");
		});

		it("talent: nome + rank em algarismos romanos", () => {
			const wrapper = mountRow({ kind: "talent", items: [{ id: "t1", rank: 2 }] });
			expect(wrapper.vm.formatItem({ id: "t1", rank: 2 })).toBe("Nuclear Cavalier II");
		});

		it("license: fabricante + frame + rank romano", () => {
			const wrapper = mountRow({ kind: "license", items: [{ id: "f1", rank: 3 }] });
			expect(wrapper.vm.formatItem({ id: "f1", rank: 3 })).toBe("GMS Everest III");
		});

		it("retorna string vazia quando o id não está no catálogo", () => {
			const wrapper = mountRow({ kind: "skill", items: [] });
			expect(wrapper.vm.formatItem({ id: "desconhecido", rank: 1 })).toBe("");
		});
	});

	describe("renderização", () => {
		it("renderiza um chip por item com o texto formatado", () => {
			const wrapper = mountRow({
				kind: "skill",
				items: [
					{ id: "sk1", rank: 1 },
					{ id: "sk1", rank: 2 },
				],
			});
			const chips = wrapper.findAll(".chip");
			expect(chips).toHaveLength(2);
			expect(chips[0].text()).toContain("Hack +2");
			expect(chips[1].text()).toContain("Hack +4");
		});

		it("exibe o heading no topo do grupo", () => {
			const wrapper = mountRow({ kind: "talent", items: [] });
			expect(wrapper.text()).toContain("PILOT TALENT AUDIT");
		});
	});
});

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

// Config enxuta para os testes: só o plugin Vue e o alias "@". Os plugins de
// build (PWA, devtools, compression) ficam de fora — não fazem sentido aqui e
// só deixariam a suíte mais lenta. Ambiente jsdom para DOM/componentes.
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		include: ["src/**/*.test.{js,ts}"],
	},
});

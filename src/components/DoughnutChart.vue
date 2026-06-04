<template>
	<canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { Chart, registerables } from "chart.js";
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";

Chart.register(...registerables);

// Wrapper mínimo sobre o chart.js, em substituição ao vue-chart-3 — que
// arrastava o lodash-es (sem versão corrigida) e era a única origem das
// vulnerabilidades do projeto. Mantém a mesma API usada por Clock/Burden:
// props `chartData` e `options`, renderizando um doughnut.
export default defineComponent({
	name: "DoughnutChart",
	props: {
		chartData: { type: Object, required: true },
		options: { type: Object, default: () => ({}) },
	},
	setup(props) {
		const canvas = ref<HTMLCanvasElement | null>(null);
		let chart: Chart | null = null;

		const render = () => {
			if (!canvas.value) return;
			chart?.destroy();
			chart = new Chart(canvas.value, {
				type: "doughnut",
				data: props.chartData as any,
				options: props.options as any,
			});
		};

		onMounted(render);
		// Recria ao mudar dados/opções (clocks são pequenos; recriar replica a
		// animação, que é o comportamento desejado).
		watch(() => [props.chartData, props.options], render, { deep: true });
		onBeforeUnmount(() => chart?.destroy());

		return { canvas };
	},
});
</script>

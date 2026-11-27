<script lang="ts">
	// Generative guilloché rosette (hypotrochoid line-art) — the world's signature material.
	let {
		size = 240,
		stroke = 0.6,
		color = 'currentColor',
		opacity = 1,
		rings = 4,
		petals = 13,
		class: klass = ''
	}: {
		size?: number;
		stroke?: number;
		color?: string;
		opacity?: number;
		rings?: number;
		petals?: number;
		class?: string;
	} = $props();

	function rosette(radius: number, k: number, d: number): string {
		const Rf = k;
		const r = 1;
		const steps = Math.max(420, k * 56);
		const scale = radius / (Rf - r + d);
		let path = '';
		for (let i = 0; i <= steps; i++) {
			const t = (i / steps) * Math.PI * 2;
			const x = ((Rf - r) * Math.cos(t) + d * Math.cos(((Rf - r) / r) * t)) * scale;
			const y = ((Rf - r) * Math.sin(t) - d * Math.sin(((Rf - r) / r) * t)) * scale;
			path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
		}
		return path + 'Z';
	}

	let paths = $derived(
		Array.from({ length: rings }, (_, i) => {
			const t = rings === 1 ? 1 : i / (rings - 1);
			const radius = (size / 2) * (0.46 + 0.5 * t);
			const k = Math.max(5, petals - i * 2);
			const d = 0.55 + i * 0.14;
			return rosette(radius, k, d);
		})
	);
</script>

<svg
	class={klass}
	width={size}
	height={size}
	viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
	aria-hidden="true"
	focusable="false"
	style="opacity:{opacity}"
>
	{#each paths as p}
		<path d={p} fill="none" stroke={color} stroke-width={stroke} vector-effect="non-scaling-stroke" />
	{/each}
</svg>

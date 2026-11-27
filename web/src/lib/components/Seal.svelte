<script lang="ts">
	// Validity seal: guilloché ring + status mark. Lit when valid, struck when expired.
	type Tone = 'valid' | 'soon' | 'crit' | 'expired' | 'unknown' | 'pending';
	let {
		status = 'valid',
		size = 56,
		legend = ''
	}: { status?: Tone; size?: number; legend?: string } = $props();

	const colorVar: Record<Tone, string> = {
		valid: 'var(--st-valid)',
		soon: 'var(--st-soon)',
		crit: 'var(--st-crit)',
		expired: 'var(--st-expired)',
		unknown: 'var(--st-unknown)',
		pending: 'var(--ink-500)'
	};

	// hypotrochoid ring for the seal interior
	function rosette(radius: number, k: number, d: number): string {
		const Rf = k;
		const r = 1;
		const steps = k * 48;
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
	const ros = rosette(30, 11, 0.7);
	const col = $derived(colorVar[status]);
	const showLegend = $derived(size >= 92 && legend.length > 0);
</script>

<span
	class="seal"
	class:lit={status === 'valid'}
	style="width:{size}px;height:{size}px;color:{col}"
	role="img"
	aria-label={legend || status}
>
	<svg viewBox="-50 -50 100 100" width={size} height={size}>
		<circle r="47" fill="none" stroke="currentColor" stroke-width="1.4" />
		<circle r="41" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.7" />
		<path d={ros} fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.5" />

		{#if showLegend}
			<defs>
				<path id="sealArc" d="M 0,0 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
			</defs>
			<text font-size="7" font-family="var(--font-mono)" letter-spacing="2.4" fill="currentColor">
				<textPath href="#sealArc" startOffset="2%">{legend} · {legend} ·</textPath>
			</text>
		{/if}

		<!-- center mark, drawn per status -->
		{#if status === 'valid'}
			<path d="M -13 1 L -4 11 L 15 -11" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
		{:else if status === 'soon'}
			<circle r="15" fill="none" stroke="currentColor" stroke-width="2.6" />
			<path d="M 0 -9 L 0 1 L 8 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
		{:else if status === 'crit'}
			<path d="M 0 -15 L 15 12 L -15 12 Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" />
			<path d="M 0 -4 L 0 5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" />
			<circle cx="0" cy="9" r="1.5" fill="currentColor" />
		{:else if status === 'expired'}
			<path d="M -12 -12 L 12 12 M 12 -12 L -12 12" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />
		{:else if status === 'pending'}
			<circle r="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="4 5" />
		{:else}
			<path d="M -6 -5 a 6 6 0 1 1 8 7 c -2 1.6 -2 2 -2 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
			<circle cx="0" cy="12" r="1.6" fill="currentColor" />
		{/if}

		{#if status === 'expired'}
			<line x1="-47" y1="26" x2="47" y2="-26" stroke="currentColor" stroke-width="2" opacity="0.6" />
		{/if}
	</svg>
</span>

<style>
	.seal {
		display: inline-grid;
		place-items: center;
		flex: none;
		border-radius: 50%;
	}
	.seal.lit {
		filter: drop-shadow(0 0 6px color-mix(in srgb, var(--st-valid) 55%, transparent));
	}
</style>

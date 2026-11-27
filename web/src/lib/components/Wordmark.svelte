<script lang="ts">
	let { sub = true }: { sub?: boolean } = $props();
</script>

<a class="wordmark" href="/">
	<svg class="seal-mini" width="34" height="34" viewBox="-50 -50 100 100" aria-hidden="true">
		<circle r="47" fill="none" stroke="var(--foil)" stroke-width="2.5" />
		<circle r="40" fill="none" stroke="var(--foil)" stroke-width="1" opacity="0.7" />
		<path
			d="M -34 0 L 0 -34 L 34 0 L 0 34 Z"
			fill="none"
			stroke="var(--foil-hi)"
			stroke-width="1"
			opacity="0.65"
		/>
		<path
			d="M -16 -8 L -9 12 L 0 -4 L 9 12 L 16 -8"
			fill="none"
			stroke="var(--foil-hi)"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	<span class="wm-text">
		<span class="wm-name">web-asset-monitor</span>
		{#if sub}<span class="wm-sub">Register Masa Aktif · Edisi Kerja</span>{/if}
	</span>
</a>

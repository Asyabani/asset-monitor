<script lang="ts">
	// Drawn icon set — one consistent stroke weight. No emoji, no unicode glyphs.
	let {
		name,
		size = 20,
		stroke = 1.6
	}: {
		name: 'arrow-right' | 'share' | 'plus' | 'check' | 'clock' | 'hash' | 'mail' | 'file' | 'copy';
		size?: number;
		stroke?: number;
	} = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	{#if name === 'arrow-right'}
		<path d="M4 12h15" /><path d="M13 6l6 6-6 6" />
	{:else if name === 'share'}
		<path d="M12 15V4" /><path d="M8 8l4-4 4 4" /><path d="M5 12v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" />
	{:else if name === 'plus'}
		<path d="M12 5v14" /><path d="M5 12h14" />
	{:else if name === 'check'}
		<path d="M4 12l5 5L20 6" />
	{:else if name === 'clock'}
		<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3.5 2" />
	{:else if name === 'hash'}
		<path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" />
	{:else if name === 'mail'}
		<rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 7l8 6 8-6" />
	{:else if name === 'copy'}
		<rect x="8.5" y="8.5" width="11" height="11" rx="1.5" /><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
	{:else if name === 'file'}
		<path d="M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z" /><path d="M14 3.5V8h4.5" />
	{/if}
</svg>

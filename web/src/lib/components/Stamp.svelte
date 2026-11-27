<script lang="ts">
	import { toneOf, labelOf } from '$lib/statusmap';
	let { status, print = false }: { status: string; print?: boolean } = $props();
</script>

<span class="stamp" class:stamp-print={print} data-tone={toneOf(status)}>{labelOf(status)}</span>

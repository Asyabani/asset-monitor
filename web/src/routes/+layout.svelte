<script lang="ts">
	import '../app.css';
	import Wordmark from '$lib/components/Wordmark.svelte';
	let { children } = $props();
</script>

<header class="masthead">
	<div class="row">
		<Wordmark />
		<nav><a href="/tools">Buka register →</a></nav>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="notice">
	<div class="shell">
		<span class="legend">Catatan</span>
		<p>
			web-asset-monitor adalah <strong>alat bantu pengingat</strong>, bukan jaminan. Tanggung jawab
			akhir atas perpanjangan aset tetap pada pengguna. Tanggal domain dibaca dari RDAP publik, masa
			berlaku SSL dari sertifikat yang disajikan server — sebagian TLD meredaksi tanggalnya.
			<span class="muted">Semua pengecekan memakai data publik; tidak perlu akses cPanel atau login.</span>
		</p>
	</div>
</footer>

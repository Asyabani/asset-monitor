<script lang="ts">
	import Guilloche from '$lib/components/Guilloche.svelte';
	import Seal from '$lib/components/Seal.svelte';
	import Stamp from '$lib/components/Stamp.svelte';
	import Icon from '$lib/components/Icon.svelte';

	// Data SPESIMEN — contoh, bukan klien nyata.
	const spesimen = [
		{ no: '001', domain: 'toko-klien.co.id', dom: '12 hr', ssl: '41 hr', reg: 'PANDI / Jetcoms', status: 'KRITIS' },
		{ no: '002', domain: 'studio-anu.com', dom: '24 hr', ssl: '88 hr', reg: 'Niagahoster', status: 'SEGERA' },
		{ no: '003', domain: 'portal.instansi.go.id', dom: '210 hr', ssl: '63 hr', reg: 'PANDI', status: 'aman' },
		{ no: '004', domain: 'klien-lama.id', dom: '-9 hr', ssl: '—', reg: 'Rumahweb', status: 'LEWAT' }
	];

	const langkah = [
		{ no: 'I', t: 'Daftarkan', d: 'Tempel sampai 50 domain klien — URL penuh & subdomain dirapikan otomatis.' },
		{ no: 'II', t: 'Diperiksa', d: 'RDAP + sertifikat TLS dibaca; tiap aset dicap masa berlakunya ke dalam register.' },
		{ no: 'III', t: 'Ditagih', d: 'Yang mendekati jatuh tempo jadi draf tagihan WhatsApp siap kirim. (Mode berlangganan.)' }
	];
</script>

<svelte:head>
	<title>web-asset-monitor — register masa aktif domain & SSL</title>
	<meta
		name="description"
		content="Pantau masa aktif domain, hosting & SSL semua klien lintas-registrar dalam satu register. Tempel sampai 50 domain, gratis, tanpa login. Untuk web developer & agensi."
	/>
</svelte:head>

<section class="hero">
	<div class="hero-bg" aria-hidden="true">
		<Guilloche size={600} rings={5} petals={15} stroke={0.6} color="var(--foil)" opacity={0.32} />
	</div>

	<div class="shell hero-inner">
		<div class="hero-copy">
			<h1 class="display">
				Setiap aset web klien <br />punya tanggal <span class="u">kedaluwarsa</span>.
			</h1>
			<p class="lede measure">
				Pantau masa aktif domain, hosting &amp; SSL semua klien — lintas-registrar, dalam satu
				register. Lalu ubah tanggal jatuh tempo jadi draf tagihan WhatsApp.
			</p>
			<div class="hero-actions">
				<a class="btn btn-foil" href="/tools">Mulai cek <Icon name="arrow-right" size={18} /></a>
				<a class="btn btn-ghost on-ink" href="#spesimen">Lihat contoh register</a>
			</div>
			<p class="hero-meta serial">GRATIS · TANPA LOGIN · SAMPAI 50 DOMAIN SEKALIGUS</p>
		</div>

		<div class="hero-seal">
			<Seal status="valid" size={168} legend="WEB ASSET REGISTER" />
		</div>
	</div>
</section>

<!-- Specimen register: prove the mechanism -->
<section class="shell block" id="spesimen">
	<div class="doc">
		<div class="doc-head">
			<span class="doc-title">Contoh register</span>
			<Stamp status="aman" print />
		</div>
		<div class="microrule" aria-hidden="true">
			{'MASABERLAKU·WEBASSETMONITOR·RDAP·TLS·'.repeat(12)}
		</div>
		<div class="doc-body no-pad">
			<div class="table-wrap">
				<table class="register">
					<thead>
						<tr>
							<th>No.</th>
							<th>Aset</th>
							<th class="sm-hide">Domain</th>
							<th class="sm-hide">SSL</th>
							<th class="sm-hide">Registrar</th>
							<th>Segel</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each spesimen as r}
							<tr>
								<td class="col-no">{r.no}</td>
								<td class="col-domain">{r.domain}</td>
								<td class="sm-hide"><span class="days">{r.dom}</span></td>
								<td class="sm-hide"><span class="days">{r.ssl}</span></td>
								<td class="col-reg sm-hide">{r.reg}</td>
								<td><Seal status={r.status === 'aman' ? 'valid' : r.status === 'SEGERA' ? 'soon' : r.status === 'KRITIS' ? 'crit' : 'expired'} size={34} /></td>
								<td><Stamp status={r.status} print /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<p class="specimen-note serial">SPESIMEN · DATA CONTOH, BUKAN KLIEN NYATA</p>
	</div>
</section>

<!-- How it works, as a register ledger -->
<section class="shell block">
	<h2 class="block-title">Dari tanggal jatuh tempo ke tagihan terkirim</h2>
	<ol class="ledger">
		{#each langkah as s}
			<li>
				<span class="ledger-no serial">{s.no}</span>
				<div>
					<h3 class="ledger-t">{s.t}</h3>
					<p class="ledger-d">{s.d}</p>
				</div>
			</li>
		{/each}
	</ol>

	<div class="closing">
		<p class="measure">
			Dibuat untuk <strong>freelancer web developer &amp; agensi</strong> yang memegang 5–50 situs
			klien dan gampang kelewatan perpanjangan. Boleh dipakai siapa saja — paling berguna kalau
			domain yang kamu urus banyak.
		</p>
		<a class="btn btn-ink" href="/tools">Buka register <Icon name="arrow-right" size={18} /></a>
	</div>
</section>

<style>
	.hero {
		position: relative;
		background: var(--ink);
		color: var(--on-ink);
		overflow: hidden;
		border-bottom: 2px solid var(--foil);
	}
	.hero-bg {
		position: absolute;
		top: 50%;
		right: -140px;
		transform: translateY(-50%);
		pointer-events: none;
		mix-blend-mode: screen;
	}
	.hero-inner {
		position: relative;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 32px;
		padding: clamp(48px, 8vw, 104px) 0 clamp(44px, 6vw, 72px);
	}
	.hero-copy h1 {
		color: var(--on-ink);
	}
	.u {
		color: var(--foil-hi);
		text-decoration: underline;
		text-decoration-color: var(--foil);
		text-decoration-thickness: 3px;
		text-underline-offset: 8px;
	}
	.lede {
		margin: 22px 0 28px;
		font-size: clamp(1.05rem, 1.6vw, 1.26rem);
		line-height: 1.5;
		color: var(--on-ink-2);
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}
	.btn-ghost.on-ink {
		color: var(--on-ink);
		border-color: var(--ink-line);
	}
	.btn-ghost.on-ink:hover {
		border-color: var(--foil);
		background: rgba(243, 234, 217, 0.06);
	}
	.hero-meta {
		margin-top: 26px;
		color: var(--on-ink-2);
		font-size: 0.68rem;
		letter-spacing: 0.18em;
	}
	.hero-seal {
		display: grid;
		place-items: center;
		color: var(--foil-hi);
		animation: seal-impress 0.9s var(--ease) both;
	}

	.block {
		padding: clamp(40px, 6vw, 72px) var(--_x, 0);
	}
	.no-pad {
		padding: 0;
	}
	.table-wrap {
		overflow-x: auto;
	}
	@media (max-width: 560px) {
		.register .sm-hide {
			display: none;
		}
	}
	.specimen-note {
		margin: 0;
		padding: 10px 18px 14px;
		color: var(--paper-ink-2);
		font-size: 0.64rem;
		letter-spacing: 0.2em;
		border-top: 1px solid var(--paper-line);
	}

	.block-title {
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		letter-spacing: -0.02em;
		margin-bottom: 26px;
		max-width: 20ch;
	}
	.ledger {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 2px solid var(--ink);
	}
	.ledger li {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 20px;
		padding: 22px 6px;
		border-bottom: 1px solid var(--paper-line);
		align-items: start;
	}
	.ledger-no {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--foil-deep);
		letter-spacing: 0.04em;
	}
	.ledger-t {
		font-size: 1.22rem;
		margin-bottom: 4px;
	}
	.ledger-d {
		margin: 0;
		color: var(--paper-ink-2);
		max-width: 60ch;
	}

	.closing {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		align-items: center;
		justify-content: space-between;
		margin-top: 40px;
		padding-top: 28px;
		border-top: 1px solid var(--paper-line);
	}

	@media (max-width: 860px) {
		.hero-inner {
			grid-template-columns: 1fr;
		}
		.hero-seal {
			display: none;
		}
	}
	@media (max-width: 560px) {
		.hero-copy h1 br {
			display: none;
		}
	}
</style>

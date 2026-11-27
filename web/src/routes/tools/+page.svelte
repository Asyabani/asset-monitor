<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import Guilloche from '$lib/components/Guilloche.svelte';

	let single = $state('');
	let bulk = $state('');
	let busy = $state(false);
	let err = $state<string | null>(null);

	const MAX = 50;

	function parseBulk(text: string): string[] {
		return text
			.split(/[\n,;]+/)
			.map((s) => s.trim())
			.filter(Boolean);
	}

	let bulkCount = $derived(parseBulk(bulk).length);

	async function submit(domains: string[]) {
		err = null;
		if (domains.length === 0) {
			err = 'Masukkan minimal satu domain.';
			return;
		}
		if (domains.length > MAX) {
			err = `Maksimum ${MAX} domain per cek.`;
			return;
		}
		busy = true;
		try {
			const res = await fetch('/api/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ domains })
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				err = body?.message ?? `Gagal (${res.status}).`;
				busy = false;
				return;
			}
			const { slug } = await res.json();
			await goto(`/r/${slug}`);
		} catch {
			err = 'Tidak bisa menghubungi server.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Daftarkan aset — web-asset-monitor</title></svelte:head>

<section class="shell page">
	<header class="page-head">
		<p class="eyebrow legend">Lembar pendaftaran · Lodgement</p>
		<h1 class="page-title">Daftarkan aset untuk diperiksa</h1>
		<p class="page-sub measure">
			Data domain &amp; SSL dibaca dari catatan publik (RDAP + sertifikat). Tidak perlu akses cPanel
			atau login — cukup kirim nama domainnya.
		</p>
	</header>

	{#if err}
		<p class="err form-err" role="alert">{err}</p>
	{/if}

	<div class="lodge">
		<div class="forms">
			<div class="doc">
				<div class="doc-head">
					<span class="doc-title">Pemeriksaan tunggal</span>
					<span class="legend">Form A</span>
				</div>
				<div class="microrule" aria-hidden="true">{'DOMAIN·SSL·RDAP·TLS·'.repeat(16)}</div>
				<div class="doc-body">
					<form
						onsubmit={(e) => {
							e.preventDefault();
							submit([single]);
						}}
					>
						<label class="field">
							<span class="field-label"><span class="no">01</span><span class="legend">Nama domain</span></span>
							<input type="text" placeholder="klien.co.id" bind:value={single} disabled={busy} />
						</label>
						<div class="actions">
							<button class="btn btn-foil" type="submit" disabled={busy || !single.trim()}>
								Periksa <Icon name="arrow-right" size={18} />
							</button>
						</div>
					</form>
				</div>
			</div>

			<div class="doc">
				<div class="doc-head">
					<span class="doc-title">Pemeriksaan borongan</span>
					<span class="legend">Form B</span>
				</div>
				<div class="microrule" aria-hidden="true">{'DOMAIN·SSL·RDAP·TLS·'.repeat(16)}</div>
				<div class="doc-body">
					<form
						onsubmit={(e) => {
							e.preventDefault();
							submit(parseBulk(bulk));
						}}
					>
						<label class="field">
							<span class="field-label">
								<span class="no">01</span>
								<span class="legend">Satu domain per baris — maks {MAX}</span>
							</span>
							<textarea
								placeholder={'klien-a.com\nwww.klien-b.co.id\nhttps://klien-c.id/kontak'}
								bind:value={bulk}
								disabled={busy}
							></textarea>
						</label>
						<div class="actions">
							<button class="btn btn-foil" type="submit" disabled={busy || bulkCount === 0}>
								{busy ? 'Memproses…' : 'Periksa register'}
								{#if !busy}<Icon name="arrow-right" size={18} />{/if}
							</button>
							<span class="meter serial" class:over={bulkCount > MAX}>{bulkCount} / {MAX}</span>
						</div>
					</form>
				</div>
			</div>

			<p class="foot-note muted">
				URL penuh &amp; subdomain otomatis dirapikan ke domain induknya, dan ditandai “dicek sebagai …”.
			</p>
		</div>

		<aside class="rail">
			<div class="rail-crest">
				<div class="rail-guilloche" aria-hidden="true">
					<Guilloche size={210} rings={8} petals={23} stroke={0.55} color="var(--foil)" opacity={0.42} />
				</div>
				<span class="crest-disc" aria-hidden="true">W</span>
			</div>
			<p class="rail-title">Register Masa Aktif</p>
			<p class="rail-ed serial">EDISI KERJA · {new Date().getFullYear()}</p>

			<hr class="rail-rule" />

			<ol class="rail-steps">
				<li>
					<span class="serial">I</span>
					<span><b>Daftar.</b> Tempel domain yang kamu urus — sampai {MAX} sekaligus.</span>
				</li>
				<li>
					<span class="serial">II</span>
					<span><b>Diperiksa.</b> RDAP + sertifikat TLS dibaca, lalu dicap masa berlakunya.</span>
				</li>
				<li>
					<span class="serial">III</span>
					<span><b>Ditagih.</b> Yang mendekati jatuh tempo jadi draf tagihan WhatsApp.</span>
				</li>
			</ol>

			<p class="rail-foot serial">GRATIS · TANPA LOGIN</p>
		</aside>
	</div>
</section>

<style>
	.page {
		padding: clamp(36px, 6vw, 64px) 0 clamp(48px, 7vw, 80px);
	}
	.eyebrow {
		color: var(--foil-deep);
		margin: 0 0 10px;
	}
	.page-title {
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		letter-spacing: -0.025em;
	}
	.page-sub {
		margin: 14px 0 26px;
		color: var(--paper-ink-2);
		font-size: 1.05rem;
	}
	.form-err {
		margin-bottom: 18px;
		padding: 10px 14px;
		border: 1px solid var(--st-crit);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--st-crit) 8%, transparent);
	}

	/* work (left) · ceremony (right) */
	.lodge {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 304px;
		gap: 32px;
		align-items: start;
	}
	.forms {
		display: flex;
		flex-direction: column;
		gap: 22px;
		min-width: 0;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 18px;
	}
	.meter {
		color: var(--paper-ink-2);
		font-size: 0.85rem;
		letter-spacing: 0.08em;
	}
	.meter.over {
		color: var(--st-crit);
	}
	.foot-note {
		margin-top: 4px;
		font-size: 0.86rem;
	}

	/* ceremonial rail — the "cover" of the register */
	.rail {
		position: sticky;
		top: 24px;
		background: linear-gradient(180deg, color-mix(in srgb, var(--ink) 5%, var(--paper)), var(--paper) 42%);
		border: 1px solid var(--paper-line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-doc);
		padding: 28px 24px 24px;
		text-align: center;
		overflow: hidden;
	}
	.rail::before {
		content: '';
		position: absolute;
		inset: 5px;
		border: 1px solid var(--paper-line);
		border-radius: 1px;
		opacity: 0.6;
		pointer-events: none;
	}
	.rail-crest {
		position: relative;
		display: grid;
		place-items: center;
		height: 150px;
		margin-bottom: 10px;
	}
	.rail-guilloche {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		mix-blend-mode: multiply;
	}
	.crest-disc {
		position: relative;
		display: grid;
		place-items: center;
		width: 62px;
		height: 62px;
		border-radius: 50%;
		font-family: var(--font-ui);
		font-weight: 900;
		font-size: 1.6rem;
		color: #3a2607;
		background: radial-gradient(circle at 38% 30%, var(--foil-hi), var(--foil) 58%, var(--foil-deep));
		border: 1px solid var(--foil-deep);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.55) inset,
			0 8px 18px -10px rgba(58, 38, 7, 0.85);
		animation: seal-impress 0.9s var(--ease) both;
	}
	.rail-title {
		margin: 0;
		font-weight: 800;
		font-size: 1.14rem;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.rail-ed {
		margin: 3px 0 0;
		color: var(--paper-ink-2);
		font-size: 0.66rem;
		letter-spacing: 0.16em;
	}
	.rail-rule {
		border: 0;
		border-top: 1px solid var(--paper-line);
		margin: 18px 0;
	}
	.rail-steps {
		list-style: none;
		margin: 0;
		padding: 0;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.rail-steps li {
		display: grid;
		grid-template-columns: 24px 1fr;
		gap: 11px;
		align-items: baseline;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--paper-ink-2);
	}
	.rail-steps .serial {
		color: var(--foil-deep);
		font-weight: 700;
		font-size: 1.02rem;
	}
	.rail-steps b {
		color: var(--ink-ink);
		font-weight: 700;
	}
	.rail-foot {
		margin: 20px 0 0;
		padding-top: 16px;
		border-top: 1px solid var(--paper-line);
		color: var(--foil-deep);
		font-size: 0.64rem;
		letter-spacing: 0.2em;
	}

	@media (max-width: 900px) {
		.lodge {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		.rail {
			position: static;
			max-width: 420px;
		}
		.rail-crest {
			height: 120px;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Seal from '$lib/components/Seal.svelte';
	import Stamp from '$lib/components/Stamp.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { toneOf } from '$lib/statusmap';

	let { data }: { data: PageData } = $props();

	type ResultView = {
		inputRaw: string;
		checkedAs: string | null;
		domainExpiry: string | null;
		domainDays: number | null;
		registrar: string | null;
		sslExpiry: string | null;
		sslDays: number | null;
		sslIssuer: string | null;
		status: string;
		note: string | null;
		pending: boolean;
	};
	type BatchView = {
		id: number;
		slug: string;
		mode: string;
		domainCount: number;
		done: number;
		finished: boolean;
		results: ResultView[];
	};

	let batch = $state<BatchView>(data.batch as BatchView);

	let email = $state('');
	let signedUp = $state(false);
	let signupErr = $state<string | null>(null);
	let copied = $state(false);

	function dayLabel(d: number | null): string {
		if (d === null) return '—';
		if (d < 0) return `${Math.abs(d)} hr lalu`;
		return `${d} hr`;
	}
	function serial(i: number): string {
		return String(i + 1).padStart(3, '0');
	}
	let pct = $derived(batch.domainCount ? Math.round((batch.done / batch.domainCount) * 100) : 0);

	async function poll() {
		try {
			const res = await fetch(`/api/batch/${batch.slug}`);
			if (res.ok) batch = (await res.json()) as BatchView;
		} catch {
			/* retry next tick */
		}
	}

	onMount(() => {
		if (batch.finished) return;
		const id = setInterval(async () => {
			await poll();
			if (batch.finished) clearInterval(id);
		}, 1500);
		return () => clearInterval(id);
	});

	async function share() {
		try {
			await navigator.clipboard.writeText($page.url.href);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			/* ignore */
		}
		fetch('/api/event', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: 'share_clicked', slug: batch.slug })
		}).catch(() => {});
	}

	async function signup(e: Event) {
		e.preventDefault();
		signupErr = null;
		const res = await fetch('/api/waitlist', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, slug: batch.slug })
		});
		if (res.ok) signedUp = true;
		else {
			const b = await res.json().catch(() => ({}));
			signupErr = b?.message ?? 'Gagal mendaftar.';
		}
	}
</script>

<svelte:head><title>Register pemeriksaan — web-asset-monitor</title></svelte:head>

<section class="shell page">
	<div class="head">
		<div>
			<h1 class="page-title">Register pemeriksaan</h1>
			<p class="meta serial">
				{#if batch.finished}
					{batch.domainCount} ASET DIPERIKSA
				{:else}
					MEMERIKSA · {batch.done}/{batch.domainCount}
				{/if}
			</p>
		</div>
		<button class="btn btn-ghost" onclick={share}>
			<Icon name={copied ? 'check' : 'share'} size={18} />
			{copied ? 'Tersalin' : 'Bagikan'}
		</button>
	</div>

	{#if !batch.finished}
		<div class="progress" aria-label="Kemajuan pemeriksaan">
			<div class="progress-bar" style="transform:scaleX({pct / 100})"></div>
		</div>
	{/if}

	<div class="doc register-doc">
		<div class="microrule" aria-hidden="true">
			{'MASABERLAKU·WEBASSETMONITOR·RDAP·TLS·'.repeat(14)}
		</div>

		<div class="register-grid" role="table" aria-label="Register masa aktif aset">
			<div class="rg-head" role="row">
				<span role="columnheader">No.</span>
				<span role="columnheader">Segel</span>
				<span role="columnheader">Aset</span>
				<span role="columnheader">Domain</span>
				<span role="columnheader">SSL</span>
				<span role="columnheader">Registrar</span>
				<span role="columnheader">Status</span>
			</div>

			{#each batch.results as r, i (r.inputRaw)}
				<div class="entry" role="row" class:is-pending={r.pending}>
					<span class="c-no serial" role="cell">{serial(i)}</span>
					<span class="c-seal" role="cell"><Seal status={toneOf(r.status)} size={38} /></span>
					<span class="c-domain" role="cell">
						<span class="dname">{r.inputRaw}</span>
						{#if r.note}<span class="as">{r.note}</span>{/if}
					</span>
					<span class="c-dom" role="cell" data-label="Domain">
						<span class="num">{r.domainExpiry ?? '—'}</span>
						<span class="days">{dayLabel(r.domainDays)}</span>
					</span>
					<span class="c-ssl" role="cell" data-label="SSL">
						<span class="num">{r.sslExpiry ?? '—'}</span>
						<span class="days">{dayLabel(r.sslDays)}</span>
					</span>
					<span class="c-reg" role="cell" data-label="Registrar">{r.registrar ?? '—'}</span>
					<span class="c-status" role="cell"><Stamp status={r.status} print /></span>
				</div>
			{/each}
		</div>

		<p class="legend-note">
			<strong>SEGERA</strong> ≤ 30 hari · <strong>KRITIS</strong> ≤ 7 hari · <strong>LEWAT</strong>
			sudah lewat · <strong>N/A</strong> tanggal tak tersedia. Status disegarkan dengan tanggal hari
			ini.
		</p>
	</div>

	<!-- Subscription seal: capture email → Tahap 2 -->
	<div class="doc subscribe">
		{#if signedUp}
			<div class="sub-done">
				<Seal status="valid" size={76} legend="TERDAFTAR" />
				<div>
					<h2 class="sub-title">Terdaftar</h2>
					<p class="muted measure">
						Email &amp; daftar domain ini kami simpan. Saat versi pantau-otomatis siap, kamu yang
						pertama tahu — lengkap dengan alert sebelum kedaluwarsa dan draf tagihan WhatsApp.
					</p>
				</div>
			</div>
		{:else}
			<div class="sub-head">
				<h2 class="sub-title">Terbitkan pengingat otomatis</h2>
				<p class="muted measure">
					Dapat alert H-30/14/7/3 sebelum tiap domain &amp; SSL kedaluwarsa — plus draf tagihan
					perpanjangan siap kirim ke klien. Tinggalkan email, kami kabari saat siap.
				</p>
			</div>
			{#if signupErr}<p class="err" role="alert">{signupErr}</p>{/if}
			<form class="sub-form" onsubmit={signup}>
				<input type="email" placeholder="kamu@agensi.com" bind:value={email} required />
				<button class="btn btn-foil" type="submit">
					Kabari saya <Icon name="mail" size={18} />
				</button>
			</form>
		{/if}
	</div>

	<p class="back"><a href="/tools">← Periksa aset lain</a></p>
</section>

<style>
	.page {
		padding: clamp(32px, 5vw, 56px) 0 clamp(48px, 7vw, 80px);
	}
	.head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 18px;
	}
	.page-title {
		font-size: clamp(1.7rem, 3.6vw, 2.4rem);
		letter-spacing: -0.025em;
	}
	.meta {
		margin: 8px 0 0;
		color: var(--paper-ink-2);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
	}

	.progress {
		height: 6px;
		background: var(--paper-3);
		border: 1px solid var(--paper-line);
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 16px;
	}
	.progress-bar {
		height: 100%;
		width: 100%;
		transform-origin: left;
		background: repeating-linear-gradient(
			-45deg,
			var(--ink),
			var(--ink) 7px,
			var(--ink-700) 7px,
			var(--ink-700) 14px
		);
		transition: transform 0.4s var(--ease);
	}

	.register-doc {
		overflow: hidden;
	}

	.register-grid {
		display: block;
	}
	.rg-head,
	.entry {
		display: grid;
		grid-template-columns: 44px 48px minmax(170px, 1.5fr) 1.05fr 1.05fr 1.2fr auto;
		align-items: center;
		gap: 14px;
		padding: 0 18px;
	}
	.rg-head {
		padding-top: 11px;
		padding-bottom: 11px;
		border-bottom: 2px solid var(--ink);
		color: var(--paper-ink-2);
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.entry {
		padding-top: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--paper-line);
	}
	.entry:nth-child(even) {
		background: rgba(185, 195, 183, 0.16);
	}
	.entry.is-pending {
		opacity: 0.72;
	}
	.c-no {
		color: var(--foil-deep);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.c-domain .dname {
		font-weight: 600;
		word-break: break-all;
	}
	.c-domain .as {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--paper-ink-2);
		margin-top: 2px;
	}
	.c-dom,
	.c-ssl {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
	.num {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: 0.88rem;
	}
	.days {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: 0.74rem;
		color: var(--paper-ink-2);
	}
	.c-reg {
		color: var(--paper-ink-2);
		font-size: 0.86rem;
		word-break: break-word;
	}

	.legend-note {
		margin: 0;
		padding: 12px 18px 15px;
		border-top: 1px solid var(--paper-line);
		color: var(--paper-ink-2);
		font-size: 0.8rem;
	}

	.subscribe {
		margin-top: 28px;
		padding: 24px;
	}
	.sub-title {
		font-size: 1.3rem;
		letter-spacing: -0.015em;
		margin-bottom: 6px;
	}
	.sub-form {
		display: flex;
		gap: 12px;
		max-width: 460px;
		margin-top: 16px;
	}
	.sub-form input {
		flex: 1;
	}
	.sub-done {
		display: flex;
		gap: 20px;
		align-items: center;
	}
	.sub-done .sub-title {
		color: var(--st-valid);
	}
	.back {
		margin-top: 26px;
	}

	/* Reflow to register slips on small screens */
	@media (max-width: 760px) {
		.rg-head {
			display: none;
		}
		.entry {
			grid-template-columns: 44px 1fr auto;
			grid-template-areas:
				'no domain status'
				'seal domain status'
				'dom dom dom'
				'ssl ssl ssl'
				'reg reg reg';
			gap: 6px 14px;
			padding: 14px 16px;
			row-gap: 4px;
		}
		.c-no {
			grid-area: no;
		}
		.c-seal {
			grid-area: seal;
			align-self: start;
		}
		.c-domain {
			grid-area: domain;
		}
		.c-status {
			grid-area: status;
			justify-self: end;
		}
		.c-dom {
			grid-area: dom;
		}
		.c-ssl {
			grid-area: ssl;
		}
		.c-reg {
			grid-area: reg;
		}
		.c-dom,
		.c-ssl,
		.c-reg {
			flex-direction: row;
			gap: 8px;
			align-items: baseline;
			padding-top: 6px;
			border-top: 1px dotted var(--paper-line);
		}
		.c-dom::before,
		.c-ssl::before,
		.c-reg::before {
			content: attr(data-label);
			font-family: var(--font-mono);
			font-size: 0.6rem;
			letter-spacing: 0.14em;
			text-transform: uppercase;
			color: var(--paper-ink-2);
			min-width: 68px;
		}
		.sub-form {
			flex-direction: column;
		}
		.sub-done {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>

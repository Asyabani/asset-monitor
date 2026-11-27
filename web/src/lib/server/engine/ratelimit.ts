/**
 * Gerbang global untuk panggilan ke registry (RDAP). Membatasi laju MULAI panggilan
 * agar total ke registry tetap ~2 permintaan/detik + jitter acak — lintas semua batch,
 * bukan per batch. Wajib sejak hari pertama: registry memblokir IP yang terlalu cepat
 * (lihat ../../../../docs/etika-legal.md).
 */

const MIN_INTERVAL_MS = 500; // ~2 req/detik
const MAX_JITTER_MS = 400;

let gateChain: Promise<void> = Promise.resolve();
let lastStart = 0;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Jalankan fn setelah mendapat slot dari gerbang laju. */
export function rdapGate<T>(fn: () => Promise<T>): Promise<T> {
	const slot = gateChain.then(async () => {
		const now = Date.now();
		const jitter = Math.floor(Math.random() * MAX_JITTER_MS);
		const wait = Math.max(0, lastStart + MIN_INTERVAL_MS - now) + jitter;
		if (wait > 0) await sleep(wait);
		lastStart = Date.now();
	});
	// Rantai hanya untuk akuisisi slot; kegagalan satu panggilan tak boleh memacetkan antrean.
	gateChain = slot.catch(() => {});
	return slot.then(() => fn());
}

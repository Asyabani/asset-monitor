import { checkOne, normalize, daysLeft, statusOf, type DomainCheck } from './engine';
import * as repo from './db/repo';

// Antrean in-process sederhana untuk satu proses Node (cukup untuk Rilis 1 di satu VPS).
// Pindah ke antrean eksternal (mis. BullMQ/Redis) hanya bila volume menuntut — bukan sekarang.
const pending: number[] = [];
let running = false;

export function enqueueBatch(batchId: number): void {
	pending.push(batchId);
	if (!running) void drain();
}

async function drain(): Promise<void> {
	running = true;
	try {
		while (pending.length) {
			const id = pending.shift() as number;
			try {
				await processBatch(id);
			} catch (e) {
				console.error('[queue] batch gagal', id, e);
			}
		}
	} finally {
		running = false;
	}
}

async function processBatch(batchId: number): Promise<void> {
	const rows = repo.getPendingResults(batchId);
	for (const row of rows) {
		const result = await resolveOne(row.input_raw);
		repo.updateResult(row.id, result);
	}
	repo.setBatchDone(batchId);
	repo.logEvent('batch_completed', batchId, { count: rows.length });
}

/** Pakai cache 24 jam per registrable domain; kalau miss baru tembak jaringan lewat engine. */
async function resolveOne(raw: string): Promise<DomainCheck> {
	const reg = normalize(raw).checkedAs;
	if (reg) {
		const cached = repo.getCache(reg);
		if (cached) return fromCache(raw, reg, cached);
	}
	const checked = await checkOne(raw);
	repo.setCache(checked);
	return checked;
}

function fromCache(
	raw: string,
	reg: string,
	cached: { domain_expiry: string | null; registrar: string | null; ssl_expiry: string | null; ssl_issuer: string | null }
): DomainCheck {
	const now = new Date();
	const cand = [daysLeft(cached.domain_expiry, now), daysLeft(cached.ssl_expiry, now)].filter(
		(x): x is number => x !== null
	);
	const status = statusOf(cand.length ? Math.min(...cand) : null);
	const changed = reg !== normalize(raw).host;
	return {
		inputRaw: raw,
		checkedAs: reg,
		domainExpiry: cached.domain_expiry,
		registrar: cached.registrar,
		sslExpiry: cached.ssl_expiry,
		sslIssuer: cached.ssl_issuer,
		status,
		note: changed ? `dicek sebagai ${reg} (dari cache)` : 'dari cache'
	};
}

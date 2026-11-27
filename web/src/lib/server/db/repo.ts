import { randomBytes } from 'node:crypto';
import { db } from './index';
import { daysLeft, statusOf, type DomainCheck } from '../engine';

const CACHE_TTL_HOURS = 24;

export interface ResultRow {
	id: number;
	input_raw: string;
	checked_as: string | null;
	domain_expiry: string | null;
	registrar: string | null;
	ssl_expiry: string | null;
	ssl_issuer: string | null;
	status: string;
	note: string | null;
}

export interface BatchRow {
	id: number;
	slug: string;
	mode: string;
	domain_count: number;
	status: string;
}

/** Hasil untuk UI — sisa hari & status dihitung ulang dengan tanggal saat ini (bukan saat dicek). */
export interface ResultView {
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
}

export interface BatchView {
	id: number;
	slug: string;
	mode: string;
	domainCount: number;
	done: number;
	finished: boolean;
	results: ResultView[];
}

function genSlug(): string {
	return randomBytes(7).toString('hex'); // 14 karakter hex
}

/** Buat batch + baris hasil 'pending' per domain. Mengembalikan id & slug. */
export function createBatch(opts: {
	mode: string;
	domains: string[];
	ipHash: string | null;
}): { id: number; slug: string } {
	const d = db();
	const slug = genSlug();
	const info = d
		.prepare(`INSERT INTO check_batch (slug, mode, domain_count, ip_hash) VALUES (?, ?, ?, ?)`)
		.run(slug, opts.mode, opts.domains.length, opts.ipHash);
	const batchId = Number(info.lastInsertRowid);
	const insResult = d.prepare(`INSERT INTO check_result (batch_id, input_raw) VALUES (?, ?)`);
	const tx = d.transaction((arr: string[]) => {
		for (const raw of arr) insResult.run(batchId, raw);
	});
	tx(opts.domains);
	return { id: batchId, slug };
}

export function getBatchById(id: number): BatchRow | undefined {
	return db().prepare(`SELECT id, slug, mode, domain_count, status FROM check_batch WHERE id = ?`).get(id) as
		| BatchRow
		| undefined;
}

export function getPendingResults(batchId: number): ResultRow[] {
	return db()
		.prepare(`SELECT * FROM check_result WHERE batch_id = ? AND status = 'pending' ORDER BY id`)
		.all(batchId) as ResultRow[];
}

export function updateResult(id: number, c: DomainCheck): void {
	db()
		.prepare(
			`UPDATE check_result
			 SET checked_as = ?, domain_expiry = ?, registrar = ?, ssl_expiry = ?, ssl_issuer = ?, status = ?, note = ?
			 WHERE id = ?`
		)
		.run(c.checkedAs, c.domainExpiry, c.registrar, c.sslExpiry, c.sslIssuer, c.status, c.note, id);
}

export function setBatchDone(id: number): void {
	db().prepare(`UPDATE check_batch SET status = 'done' WHERE id = ?`).run(id);
}

/** Ambil cache yang masih segar (< 24 jam). Null kalau tak ada / basi. */
export function getCache(domain: string): {
	domain_expiry: string | null;
	registrar: string | null;
	ssl_expiry: string | null;
	ssl_issuer: string | null;
} | null {
	const row = db()
		.prepare(
			`SELECT domain_expiry, registrar, ssl_expiry, ssl_issuer
			 FROM domain_cache
			 WHERE domain = ? AND fetched_at > datetime('now', ?)`
		)
		.get(domain, `-${CACHE_TTL_HOURS} hours`) as
		| { domain_expiry: string | null; registrar: string | null; ssl_expiry: string | null; ssl_issuer: string | null }
		| undefined;
	return row ?? null;
}

export function setCache(c: DomainCheck): void {
	if (!c.checkedAs) return;
	db()
		.prepare(
			`INSERT INTO domain_cache (domain, domain_expiry, registrar, ssl_expiry, ssl_issuer, fetched_at)
			 VALUES (?, ?, ?, ?, ?, datetime('now'))
			 ON CONFLICT(domain) DO UPDATE SET
			   domain_expiry = excluded.domain_expiry,
			   registrar = excluded.registrar,
			   ssl_expiry = excluded.ssl_expiry,
			   ssl_issuer = excluded.ssl_issuer,
			   fetched_at = excluded.fetched_at`
		)
		.run(c.checkedAs, c.domainExpiry, c.registrar, c.sslExpiry, c.sslIssuer);
}

export function getBatchBySlug(slug: string): BatchView | null {
	const d = db();
	const batch = d
		.prepare(`SELECT id, slug, mode, domain_count, status FROM check_batch WHERE slug = ?`)
		.get(slug) as BatchRow | undefined;
	if (!batch) return null;

	const rows = d
		.prepare(
			`SELECT * FROM check_result WHERE batch_id = ?
			 ORDER BY (domain_expiry IS NULL), domain_expiry, id`
		)
		.all(batch.id) as ResultRow[];

	const now = new Date();
	const results: ResultView[] = rows.map((r) => ({
		inputRaw: r.input_raw,
		checkedAs: r.checked_as,
		domainExpiry: r.domain_expiry,
		domainDays: daysLeft(r.domain_expiry, now),
		registrar: r.registrar,
		sslExpiry: r.ssl_expiry,
		sslDays: daysLeft(r.ssl_expiry, now),
		sslIssuer: r.ssl_issuer,
		// Status disegarkan dengan tanggal sekarang; '?' kalau belum ada tanggal sama sekali.
		status: r.status === 'pending' ? 'pending' : freshStatus(r, now),
		note: r.note,
		pending: r.status === 'pending'
	}));

	const done = rows.filter((r) => r.status !== 'pending').length;
	return {
		id: batch.id,
		slug: batch.slug,
		mode: batch.mode,
		domainCount: batch.domain_count,
		done,
		finished: batch.status === 'done',
		results
	};
}

function freshStatus(r: ResultRow, now: Date): string {
	const cand = [daysLeft(r.domain_expiry, now), daysLeft(r.ssl_expiry, now)].filter(
		(x): x is number => x !== null
	);
	return statusOf(cand.length ? Math.min(...cand) : null);
}

export function addWaitlist(email: string, slug: string | null, source: string | null): void {
	const d = db();
	let batchId: number | null = null;
	if (slug) {
		const b = d.prepare(`SELECT id FROM check_batch WHERE slug = ?`).get(slug) as { id: number } | undefined;
		batchId = b?.id ?? null;
	}
	d.prepare(`INSERT INTO waitlist (email, batch_id, source) VALUES (?, ?, ?)`).run(email, batchId, source);
}

export function logEvent(name: string, batchId: number | null, props: Record<string, unknown> | null): void {
	db()
		.prepare(`INSERT INTO event (name, batch_id, props) VALUES (?, ?, ?)`)
		.run(name, batchId, props ? JSON.stringify(props) : null);
}

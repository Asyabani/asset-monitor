import { createHash } from 'node:crypto';

// Kita simpan HASH IP, bukan IP mentah (higiene PDP — legal-liability.md).
const SALT = process.env.IP_SALT ?? 'dev-salt-ganti-di-produksi';

export function ipHash(ip: string): string {
	return createHash('sha256').update(`${SALT}|${ip}`).digest('hex').slice(0, 32);
}

// Batas per IP: anti-scraping registry lewat tool massal gratis (etika-legal.md).
// In-memory per proses — cukup untuk satu VPS Rilis 1.
const WINDOW_MS = 60 * 60 * 1000; // 1 jam
const MAX_BATCHES_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

/** True kalau masih di bawah batas (dan mencatat hit). False kalau harus ditolak (429). */
export function checkIpLimit(hash: string): boolean {
	const now = Date.now();
	const recent = (hits.get(hash) ?? []).filter((t) => now - t < WINDOW_MS);
	if (recent.length >= MAX_BATCHES_PER_WINDOW) {
		hits.set(hash, recent);
		return false;
	}
	recent.push(now);
	hits.set(hash, recent);
	return true;
}

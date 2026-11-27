export type Status = 'LEWAT' | 'KRITIS' | 'SEGERA' | 'aman' | '?';

/** Sisa hari sampai tanggal (ISO 'YYYY-MM-DD'). Null kalau tanggal tidak ada / tak valid. */
export function daysLeft(dateISO: string | null, now: Date = new Date()): number | null {
	if (!dateISO) return null;
	const d = new Date(dateISO + 'T00:00:00Z');
	if (Number.isNaN(d.getTime())) return null;
	return Math.floor((d.getTime() - now.getTime()) / 86_400_000);
}

/** Ambang sama persis dengan scripts/cek-domain.py supaya hasil konsisten. */
export function statusOf(days: number | null): Status {
	if (days === null) return '?';
	if (days < 0) return 'LEWAT';
	if (days <= 7) return 'KRITIS';
	if (days <= 30) return 'SEGERA';
	return 'aman';
}

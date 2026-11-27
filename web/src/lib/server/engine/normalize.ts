import { parse } from 'tldts';

export interface Normalized {
	inputRaw: string;
	/** Registrable domain (lewat Public Suffix List). Null kalau bukan domain valid. */
	checkedAs: string | null;
	/** Host penuh setelah dibersihkan (dipakai untuk SNI TLS). */
	host: string;
	/** True kalau registrable berbeda dari host yang ditempel (subdomain/URL penuh). */
	changed: boolean;
	error?: string;
}

/** Buang skema, path, query, fragment, dan port. "https://www.klien.id/kontak" -> "www.klien.id" */
export function cleanInput(raw: string): string {
	let d = String(raw ?? '')
		.trim()
		.toLowerCase();
	if (!d) return '';
	d = d.replace(/^[a-z][a-z0-9+.-]*:\/\//, ''); // skema://
	d = d.split('/')[0].split('?')[0].split('#')[0]; // path/query/fragment
	d = d.split(':')[0]; // port
	return d.trim();
}

/**
 * Normalisasi satu masukan jadi registrable domain lewat PSL (tldts).
 * Mengganti daftar sufiks pendek di skrip manual — PSL menangani co.id, go.id, co.uk, dll secara benar.
 */
export function normalize(raw: string): Normalized {
	const host = cleanInput(raw);
	if (!host) {
		return { inputRaw: raw, checkedAs: null, host: '', changed: false, error: 'kosong' };
	}
	const parsed = parse(host);
	const registrable = parsed.domain; // null untuk IP, sufiks-publik-saja, atau input tak valid
	if (!registrable) {
		return { inputRaw: raw, checkedAs: null, host, changed: false, error: 'bukan domain valid' };
	}
	return {
		inputRaw: raw,
		checkedAs: registrable,
		host,
		changed: registrable !== host
	};
}

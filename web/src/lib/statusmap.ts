export type Tone = 'valid' | 'soon' | 'crit' | 'expired' | 'unknown' | 'pending';

/** Peta status engine (aman/SEGERA/KRITIS/LEWAT/?/pending) → nada seal & stempel. */
export function toneOf(status: string): Tone {
	switch (status) {
		case 'aman':
			return 'valid';
		case 'SEGERA':
			return 'soon';
		case 'KRITIS':
			return 'crit';
		case 'LEWAT':
			return 'expired';
		case 'pending':
			return 'pending';
		default:
			return 'unknown';
	}
}

export function labelOf(status: string): string {
	switch (status) {
		case 'aman':
			return 'VALID';
		case 'SEGERA':
			return 'SEGERA';
		case 'KRITIS':
			return 'KRITIS';
		case 'LEWAT':
			return 'LEWAT';
		case 'pending':
			return 'DIPERIKSA';
		default:
			return 'N/A';
	}
}

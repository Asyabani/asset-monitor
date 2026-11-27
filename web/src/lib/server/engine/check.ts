import { normalize } from './normalize';
import { rdapLookup } from './rdap';
import { tlsCheckWithFallback } from './tls';
import { daysLeft, statusOf } from './status';
import { rdapGate } from './ratelimit';

export interface DomainCheck {
	inputRaw: string;
	checkedAs: string | null;
	domainExpiry: string | null;
	registrar: string | null;
	sslExpiry: string | null;
	sslIssuer: string | null;
	status: string;
	note: string | null;
}

/**
 * Orkestrasi satu domain: normalisasi → (RDAP ter-gerbang ‖ TLS) → status.
 * Murni jaringan, tanpa cache/DB (itu urusan lapisan app). Tidak pernah melempar —
 * satu domain gagal tak boleh merusak seluruh batch (rilis-1.md §4).
 */
export async function checkOne(raw: string, now: Date = new Date()): Promise<DomainCheck> {
	const n = normalize(raw);
	const notes: string[] = [];
	if (n.changed && n.checkedAs) notes.push(`dicek sebagai ${n.checkedAs}`);

	if (!n.checkedAs) {
		return empty(raw, n.error ?? 'bukan domain valid');
	}

	const [rdap, tlsRes] = await Promise.all([
		rdapGate(() => rdapLookup(n.checkedAs as string)),
		tlsCheckWithFallback(n.host || (n.checkedAs as string))
	]);

	if (rdap.error) notes.push(rdap.error);
	if (rdap.note) notes.push(rdap.note);
	if (tlsRes.error) notes.push(`SSL: ${tlsRes.error}`);
	if (tlsRes.note) notes.push(`SSL: ${tlsRes.note}`);

	const candidates = [daysLeft(rdap.domainExpiry, now), daysLeft(tlsRes.sslExpiry, now)].filter(
		(x): x is number => x !== null
	);
	const status = statusOf(candidates.length ? Math.min(...candidates) : null);

	return {
		inputRaw: raw,
		checkedAs: n.checkedAs,
		domainExpiry: rdap.domainExpiry,
		registrar: rdap.registrar,
		sslExpiry: tlsRes.sslExpiry,
		sslIssuer: tlsRes.sslIssuer,
		status,
		note: notes.length ? notes.join('; ') : null
	};
}

function empty(raw: string, note: string): DomainCheck {
	return {
		inputRaw: raw,
		checkedAs: null,
		domainExpiry: null,
		registrar: null,
		sslExpiry: null,
		sslIssuer: null,
		status: '?',
		note
	};
}

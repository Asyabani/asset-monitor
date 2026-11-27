export interface RdapResult {
	/** ISO 'YYYY-MM-DD' atau null. */
	domainExpiry: string | null;
	registrar: string | null;
	error?: string;
	note?: string;
}

const RDAP_URL = (d: string) => `https://rdap.org/domain/${encodeURIComponent(d)}`;

// User-Agent jujur & bisa dihubungi (etika-legal.md). Ganti kontak saat domain merek final dibeli.
const UA = 'web-asset-monitor/0.1 (+alat cek masa aktif domain; kontak: lihat situs)';

function toISODate(s: string | undefined | null): string | null {
	if (!s) return null;
	const d = new Date(s);
	if (Number.isNaN(d.getTime())) return null;
	return d.toISOString().slice(0, 10);
}

/**
 * Query RDAP lewat rdap.org untuk tanggal kedaluwarsa + registrar.
 * RDAP hanya melayani domain terdaftar (registrable), bukan subdomain — pastikan `domain`
 * sudah dinormalisasi lebih dulu (lihat normalize.ts). Tidak pernah melempar: selalu
 * mengembalikan hasil atau galat bertanda.
 */
export async function rdapLookup(domain: string, timeoutMs = 12_000): Promise<RdapResult> {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), timeoutMs);
	try {
		const res = await fetch(RDAP_URL(domain), {
			headers: { 'User-Agent': UA, Accept: 'application/rdap+json, application/json' },
			signal: ctrl.signal,
			redirect: 'follow'
		});
		if (!res.ok) {
			return { domainExpiry: null, registrar: null, error: `RDAP ${res.status}` };
		}
		const data = (await res.json()) as RdapJson;

		let domainExpiry: string | null = null;
		for (const ev of data.events ?? []) {
			if (ev.eventAction === 'expiration') {
				domainExpiry = toISODate(ev.eventDate);
				break;
			}
		}

		let registrar: string | null = null;
		for (const ent of data.entities ?? []) {
			if ((ent.roles ?? []).includes('registrar')) {
				const vcard = ent.vcardArray?.[1] ?? [];
				for (const item of vcard) {
					if (item[0] === 'fn') {
						registrar = typeof item[3] === 'string' ? item[3] : null;
						break;
					}
				}
				if (registrar) break;
			}
		}

		const note = domainExpiry ? undefined : 'tanggal domain tidak tersedia (diredaksi?)';
		return { domainExpiry, registrar, note };
	} catch (e) {
		const name = (e as Error)?.name === 'AbortError' ? 'timeout' : ((e as Error)?.name ?? 'error');
		return { domainExpiry: null, registrar: null, error: `RDAP gagal: ${name}` };
	} finally {
		clearTimeout(timer);
	}
}

interface RdapJson {
	events?: Array<{ eventAction?: string; eventDate?: string }>;
	entities?: Array<{ roles?: string[]; vcardArray?: [string, Array<[string, unknown, string, unknown]>] }>;
}

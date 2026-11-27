import tls from 'node:tls';

export interface TlsResult {
	/** ISO 'YYYY-MM-DD' atau null. */
	sslExpiry: string | null;
	sslIssuer: string | null;
	error?: string;
	note?: string;
}

/**
 * Ambil tanggal kedaluwarsa & penerbit sertifikat lewat handshake TLS socket (bukan HTTP).
 * rejectUnauthorized:false supaya sertifikat kedaluwarsa / self-signed tetap terbaca dan
 * alasannya dicatat, bukan sekadar gagal. Tidak pernah melempar.
 */
export function tlsCheck(host: string, timeoutMs = 12_000): Promise<TlsResult> {
	return new Promise((resolve) => {
		let settled = false;
		const finish = (r: TlsResult) => {
			if (settled) return;
			settled = true;
			try {
				socket.destroy();
			} catch {
				/* abaikan */
			}
			resolve(r);
		};

		const socket = tls.connect(
			{ host, port: 443, servername: host, rejectUnauthorized: false, timeout: timeoutMs },
			() => {
				const cert = socket.getPeerCertificate();
				if (!cert || !cert.valid_to) {
					finish({ sslExpiry: null, sslIssuer: null, error: 'tidak ada sertifikat' });
					return;
				}
				const exp = new Date(cert.valid_to);
				const sslExpiry = Number.isNaN(exp.getTime()) ? null : exp.toISOString().slice(0, 10);
				const issuerO = cert.issuer?.O;
				const issuer = Array.isArray(issuerO) ? (issuerO[0] ?? null) : (issuerO ?? null);
				const authErr = (socket as unknown as { authorizationError?: Error | string }).authorizationError;
				const note = authErr ? `sertifikat tidak tepercaya (${String(authErr)})` : undefined;
				finish({ sslExpiry, sslIssuer: issuer, note });
			}
		);

		socket.on('timeout', () => finish({ sslExpiry: null, sslIssuer: null, error: 'timeout' }));
		socket.on('error', (e: NodeJS.ErrnoException) =>
			finish({ sslExpiry: null, sslIssuer: null, error: `gagal: ${e?.code ?? e?.name ?? 'error'}` })
		);
	});
}

/**
 * Coba host apa adanya; kalau apex tidak melayani :443, coba `www.` sebagai fallback —
 * celah yang ada di skrip manual (rilis-1-teknis.md §2).
 */
export async function tlsCheckWithFallback(host: string): Promise<TlsResult> {
	const first = await tlsCheck(host);
	if (first.sslExpiry || host.startsWith('www.')) return first;
	const second = await tlsCheck('www.' + host);
	return second.sslExpiry ? second : first;
}

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cleanInput } from '$lib/server/engine';
import { createBatch, logEvent } from '$lib/server/db/repo';
import { enqueueBatch } from '$lib/server/queue';
import { ipHash, checkIpLimit } from '$lib/server/ratelimit-ip';

const MAX_DOMAINS = 50;

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const body = (await request.json().catch(() => null)) as { domains?: unknown } | null;
	if (!body || !Array.isArray(body.domains)) {
		throw error(400, '`domains` harus berupa array.');
	}

	const domains = [
		...new Set(
			body.domains
				.map((d) => cleanInput(String(d)))
				.filter((d): d is string => d.length > 0)
		)
	];

	if (domains.length === 0) throw error(400, 'Tidak ada domain yang valid.');
	if (domains.length > MAX_DOMAINS) throw error(400, `Maksimum ${MAX_DOMAINS} domain per cek.`);

	const hash = ipHash(getClientAddress());
	if (!checkIpLimit(hash)) {
		throw error(429, 'Terlalu banyak permintaan dari jaringanmu. Coba lagi nanti.');
	}

	const mode = domains.length === 1 ? 'single' : 'bulk';
	const { id, slug } = createBatch({ mode, domains, ipHash: hash });
	logEvent('batch_created', id, { domain_count: domains.length, mode });
	enqueueBatch(id);

	return json({ slug });
};

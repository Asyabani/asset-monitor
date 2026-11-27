import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBatchBySlug, logEvent } from '$lib/server/db/repo';

// Event sisi-klien yang diizinkan (instrumen validasi). Daftar putih supaya endpoint
// tidak bisa dipakai menulis nama event sembarangan.
const ALLOWED = new Set(['share_clicked']);

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as { name?: unknown; slug?: unknown } | null;
	const name = String(body?.name ?? '');
	if (!ALLOWED.has(name)) throw error(400, 'Event tidak dikenal.');

	const slug = body?.slug ? String(body.slug) : null;
	const batch = slug ? getBatchBySlug(slug) : null;
	logEvent(name, batch?.id ?? null, null);

	return json({ ok: true });
};

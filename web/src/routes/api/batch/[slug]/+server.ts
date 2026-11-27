import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBatchBySlug } from '$lib/server/db/repo';

/** Dipakai halaman hasil untuk polling sampai status selesai. */
export const GET: RequestHandler = ({ params }) => {
	const batch = getBatchBySlug(params.slug);
	if (!batch) throw error(404, 'Hasil tidak ditemukan.');
	return json(batch);
};

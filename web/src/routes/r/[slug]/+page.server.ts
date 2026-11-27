import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBatchBySlug, logEvent } from '$lib/server/db/repo';

export const load: PageServerLoad = ({ params }) => {
	const batch = getBatchBySlug(params.slug);
	if (!batch) throw error(404, 'Hasil tidak ditemukan.');
	logEvent('result_viewed', batch.id, null);
	return { batch };
};

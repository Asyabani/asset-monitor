import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addWaitlist, getBatchBySlug, logEvent } from '$lib/server/db/repo';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as
		| { email?: unknown; slug?: unknown; source?: unknown }
		| null;

	const email = String(body?.email ?? '').trim();
	if (!EMAIL_RE.test(email)) throw error(400, 'Email tidak valid.');

	const slug = body?.slug ? String(body.slug) : null;
	const source = body?.source ? String(body.source).slice(0, 120) : null;

	addWaitlist(email, slug, source);

	const batch = slug ? getBatchBySlug(slug) : null;
	logEvent('waitlist_signup', batch?.id ?? null, {
		domain_count: batch?.domainCount ?? null
	});

	return json({ ok: true });
};

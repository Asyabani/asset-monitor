import test from 'node:test';
import assert from 'node:assert/strict';
import { statusOf, daysLeft } from '../src/lib/server/engine/status.ts';
import { normalize, cleanInput } from '../src/lib/server/engine/normalize.ts';

// Ambang harus sama persis dengan scripts/cek-domain.py agar hasil konsisten.
test('statusOf — ambang sama dengan skrip Python', () => {
	assert.equal(statusOf(null), '?');
	assert.equal(statusOf(-1), 'LEWAT');
	assert.equal(statusOf(0), 'KRITIS');
	assert.equal(statusOf(7), 'KRITIS');
	assert.equal(statusOf(8), 'SEGERA');
	assert.equal(statusOf(30), 'SEGERA');
	assert.equal(statusOf(31), 'aman');
});

test('cleanInput — buang skema, path, query, port', () => {
	assert.equal(cleanInput('https://www.Klien.id/kontak?x=1'), 'www.klien.id');
	assert.equal(cleanInput('klien.co.id:443'), 'klien.co.id');
	assert.equal(cleanInput('  TOKO.COM  '), 'toko.com');
});

test('normalize — registrable domain lewat PSL (bukan daftar sufiks pendek)', () => {
	assert.equal(normalize('www.klien.co.id').checkedAs, 'klien.co.id');
	assert.equal(normalize('blog.toko.com').checkedAs, 'toko.com');
	assert.equal(normalize('klien.co.id').changed, false);
	assert.equal(normalize('www.klien.co.id').changed, true);
	assert.equal(normalize('https://www.tokopedia.com/x').checkedAs, 'tokopedia.com');
	assert.equal(normalize('bukan domain').checkedAs, null);
});

test('daysLeft — selisih hari dari tanggal ISO', () => {
	const now = new Date('2026-01-01T00:00:00Z');
	assert.equal(daysLeft('2026-01-11', now), 10);
	assert.equal(daysLeft('2025-12-22', now), -10);
	assert.equal(daysLeft(null, now), null);
});

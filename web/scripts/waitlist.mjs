#!/usr/bin/env node
// Lihat siapa saja yang daftar waitlist (tanpa buka database manual).
// Jalankan:  npm run waitlist
// Opsi:      npm run waitlist -- --csv   (cetak CSV untuk ditempel ke spreadsheet)

import Database from 'better-sqlite3';
import { existsSync } from 'node:fs';

const path = process.env.DATABASE_PATH || 'data/app.db';
if (!existsSync(path)) {
	console.error(`Database belum ada di "${path}". Jalankan appnya dulu (npm run build && npm start).`);
	process.exit(1);
}

const db = new Database(path, { readonly: true });
const csv = process.argv.includes('--csv');

const rows = db
	.prepare(
		`SELECT w.id, w.email, COALESCE(w.source,'-') AS source, w.created_at,
		        (SELECT COUNT(*) FROM check_result r WHERE r.batch_id = w.batch_id) AS domain_dicek
		 FROM waitlist w
		 ORDER BY w.id DESC`
	)
	.all();

if (rows.length === 0) {
	console.log('Belum ada yang daftar waitlist.');
	process.exit(0);
}

if (csv) {
	console.log('id,email,source,created_at,domain_dicek');
	for (const r of rows) {
		const email = `"${String(r.email).replace(/"/g, '""')}"`;
		console.log([r.id, email, r.source, r.created_at, r.domain_dicek].join(','));
	}
} else {
	console.log(`\n${rows.length} pendaftar waitlist (terbaru di atas):\n`);
	console.table(
		rows.map((r) => ({
			'#': r.id,
			Email: r.email,
			Sumber: r.source,
			Daftar: r.created_at,
			'Domain dicek': r.domain_dicek
		}))
	);
	console.log('\nTip: `npm run waitlist -- --csv` untuk salin ke spreadsheet.\n');
}

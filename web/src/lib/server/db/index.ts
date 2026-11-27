import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { SCHEMA } from './schema';

const DB_PATH = process.env.DATABASE_PATH ?? 'data/app.db';

let instance: Database.Database | null = null;

/** Koneksi tunggal (lazy). Membuat folder & skema bila belum ada. */
export function db(): Database.Database {
	if (instance) return instance;
	mkdirSync(dirname(DB_PATH), { recursive: true });
	const d = new Database(DB_PATH);
	d.pragma('journal_mode = WAL');
	d.pragma('foreign_keys = ON');
	d.exec(SCHEMA);
	instance = d;
	return d;
}

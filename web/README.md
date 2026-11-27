# web (Rilis 1)

Aplikasi SvelteKit untuk **Rilis 1** — tool cek masa aktif domain & SSL (gratis, tanpa login).
Spesifikasi lengkap: [`../docs/rilis-1-teknis.md`](../docs/rilis-1-teknis.md). Cakupan & alasan:
[`../docs/rilis-1.md`](../docs/rilis-1.md).

> ⚠️ Jangan menambah fitur di luar `rilis-1.md` (login, billing, cron, cek hosting, keamanan).
> Scope explosion adalah risiko kematian nomor satu (`../HANDOFF.md`).

## Stack

SvelteKit full-stack + TypeScript + SQLite (`better-sqlite3`). Satu codebase melayani UI (`/tools`)
sekaligus API (`/api/*`, `/r/[slug]`). Engine cek ada di `src/lib/server/engine/` — paket TS
server-only yang sengaja diisolasi agar bisa diekstrak nanti bila `security-test` juga TS.

## Jalankan

```bash
cp .env.example .env      # lalu ganti IP_SALT
npm install
npm run dev               # http://localhost:5173
```

Perintah lain:

```bash
npm run check             # type-check (svelte-check)
npm test                  # unit test engine (butuh Node 22.6+)
npm run build && npm start  # build produksi (adapter-node) lalu jalankan
```

> `npm test` memakai `node --experimental-strip-types`. Butuh Node ≥ 22.6.

## Struktur

```
src/
  lib/server/
    engine/            paket cek (murni, server-only) — normalize(PSL) · rdap · tls · status · ratelimit · check
    db/                SQLite: schema · koneksi · repo (query)
    queue.ts           worker batch in-process + cache 24 jam
    ratelimit-ip.ts    batas per IP (hash, bukan IP mentah)
  routes/
    +page.svelte       landing (copy untuk developer/agensi)
    tools/             Form A (satu) + Form B (massal)
    r/[slug]/          halaman hasil permanen + polling + CTA email + bagikan
    api/check          POST → buat batch, enqueue, balas slug
    api/batch/[slug]   GET  → status + hasil (untuk polling)
    api/waitlist       POST → tangkap email
    api/event          POST → event sisi-klien (share_clicked)
```

## Guardrail yang sudah terpasang (jangan dilepas)

- Rate limiter global RDAP ~2 req/detik + jitter (`engine/ratelimit.ts`).
- Cache hasil per registrable domain 24 jam (`db/repo.ts` + `queue.ts`).
- Batas 50 domain/cek & 20 cek/jam per IP (`ratelimit-ip.ts`).
- Simpan **hash** IP, bukan IP mentah (higiene PDP).
- User-Agent jujur di RDAP (`engine/rdap.ts`) — ganti kontak saat merek final dibeli.

Lihat `../docs/etika-legal.md` & `../docs/legal-liability.md`.

## Instrumen validasi

Tabel `event` mencatat `batch_created`, `batch_completed`, `result_viewed`, `share_clicked`,
`waitlist_signup` — internal, tanpa pihak ketiga. Sinyal terpenting: **rata-rata `domain_count`
pada `batch_created` mode `bulk`** (lihat `../docs/rilis-1-teknis.md` §6 & `../docs/validasi.md`).

# Rilis 1 — Spesifikasi Teknis

> Dokumen ini adalah **"bagaimana"**-nya; `rilis-1.md` adalah **"apa & kenapa"**-nya (cakupan).
> Kalau ada yang bertentangan dengan `peta-produk.md`, peta produk menang. Jangan membangun apa pun
> yang tidak ada di `rilis-1.md` — dokumen ini hanya merinci cara membangun cakupan yang sudah dikunci.

## ✅ Keputusan yang sudah dikunci (24 Nov 2026)

| # | Keputusan | Dasar |
|---|-----------|-------|
| 1 | **Engineering solo** (pemasaran = orang kedua, bergabung belakangan) | Dikonfirmasi founder (`HANDOFF.md`) — §9 memakai estimasi solo |
| 2 | **Stack: SvelteKit full-stack + TypeScript + SQLite** (satu app: halaman `/tools` + API routes server + `better-sqlite3`). Engine = paket TypeScript server-only yang bisa diekstrak nanti | Go belum terpasang di mesin dev; Node 22 + npm ada. `mvp-scope.md`: "kecepatan mengirim > stack yang benar". Paling sedikit bagian bergerak untuk solo — satu codebase, satu deploy |

> **Konsekuensi penting untuk `security-test`:** rencana awal (`hubungan-proyek.md`) membayangkan
> `web-scan-engine` sebagai **library Go bersama** dua proyek. Karena engine kini TypeScript, saat
> `security-test` mulai dibangun nanti ada dua pilihan: (a) `security-test` juga pakai TS dan berbagi
> paket engine ini, atau (b) engine di-port ke Go saat itu. Keputusan ditunda sampai `security-test`
> benar-benar dimulai — untuk sekarang engine ditulis terisolasi & murni agar gampang diekstrak/di-port.

## 1. Bentuk sistem

Rilis 1 adalah **satu app SvelteKit kecil**, tanpa akun, tanpa pembayaran, tanpa cron. Satu codebase
yang melayani UI sekaligus API:

```
SvelteKit  ──  routes/tools (UI form A & B)          ← dikirim ke browser
   (satu      routes/api/* + routes/r/[slug]         ← endpoint server (Node)
    app)           │
                   ▼
        src/lib/server/engine/  (paket TS server-only)
            normalize(PSL) · rdap · tls · status · ratelimit · cache
                   │
                   ▼
                SQLite via better-sqlite3  (hasil tersimpan + waitlist + event)
```

**Engine ditulis sebagai paket TypeScript server-only** di `web/src/lib/server/engine/`, terisolasi
dari HTTP & DB (fungsi murni + I/O jaringan saja) supaya **bisa diekstrak jadi paket npm bersama**
bila `security-test` nanti juga TS (`hubungan-proyek.md`). Skrip `scripts/cek-domain.py` tetap ada
sebagai **alat concierge & oracle rujukan** — logikanya ditulis ulang di TS dan diuji agar hasilnya
cocok dengan skrip Python.

## 2. Engine (`src/lib/server/engine/`) — isi paket

Fungsi murni, tanpa tahu soal HTTP/DB. Server-only (pakai modul Node `tls`/`net` & `fetch`).

| Modul | Tanggung jawab | Catatan dari `rilis-1.md` §4 |
|-------|----------------|------------------------------|
| `normalize` | URL/subdomain → *registrable domain* | **Wajib Public Suffix List sungguhan** — pakai `tldts` (PSL tertanam, nol panggilan jaringan) — bukan daftar sufiks pendek seperti di skrip manual. Simpan juga bentuk asli untuk ditampilkan "dicek sebagai …" |
| `rdap` | Query RDAP → tanggal kedaluwarsa + registrar | Lewat `rdap.org`; fallback WHOIS untuk TLD tanpa RDAP. `.id` sudah terverifikasi (`rilis-1.md` §4) |
| `tls` | Handshake TLS socket → kedaluwarsa + penerbit SSL | Socket, bukan HTTP request. Coba `www.` sebagai fallback kalau apex tidak melayani :443 (celah yang ada di skrip manual) |
| `ratelimit` | Token bucket global ≤2 req/det + jitter acak | Wajib hari pertama; registry memblokir IP yang terlalu cepat |
| `cache` | Hasil per *registrable domain*, TTL ≥24 jam | Melindungi registry & menghemat biaya. Domain berulang tidak menembak RDAP lagi |
| `status` | sisa hari → `LEWAT`/`KRITIS ≤7`/`SEGERA ≤30`/`aman`/`?` | Sama persis dengan skrip, agar hasil konsisten |

Prinsip: **satu baris gagal tidak merusak seluruh batch** — tiap domain mengembalikan hasil atau
galat bertanda, tidak pernah melempar ke atas.

## 3. Model data (SQLite)

Tidak ada akun, tapi **ada penyimpanan** — hasil bisa dibagikan via URL permanen, dan email waitlist
ditangkap. Ini menyelesaikan ketegangan di `rilis-1.md §3`: *tanpa login* ≠ *tanpa database*.

```
check_batch
  id            INTEGER PK
  slug          TEXT UNIQUE      -- URL permanen /r/{slug}
  mode          TEXT             -- 'single' | 'bulk'
  domain_count  INTEGER
  status        TEXT             -- 'pending' | 'done'
  ip_hash       TEXT             -- hash+salt, untuk rate limit & anti-abuse (BUKAN IP mentah — higiene PDP)
  created_at    DATETIME

check_result
  id            INTEGER PK
  batch_id      INTEGER FK
  input_raw     TEXT             -- apa yang ditempel pengguna
  checked_as    TEXT             -- registrable domain yang benar-benar dicek
  domain_expiry DATE NULL
  registrar     TEXT NULL
  ssl_expiry    DATE NULL
  ssl_issuer    TEXT NULL
  status        TEXT             -- hasil fungsi status()
  note          TEXT NULL        -- "dicek sebagai …", "tanggal diredaksi", galat
  created_at    DATETIME

waitlist
  id            INTEGER PK
  email         TEXT
  batch_id      INTEGER FK NULL  -- domain yang sudah dia tempel = data cold-start onboarding Tahap 2
  source        TEXT NULL        -- utm/komunitas asal, untuk tahu kanal mana yang bekerja
  created_at    DATETIME

domain_cache               -- cache 24 jam, kunci = registrable domain
  domain        TEXT PK
  domain_expiry DATE NULL
  registrar     TEXT NULL
  ssl_expiry    DATE NULL
  ssl_issuer    TEXT NULL
  fetched_at    DATETIME

event                      -- instrumen validasi (lihat §6)
  id         INTEGER PK
  name       TEXT          -- 'batch_created' | 'batch_completed' | 'result_viewed' | 'share_clicked' | 'waitlist_signup'
  batch_id   INTEGER FK NULL
  props      TEXT NULL     -- JSON ringkas (mis. {"domain_count":40})
  created_at DATETIME
```

SQLite cukup untuk Rilis 1 (satu VPS, volume rendah, tanpa akun) dan nol-ops. **Pindah ke Postgres
di Tahap 2** saat ada akun & cron — bukan sekarang (jangan over-engineer, `mvp-scope.md`).

## 4. Endpoint

Batch bulk sampai ~50 domain pada ≤2 req/detik bisa makan ~25–50 detik → **jangan sinkron** (risiko
timeout). Pola: buat batch, kerjakan di background, frontend polling.

| Metode & path | Fungsi |
|---------------|--------|
| `POST /api/check` | Body `{mode, domains[]}`. Validasi + batas (≤50 domain, cek rate limit per `ip_hash`). Buat `check_batch` status `pending`, enqueue pekerjaan, **segera** balas `{slug}` |
| `GET /r/{slug}.json` | Status batch + hasil sejauh ini (untuk polling & progress bar) |
| `GET /r/{slug}` | Halaman HTML permanen hasil cek — tabel urut dari paling cepat kedaluwarsa, chip status, catatan "dicek sebagai …", tombol bagikan, CTA email. Memicu event `result_viewed` |
| `POST /api/waitlist` | Body `{email, slug}`. Simpan email + tautkan ke domain batch-nya. Event `waitlist_signup` |

Worker: pool kecil yang menarik pekerjaan batch, memanggil engine dengan rate limiter **global**
(lintas semua batch, bukan per batch — biar total ke registry tetap ≤2/detik), cek `domain_cache`
dulu, tulis `check_result` sambil jalan supaya progress terlihat.

## 5. Frontend `/tools`

- **Satu halaman**, dua form (`rilis-1.md §2`): Form A (satu domain) & Form B (textarea tempel ~50).
  Keduanya menembak endpoint yang sama dengan `mode` berbeda.
- Submit → redirect ke `/r/{slug}`, yang polling `.json` dan merender tabel saat hasil masuk (progress
  "12/40 dicek…"). Ini membuat URL permanen itu sekaligus halaman tunggu — tidak perlu layar terpisah.
- Tabel: kolom domain, kedaluwarsa domain + sisa hari, SSL + sisa hari, registrar, status. Baris
  bertanda "dicek sebagai `klien.com`" bila pengguna menempel subdomain/URL penuh (biar tidak terasa salah).
- **CTA tangkap email** di bawah hasil: *"Pantau otomatis semua domain ini — dapat alert sebelum
  kedaluwarsa."* → `POST /api/waitlist`. Inilah jembatan ke Tahap 2 (data onboarding sudah masuk).
- Tombol **Bagikan** (salin URL `/r/{slug}`) → pemicu penyebaran organik.
- **Copy berbicara ke developer & agensi**, bukan orang awam (`peta-produk.md` aturan audiens).

## 6. Instrumentasi metrik (ini instrumen validasinya — jangan dilewat)

Seluruh ambang "lanjut Tahap 2" di `validasi.md` bergantung pada perilaku yang **harus terukur**.
Tabel `event` di atas adalah alat ukurnya — internal, tanpa pihak ketiga (hormati sikap privasi
produk; jangan kirim data pengguna ke luar). Yang diturunkan dari event:

| Sinyal (dari `validasi.md` & `rilis-1.md §6`) | Dihitung dari |
|-----------------------------------------------|---------------|
| **Rata-rata domain per cek massal** — *sinyal terkuat* | rata-rata `domain_count` pada `batch_created` mode `bulk` |
| Jumlah cek massal dijalankan | hitung `batch_created` mode `bulk` |
| Konversi → daftar email | `waitlist_signup` / `batch_completed` |
| Penyebaran | `share_clicked`, dan hit `result_viewed` tanpa batch baru |
| Pengguna kembali | `result_viewed`/`batch_created` berulang dari `ip_hash` sama |

Pengguna yang menempel **≥20 domain** adalah ICP terbukti → kontak lewat email (asinkron), pakai
pertanyaan di `validasi.md §5` / `scripts/template-komunikasi.md §4`.

## 7. Guardrail wajib (dari `etika-legal.md` & `rilis-1.md`)

- Rate limit global ≤2 req/det + jitter; cache ≥24 jam; **batas per IP & per permintaan** (≤50
  domain/batch, batasi jumlah batch/jam per `ip_hash`) — tool massal gratis adalah sasaran scraping registry.
- **User-Agent jujur & bisa dihubungi.**
- Simpan `ip_hash` (hash+salt), **bukan IP mentah**; hapus batch & event lama otomatis (higiene PDP).
- **Baca ketentuan PANDI** sebelum rilis `.id` secara massal.
- Tangani kegagalan dengan anggun; tampilkan sumber data & tanggal apa adanya (kebiasaan jujur =
  pertahanan hukum nanti, `legal-liability.md`).

## 8. Yang TIDAK dibangun di Rilis 1 (kunci keras — `rilis-1.md §3`)

❌ Login/akun/dashboard · ❌ Pembayaran · ❌ Cron/monitoring terjadwal & alert (Tahap 2) ·
❌ Cek hosting · ❌ Deteksi perubahan NS/registrar (Tahap 3) · ❌ Pemeriksaan keamanan apa pun
(proyek `security-test`) · ❌ Aplikasi seluler, API publik, multi-bahasa.

Tabel `waitlist` & `event` **bukan** pelanggaran "tanpa akun" — tidak ada autentikasi, tidak ada
sesi login; hanya penampung anonim untuk hasil-bisa-dibagikan dan sinyal validasi.

## 9. Perkiraan usaha (asumsi solo, ~15 jam/minggu)

Angka kasar, bukan janji. Cakupan sengaja kecil justru supaya realistis buat solo.

| Blok | Perkiraan |
|------|-----------|
| Engine TS (port logika skrip + PSL `tldts` + cache + rate limit + uji vs oracle Python) | ~1 minggu |
| API routes + worker + SQLite (`better-sqlite3`) | ~0,5–1 minggu |
| UI `/tools` + halaman hasil `/r/[slug]` + polling + CTA email | ~1 minggu |
| Instrumentasi event + guardrail + poles + deploy 1 VPS (adapter-node) | ~0,5 minggu |
| **Total** | **~3–4 minggu kalender** solo paruh waktu |

> Catatan: PDF mengasumsikan tim dua orang & 4–6 minggu untuk cakupan lebih besar. Kalau benar solo,
> **jangan tambah apa pun** ke angka di atas — tiap fitur ekstra menggandakan risiko tak-pernah-rilis
> (`HANDOFF.md` risiko scope explosion).

## 10. Keputusan — status

1. ✅ **Engineering solo** (24 Nov 2026); pemasaran orang kedua, bergabung belakangan. §9 berlaku.
2. ✅ **Stack SvelteKit full-stack + TS + SQLite** (24 Nov 2026). Go belum terpasang; satu codebase paling cepat untuk solo.
3. ⏳ **Bahasa engine bersama dengan `security-test`** ditunda sampai proyek itu dimulai — engine ditulis
   terisolasi & murni di `src/lib/server/engine/` supaya mudah diekstrak jadi paket npm atau di-port ke Go nanti.

# web-asset-monitor

**Pusat kesehatan aset web untuk agensi** — pantau masa aktif domain, hosting & SSL klien, lalu ubah tanggal jatuh tempo jadi draf tagihan WhatsApp siap kirim.

> `web-asset-monitor` adalah **nama folder kerja, bukan merek**. Nama komersial belum ditentukan dan wajib melewati penelusuran PDKI DJKI (Kelas 9 & 42) sebelum dikunci.

**Proyek ini satu dari dua.** Ide pemindai keamanan kini berdiri sendiri di `../security-test/`. Hubungan keduanya, mesin bersama, dan urutan eksekusi yang disarankan ada di `docs/hubungan-proyek.md`.

Folder ini adalah **paket handoff**: bisa dilanjutkan dari AI/tool mana pun tanpa menjelaskan ulang konteks. Kalau kamu AI yang baru membuka folder ini, baca `HANDOFF.md` lalu `docs/peta-produk.md`.

## Struktur

| File | Isi |
|------|-----|
| `HANDOFF.md` | Konteks lengkap & mandiri — **baca pertama** |
| `docs/peta-produk.md` | ⭐ **Dokumen penentu** — ruang lingkup, 2 mode, 3 tahap |
| `docs/rilis-1.md` | Cakupan konkret yang dibangun sekarang (apa & kenapa) |
| `docs/rilis-1-teknis.md` | Spesifikasi teknis Rilis 1 (arsitektur, model data, endpoint) |
| `docs/validasi.md` | Validasi asinkron + aturan kill-switch |
| `docs/konsep-produk.md` | Kenapa produknya begini, fitur paling bernilai |
| `docs/target-pasar.md` | Siapa pembelinya, corong gratis → berbayar |
| `docs/model-finansial.md` | Hipotesis harga, unit economics, ambang "layak lanjut" |
| `docs/kompetitor.md` | Peta kompetitor + analisis moat |
| `docs/retensi.md` | Melawan churn |
| `docs/mvp-scope.md` | Cakupan Tahap 2 (produk berbayar) |
| `docs/etika-legal.md` | Batas pengecekan & guardrail (risiko ke luar) |
| `docs/legal-liability.md` | Disclaimer, ToS, keamanan data (risiko ke dalam) |
| `docs/hubungan-proyek.md` | Hubungan dengan `security-test` & mesin bersama |

## Ringkasan

**Satu situs, dua mode.**

- **Mode sekali cek** (`/tools`, gratis, terbuka) — corong SEO
- **Mode dipantau terus** (`/app`, berlangganan) — sumber pendapatan

Pembeda utamanya **bukan** pemantauannya — registrar sudah mengingatkan gratis. Yang tidak dimiliki siapa pun adalah **pandangan lintas-registrar untuk semua klien sekaligus + draf tagihan WhatsApp satu klik** yang mengubah tanggal jatuh tempo jadi pendapatan nyata bagi agensi.

## Status

**Tahap: Rilis 1 — scaffold terbangun & terverifikasi (24 Nov 2026).**

Kerangka kerja Rilis 1 ada di [`web/`](web/) — SvelteKit + TypeScript + SQLite. Alur inti sudah
diuji end-to-end: tempel domain → normalisasi PSL → RDAP + TLS → tabel hasil + tangkap email.
Lihat [`web/README.md`](web/README.md) dan [`docs/rilis-1-teknis.md`](docs/rilis-1-teknis.md).

> **Langkah dunia-nyata berikutnya tetap validasi.** Scaffold dibangun lebih dulu atas pilihan
> founder (bangun paralel), tapi urutan di `docs/validasi.md` tidak berubah: sebar (concierge
> `scripts/` atau tool Rilis 1) → baca perilaku → baru Tahap 2. Jangan bangun fitur Tahap 2
> sebelum ambang validasi tercapai.

## Struktur kode

```
Asyabani/
├── web-asset-monitor/    ← proyek ini
│   ├── docs/             ← dokumen strategi & spesifikasi
│   ├── scripts/          ← alat concierge (cek-domain.py) + template komunikasi
│   └── web/              ← ✅ Rilis 1: app SvelteKit (/tools gratis)
│       └── src/lib/server/engine/  ← engine cek (TS, server-only, bisa diekstrak)
└── security-test/        ← proyek sebelah (dibangun nanti)
```

> Catatan: rencana awal (`docs/hubungan-proyek.md`) membayangkan `web-scan-engine` sebagai library
> **Go** bersama dua proyek. Karena Go belum terpasang & demi kecepatan solo, engine kini **TypeScript**
> di dalam `web/`, ditulis terisolasi agar mudah diekstrak/di-port saat `security-test` dimulai.

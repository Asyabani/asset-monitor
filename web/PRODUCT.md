# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pembeli/pengguna inti: **freelancer web developer & agensi mikro (1–5 orang) di Indonesia yang mengelola 5–50 situs klien.** Situasi: mencatat tanggal perpanjangan domain/hosting/SSL manual di spreadsheet atau kalender, tersebar di banyak registrar, dan **terlewat** — mengakibatkan situs klien mati, domain hilang, dan fee perpanjangan gagal ditagih. Pekerjaan mereka saat memakai produk: melihat sekaligus semua aset klien yang mendekati jatuh tempo, lalu menagih perpanjangannya.

Pengguna tier gratis juga mencakup lalu lintas insidental (mahasiswa, pemilik blog, developer belajar) — **boleh memakai, tapi produk tidak dirancang untuk mereka.** *Dipakai umum ≠ dirancang untuk umum.*

## Product Purpose

Pusat kesehatan aset web untuk agensi: pantau masa aktif **domain, hosting & SSL** semua klien lintas-registrar dalam satu tampilan, lalu ubah tanggal jatuh tempo jadi **draf tagihan WhatsApp siap kirim**. Sukses = agensi tidak pernah lagi kelewatan perpanjangan, dan menagih fee perpanjangan jadi satu klik.

Rilis 1 (yang ada sekarang) adalah **mode sekali-cek gratis** di `/tools`: tempel sampai 50 domain → tabel kedaluwarsa domain + SSL + registrar. Fungsinya corong akuisisi/SEO sekaligus instrumen validasi; monitoring terjadwal, akun, alert, dan penagihan adalah Tahap 2 (belum dibangun).

## Positioning

Pembeda bukan pemantauannya — registrar sudah mengingatkan gratis untuk domainnya sendiri. Yang tidak dimiliki siapa pun: **pandangan lintas-registrar untuk semua klien sekaligus + generator draf tagihan WhatsApp** yang mengubah "domain klien X jatuh tempo H-30" jadi pendapatan nyata. Bukan security scanner (itu proyek terpisah), bukan uptime monitoring per menit, bukan PageSpeed.

## Operating Context

- Alur inti pengguna: tempel/impor daftar domain → sistem cek (RDAP + TLS, data publik) → tabel diurut dari yang paling cepat kedaluwarsa → (Tahap 2) alert bertingkat H-30/14/7/3 → draf tagihan WA.
- Semua pengecekan **pasif atas data publik** (RDAP/WHOIS, sertifikat TLS, DNS) — tidak perlu login/akses cPanel.
- Status per aset: aman / SEGERA (≤30 hari) / KRITIS (≤7 hari) / LEWAT / tidak tersedia (?).
- Konteks lokal Indonesia: bahasa Indonesia, WhatsApp sebagai kanal tagih, gateway pembayaran lokal (Midtrans/Xendit) di Tahap 2.

## Capabilities and Constraints

- **Ada sekarang (Rilis 1):** cek 1 domain & cek massal (≤50), normalisasi subdomain→registrable (Public Suffix List, ditandai "dicek sebagai …"), hasil tersimpan dengan URL permanen bisa dibagikan, tangkap email waitlist. Tanpa akun/login/pembayaran.
- **Kunci keras di luar cakupan Rilis 1:** login/dashboard, billing, monitoring terjadwal & alert, cek hosting, deteksi perubahan NS/registrar, pemeriksaan keamanan apa pun. Jangan tambah tanpa ambang validasi tercapai.
- **Keterbatasan jujur yang wajib disampaikan:** tanggal hosting tidak bisa dideteksi otomatis (input manual di Tahap 2); sebagian TLD meredaksi tanggal RDAP; alat bantu pengingat **bukan jaminan** — tanggung jawab akhir atas perpanjangan ada pada pengguna.
- **Guardrail teknis:** rate limit ~2 req/detik + jitter ke registry, cache 24 jam, batas per IP, simpan hash IP (bukan IP mentah), User-Agent jujur.
- Stack terpasang: SvelteKit + TypeScript + SQLite (better-sqlite3), engine cek server-only di `src/lib/server/engine/`.

## Brand Commitments

- **Nama "web-asset-monitor" adalah nama folder kerja, dipakai sebagai wordmark sementara** (dikonfirmasi pengguna). Nama komersial final BELUM ditentukan dan wajib penelusuran PDKI DJKI (Kelas 9 & 42) sebelum dikunci — jangan memperlakukan wordmark ini sebagai merek final.
- **Bahasa kerja & UI: Indonesia.**
- Voice: jujur, teknis-tanpa-sok, langsung ke manfaat. Bukan hype, bukan jargon marketing. Model bisnis product-led & asinkron (produk menjual dirinya; founder kurang nyaman penjualan tatap muka) — UI harus bisa "menjual" sendiri tanpa sales call.
- Copy saat ini berbahasa Indonesia dan harus tetap (redesign mengganti tampilan, bukan fungsi/bahasa).

## Evidence on Hand

- Aplikasi Rilis 1 yang berjalan & teruji: `web/` (routes `/`, `/tools`, `/r/[slug]`, API). Alur cek nyata terverifikasi (kompas.id, github.com).
- Dokumen strategi lengkap di `../docs/` (peta-produk, konsep-produk, target-pasar, kompetitor, retensi, model-finansial, legal-liability, etika-legal, validasi, rilis-1 + teknis) dan `../HANDOFF.md`.
- Alat concierge `../scripts/cek-domain.py` + template komunikasi.
- **Belum ada:** pelanggan berbayar, testimoni, angka traksi, logo final, merek terdaftar. Jangan mengarang klaim komersial (harga sebagai "hipotesis" boleh, testimoni/pelanggan tidak).

## Product Principles

1. **Obat, bukan vitamin.** Masalahnya "web/domain klien mati" — bencana langsung & terlihat. Desain harus terasa seperti alat yang mencegah kerugian nyata, bukan gimmick.
2. **Satu jenis nilai, dikerjakan sangat baik.** Alur pantau → ingatkan → tagih yang mulus mengalahkan sepuluh fitur setengah matang. Tolak scope creep.
3. **Jujur soal keterbatasan = pertahanan hukum & kepercayaan.** Selalu tampilkan "terakhir dicek" dan sumber data; jangan pernah terlihat menjamin keamanan/keberlangsungan.
4. **Bicara ke developer & agensi**, meski tool terbuka untuk umum. Sinyal nilai paling kuat: jumlah domain yang dipantau per pengguna.
5. **Lokal & product-led.** Indonesia, WhatsApp, murah, self-serve — tanpa meeting/penjualan tatap muka.

## Accessibility & Inclusion

Target pengguna developer/agensi di beragam perangkat & kondisi jaringan Indonesia. Wajib: kontras memadai, dapat dioperasikan keyboard, tabel hasil terbaca di layar kecil, dan tetap berguna di koneksi lambat (hasil muncul progresif saat batch diproses).

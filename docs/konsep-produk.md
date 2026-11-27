# Konsep Produk

> Peta lengkap (kemampuan, dua mode, tahapan) ada di `peta-produk.md`. Dokumen ini menjelaskan **kenapa produknya begini**.

## Masalah yang diselesaikan

Freelancer web developer dan agensi mikro mengelola 5–50 situs klien. Tanggal perpanjangan domain, hosting, dan SSL dicatat manual di spreadsheet atau kalender — dan **terlewat**.

Akibatnya berlapis:
- Situs klien mati mendadak → reputasi agensi hancur di depan klien
- Nama domain bisa hilang kalau lewat masa tenggang
- Agensi kehilangan momentum menagih biaya perpanjangan → **pendapatan rutin bocor**

Lapisan terakhir itu yang paling sering terlewat dalam analisis: ini bukan cuma soal menghindari bencana, tapi soal **uang yang gagal ditagih**.

## Kenapa produk ini lebih mudah dijual daripada security scanner

Ide awal folder ini adalah pemindai keamanan. Ide itu **tidak dibuang** — sekarang jadi proyek terpisah di `../security-test/` (lihat `hubungan-proyek.md`). Produk ini yang disarankan dibangun lebih dulu, karena:

| | Monitoring perpanjangan | Security scanner |
|---|---|---|
| Sifat masalah | **Obat** — web mati = bencana langsung & terlihat | **Vitamin** — penting tapi gampang ditunda |
| Risiko teknis | Rendah, deterministik (RDAP/TLS) | Tinggi — false positive membunuh kepercayaan |
| Kaitan ke uang | Langsung: menyelamatkan fee perpanjangan | Tak langsung: mencegah kerugian hipotetis |

Security tetap masuk rencana, tapi sebagai **lapisan premium di tahap 3** — bukan titik awal. Alasan lengkap di `peta-produk.md` §6.

## Fitur paling bernilai: generator draf tagihan WhatsApp

Monitoring-nya sendiri mudah ditiru. Yang sulit ditiru adalah mengubah *"domain klien X jatuh tempo H-30"* menjadi **draf tagihan bermargin, siap kirim lewat WhatsApp dalam satu klik**.

Kenapa ini intinya:
- Produk berubah dari *mencegah rugi* menjadi **membantu pengguna menghasilkan uang**. Jauh lebih mudah dijual.
- Menjawab paradoks retensi (`retensi.md`): pengguna tetap merasa dapat nilai tiap bulan walau tak ada yang nyaris kedaluwarsa — karena tiap bulan dia menagih.
- Cocok dengan kebiasaan bisnis lokal (WhatsApp), sesuatu yang pemain global tidak urus.

**Jadikan ini headline produk, bukan fitur pendukung.**

## Cara kerja

**Mode gratis** — buka `/tools`, tempel domain, lihat hasil. Tanpa login.

**Mode berbayar** — daftar → masukkan daftar aset klien (impor CSV/tempel massal) → sistem cek harian → alert bertingkat H-30/14/7/3 → saat jatuh tempo dekat, satu klik menghasilkan draf tagihan WA siap kirim.

## Positioning

- **Bukan** untuk enterprise dengan tim IT (itu pasar high-touch — dihindari, lihat batasan founder di `HANDOFF.md`).
- **Untuk** freelancer & agensi mikro Indonesia yang mengelola aset web klien.
- Pembeda: **murah, berbahasa Indonesia, terintegrasi alur penagihan WhatsApp** — bukan sekadar monitoring.

## Bentuk bisnis

- Langganan bulanan, batas berdasarkan jumlah aset yang dipantau.
- Tool gratis = corong akuisisi lewat SEO, bukan sumber pendapatan.
- Laporan rapi yang bisa diteruskan ke klien = pemasaran berulang.

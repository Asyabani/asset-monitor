# Peta Produk — satu situs, dua mode

> **Dokumen penentu.** Kalau isi dokumen lain bertentangan dengan dokumen ini, **dokumen ini yang menang**.
>
> **Diperbarui 23 Nov 2026 (malam):** proyek dipecah jadi dua. Seluruh pemeriksaan keamanan (security header, file terekspos, SPF/DMARC, subdomain takeover) **pindah ke proyek `security-test`** dan tidak lagi jadi bagian dari peta ini. Lihat `hubungan-proyek.md`.

## 1. Ruang lingkup produk ini

**Siklus hidup aset web klien: domain, hosting, SSL — dan penagihannya.**

Satu kalimat positioning: *"pusat kesehatan aset web untuk agensi"* — tahu kapan setiap aset klien jatuh tempo, dan langsung bisa menagihnya.

Yang **bukan** urusan produk ini: pemeriksaan keamanan (proyek sebelah), uptime monitoring per menit (wilayah UptimeRobot, mahal dan sudah ramai), performa/PageSpeed.

## 2. Dua mode

| | **Mode Sekali Cek** | **Mode Dipantau Terus** |
|---|---|---|
| Harga | Gratis, tanpa login | Berlangganan |
| Letak | `/tools/*` (terbuka untuk umum) | `/app` (perlu login) |
| Fungsi bisnis | Corong akuisisi & SEO | **Sumber pendapatan** |
| Nilai bagi pengguna | Jawaban instan | Riwayat, alert otomatis, **penagihan** |

**Prinsipnya:** tool gratis bukan produk — dia materi pemasaran. Sama seperti tool gratis Ahrefs atau link checker NordVPN: tidak menghasilkan uang sendiri, tugasnya menang di Google dan menggiring orang ke langganan.

### Aturan audiens

Tool **terbuka untuk siapa pun**, tapi **bahasanya bicara ke developer & agensi web**.

*Dipakai umum ≠ dirancang untuk umum.* Orang awam yang menemukan tool cek SSL tetap boleh memakainya — tapi jangan pernah menulis copy, memilih fitur, atau mengejar kata kunci demi mereka. Mereka cek sekali lalu pergi selamanya dan tidak pernah membayar; yang punya 50 domain klien adalah satu-satunya yang punya kebutuhan berulang.

## 3. Kemampuan

Semua hanya query **DNS / RDAP / TLS**. Ringan, deterministik, tanpa API berbayar pihak ketiga.

| # | Kemampuan | Yang dicek | Gratis | Berbayar | Tahap |
|---|-----------|-----------|--------|----------|-------|
| 1 | **Cek Domain & SSL** | Kedaluwarsa domain, registrar, masa berlaku & penerbit SSL | 1 domain, instan | Semua aset, cron harian, riwayat | **1** |
| 2 | **Cek Massal** | Sama, 20–50 domain sekaligus → tabel | Dibatasi, tidak tersimpan | Tersimpan jadi workspace | **1** |
| 3 | **Alert Bertingkat** | — | — | Email H-30/14/7/3 per aset | 2 |
| 4 | **Generator Draf Tagihan WA** | — | — | Satu klik → draf tagihan siap kirim | 2 |
| 5 | **Deteksi Perubahan Nameserver/Registrar** | NS & registrar berubah tanpa diduga | — | Alert dini (indikasi pembajakan domain / klien pindah diam-diam) | 3 |

Kemampuan 1 & 2 secara teknis adalah **mesin yang sama dengan dua form input** — itulah sebabnya Rilis 1 bisa selesai dalam hitungan minggu.

**Nomor 4 adalah fitur paling bernilai di seluruh produk.** Lihat `konsep-produk.md`.

**Nomor 5** sering terlewat tapi menarik: agensi yang kliennya diam-diam memindahkan domain ke pihak lain baru sadar setelah kehilangan fee perpanjangan. Deteksi dini = menyelamatkan pendapatan, sejalan persis dengan inti produk.

## 4. Kenapa satu mesin itu kunci

Semua kemampuan berbagi fondasi yang sama: antrean kerja, rate limiter, parser RDAP, pemeriksa TLS, penyimpanan hasil, tampilan laporan.

**Menyelesaikan Rilis 1 = menyelesaikan sebagian besar fondasi tahap berikutnya.** Tahap 2 tinggal menambahkan penjadwalan, akun, dan penagihan di atasnya.

Mesin ini juga **dipakai bersama proyek `security-test`** — jangan ditulis dua kali. Lihat `hubungan-proyek.md`.

## 5. Yang sengaja DITOLAK

| Ditolak | Alasan |
|---------|--------|
| **PageSpeed / Lighthouse** | Google sudah gratiskan + punya API. Self-host butuh headless Chrome → berat & mahal, merusak model biaya VPS murah |
| **File checker (scan malware)** | Butuh mesin AV berbayar, butuh storage, dan **kamu jadi menampung file berbahaya di server** |
| **Phishing / link checker** | Pembungkus tipis Google Safe Browsing/PhishTank — tanpa pembeda, **audiensnya salah** (konsumen awam) |
| **Uptime monitoring per menit** | Wilayah UptimeRobot/Better Stack. Biaya jauh lebih tinggi, pasar sudah ramai, bukan masalah yang kita pecahkan |
| **Pemeriksaan keamanan** | Pindah ke proyek `security-test` |

Pola yang ditolak: **pembungkus tipis API orang lain yang biayanya naik seiring bertambahnya pengguna gratis yang tak pernah membayar** — pusat biaya yang tumbuh justru saat kelihatan "sukses".

## 6. Tahapan eksekusi

| Tahap | Isi | Syarat lanjut |
|-------|-----|---------------|
| **1** | Kemampuan 1 & 2 versi gratis + tangkap email. Sekaligus instrumen validasi | Ambang di `validasi.md` |
| **2** | Produk berbayar: akun, monitoring terjadwal, alert bertingkat, **draf tagihan WA**, billing | ~20 pelanggan berbayar |
| **3** | Deteksi perubahan NS/registrar, laporan white-label untuk klien agensi | — |

## 7. Catatan merek

> `web-asset-monitor` adalah **nama folder kerja, bukan merek**. Sebelum membeli domain & mengunci nama komersial, wajib penelusuran **PDKI DJKI** Kelas 9 (perangkat lunak) dan Kelas 42 (layanan SaaS) — lihat `legal-liability.md`.

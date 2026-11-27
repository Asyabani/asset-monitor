# Hubungan dengan proyek `security-test`

## Dua proyek, bukan satu

| | `web-asset-monitor` (ini) | `security-test` |
|---|---|---|
| Masalah | Aset klien kedaluwarsa & fee perpanjangan tak tertagih | Lubang keamanan di situs tak terdeteksi |
| Sifat masalah | **Obat** — web mati = bencana langsung & terlihat | **Vitamin** — penting tapi gampang ditunda |
| Pemeriksaan | RDAP, TLS, DNS (pasif, data publik) | Header, file terekspos, DMARC, subdomain takeover |
| Fitur pembunuh | Generator draf tagihan WhatsApp | Deteksi yang hanya dipahami orang pentest |
| Risiko teknis | Rendah, deterministik | Tinggi — false positive membunuh kepercayaan |
| Keahlian founder terpakai? | Tidak banyak | Ya, sepenuhnya |

Letak folder: `/home/egdev/Asyabani/security-test/`

## Mesin dasarnya SAMA — jangan ditulis dua kali

Ini konsekuensi terpenting dari pemisahan. Kedua proyek butuh fondasi yang identik:

- Resolver DNS
- Klien RDAP/WHOIS
- Pemeriksa sertifikat TLS
- Klien HTTP dengan timeout & penanganan galat
- Antrean kerja + rate limiter + cache hasil
- Penyimpanan riwayat & tampilan laporan

**Tulis sekali sebagai library bersama**, lalu dipakai kedua proyek. Kalau tidak, kamu akan memperbaiki bug parser RDAP yang sama di dua tempat — dengan kapasitas 10–20 jam/minggu, itu pemborosan yang tidak terasa di awal tapi menyakitkan dalam 6 bulan.

Saran struktur:

```
Asyabani/
├── web-scan-engine/      ← library bersama (dibuat saat mulai ngoding)
├── web-asset-monitor/    ← proyek ini
└── security-test/        ← proyek sebelah
```

## Urutan eksekusi yang disarankan

**Bangun satu dulu, jangan dua-duanya sekaligus.**

Memisahkan *dokumen* itu murah dan rapi. Memisahkan *pembangunan* itu mahal: dua basis kode, dua merek, dua corong SEO, dua produk yang harus dipasarkan — dengan kapasitas satu side hustle.

**Rekomendasi: `web-asset-monitor` lebih dulu.** Alasannya:

1. Masalahnya "obat", bukan "vitamin" → jauh lebih mudah dijual
2. Deterministik → tidak ada risiko false positive yang merusak kepercayaan di produk pertama
3. Punya kaitan uang langsung (menyelamatkan fee perpanjangan agensi)
4. Membangunnya sekaligus membangun mesin bersama yang dipakai proyek kedua

`security-test` punya pembeda lebih tajam (keahlian pentest), tapi lebih sulit dijual dan lebih sulit diretensi. Lebih aman dibangun setelah ada arus kas dan basis pengguna.

## Peluang cross-sell nanti

ICP kedua proyek **beririsan besar**: agensi web yang mengelola situs klien butuh keduanya.

Begitu proyek pertama punya pelanggan berbayar, proyek kedua bisa ditawarkan ke basis yang sudah ada — akuisisi nyaris gratis, tanpa iklan dan tanpa percakapan penjualan. Itulah hadiah terbesar dari mengerjakannya berurutan, dan hadiah itu **hilang kalau keduanya dibangun bersamaan lalu dua-duanya setengah jadi**.

Pertimbangkan juga: satu akun, satu tagihan, dua produk. Itu menaikkan switching cost (lihat `kompetitor.md` soal moat).

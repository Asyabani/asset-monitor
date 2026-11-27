# Rilis 1 — Cek Domain & SSL (gratis)

> Satu build, **empat fungsi sekaligus**. Ini satu-satunya hal yang dibangun sampai ada sinyal pasar.
>
> Dokumen ini = **apa & kenapa** (cakupan). Untuk **bagaimana** membangunnya (arsitektur, model data,
> endpoint, strategi port skrip, instrumentasi metrik) lihat `rilis-1-teknis.md`.

## 1. Kenapa justru ini yang dibangun duluan

Tool "tempel 50 domain, lihat semua tanggal kedaluwarsanya" mengerjakan empat hal dalam satu pekerjaan:

1. **Instrumen validasi** — menggantikan 10–15 wawancara yang bertabrakan dengan gaya komunikasi founder. Orang menempelkan 40 domain = bukti perilaku nyata, jauh lebih jujur daripada orang bilang "menarik" saat diwawancara.
2. **Aset SEO** — menyasar kata kunci seperti *"cek masa aktif domain"*, *"cek expired SSL massal"*.
3. **Demo nilai produk** — hasilnya *memperlihatkan* masalah tanpa perlu dijelaskan: "3 dari 50 domainmu kedaluwarsa bulan depan."
4. **Solusi cold-start** — pengguna sudah menempelkan daftar domainnya; tinggal tawarkan "simpan & pantau otomatis" → data onboarding sudah masuk tanpa ketik ulang.

## 2. Cakupan (MASUK)

- **Form A — cek 1 domain:** hasil detail satu aset.
- **Form B — cek massal:** textarea, tempel sampai ~50 domain, hasil berupa tabel urut berdasarkan yang paling cepat kedaluwarsa.
- **Data yang ditampilkan per domain:**
  - Tanggal kedaluwarsa domain (RDAP, fallback WHOIS)
  - Registrar
  - Masa berlaku sertifikat SSL + penerbit (TLS socket)
  - Status: aman / segera kedaluwarsa / sudah lewat / gagal dicek
- **Tangkap email:** CTA "pantau otomatis semua domain ini" → simpan email + daftar domainnya sebagai waitlist.
- **Hasil bisa dibagikan** (URL permanen per hasil cek) — pemicu penyebaran organik.

## 3. Cakupan (TIDAK MASUK)

Dikunci keras. Melanggar ini = mengulang kesalahan *scope explosion*.

- ❌ Login / akun / dashboard
- ❌ Pembayaran
- ❌ Monitoring terjadwal & alert (itu Tahap 2)
- ❌ Cek hosting (tidak bisa dideteksi otomatis — lihat catatan di bawah)
- ❌ Deteksi perubahan nameserver/registrar (Tahap 3)
- ❌ Pemeriksaan keamanan apa pun — itu proyek `../security-test/`
- ❌ Aplikasi seluler, API publik, multi-bahasa

## 4. Catatan teknis

**Gunakan RDAP, bukan WHOIS mentah.** WHOIS makin banyak diredaksi (GDPR) dan formatnya tak konsisten antar-TLD; RDAP terstruktur (JSON). Sediakan fallback ke WHOIS untuk TLD yang belum mendukung RDAP.

**Khusus `.id` — ✅ SUDAH DIVERIFIKASI (23 Nov 2026).** RDAP berfungsi untuk `.id` dan `.go.id` lewat `rdap.org` (diuji: `pandi.id`, `kemkes.go.id`, `kompas.id` — ketiganya mengembalikan tanggal kedaluwarsa). **Risiko teknis terbesar proyek ini sudah hilang.** Bukti: `scripts/cek-domain.py`.

**Keterbatasan yang ditemukan saat pengujian:** RDAP hanya bekerja pada domain terdaftar, bukan subdomain (`expired.badssl.com` → 404, sedangkan `badssl.com` berhasil). **Ini bukan kasus pinggiran** — pengguna akan menempelkan `www.klien.com` dan URL penuh; tanpa normalisasi, sebagian besar barisnya gagal.

Alat manual sudah menanganinya dengan mundur ke domain induk + daftar sufiks pendek (`co.id`, `go.id`, dst). **Untuk Rilis 1 itu tidak cukup — wajib Public Suffix List sungguhan**, karena pengguna publik akan memasukkan TLD yang tidak kita perkirakan. Tampilkan juga domain mana yang sebenarnya dicek ("dicek sebagai `klien.com`"), supaya hasilnya tidak terasa salah bagi yang menempel subdomain.

**Rate limiting wajib sejak hari pertama.** Registry memblokir IP yang meminta terlalu cepat (risiko ini sudah ditandai di SWOT dokumen PDF). Antrean dengan jeda acak, maksimal ~2 permintaan/detik, dan cache hasil per domain minimal 24 jam.

**SSL via TLS socket**, bukan HTTP request — lebih ringan dan tetap akurat.

**Tangani kegagalan dengan anggun:** domain mati, tidak terdaftar, atau unreachable tidak boleh membuat satu baris merusak seluruh tabel.

**Batas anti-penyalahgunaan:** batasi jumlah domain per permintaan dan per IP. Tool massal gratis adalah sasaran empuk untuk dipakai *scraping* registry.

## 5. Keterbatasan yang harus jujur disampaikan

**Tanggal kedaluwarsa hosting tidak bisa dideteksi otomatis** — tidak ada protokol publik untuk itu. Padahal di situlah margin perpanjangan agensi paling besar.

Artinya di Tahap 2 nanti, hosting = input manual per aset. Ini titik gesekan onboarding terbesar produk berbayar, jadi **wajib ada impor CSV / tempel massal sejak awal Tahap 2**. Jangan diabaikan — inilah tempat kebanyakan pengguna menyerah sebelum jadi pelanggan.

## 6. Kriteria sukses Rilis 1

Lihat ambang lengkap di `validasi.md`. Sinyal yang dipantau:

| Metrik | Kenapa penting |
|--------|----------------|
| Jumlah cek massal dijalankan | Minat nyata (bukan opini) |
| **Rata-rata domain per cek massal** | **Sinyal terkuat** — makin banyak domain, makin besar kemungkinan dia agensi dengan rasa sakit nyata |
| Konversi → daftar email | Kesediaan melangkah lebih jauh |
| Pengguna yang kembali | Kebutuhan berulang |

> Pengguna yang menempelkan 40+ domain adalah ICP-mu yang sesungguhnya. **Hubungi mereka langsung lewat email** — inilah percakapan validasi yang bernilai, dan sifatnya asinkron (cocok dengan batasan komunikasi founder).

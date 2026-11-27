# Etika & Legal — batas pengecekan

> **Diperbarui 23 Nov 2026 (malam).** Setelah proyek dipecah dua, produk ini **nyaris seluruhnya pemeriksaan pasif atas data publik** — jauh lebih sederhana secara etis daripada proyek `security-test`. Pembahasan mendalam soal probing ada di sana.

## Semua pemeriksaan di sini bersifat pasif

Produk ini hanya membaca informasi yang memang disiarkan publik. Setara dengan yang dilakukan browser biasa atau perintah `whois`:

| Pemeriksaan | Sumber | Sifat |
|-------------|--------|-------|
| Kedaluwarsa domain, registrar | RDAP / WHOIS | Data publik registry |
| Masa berlaku & penerbit SSL | Sertifikat TLS | Disajikan terbuka ke setiap pengunjung |
| Nameserver, record DNS | DNS | Data publik |

**Konsekuensinya: tool gratis boleh dibuka untuk domain mana pun tanpa verifikasi kepemilikan.** Tidak ada masalah etis — ini data publik, dan memang begitulah cara tool sejenis (SSL Labs, whois lookup) bekerja.

**Yang tidak boleh ada di produk ini:** pencarian jalur seperti `/.env` atau `/.git`, enumerasi subdomain, atau apa pun yang sifatnya menyelidik. Semua itu milik proyek `security-test` dan **wajib verifikasi kepemilikan** di sana.

> Kalau suatu saat ada dorongan menambahkan "sekalian cek keamanannya" ke produk ini — **jangan**. Itu memindahkan produk dari Kelas A ke Kelas B dan membawa serta seluruh beban etis & hukumnya. Arahkan ke proyek sebelah.

## Verifikasi kepemilikan: tetap perlu, tapi untuk alasan berbeda

Di mode berbayar, verifikasi tetap disarankan — bukan karena etika pemeriksaan, melainkan karena:

1. **Mencegah penyalahgunaan sebagai alat intelijen kompetitor** — tanpa batas apa pun, orang bisa memantau portofolio domain agensi saingannya.
2. **Kualitas data** — memastikan pengguna memang mengelola aset yang didaftarkan.

Metode: DNS TXT record, file token, atau meta tag. Bisa dibuat **opsional dengan insentif** (aset terverifikasi dapat alert lebih cepat) alih-alih wajib keras, supaya tidak menghambat onboarding.

## Guardrail teknis (wajib sejak hari pertama)

- **Rate limiting** — registry memblokir IP yang meminta terlalu cepat. Antrean dengan jeda acak, maksimal ~2 permintaan/detik. Risiko ini sudah ditandai di SWOT dokumen PDF.
- **Cache hasil minimal 24 jam** per domain — melindungi registry sekaligus menghemat biayamu.
- **Batas per IP & per permintaan** pada tool massal gratis. Tool massal terbuka adalah **sasaran empuk untuk scraping registry** — ini risiko penyalahgunaan terbesar produk ini.
- **User-agent jelas & jujur** agar registry/pemilik situs bisa mengenali dan menghubungi.
- **Hormati batasan registry.** Beberapa registry melarang penggunaan data WHOIS/RDAP secara massal atau untuk tujuan komersial tertentu — **baca ketentuan registry `.id` (PANDI) sebelum rilis**, karena `.id` adalah TLD terpenting bagi pasar targetmu.

## Data pribadi pihak ketiga (UU PDP)

Satu koreksi terhadap dokumen PDF, yang menyatakan sistem hanya menyimpan "metadata non-sensitif":

**Nama dan nomor WhatsApp klien pengguna tetap data pribadi** — dan itu data **pihak ketiga** (kliennya penggunamu, bukan penggunamu sendiri). Posisimu menjadi pemroses data.

Artinya tetap dibutuhkan: dasar hukum pemrosesan, perjanjian pemrosesan data dengan pengguna, kebijakan retensi & penghapusan, serta enkripsi saat disimpan. Bukan penghalang — tapi jangan merasa aman hanya karena bukan kata sandi.

Yang **tetap dilarang keras** disimpan (ini benar di dokumen PDF): kata sandi cPanel/hosting, SSH key, root access, NIK/KTP.

## Framing produk

Ini **alat administrasi & pemantauan**, bukan alat keamanan dan bukan alat intelijen. Jaga agar produk tidak bisa dibelokkan jadi pemindai massal portofolio domain milik orang lain.

> Risiko hukum **ke arah kita** (disclaimer, ToS, tanggung jawab bila alert gagal terkirim, keamanan data pelanggan) dibahas terpisah di `legal-liability.md`.

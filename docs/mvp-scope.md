# Tahap 2 — Cakupan MVP Produk Berbayar

> **Jangan buka dokumen ini sebelum ambang di `validasi.md` tercapai.** Tahap 1 (`rilis-1.md`) harus selesai dan memberi sinyal lebih dulu.
>
> Modul di bawah diadaptasi dari dokumen PDF *"Blueprint & Spesifikasi Teknis MVP"* — bagian itu sudah matang dan dipertahankan, dengan beberapa koreksi.

## Lima modul wajib (scope lock)

| # | Modul | Fungsi inti | Batas tegas (di luar cakupan) |
|---|-------|-------------|-------------------------------|
| 1 | **Autentikasi & Workspace** | Daftar email/password + Google OAuth. Isolasi data per `workspace_id` | Tanpa peran/permission rumit |
| 2 | **Manajemen Klien & Aset** | CRUD klien (nama, email, no WA) & aset web (domain, hosting, harga jual perpanjangan, jatuh tempo). **Impor CSV / tempel massal wajib ada** | Tanpa integrasi API registrar |
| 3 | **Mesin Cek Terjadwal** | Cron harian, antrean dengan rate limiter, RDAP + TLS. Menyimpan riwayat hasil | Bukan uptime monitoring per menit |
| 4 | **Notifikasi & Generator Draf WA** | Email bertingkat H-30/14/7/3 + tombol satu klik menghasilkan URL `wa.me` berisi draf tagihan terformat | Tanpa WhatsApp Gateway berbayar — pengguna menekan kirim sendiri |
| 5 | **Billing Mandiri** | Payment gateway lokal (Midtrans/Xendit) dengan QRIS & Virtual Account, upgrade/downgrade via webhook | Tanpa kartu kredit internasional, tanpa transfer manual |

## Koreksi penting terhadap blueprint PDF

**1. Impor massal naik jadi wajib.** Blueprint menaruh "impor data otomatis" di luar cakupan. Itu keliru untuk produk self-serve tanpa sentuhan sales: agensi dengan 50 aset tidak akan mengetik satu per satu. Minimal **impor CSV + tempel massal**. Tanggal kedaluwarsa domain terisi otomatis lewat RDAP — jadi pengguna cukup menempelkan nama domain, harga, dan klien.

**2. Hosting tetap manual.** Tidak ada protokol publik untuk mendeteksi masa aktif hosting. Padahal di situlah margin agensi terbesar. Terima ini sebagai keterbatasan dan permudah input massalnya.

**3. RDAP, bukan WHOIS mentah.** WHOIS makin diredaksi dan formatnya tak konsisten. Verifikasi dukungan RDAP untuk `.id` (PANDI) **sejak Tahap 1**.

**4. Rate limiting & cache bukan opsional.** Risiko pemblokiran IP oleh registry sudah ditandai di SWOT dokumen PDF. Antrean + jeda acak + cache 24 jam per domain.

## Prinsip

**Satu jenis nilai, dikerjakan sangat baik.** Lebih berharga satu alur (pantau → ingatkan → tagih) yang mulus, daripada sepuluh fitur setengah matang.

## Yang SENGAJA ditunda

- Deteksi perubahan nameserver/registrar & laporan white-label — itu Tahap 3 (`peta-produk.md`)
- **Pemantauan keamanan — bukan bagian produk ini sama sekali.** Itu proyek terpisah (`hubungan-proyek.md`)
- Integrasi Slack/webhook, multi-user/tim, aplikasi seluler, API publik

## Catatan arsitektur

- Mesin dari Tahap 1 dipakai ulang — Tahap 2 menambahkan penjadwalan, penyimpanan, akun, dan penagihan di atasnya.
- Founder nyaman dengan **Go** dan **Svelte** dari proyek sebelumnya; blueprint PDF mengasumsikan Next.js/Node. **Pilih yang paling kamu kuasai** — kecepatan mengirim lebih penting daripada stack yang "benar".
- Monolit sederhana. Jangan over-engineer sebelum ada pengguna.

## Kill-switch yang berlaku di tahap ini

- **KS-2:** dilarang menambah fitur di luar 5 modul sampai 20 pelanggan berbayar.
- **KS-3:** 3 bulan setelah rilis komersial, bila <8 pelanggan berbayar → hentikan biaya server, tutup dengan rapi.

# scripts/

Alat manual untuk **validasi concierge** — bukan produk, bukan bagian dari Rilis 1.

| Berkas | Isi |
|--------|-----|
| `cek-domain.py` | Alatnya |
| `template-komunikasi.md` | **Teks siap tempel** untuk posting, balasan, dan pertanyaan validasi |

## `cek-domain.py`

Cek masa aktif domain & sertifikat SSL untuk banyak domain sekaligus. Hanya pustaka bawaan Python 3, tidak perlu `pip install`.

```bash
python3 cek-domain.py tokopedia.com kompas.id
python3 cek-domain.py -f daftar.txt
python3 cek-domain.py -f daftar.txt --csv hasil.csv
```

Keluaran: tabel diurut dari yang paling cepat kedaluwarsa, plus status (`LEWAT` / `KRITIS` ≤7 hari / `SEGERA` ≤30 hari / `aman`).

## Cara memakainya untuk validasi

1. Posting di komunitas web developer: *"Kirim daftar domain klienmu, saya balas tabel tanggal kedaluwarsa + SSL-nya. Gratis."*
2. Masukkan domain yang dikirim ke `daftar.txt`, jalankan skrip.
3. Balas lewat email/DM dengan hasilnya.
4. Catat: siapa, berapa domain, dan reaksinya.
5. Tanyakan satu hal saja: **"sekarang gimana cara kamu menagih biaya perpanjangan ke klien?"**

Tujuannya mendapat sinyal yang sama dengan Rilis 1 — berapa banyak orang tertarik, dan berapa domain yang mereka kelola — **tanpa membangun produk apa pun**. Kalau sepi, kamu kehilangan satu hari, bukan satu bulan.

Semua teksnya — posting, balasan, cara mengirim hasil, dan pertanyaan validasinya —
sudah ditulis siap tempel di **`template-komunikasi.md`**.

Ambang lanjut ada di `../docs/validasi.md`.

## Catatan teknis

- Semua data yang diambil **publik** (RDAP + sertifikat TLS) → tidak perlu verifikasi kepemilikan. Lihat `../docs/etika-legal.md`.
- Jeda 1 detik antar domain supaya tidak kena rate limit registry. Naikkan dengan `--jeda` kalau mengolah daftar panjang.
- **RDAP hanya melayani domain terdaftar, bukan subdomain.** Skrip menanganinya otomatis: `www.klien.co.id` dicoba dulu, lalu mundur ke `klien.co.id`, dan hasilnya ditandai `dicek sebagai ...`. Pemangkasan berhenti sebelum sufiks registry (`co.id`, `go.id`, dst) lewat daftar pendek di dalam skrip — bukan Public Suffix List sungguhan. **Tahap 2 wajib pakai PSL.**
- URL penuh ikut dibersihkan (`https://klien.id/kontak` → `klien.id`), jadi tidak perlu minta orang merapikan daftarnya dulu.
- Beberapa TLD meredaksi tanggal kedaluwarsa; skrip menandainya di kolom catatan, tidak berhenti.

## Status pengujian (23 Nov 2026)

| Diuji | Hasil |
|-------|-------|
| `.id`, `.go.id` (pandi.id, kemkes.go.id, kompas.id) | ✅ tanggal kedaluwarsa terbaca |
| `.com` (google, github, tokopedia, detik) | ✅ |
| Domain tidak terdaftar | ✅ ditandai, tidak crash |
| Sertifikat kedaluwarsa & self-signed | ✅ ditandai dengan alasannya |
| Subdomain & URL penuh (`www.kompas.id`, `https://www.tokopedia.com`) | ✅ mundur ke domain induk, ditandai `dicek sebagai ...` |

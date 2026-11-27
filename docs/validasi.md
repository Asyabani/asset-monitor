# Validasi — asinkron, berbasis perilaku

> **Diperbarui 23 Nov 2026.** Versi lama menyuruh 10–15 wawancara terstruktur (mengikuti dokumen PDF "Riset Ide Produk"). Itu **dibuang** karena bertabrakan langsung dengan batasan founder: kurang nyaman berkomunikasi. Rencana yang mengandalkan 15 panggilan telepon akan macet di minggu pertama. Versi ini mencapai tujuan yang sama lewat jalur asinkron.

## Prinsip

**Utamakan bukti perilaku di atas opini.** Orang bilang "menarik" itu murah dan menyesatkan. Orang menempelkan 40 domain klien ke tool-mu itu data. Orang membayar di muka itu kebenaran.

Urutan kekuatan sinyal:

```
bayar di muka  >  daftar email  >  pakai tool  >  bilang "menarik"
```

## Langkah

### 1. Pilih satu segmen pembayar
**Freelancer web developer & agensi mikro (1–5 orang) yang mengelola 5–50 situs klien.** Sudah diputuskan; jangan dibuka lagi.

### 2. Instrumen validasi — concierge dulu, Rilis 1 belakangan

> **Diubah 24 Nov 2026.** Semula langkah ini langsung menyuruh membangun Rilis 1. Founder memutuskan menyisipkan satu tahap lebih murah di depannya.

**Tahap 0 — concierge (±1 hari kerja, sekarang).** Instrumennya `../scripts/cek-domain.py`: orang mengirim daftar domain lewat DM, kamu jalankan skrip di laptop, balas tabelnya manual. Tidak ada yang dibangun, tidak ada server, tidak ada biaya. Teks siap tempelnya ada di `../scripts/template-komunikasi.md`.

**Tahap 1 — Rilis 1 (3–4 minggu, hanya jika Tahap 0 lolos).** Tool cek massal gratis (`rilis-1.md`), versi otomatis dari hal yang sama.

Alasan urutannya: Tahap 0 menjawab pertanyaan yang sama dengan Tahap 1, tapi dalam sehari alih-alih sebulan. Kalau Tahap 0 sepi, kamu kehilangan satu hari — bukan satu bulan.

Selain kedua itu, **tidak ada yang boleh dibangun** sebelum ada sinyal.

### 3. Sebarkan secara asinkron (tanpa menelepon siapa pun)
- Posting di komunitas tempat ICP berkumpul: grup Facebook/Telegram web developer Indonesia, forum, LinkedIn, X, r/webdev lokal.
- Formatnya **berbagi alat gratis yang berguna**, bukan jualan. *"Saya bikin tool buat cek masa aktif 50 domain sekaligus, gratis, silakan pakai."*
- Tulis 1–2 artikel pendek yang menargetkan kata kunci pencarian (mulai aset SEO sejak hari pertama).

### 4. Baca perilakunya
Amati metrik di `rilis-1.md` §6. Yang paling penting: **rata-rata jumlah domain per cek massal.**

### 5. Percakapan susulan — lewat email, bukan telepon
Kirim email personal ke pengguna yang menempelkan **≥20 domain**. Mereka ICP-mu yang terbukti.

Tiga pertanyaan saja, singkat:
1. Berapa situs klien yang kamu kelola sekarang?
2. Pernah kelewatan perpanjangan domain/hosting klien? Apa akibatnya?
3. Bagaimana cara kamu menagih biaya perpanjangan ke klien sekarang?

> Pertanyaan ke-3 adalah yang paling penting dan paling sering dilewatkan. Jawabannya menentukan apakah **generator draf tagihan WA** — fitur paling bernilai di produk ini — benar-benar menyentuh masalah nyata.

### 6. Uji harga dengan angka, bukan pertanyaan terbuka
Jangan tanya *"mau bayar berapa?"* (jawabannya selalu terlalu rendah atau asal). Sodorkan angka konkret dan amati reaksinya. Hipotesis harga ada di `model-finansial.md`.

### 7. Baru bangun Tahap 2
Hanya jika ambang di bawah tercapai.

## Ambang Tahap 0 → boleh bangun Rilis 1

> **Ditetapkan 24 Nov 2026, sebelum posting apa pun** — sengaja, supaya angkanya tidak dikarang ulang belakangan agar terlihat lolos. Kalau mau diubah, ubah **sekarang**, bukan setelah hasilnya keluar.

**Tenggat: posting paling lambat 30 Nov 2026. Evaluasi 7 Des 2026.**

Yang dihitung hanya orang yang **benar-benar mengirim daftar domain** — bukan yang nge-*like*, bukan yang komentar "keren", bukan yang bilang "nanti saya kirim".

| Hasil di 7 Des | Artinya | Tindakan |
|---|---|---|
| **≥10 orang kirim, rata-rata ≥10 domain** | Sinyal kuat | Bangun Rilis 1 |
| **3–9 orang kirim** | Hidup tapi belum meyakinkan | Ulangi di 2 komunitas berbeda, 1 minggu lagi. **Satu kali ini saja** — jangan berputar terus |
| **≤2 orang kirim** | Postingan, komunitas, atau segmennya salah | **Jangan bangun Rilis 1.** Evaluasi ulang sebelum menulis satu baris kode |

**Ambang terpisah untuk fitur andalan.** Dari yang membalas pertanyaan soal penagihan:

- **≥50% menyebut penagihan sebagai kerepotan spontan** → generator tagihan WA jadi headline, sesuai rencana.
- **<50%, jawabannya datar ("ya tinggal chat aja")** → fitur andalanmu belum terbukti. **Jangan jadikan headline**; turunkan jadi fitur biasa dan cari ulang apa yang sebenarnya menyakitkan. Lebih baik tahu ini sekarang daripada setelah dibangun.

## Ambang "lanjut ke Tahap 2"

Minimal salah satu:

- **≥50 cek massal** dijalankan, dengan **rata-rata ≥15 domain** per cek, **atau**
- **≥50 pendaftar email** berkualitas (bukan email sampah), **atau**
- **≥1 pre-order dibayar di muka** — sinyal terkuat, mengalahkan semua metrik lain.

## Kapan berhenti (kill-switch)

Diadaptasi dari aturan kill-switch di dokumen PDF — pertahankan disiplin ini, ini bagian terbaik dari rencana aslinya.

| Aturan | Pemicu | Tindakan |
|--------|--------|----------|
| **KS-0** | 7 Des 2026: ≤2 orang mengirim daftar domain | Jangan bangun Rilis 1. Evaluasi ulang segmen & pesan dulu |
| **KS-1** | Akhir periode validasi: 0 komitmen & <10 pendaftar | Proyek gugur, jangan tulis kode Tahap 2 |
| **KS-2** | Selama Tahap 2 | Dilarang menambah fitur di luar cakupan sampai 20 pelanggan berbayar |
| **KS-3** | 3 bulan setelah rilis komersial: <8 pelanggan berbayar | Hentikan biaya server, tutup dengan rapi |

Kalau semua bilang "menarik" tapi tak ada yang membayar → ini **vitamin**. Pertajam segmen/pesan, atau pivot.

## Catatan soal tenggat

Dokumen PDF menetapkan jendela validasi 23–30 November 2026 (7 hari). **Itu terlalu pendek** kalau Rilis 1 belum ada — tool-nya sendiri perlu waktu dibangun. Perlakukan tanggal itu sebagai awal, bukan akhir. Yang tidak boleh dikompromikan adalah **urutannya** (tool dulu → sebar → baca perilaku → baru bangun produk berbayar), bukan tanggalnya.

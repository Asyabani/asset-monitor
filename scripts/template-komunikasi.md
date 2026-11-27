# Template komunikasi — validasi concierge

Semua teks di bawah siap tempel. Ubah seperlunya, tapi **jangan ubah strukturnya** —
tiap bagian ada alasannya, dijelaskan di blok `> kenapa begini`.

Prinsipnya: kamu **bukan sedang menjual**. Kamu sedang menawarkan jasa gratis
sambil diam-diam mengukur. Tidak ada produk yang disebut. Tidak ada yang perlu
kamu bujuk. Ini sengaja dipilih supaya cocok dengan cara kerjamu.

---

## 1. Posting di komunitas

Sasaran: grup Facebook/WhatsApp/Discord/Telegram web developer & freelancer
Indonesia. Pilih 2–3 saja, jangan sebar ke mana-mana.

```
Lagi iseng bikin skrip kecil buat cek masa aktif domain + sertifikat SSL
sekaligus banyak, karena saya sendiri sering lupa domain klien mana yang
mau habis.

Kalau ada yang mau coba: kirim aja daftar domain klienmu (boleh sampai
50-an), nanti saya balas tabelnya — tanggal kedaluwarsa domain,
registrar, plus masa berlaku SSL-nya. Gratis, nggak ada syarat apa-apa.

Datanya semua publik (RDAP + sertifikat), jadi saya nggak butuh akses
cPanel atau login apa pun. Kirim domainnya saja.
```

> **Kenapa begini**
> - *"Lagi iseng bikin skrip"* — menurunkan ekspektasi. Kalau ada yang error, tidak ada yang kecewa.
> - *"saya sendiri sering lupa"* — kamu pengguna, bukan penjual. Ini yang bikin orang mau membalas.
> - *"boleh sampai 50-an"* — sengaja. Angka ini yang mengundang orang menyebut jumlah besar, dan **jumlah domain adalah sinyal validasimu yang paling kuat**.
> - *"nggak butuh akses cPanel"* — menghapus kecurigaan terbesar. Tanpa kalimat ini, sebagian orang akan mengira kamu memancing kredensial.
> - **Tidak ada** kata "SaaS", "produk", "langganan", "beta", atau "sedang riset pasar". Begitu orang mencium kamu sedang menjual, jawabannya berubah jadi sopan — dan sopan itu racun buat validasi.

---

## 2. Balasan saat ada yang kirim daftar

```
Siap, saya proses. Nanti saya balas di sini.
```

Itu saja. Jangan tanya apa-apa dulu.

> **Kenapa begini**
> Pertanyaan di awal menambah gesekan sebelum mereka menerima sesuatu yang
> bernilai. Semua pertanyaan ditahan sampai setelah hasilnya kamu kirim
> (bagian 4).

---

## 3. Mengirim hasilnya

Jalankan skripnya, lalu kirim tabelnya apa adanya:

```bash
python3 cek-domain.py -f daftar.txt
```

Teks pengantarnya:

```
Ini hasilnya:

[tempel tabel di sini]

Keterangan kolom SISA = sisa hari. Yang ditandai SEGERA itu di bawah
30 hari, KRITIS di bawah 7 hari.

Catatan: tanggal domain diambil dari RDAP (data registrar), SSL dari
sertifikat yang sedang dipakai servernya. Kalau ada baris yang kosong
atau aneh, bilang aja — beberapa TLD menyembunyikan tanggalnya.
```

> **Kenapa begini**
> - Tabel mentah, tanpa dipercantik. Ini alat kerja, bukan brosur.
> - *"Kalau ada baris yang aneh, bilang aja"* — mengundang balasan kedua. Percakapan yang berlanjut jauh lebih bernilai daripada satu kali kirim.
> - Menyebut sumber data membangun kepercayaan teknis ke sesama developer, dan membiasakanmu bersikap jujur soal keterbatasan — kebiasaan yang nanti jadi pertahanan hukummu (`../docs/legal-liability.md`).

---

## 4. Satu pertanyaan validasi

Kirim **terpisah**, setelah mereka membalas hasilnya. Jangan digabung.

```
Btw boleh tanya satu hal? Sekarang gimana cara kamu nagih biaya
perpanjangan domain/hosting ke klien — ada alurnya sendiri, atau
diingat-ingat manual?
```

> **Kenapa ini pertanyaannya**
> Fitur paling bernilai di seluruh rencanamu adalah **generator draf tagihan
> WhatsApp** (`../HANDOFF.md`). Seluruh rencana itu berdiri di atas satu
> asumsi: bahwa menagih perpanjangan ke klien itu merepotkan.
>
> Pertanyaan ini mengujinya tanpa membocorkan apa yang sedang kamu cari.
> Kalau kamu bertanya *"butuh alat buat bikin tagihan nggak?"*, semua orang
> bilang butuh — dan kamu tidak belajar apa-apa.
>
> **Yang kamu dengarkan:** keluhan spontan. "Ribet", "suka kelewat", "nagihnya
> yang paling males". Kalau jawabannya datar — *"ya tinggal chat aja"* —
> berarti ini bukan rasa sakit nyata, dan fitur andalanmu perlu dipikir ulang
> **sebelum** dibangun, bukan sesudah.

---

## 5. Yang dicatat (bukan dihafal)

Buat satu spreadsheet, lima kolom:

| Nama/akun | Dari mana | Jumlah domain | Jawaban soal penagihan | Balas lagi? |
|---|---|---|---|---|

> **Kolom yang menentukan adalah "jumlah domain".** Satu orang yang menempelkan
> 40 domain lebih berarti daripada sepuluh orang yang bilang "keren".
> Ambang lanjutnya ada di `../docs/validasi.md`.

---

## 6. Yang JANGAN dilakukan

- ❌ **Jangan sebut rencana produk berbayar.** Begitu disebut, orang mulai bersikap sopan dan datamu rusak.
- ❌ **Jangan minta akses cPanel, hosting, atau login apa pun.** Tidak perlu, dan merusak kepercayaan seumur hidup. Semua pengecekan di sini memakai data publik — lihat `../docs/etika-legal.md`.
- ❌ **Jangan tawarkan memperbaiki apa pun.** Kamu mengirim informasi, bukan jasa. Begitu jadi jasa, ini berubah jadi pekerjaan tatap muka yang justru kamu hindari.
- ❌ **Jangan simpan daftar domain orang lebih lama dari perlu.** Portofolio klien agensi itu sensitif (`../docs/legal-liability.md`). Hapus `daftar.txt` dan CSV-nya setelah selesai.
- ❌ **Jangan mulai ngoding Rilis 1 sebelum tahap ini selesai.** Itulah seluruh gunanya minggu ini.

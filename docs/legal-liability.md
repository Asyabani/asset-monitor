# Legal & Liability — risiko hukum ke arah KITA

> **Ditulis ulang 24 Nov 2026** agar seluruh badan dokumen sesuai produk sekarang
> (monitoring siklus hidup aset + penagihan WA). Versi sebelumnya ditulis untuk
> security scanner dan hanya diperbaiki lewat banner di atas konten lama — berisiko,
> karena §2 (disclaimer) dan §8 (checklist) justru bagian yang paling mungkin disalin
> orang apa adanya. Kerangkanya (disclaimer → ToS → gagal-diam-diam → higiene data →
> entitas bisnis) dipertahankan; isi risikonya kini mengikuti janji produk yang benar.
>
> `etika-legal.md` membahas risiko ke arah **luar** (jangan pantau aset orang lain).
> Dokumen ini membahas arah sebaliknya: **risiko hukum & tanggung jawab yang jatuh ke
> founder/produk sendiri.** Ini bukan nasihat hukum — konsultasikan ke notaris/pengacara
> sebelum live. Dokumen ini daftar hal yang wajib disiapkan.

## 1. Masalah inti: kami menjanjikan pengingat, bukan jaminan

Produk ini memberi sinyal *"aman / segera kedaluwarsa / sudah lewat"* atas tanggal jatuh
tempo aset klien. Janji itu menciptakan mode kegagalan yang spesifik:

> **Janji produk:** *"Kami mengingatkan sebelum aset klienmu kedaluwarsa."*
> **Kegagalan terburuk:** *alert gagal terkirim → domain klien lewat masa tenggang → hilang permanen.*

**Skenario yang pasti terjadi cepat atau lambat:** email alert masuk spam, atau RDAP
gagal/diredaksi sehingga tanggal salah, atau cron mati diam-diam. Agensi mengira aman,
tidak memperpanjang, domain klien lewat masa tenggang, dan **nama domain bisa hilang
permanen** — kerugian nyata yang jauh melebihi harga langganan. Agensi akan menyalahkan kita.

Mode kegagalan kedua: **data hosting diisi manual oleh pengguna sendiri** (tidak ada
protokol publik untuk mendeteksinya — lihat `rilis-1.md §5`). Salah input oleh pengguna
bukan tanggung jawab kita, tapi itu harus **tertulis**, bukan diasumsikan.

Keduanya diredam oleh **framing hukum yang benar + larangan gagal diam-diam** (§4), bukan
dengan berjanji sempurna.

## 2. Disclaimer wajib (inti pertahanan)

Ditampilkan saat daftar (harus di-*accept*) dan di tiap laporan/alert:

- **Alat bantu pengingat, bukan pengganti tanggung jawab pengguna.** Tanggung jawab akhir
  atas perpanjangan aset tetap ada pada pengguna; produk membantu, tidak menggantikan.
- **Best-effort, bukan jaminan.** Tanggal berasal dari registry/RDAP & sertifikat TLS publik
  yang **bisa tidak tersedia, diredaksi, atau berubah**; tanggal hosting **diisi pengguna
  sendiri**. Tidak adanya alert ≠ jaminan aset aman.
- **Batasan tanggung jawab (limitation of liability).** Tanggung jawab maksimum dibatasi —
  lazimnya sebesar biaya langganan yang dibayar (mis. 1–3 bulan terakhir), **bukan** kerugian
  tak terbatas akibat domain hilang atau fee perpanjangan yang gagal ditagih.
- **Tanpa garansi tersirat** atas kecocokan untuk tujuan tertentu.

## 3. Terms of Service (ToS) — poin minimum

- Definisi layanan & batasannya (poin #2 di atas).
- **Kewajiban pengguna:** hanya mendaftarkan aset milik sendiri/berizin (tautkan ke
  `etika-legal.md`); larangan memakai produk sebagai alat intelijen untuk memantau portofolio
  domain pihak lain; **akurasi data yang diinput manual (termasuk tanggal hosting & harga jual)
  adalah tanggung jawab pengguna**.
- Hak menangguhkan/menghapus akun yang melanggar.
- Pembatasan tanggung jawab & ganti rugi (*indemnity*): jika pengguna menyalahgunakan alat
  untuk memata-matai atau merugikan pihak lain, **pengguna** yang menanggung, bukan kami.
- Hukum yang berlaku & penyelesaian sengketa (Indonesia).

## 4. Jangan pernah gagal diam-diam (pertahanan teknis = pertahanan hukum)

Ini pertahanan teknis **sekaligus** hukum yang terpenting untuk produk ini. Kalau pengguna
bisa membuktikan sistem memberitahunya setiap kali ada yang tidak beres, klaim "kami kira
aman karena kalian diam" runtuh. Wajib:

- **Tampilkan "terakhir berhasil dicek" dan sumber data** di tiap aset — pengguna selalu tahu
  kapan terakhir angkanya benar-benar diperbarui.
- **Kirim notifikasi saat pengecekan GAGAL**, bukan hanya saat ada temuan. RDAP 404/timeout,
  TLS error, tanggal diredaksi — semua harus terlihat, bukan hilang diam-diam.
- **Dead-man's switch:** kalau cron tidak jalan sekian jam, pengguna diberi tahu (via kanal
  terpisah) bahwa pemantauan sedang tidak aktif.
- **Alert multi-kanal** (email + dalam aplikasi, idealnya + WA/Telegram nanti) agar tidak
  bergantung pada satu jalur yang bisa masuk spam.

## 5. Data kita sensitif — tiga kategori

Database kita **bukan** peta kerentanan (itu produk `security-test`), melainkan sesuatu yang
tak kalah sensitif:

1. **Portofolio aset klien tiap agensi** — bocor = intelijen kompetitor siap pakai (daftar
   klien beserta tanggal jatuh temponya).
2. **Harga jual perpanjangan** — ini **margin dagang agensi**. Kalau bocor ke klien mereka,
   hubungan bisnis pengguna bisa rusak. Perlakukan setara **rahasia dagang**.
3. **Nama & nomor WhatsApp klien** — data pribadi **pihak ketiga** (kliennya pengguna, bukan
   pengguna kita). Posisi kita menjadi **pemroses data** (lihat `etika-legal.md` & §6).

Kewajiban kami untuk ketiga kategori ini:

- **Enkripsi saat disimpan (at rest) & saat transit (TLS).**
- **Kontrol akses ketat** — minimkan siapa/apa yang bisa membaca portofolio & harga mentah.
- **Minimalkan data:** simpan hanya yang perlu untuk alert, laporan, dan draf tagihan.
- **Kebijakan retensi & penghapusan:** hapus data lama otomatis; hapus semua data saat akun ditutup.
- **Rencana tanggap insiden:** apa yang dilakukan kalau *kami* yang bocor (notifikasi pengguna, dsb).

Yang **dilarang keras disimpan** (ini tetap benar dari dokumen PDF): kata sandi cPanel/hosting,
SSH key, root access, NIK/KTP.

## 6. UU PDP (Pelindungan Data Pribadi, UU 27/2022)

Dua lapis, karena kita memegang dua jenis data pribadi:

- **Data pengguna sendiri** (email, dsb) — butuh **Kebijakan Privasi** publik: data apa yang
  dikumpulkan, untuk apa, berapa lama, hak pengguna; dasar pemrosesan yang jelas (persetujuan
  saat daftar); mekanisme hapus akun & data atas permintaan.
- **Data klien pengguna** (nama & no WA pihak ketiga) — di sini kita **pemroses data**, bukan
  pengendali. Butuh **dasar hukum pemrosesan + perjanjian pemrosesan data dengan pengguna**
  (pengguna sebagai pengendali), plus kebijakan retensi/penghapusan yang sama. Jangan merasa
  aman hanya karena ini "bukan kata sandi" — lihat `etika-legal.md`.

## 7. Entitas bisnis

- Pertimbangkan **PT/CV** sejak pelanggan berbayar pertama: memisahkan tanggung jawab pribadi
  founder dari tanggung jawab bisnis (*limited liability*). Awal boleh perorangan, tapi tetapkan
  ambang kapan harus berbadan hukum.
- Rekening bisnis terpisah; pembukuan rapi untuk pajak.

## 8. Yang SENGAJA ditunda

- **Asuransi tanggung jawab profesional** (professional indemnity): relevan saat skala sudah
  besar / pelanggan enterprise — belum perlu di fase bootstrap, tapi catat.
- Sertifikasi formal (ISO 27001, SOC 2): mahal, baru relevan saat menyasar pelanggan yang menuntutnya.

## 9. Checklist sebelum menerima pembayaran pertama

- [ ] Disclaimer **"alat pengingat, bukan jaminan; tanggung jawab akhir pada pengguna"** tampil & wajib di-accept saat daftar.
- [ ] ToS + Kebijakan Privasi dipublikasikan.
- [ ] Batasan tanggung jawab tertulis di ToS **dan** di tiap laporan/alert.
- [ ] **"Terakhir berhasil dicek"** tampil di tiap aset; **notifikasi saat pengecekan GAGAL** aktif; **dead-man's switch** terpasang.
- [ ] Enkripsi at-rest untuk portofolio aset, harga jual perpanjangan, dan kontak klien.
- [ ] Perjanjian pemrosesan data dengan pengguna disiapkan (untuk data klien pihak ketiga).
- [ ] Jalur hapus akun + data berfungsi.
- [ ] Keputusan entitas bisnis (perorangan dulu / langsung PT) sudah diambil.

---

*Tujuan dokumen ini: memastikan satu insiden pelanggan tidak berubah jadi tanggung jawab tak
terbatas bagi founder. Tiga pilarnya untuk produk ini: **disclaimer yang benar** (alat pengingat,
bukan jaminan) + **jangan gagal diam-diam** (bukti bahwa kita selalu memberi tahu) + **higiene
data** (portofolio, margin, dan kontak klien diperlakukan sebagai rahasia dagang & data pihak ketiga).*

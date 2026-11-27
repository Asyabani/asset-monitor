# Analisis Kompetitor & Moat

> ## ⚠️ Catatan rekonsiliasi (23 Nov 2026, badan dokumen diselaraskan 24 Nov 2026)
>
> Peta kompetitor di §1 ditulis untuk produk **security scanner** (Detectify, Intruder, UpGuard).
> Produk itu kini **proyek terpisah** (`../security-test/`), jadi peta §1 **bukan lagi kompetitor
> produk ini** — biarkan sebagai arsip, dan pakai versi lengkapnya di dokumen kompetitor proyek sebelah.
> Seksi §2–§5 sudah ditulis ulang agar sesuai produk sekarang (monitoring aset + penagihan WA).
>
> **Kompetitor sebenarnya untuk produk monitoring perpanjangan:**
>
> | Pemain | Kenapa berbahaya |
> |--------|------------------|
> | **Email pengingat registrar** | **Ancaman terbesar — sudah gratis & otomatis.** Pertanyaannya bukan "apakah tool ini berguna" tapi "kenapa bayar kalau registrar sudah mengingatkan?" Jawaban kita: registrar hanya mengingatkan domain miliknya sendiri, tidak lintas-registrar, tidak mencakup hosting, dan **tidak membantu menagih klien** |
> | **Spreadsheet + Google Calendar** | Gratis dan "cukup baik". Ini kompetitor paling mematikan untuk semua produk kecil |
> | **WHMCS** | Lengkap tapi berat, mahal, overkill untuk agensi 1–5 orang |
> | **UptimeRobot / Better Stack** | Fokus uptime per detik, harga USD, tidak memantau siklus tagihan domain lokal |
>
> **Implikasi untuk pembeda:** monitoring saja tidak cukup — registrar sudah melakukannya gratis.
> Yang tidak dimiliki siapa pun adalah **pandangan lintas-registrar untuk semua klien sekaligus +
> generator draf tagihan WhatsApp**. Pembeda ada di alur penagihan, bukan di pemantauannya. Lihat `konsep-produk.md`.

## 1. Peta kompetitor (ARSIP — milik proyek `security-test`)

> Tabel ini dipertahankan sebagai arsip. Kompetitor produk ini ada di banner atas, bukan di sini.

| Pemain | Target | Harga (kira-kira) | Self-serve? | Bahasa | Kelemahan yang bisa kita manfaatkan |
|--------|--------|-------------------|-------------|--------|-------------------------------------|
| **Detectify** | Mid-market–enterprise | ~ratusan USD/bln | Ya | Inggris | Mahal, kompleks, berlebihan untuk situs kecil |
| **Intruder.io** | SMB–enterprise | ~mulai ratusan USD/bln | Ya | Inggris | Harga naik cepat per target; overkill untuk UMKM |
| **Pentest-Tools** | Pentester/teknis | Langganan menengah | Ya | Inggris | Berorientasi praktisi, bukan pemilik bisnis awam |
| **UpGuard** | Enterprise/vendor risk | Mahal (enterprise) | Sebagian | Inggris | Jauh dari segmen kecil; high-touch |
| **Tools open-source** (nuclei, testssl.sh, dll) | Teknis/DIY | Gratis | — | Inggris | Perlu keahlian; tak ada monitoring/alert/laporan rapi; bukan produk |
| **Lokal Indonesia** | — | — | — | — | **Nyaris kosong** — peluang di sini |

## 2. Celah pasar yang kita isi

Kompetitor sebenarnya (lihat banner) semuanya gratis atau salah fokus — tapi masing-masing punya
celah yang persis menjadi ruang kita:

- **Lintas-registrar dalam satu tampilan.** Email registrar hanya mengingatkan domain di registrar
  itu sendiri; agensi dengan klien tersebar di banyak registrar tidak punya satu layar.
- **Mencakup hosting & SSL, bukan domain saja.** Tidak ada pengingat gratis yang menyatukan ketiganya per klien.
- **Menyambung ke penagihan.** Tidak ada yang mengubah *"domain klien X jatuh tempo H-30"* jadi
  **draf tagihan siap kirim**. Inilah pembeda yang tidak dimiliki siapa pun (`konsep-produk.md`).
- **Murah, berbahasa Indonesia, self-serve penuh** (puluhan–ratusan ribu Rupiah, tanpa sales call —
  sesuai batasan founder).

Positioning satu kalimat: *"Pusat kesehatan aset web untuk agensi — pantau masa aktif domain,
hosting & SSL semua klien lintas-registrar dalam satu layar, lalu ubah tanggal jatuh tempo jadi
draf tagihan WhatsApp siap kirim."*

## 3. Kritik jujur: "keahlian founder" BUKAN moat

Dokumen awal menyebut keahlian pentest founder sebagai keunggulan utama. Untuk produk ini keahlian
itu **nyaris tidak terpakai** (Tahap 1–2 hanya RDAP/TLS deterministik) — ia milik proyek
`security-test`. Yang tersisa sebagai head start di sini: kecepatan eksekusi, selera produk, dan
paham konteks lokal. Itu pun **head start, bukan parit (moat):**

- **Tidak scalable:** keunggulan satu orang tak bisa digandakan; jadi *bus factor* (kalau founder berhenti, produk mati).
- **Tidak defensible:** begitu produk jalan dan hasilnya kelihatan, parser RDAP/TLS + alur tagihan WA bisa ditiru — tidak ada rahasia dagang di dalam mekanismenya.
- **Head start itu sementara:** memberi keunggulan 6–18 bulan, lalu habis bila tak dikonversi jadi sesuatu yang menumpuk.

## 4. Moat yang sebenarnya bisa dibangun (urut dari paling realistis)

1. **Distribusi / SEO & konten** — korpus artikel berbahasa Indonesia tentang masa aktif domain,
   SSL, dan pengelolaan aset web klien (*"cara cek masa aktif domain"*, *"kapan harus perpanjang
   SSL"*, *"cara menagih biaya perpanjangan ke klien"*). Menumpuk seiring waktu, sulit disusul
   pendatang baru. **Paling selaras dengan gaya founder (menulis asinkron).**
2. **Switching cost pada segmen Agency** — begitu agensi memasukkan 25+ domain klien, harga jual
   perpanjangan, dan riwayat tagihan ke dalam sistem, lalu mengandalkan laporan white-label kami ke
   kliennya, pindah itu merepotkan. Perdalam ini (integrasi alur kerja mereka).
3. **Data agregat** — seiring banyak aset dipantau, kita tahu pola "registrar/TLD apa paling umum
   dipakai agensi", "kapan puncak jatuh tempo", "berapa lazimnya margin perpanjangan" → benchmark &
   insight yang pemain baru tak punya. Menumpuk otomatis.
4. **Merek & template laporan** — laporan yang layak diteruskan ke klien = pemasaran berulang +
   asosiasi merek. Bukan moat kuat sendirian, tapi memperkuat #1 & #2.
5. **Lokalisasi** — bahasa, gateway pembayaran lokal (Midtrans/Xendit), alur WhatsApp, konteks
   regulasi (UU PDP). Menghalangi pemain global masuk murah, walau bisa ditiru pemain lokal lain.

**Kesimpulan:** ubah head start (eksekusi + konteks lokal) → menjadi **konten + data agregat +
switching cost** (moat yang menumpuk). Head start dipakai untuk *memulai dengan benar*, bukan
diandalkan sebagai pembeda permanen.

## 5. Risiko kompetitif

- **Registrar/WHMCS menambah tampilan lintas-registrar + penagihan** → mitigasi: lebih ringan,
  lebih murah, berbahasa Indonesia, fokus alur WhatsApp lokal yang tidak mereka urus; head start
  SEO + switching cost lebih dulu.
- **Pendatang lokal meniru** → mitigasi: head start di SEO + data agregat lebih dulu (keduanya
  menumpuk, pemenang-pertama diuntungkan).
- **Spreadsheet + email registrar "cukup bagus"** (kompetitor paling mematikan) → mitigasi: kita
  jual *lintas-registrar + alert bertingkat + draf tagihan WA*, yakni pekerjaan yang spreadsheet
  tidak lakukan — bukan sekadar daftar tanggal yang memang bisa dicatat gratis.

---

*Angka harga kompetitor di §1 adalah arsip. Poin terpenting dokumen ini: jangan bergantung pada
keahlian founder sebagai moat — konversikan ke aset yang menumpuk (konten, data agregat, switching cost).*

# Model Finansial — angka untuk divalidasi

> ## ⚠️ Catatan rekonsiliasi (23 Nov 2026, badan dokumen diselaraskan 24 Nov 2026)
>
> Dokumen ini awalnya ditulis untuk produk **security scanner**. Produk sudah berubah jadi
> **monitoring perpanjangan domain/hosting/SSL + penagihan WA** (`peta-produk.md`). Struktur,
> metode, dan logika tetap berlaku; badan dokumen kini sudah diselaraskan dengan produk baru.
> Empat catatan substantif yang tetap hidup:
>
> **1. Harga bertabrakan dengan dokumen PDF.**
> | Sumber | Tier menengah | Tier atas |
> |--------|---------------|-----------|
> | Dokumen ini | Rp99rb (3 domain) | Rp399rb (25 domain) |
> | PDF Blueprint | Rp99rb (25 aset) | Rp199rb (100 aset) |
>
> Perbedaannya besar (Rp399rb vs Rp199rb untuk kapasitas yang jauh berbeda). **Belum ada yang
> benar — keduanya tebakan.** Uji keduanya di `validasi.md` §6. Catatan: harga PDF jauh lebih
> murah per aset, cocok untuk penetrasi cepat; harga di dokumen ini lebih sehat untuk
> keberlanjutan. Jangan kunci sebelum ada data.
>
> **2. Proyeksi PDF mengasumsikan churn NOL.** Grafik 6 bulan di PDF (3→10→20→32→44→56) adalah
> penjumlahan murni, padahal SWOT di dokumen yang sama menyebut churn sebagai kelemahan nomor satu.
> Pakai asumsi churn 3–8%/bulan dari §6, perlakukan grafik PDF sebagai **skenario terbaik, bukan target**.
>
> **3. "BEP 3 pelanggan" menyesatkan secara halus.** Itu impas terhadap biaya kas saja, dengan
> **waktu founder dihargai Rp0**. 6 bulan × 20 jam/minggu ≈ 520 jam kerja. Sebagai side hustle
> mungkin wajar — tapi jangan sampai angka itu memberi rasa aman berlebihan.
>
> **4. Biaya variabel turun** untuk produk ini. Query RDAP/TLS harian jauh lebih ringan daripada
> scan keamanan, dan hasilnya bisa di-cache 24 jam. Estimasi ~Rp500/domain/bln di §2 kemungkinan
> **terlalu tinggi** sekarang.

> **Semua angka di sini adalah HIPOTESIS, bukan kebenaran.** Fungsinya: memberi target konkret yang
> bisa diuji di `validasi.md` (§6 menguji reaksi atas angka harga). Perbarui begitu ada data nyata.
> Mata uang: Rupiah, asumsi pasar awal Indonesia.

## 1. Hipotesis harga (tiga tier)

| Tier | Harga/bln | Untuk siapa | Batasan | Fungsi |
|------|-----------|-------------|---------|--------|
| **Gratis** | Rp0 | Siapa pun lewat `/tools` (mahasiswa, developer, pemilik blog) | 1 domain, cek instan, tanpa simpan | Corong akuisisi & SEO |
| **Pro** | **Rp99rb** | Freelancer web dev yang kelola sedikit klien | 3 domain tersimpan, cek harian, alert email, draf tagihan WA | Pendapatan volume |
| **Agency** | **Rp399rb** | Agensi mikro / freelancer dengan banyak klien | 25 domain, cek harian, laporan white-label, dashboard multi-klien, draf tagihan WA | **Pendapatan utama** |

Catatan: **Agency adalah fokus** (lihat `target-pasar.md`) — satu pelanggan = banyak domain, rasa
sakit nyata (laporan = bukti nilai ke klien, dan tiap bulan menagih perpanjangan). Pro ada untuk
menangkap freelancer kecil dari segmen yang sama tanpa usaha penjualan tambahan. **Tier gratis &
berbayar melayani ICP yang sama** (agensi/freelancer) — bukan segmen berbeda; orang umum di tier
gratis hanya lalu lintas insidental (`target-pasar.md`).

### Kenapa angka ini (logika, bukan tebakan buta)
- **Rp399rb untuk 25 domain = ~Rp16rb/domain/bln.** Murah cukup untuk impulse-buy tanpa meeting,
  tapi tidak "murahan". Bandingkan dengan nilai yang diselamatkan: satu fee perpanjangan domain
  klien yang tak terlewat sudah menutup langganan berbulan-bulan.
- **Rp99rb** = titik psikologis di bawah Rp100rb; sebanding langganan SaaS kecil lain yang sudah biasa dibayar developer.
- Harga ini **sengaja rendah** karena model product-led: tidak ada biaya sales yang harus ditutup.

## 2. Biaya per domain (unit cost)

Pengecekan harian **RDAP + TLS** itu sangat ringan: beberapa query read-only per domain, hasilnya
di-cache minimal 24 jam (lihat `rilis-1.md` & `etika-legal.md`).

| Komponen | Estimasi |
|----------|----------|
| Compute (VPS kecil 2vCPU/4GB ~Rp200rb/bln, muat ribuan domain cek harian ringan) | **~Rp200 / domain / bln** |
| Email transaksional (alert bertingkat) | ~Rp0 pada skala awal (tier gratis provider) |
| Penyimpanan hasil + laporan | Dapat diabaikan |
| **Total biaya variabel** | **~Rp300 / domain / bln** (konservatif; lebih rendah dari estimasi scanner lama) |

## 3. Unit economics per tier

| | Pro (3 domain) | Agency (25 domain) |
|---|---|---|
| Pendapatan/bln | Rp99rb | Rp399rb |
| Biaya variabel (domain × Rp300) | ~Rp0,9rb | ~Rp7,5rb |
| **Gross margin** | **~99%** | **~98%** |

Margin khas SaaS yang sehat. **Pengungkit utama bukan margin, tapi akuisisi** (berapa banyak
pelanggan bisa didatangkan tanpa biaya sales).

### Biaya tier gratis (jangan diabaikan)
Setiap pengguna gratis = biaya nyata kecil + permukaan penyalahgunaan (scraping registry lewat tool
massal — lihat `etika-legal.md`). **Batasi keras**: 1 domain, tanpa simpan, rate limit per IP.
Anggap biaya tier gratis sebagai **biaya marketing**, dan pantau rasionya terhadap konversi berbayar.

## 4. Biaya tetap (solo founder, tanpa gaji ditarik)

| Item | Per bln |
|------|---------|
| Infra dasar (VPS, DB, domain, email service) | ~Rp500rb |
| Payment gateway lokal (Xendit/Midtrans, ~3% + fee) | variabel |
| Tools/langganan (monitoring, dsb) | ~Rp300rb |
| **Total tetap** | **~Rp1jt/bln** (fase awal, bootstrap) |

> **Detail lokal penting:** gunakan **Xendit atau Midtrans**, bukan Stripe — Stripe belum mendukung
> payout ke entitas Indonesia dengan baik. Gateway lokal mendukung QRIS, VA bank & e-wallet yang
> dipakai target pasar.

## 5. Titik impas & ambang target

Dengan biaya tetap ~Rp1jt/bln dan margin ~98%:

| Tujuan | Butuh (kira-kira) |
|--------|-------------------|
| **Impas** (tutup biaya tetap) | ~3 pelanggan Agency, atau ~11 Pro |
| **Penghasilan sampingan** (~Rp5jt/bln profit) | ~15 Agency, atau campuran setara |
| **Penghasilan utama** (~Rp15jt/bln profit) | ~40 Agency, atau campuran setara |

Angka ini **kecil dan dapat dicapai** — itulah daya tarik model lean ini. 40 agensi berbayar adalah
target realistis untuk produk niche yang bagus, bukan mimpi unicorn. (Ingat catatan banner #3: impas
kas ≠ waktu founder terbayar.)

## 6. LTV / CAC

- **ARPU** (asumsi mayoritas Agency): ~Rp300rb/bln.
- **Churn hipotesis**: 3–8%/bln. Pada 3% → umur rata-rata pelanggan ~33 bln; pada 8% → ~12 bln.
  Retensi inilah variabel paling menentukan — lihat `retensi.md` (jangkar utamanya: ritme tagihan WA bulanan).
- **LTV** ≈ Rp300rb × 0,98 × 33 ≈ **~Rp9,7jt** (skenario churn rendah).
- **CAC**: model product-led → CAC *tunai* mendekati nol (akuisisi lewat SEO/konten/tier gratis).
  Biaya sebenarnya = **waktu founder menulis konten**.
- Selama CAC tunai rendah, rasio LTV/CAC sangat sehat. **Risiko terbesar bukan ekonomi per-pelanggan,
  tapi volume** — apakah konten cukup mendatangkan orang — **dan churn**, bukan margin.

## 7. Ambang "layak dilanjutkan" (hubungkan ke `validasi.md`)

Fase validasi dinyatakan **berhasil** (lanjut bangun Tahap 2) bila minimal salah satu:

- **≥3–5 agensi** dari segmen target bilang mau bayar **≥Rp200rb/bln** (bukan sekadar "menarik"), atau
- **Waitlist ≥50 pendaftar berkualitas** dari landing page, atau
- **≥1 pre-order dibayar di muka** (sinyal terkuat).

Bila semua bilang "menarik" tapi tak ada yang bayar → pesan/segmen belum pas. Pertajam atau pivot
(sesuai `validasi.md`).

## 8. Risiko finansial yang disadari

1. **WTP Indonesia rendah** (budaya enggan bayar software). Produk ini "obat" (web mati = bencana
   langsung), bukan "vitamin" — itu membantu, tapi jangan asumsikan WTP otomatis tinggi. Mitigasi:
   fokus Agency (punya anggaran operasional & motif reputasi ke klien), framing "menyelamatkan fee
   perpanjangan & memudahkan menagih" (uang masuk, bukan sekadar biaya), siapkan rencana ekspansi
   global lebih awal bila WTP lokal terbukti tipis.
2. **Churn karena "tidak ada yang jatuh tempo bulan ini → merasa tak perlu bayar".** Ini paradoks
   retensi produk monitoring. Mitigasi utama: **generator draf tagihan WA** membuat pengguna
   *menghasilkan uang tiap bulan* (bukan sekadar menunggu alarm) + laporan berkala "status aman"
   sebagai bukti nilai. Detail di `retensi.md`.
3. **Biaya gratis membengkak** bila konversi rendah atau tool massal disalahgunakan untuk scraping.
   Mitigasi: batasan keras tier gratis + rate limit + pantau rasio gratis→berbayar sebagai metrik utama.

---

*Angka di dokumen ini adalah titik awal untuk diuji, bukan proyeksi final. Perbarui kolom harga &
churn segera setelah percakapan validasi pertama.*

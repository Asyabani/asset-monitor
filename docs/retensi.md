# Retensi — melawan churn

> ## ⚠️ Catatan rekonsiliasi (23 Nov 2026, badan dokumen diselaraskan 24 Nov 2026)
>
> Awalnya ditulis untuk security scanner, tapi **paradoks intinya berlaku persis sama** untuk produk
> sekarang: kalau tak ada aset yang hampir jatuh tempo bulan ini, pelanggan merasa tak perlu membayar.
> Badan dokumen kini sudah diselaraskan ke produk monitoring aset + penagihan WA.
>
> **Yang berubah: jawabannya jadi jauh lebih kuat.** Produk baru punya senjata yang tidak dimiliki
> security scanner — **generator draf tagihan WhatsApp**:
>
> | | Security scanner | Produk sekarang |
> |---|---|---|
> | Nilai saat "aman" | Hanya laporan "tidak ada masalah" (pasif) | Pengguna **menagih klien & dapat uang** (aktif) |
> | Arah nilai | Mencegah kerugian hipotetis | Menghasilkan pendapatan nyata |
>
> Produk yang membuat pengguna **menghasilkan uang tiap bulan** jauh lebih sulit dibatalkan daripada
> produk yang sekadar mencegah kerugian. **Ritme penagihan bulanan = jangkar retensi utama;** mekanisme
> lain di bawah jadi pendukung.
>
> Retensi, bukan akuisisi, yang menentukan apakah bisnis ini bertahan — ia input langsung ke LTV di
> `model-finansial.md` (§6).

## 1. Masalah inti: paradoks "tidak ada yang jatuh tempo"

Produk monitoring punya jebakan unik:

- Kalau **ada** aset jatuh tempo terus → bagus, nilai terasa jelas.
- Kalau **tidak ada** yang jatuh tempo bulan ini → pelanggan merasa "ngapain bayar, kan aman-aman
  aja" → **churn**.

Artinya: nilai produk harus terasa **justru saat tidak ada yang mendesak**. Ini inti seluruh strategi retensi.

**Jawaban terkuat produk ini:** penagihan tidak menunggu ada yang "nyaris kedaluwarsa". Agensi
menagih perpanjangan ke klien **setiap siklus**, dan draf tagihan WA membuat itu satu klik — jadi
pengguna mendapat nilai (uang masuk) tiap bulan, terlepas dari ada-tidaknya alarm. Jangkar inilah
yang membedakan produk ini dari sekadar "alarm yang kadang berbunyi".

## 2. Mekanisme retensi (urut dari paling penting)

### a. Ritme penagihan bulanan (jangkar utama)
- **Generator draf tagihan WA** mengubah tiap siklus perpanjangan jadi pendapatan nyata bagi
  pengguna. Selama pengguna menagih lewat produk kita, membatalkan langganan = kehilangan alur
  pendapatannya sendiri. Ini pertahanan churn terkuat; `konsep-produk.md` menyebutnya fitur paling bernilai.

### b. Ubah "tidak ada yang jatuh tempo" jadi bukti nilai yang terlihat
- **Laporan berkala "status aset"** — ringkasan rutin: *"25 aset dipantau, X pengecekan dijalankan,
  0 terlewat, Y tagihan dibuat bulan ini."* Membuat ketiadaan masalah terasa seperti *kerja yang
  dibayar*, bukan keheningan.
- **Tren dari waktu ke waktu** — "semua aset klienmu sehat 3 bulan berturut-turut". Orang bertahan demi melindungi progres.

### c. Jadikan laporan layak diteruskan (khusus Agency)
- Agensi meneruskan laporan ke **kliennya** sebagai bukti kerja. Setiap laporan terkirim = agensi
  makin tergantung pada kami (switching cost, `kompetitor.md` #2).
- Laporan white-label = agensi terlihat profesional → mereka tak mau berhenti.

### d. Relevansi lewat alert yang tepat waktu
- Alert bertingkat H-30/14/7/3 saat aset mendekati jatuh tempo menjaga produk tetap "hidup" di benak
  pengguna. **Dan** — khusus produk ini — alert saat pengecekan **GAGAL**, bukan hanya saat ada
  temuan (lihat `legal-liability.md` §4): itu menjaga kepercayaan sekaligus mencegah churn karena "kok diam".

### e. Switching cost yang menumpuk
- Daftar aset klien, harga jual perpanjangan, dan riwayat tagihan menumpuk di dalam sistem seiring
  waktu. Makin lama dipakai, makin mahal untuk pindah atau kembali ke spreadsheet.

### f. Komitmen & diskon tahunan
- Tawarkan langganan **tahunan dengan diskon** → mengunci retensi 12 bulan, memperbaiki arus kas, menurunkan churn bulanan.

### g. Onboarding → kebiasaan
- Minggu pertama menentukan: pastikan pengguna sampai ke **"momen aha"** (daftar aset pertama
  terpantau, atau draf tagihan pertama terkirim) secepatnya. Di sinilah impor CSV/tempel massal
  krusial (`mvp-scope.md`) — banyak pengguna menyerah saat input manual. Aktivasi kuat menurunkan churn dini.

## 3. Metrik retensi yang dipantau (lengkapi `validasi.md`)

| Metrik | Kenapa penting |
|--------|----------------|
| **Churn bulanan (%)** | Input langsung ke LTV di `model-finansial.md` |
| **% pengguna yang membuat draf tagihan WA tiap bulan** | Sinyal jangkar retensi utama bekerja |
| **% pengguna buka laporan ke-2, ke-3, dst** | Kebiasaan terbentuk |
| **% aset terverifikasi/aktif vs didaftarkan** | Aktivasi — gerbang menuju retensi |
| **% ambil langganan tahunan** | Retensi terkunci |
| **Net revenue retention** (upgrade/tambah aset − churn) | Apakah pelanggan yang bertahan tumbuh |

## 4. Tanda bahaya

- Churn > 5%/bln konsisten → nilai tak terasa; periksa apakah alur tagihan WA benar-benar dipakai,
  atau laporan "status aset" cukup menonjol, atau segmen salah.
- Banyak yang daftarkan aset tapi tak pernah buat tagihan / buka laporan kedua → masalah
  aktivasi/onboarding, bukan produk.
- Agency churn ≈ Pro churn → switching cost Agency belum terbangun; perdalam integrasi alur kerja mereka.

---

*Prinsip tunggal: pada produk monitoring, nilai harus terasa paling kuat justru ketika tidak ada yang
mendesak. Senjata khas produk ini — penagihan WA yang membuat pengguna menghasilkan uang tiap bulan —
mengubah "bulan yang sepi" menjadi "bulan yang tetap menghasilkan", dan itulah pertahanan churn terbaik.*

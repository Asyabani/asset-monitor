# HANDOFF — konteks lengkap untuk melanjutkan

Dokumen ini mandiri. Dibuat agar AI/tool apa pun bisa melanjutkan pengembangan ide ini tanpa riwayat percakapan sebelumnya.

> **Mulai dari sini, lalu baca `docs/peta-produk.md`.** Kalau ada dokumen lain yang bertentangan dengan peta produk, **peta produk yang menang**.

## Ini satu dari dua proyek

| | `web-asset-monitor` (ini) | `../security-test/` |
|---|---|---|
| Masalah | Aset klien kedaluwarsa & fee perpanjangan tak tertagih | Lubang keamanan tak terdeteksi |
| Sifat | **Obat** — web mati = bencana langsung | **Vitamin** — gampang ditunda |
| Disarankan dibangun | **Pertama** | Setelah yang pertama punya arus kas |

Mesin dasarnya sama (DNS/RDAP/TLS) dan **harus jadi library bersama** — detail di `docs/hubungan-proyek.md`.

## Peta dokumen

| Dokumen | Isi | Kapan dibaca |
|---------|-----|--------------|
| `docs/peta-produk.md` | ⭐ Ruang lingkup, 2 mode, 3 tahap | **Sekarang** — penentu segalanya |
| `docs/rilis-1.md` | Cakupan yang dibangun sekarang (apa & kenapa) | **Sekarang** — pekerjaan aktif |
| `docs/rilis-1-teknis.md` | Spesifikasi teknis Rilis 1 (bagaimana) | **Sekarang** — sebelum ngoding |
| `docs/validasi.md` | Validasi asinkron + kill-switch | Bersamaan dengan Rilis 1 |
| `docs/hubungan-proyek.md` | Mesin bersama & urutan eksekusi | Sebelum mulai ngoding |
| `docs/konsep-produk.md` | Kenapa produknya begini | Konteks dasar |
| `docs/target-pasar.md` | Siapa pembelinya | Saat menyusun pesan |
| `docs/model-finansial.md` | Harga, unit economics, ambang lanjut | Saat uji harga |
| `docs/kompetitor.md` | Kompetitor + moat | Saat menyusun positioning |
| `docs/retensi.md` | Melawan churn | Saat merancang laporan & alert |
| `docs/mvp-scope.md` | Cakupan Tahap 2 | **Jangan dibuka** sebelum validasi lolos |
| `docs/etika-legal.md` | Batas pengecekan & guardrail | **Wajib** sebelum menulis mesin cek |
| `docs/legal-liability.md` | Disclaimer, ToS, keamanan data | **Wajib** sebelum menerima bayaran |

## Siapa pemiliknya (konteks founder)

- Latar teknis kuat: pernah membangun marketplace (Svelte + Go), punya latar **penetration testing / keamanan web**.
- **Batasan yang membentuk seluruh model bisnis:** kurang nyaman dengan komunikasi & penjualan tatap muka. Maka model harus **self-serve / product-led** — produk menjual dirinya sendiri, komunikasi berupa tulisan asinkron (dokumentasi, artikel, email), **bukan** telepon/demo/negosiasi.
- Kapasitas: sekitar 10–20 jam/minggu (side hustle).

> ✅ **Dikonfirmasi 24 Nov 2026:** pembagian peran sudah jelas — **seluruh pengerjaan teknis (engineering) dikerjakan founder sendiri (solo)**; **pemasaran/growth ditangani orang kedua, tapi bergabung belakangan ("nanti")**. Implikasi: timeline *build* memakai estimasi solo (`rilis-1-teknis.md` §9, ~3–4 minggu untuk Rilis 1), bukan "4–6 minggu" versi tim di PDF — orang pemasaran bukan peran teknis, jadi tidak mempercepat ngoding. **Catatan sekuens penting:** pada fase validasi awal (concierge + sebar Rilis 1) orang pemasaran kemungkinan belum ada, jadi outreach asinkron awal tetap di tangan founder. Pertahankan pendekatan **product-led & asinkron** (`validasi.md`) — jangan beralih ke penjualan tatap muka meski nanti ada orang pemasaran (itu melanggar batasan founder yang membentuk seluruh model bisnis).

## Produk

**Siklus hidup aset web klien: domain, hosting, SSL — dan penagihannya.**

- **Mode sekali cek** — gratis, tanpa login, di `/tools`. Fungsinya corong SEO, **bukan** sumber pendapatan.
- **Mode dipantau terus** — berlangganan, di `/app`. **Ini produknya.**

Di luar lingkup: pemeriksaan keamanan (proyek sebelah), uptime per menit (wilayah UptimeRobot), performa/PageSpeed.

### Fitur paling bernilai

**Generator draf tagihan WhatsApp satu klik.** Monitoring mudah ditiru — registrar bahkan sudah mengingatkan gratis. Yang sulit ditiru adalah mengubah *"domain klien X jatuh tempo H-30"* jadi **draf tagihan bermargin siap kirim**.

Ini mengubah produk dari *mencegah rugi* menjadi *membantu pengguna menghasilkan uang*, sekaligus menjawab masalah retensi. **Jadikan headline, bukan fitur pendukung.**

## Pembeli

Freelancer web developer & agensi mikro (1–5 orang) Indonesia yang mengelola **5–50 situs klien**. Sudah diputuskan, jangan dibuka lagi.

Pengguna umum boleh memakai tool gratis, tapi **jangan pernah mendesain untuk mereka** — mereka cek sekali lalu pergi dan tidak pernah membayar. *Dipakai umum ≠ dirancang untuk umum.*

## Risiko yang sudah diidentifikasi

1. **Kompetitor sebenarnya gratis** — email pengingat registrar, spreadsheet, Google Calendar. Bukan WHMCS/UptimeRobot. Pembeda harus ada di **lintas-registrar + alur penagihan**, bukan di pemantauannya. → `kompetitor.md`
2. **Churn** — kalau tak ada yang hampir kedaluwarsa, pelanggan merasa tak perlu bayar. Dijawab oleh draf tagihan WA (nilai tiap bulan). → `retensi.md`
3. **Proyeksi PDF mengasumsikan churn nol** — bertentangan dengan SWOT-nya sendiri. Perlakukan sebagai skenario terbaik. → `model-finansial.md`
4. **"BEP 3 pelanggan" menyesatkan** — impas kas saja, waktu founder dihargai Rp0.
5. **Cold-start data** — hosting tidak bisa dideteksi otomatis; harus input manual. Titik gesekan onboarding terbesar. Wajib impor CSV/tempel massal. → `mvp-scope.md`
6. **Rate limit & pemblokiran IP registry** — antrean + jeda acak + cache 24 jam, sejak hari pertama. Baca juga ketentuan penggunaan data registry.
7. ~~**RDAP vs WHOIS**~~ — ✅ **SELESAI 23 Nov 2026.** RDAP terbukti berfungsi untuk `.id`/`.go.id` lewat `rdap.org`. Risiko ini gugur. Catatan baru: RDAP tidak melayani subdomain, jadi Tahap 2 perlu normalisasi ke *registrable domain* (Public Suffix List). Bukti: `scripts/cek-domain.py`.
8. **Scraping registry lewat tool massal gratis** — batasi per IP & per permintaan. → `etika-legal.md`
9. **Data pribadi pihak ketiga** — nama & nomor WA klien pengguna tetap tunduk UU PDP. → `etika-legal.md`
10. **WTP Indonesia rendah** — siapkan rencana ekspansi bila terbukti tipis. → `model-finansial.md`
11. **Gagal diam-diam (silent failure)** — cron mati / alert masuk spam / RDAP gagal, pengguna mengira aman, domain klien hilang permanen. Kerugiannya jauh melebihi harga langganan dan kita yang disalahkan. **Wajib:** tampilkan "terakhir berhasil dicek", kirim notifikasi saat pengecekan **gagal**, dan pasang *dead-man's switch*. → `legal-liability.md`
12. **Harga jual perpanjangan = margin dagang agensi** tersimpan di database kita. Bocor ke klien mereka = hubungan bisnis pengguna rusak. Perlakukan setara rahasia dagang. → `legal-liability.md`

## Langkah berikutnya

1. ~~Konfirmasi solo atau berdua~~ — ✅ **selesai 24 Nov 2026.** Lihat blok konfirmasi di atas: engineering solo, orang kedua pemasaran & bergabung belakangan.
2. ~~Cek dukungan RDAP untuk `.id` (PANDI)~~ — ✅ **selesai 23 Nov 2026.** Lihat risiko #7.
3. **→ SEKARANG: validasi concierge.** Founder memutuskan 24 Nov 2026 untuk **memvalidasi dulu sebelum ngoding**. Alat & teksnya sudah siap di `scripts/` (`cek-domain.py` + `template-komunikasi.md`). Posting ke 2–3 komunitas, balas manual, catat jumlah domain per orang.
4. **Baca perilaku**, bukan opini. Sinyal terkuat = jumlah domain yang dikirim per orang. Ambang lanjut di `validasi.md`.
5. **Baru bangun Rilis 1** (`docs/rilis-1.md` + `docs/rilis-1-teknis.md`) kalau ambang tercapai. **Hanya itu.**
6. Baru buka `mvp-scope.md` untuk Tahap 2.

> ⚠️ **Jangan mulai ngoding Rilis 1 sebelum langkah 3–4 selesai.** Ini keputusan sadar founder, bukan kelalaian. Alasannya: validasi concierge memakan ~1 hari dan menjawab pertanyaan yang Rilis 1 butuh 3–4 minggu untuk menjawabnya.
>
> **Satu-satunya pengecualian:** mem-*port* `scripts/cek-domain.py` jadi library `web-scan-engine` (lihat `hubungan-proyek.md`) adalah pekerjaan nol-sia-sia — logikanya sudah terbukti dan dipakai kedua proyek apa pun hasil validasinya.

## Catatan untuk AI yang melanjutkan

- **Jangan dorong ke penjualan enterprise/high-touch** — melanggar batasan founder.
- **Jangan dorong rencana yang butuh banyak wawancara/telepon.** Versi lama `validasi.md` menyuruh 10–15 wawancara; sudah dibuang karena bertabrakan dengan batasan founder. Semua validasi harus asinkron atau berbasis perilaku.
- **Jangan bangun fitur di luar `rilis-1.md`** sebelum ambang validasi tercapai. Scope explosion adalah risiko kematian nomor satu.
- **Jangan tambahkan pemeriksaan keamanan ke produk ini.** Itu proyek terpisah; menambahkannya membawa serta beban etis & hukum probing. → `etika-legal.md`
- **Jangan tambahkan PageSpeed, file checker, phishing checker, atau uptime per menit.** Sudah ditolak dengan alasan tertulis di `peta-produk.md` §5.
- **Jangan tulis mesin DNS/RDAP/TLS dua kali** untuk dua proyek. → `hubungan-proyek.md`
- **Angka finansial adalah hipotesis, bukan fakta.** Perbarui setelah ada data nyata.
- Bahasa kerja: **Indonesia**.

## Status & riwayat

- **Tahap:** Rilis 1 — **scaffold terbangun & terverifikasi** (`web/`). Langkah dunia-nyata berikutnya tetap **validasi** (sebar + baca perilaku) sebelum Tahap 2.
- **23 Nov 2026 (pagi):** paket dokumen dilengkapi 5 → 9 dokumen (model finansial, kompetitor, retensi, legal-liability).
- **23 Nov 2026 (sore):** dua ide yang bersaing disatukan jadi satu peta bertingkat; folder di-rename dari `security-test` → `web-asset-monitor`; `validasi.md` diubah total jadi asinkron; `etika-legal.md` diperbarui; `konsep-produk.md` & `mvp-scope.md` ditulis ulang.
- **23 Nov 2026 (malam):** **user memutuskan memecah jadi dua proyek terpisah.** Seluruh pemeriksaan keamanan dikeluarkan dari produk ini dan pindah ke `../security-test/` sebagai proyek mandiri. `peta-produk.md` dipersempit jadi murni siklus hidup aset; `etika-legal.md` disederhanakan (produk ini nyaris seluruhnya pemeriksaan pasif); ditambahkan `hubungan-proyek.md`.
- **24 Nov 2026 (tahap 1 & 2 — bersih-bersih pasca-pivot):** empat dokumen hasil-pivot yang sebelumnya hanya diperbaiki lewat banner kini **badan dokumennya diselaraskan** ke produk sekarang:
  - `legal-liability.md` ditulis ulang penuh — disclaimer §2 kini "alat pengingat, bukan jaminan" (bukan lagi "bukan pengganti audit keamanan/pentest"); §4 "jangan gagal diam-diam" jadi seksi penuh; §5 data sensitif = portofolio aset + margin dagang + kontak klien pihak ketiga; §9 checklist disetel ulang.
  - `kompetitor.md` §2–§5 ditulis ulang (positioning jadi monitoring aset + penagihan WA; §1 dipertahankan sebagai arsip milik `security-test`).
  - `model-finansial.md` §1–§8 diselaraskan (tier untuk ICP terkunci agensi/freelancer, biaya variabel RDAP/TLS lebih rendah, risiko #1 dikoreksi: produk ini "obat" bukan "vitamin").
  - `retensi.md` ditulis ulang (jangkar retensi = ritme tagihan WA bulanan, bukan lagi framing "paradoks tidak ada temuan keamanan").
- **24 Nov 2026 (tahap 3):** ditambahkan `docs/rilis-1-teknis.md` — spesifikasi teknis konkret Rilis 1 (arsitektur, model data, endpoint, strategi port skrip, instrumentasi metrik). **Mengandung dua asumsi default yang perlu dikonfirmasi founder:** (a) founder **solo**, (b) stack **Go (engine + backend) + SvelteKit (frontend) + SQLite**. Keduanya ditandai di dokumen dan mudah diubah.
- **24 Nov 2026 (keputusan founder):** (a) peran dikonfirmasi — engineering solo, orang kedua pemasaran & menyusul; (b) **jalur yang dipilih: validasi concierge dulu, ngoding belakangan**; (c) `scripts/` dilengkapi — `cek-domain.py` diberi fallback subdomain → domain induk (`www.klien.co.id` → `klien.co.id`, ditandai "dicek sebagai ..."), plus `template-komunikasi.md` berisi teks siap tempel untuk posting, balasan, pengiriman hasil, dan satu pertanyaan validasi soal penagihan.
- **24 Nov 2026 (keputusan stack + scaffold Rilis 1):** founder memilih membangun scaffold Rilis 1 **paralel** dengan validasi. Keputusan terbuka ditutup: (a) **engineering solo** (pemasaran orang kedua, menyusul); (b) **stack SvelteKit full-stack + TypeScript + SQLite** — Go belum terpasang di mesin dev, dan satu codebase paling cepat untuk solo (`mvp-scope.md`: kecepatan > stack "benar"). Konsekuensi: `web-scan-engine` jadi **TS** (bukan Go), ditulis terisolasi di `web/src/lib/server/engine/` agar bisa diekstrak/di-port saat `security-test` dimulai.
- **24 Nov 2026 (scaffold dibangun & diuji):** `web/` berisi app SvelteKit lengkap untuk Rilis 1 — engine (normalize+PSL `tldts`, rdap, tls, status, rate limiter global, orkestrasi), SQLite (`better-sqlite3`) + repo, worker batch in-process + cache 24 jam, 4 endpoint API (`check`, `batch/[slug]`, `waitlist`, `event`), UI `/tools` (Form A+B) + halaman hasil `/r/[slug]` dengan polling + CTA email + bagikan, instrumentasi event, guardrail (≤50 domain, batas per-IP via hash, UA jujur). **Terverifikasi:** `npm run check` 0 error, test engine 4/4, `npm run build` sukses, smoke test end-to-end (`www.kompas.id`→`kompas.id` via PSL, RDAP `.id` jalan, SSL kebaca, domain invalid tidak merusak batch, event tercatat). Cakupan dikunci ke `rilis-1.md` — tidak ada fitur Tahap 2.
- **24 Nov 2026 (redesign total UI — "Register of Record"):** seluruh tampilan `web/` diredesain lewat skill frontend (impeccable), mengganti dashboard gelap generik dengan dunia visual **security-print register** — tinta oxblood, kertas-sekuriti celadon (bukan krem), guilloché generatif (SVG hypotrochoid), segel validitas + stempel status, kolom ber-ruled, tipografi Archivo + Spline Sans Mono. Fungsi/route/API/bahasa tidak berubah. Arah dipilih user (berani & berkarakter; wordmark tetap "web-asset-monitor"; ketiga surface). Lolos finish-review (disposition: ship, 0 regresi) + detektor bersih. Sistem desain terekam di **`web/DESIGN.md`** + `web/.impeccable/design.json`; kebenaran produk di **`web/PRODUCT.md`**. Catatan: nama "web-asset-monitor" dipakai sebagai wordmark **sementara** — belum merek final (wajib penelusuran PDKI sebelum dikunci).
- **Sumber tambahan:** dua PDF & tiga gambar di `~/Downloads` (*Riset Ide Produk Side Hustle*, *Blueprint & Spesifikasi Teknis MVP*, BMC, proyeksi 6 bulan, alur 2 peran) — sudah dibaca dan diserap. Bagian terbaiknya (aturan kill-switch, 5 modul MVP, generator tagihan WA) dipertahankan; bagian bermasalahnya (churn nol, validasi berbasis wawancara) sudah dikoreksi.

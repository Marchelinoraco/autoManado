# Audit SEO — AutoManado (automanado.com)

**Tanggal audit:** 1 Juni 2026
**Tujuan situs:** Mendapatkan klien sewa/jual mobil di Kota Manado & Sulawesi Utara
**Model bisnis:** Marketplace tanpa modal — mobil milik mitra, fokus pemilik = cari klien lewat WhatsApp

---

## Ringkasan eksekutif

Fondasi teknis SEO situs Anda **sudah sangat baik** (skor ±8/10). Ini di atas rata-rata situs rental mobil lokal. Yang membuat Anda *belum* nomor satu **bukan** soal kode, melainkan tiga hal di luar kode:

1. **Local SEO / Google Business Profile** — di Manado, hasil pencarian "rental mobil manado" didominasi peta (Local Pack). Ini medan tempur utama Anda, dan menang di sini **gratis**.
2. **Jumlah & kualitas review** — situs baru punya ±3 testimoni. Pesaing punya puluhan review Google.
3. **Kedalaman konten** — belum ada blog/artikel. Ini cara gratis menang di kata kunci "ekor panjang" (long-tail).

Kabar baik: 6 bug/kelemahan teknis sudah saya perbaiki langsung di kode hari ini (lihat bagian "Yang sudah diperbaiki"). Sisanya adalah pekerjaan rutin yang akan dipandu agent harian + dokumen strategi.

**Realita persaingan (jujur):** Kata kunci utama "rental mobil manado" dikuasai agregator nasional berdomain kuat (Traveloka, Salsa Wisata, Niagatour, Global Transport, dll). Menyalip mereka di hasil organik #1 butuh waktu 6–12 bulan. **Tapi** Anda bisa menang **lebih cepat** di: (a) Local Pack/Maps, (b) kata kunci spesifik seperti "sewa alphard manado", "rental hiace manado lepas kunci", "sewa mobil bandara sam ratulangi".

---

## Yang SUDAH bagus di situs Anda

| Aspek | Status |
|---|---|
| Meta title, description, keywords, canonical | Lengkap di semua halaman |
| Open Graph & Twitter Card | Ada (gambar OG dinamis) |
| robots.txt | Benar — `index, follow`, blok `/admin` & `/api`, link sitemap |
| sitemap.xml | Aktif & dinamis (landing page + semua mobil) |
| Structured data (Schema.org) | AutoRental, FAQPage, BreadcrumbList, Car, Offer, AggregateRating |
| Landing page per layanan | 4 halaman (rental, lepas kunci, dengan sopir, jual bekas) |
| Mobile-friendly & kecepatan | Next.js SSR + `revalidate`, gambar dioptimasi (Cloudinary) |
| Konten landing page | Cukup kaya keyword & natural (bukan spam) |
| CTA WhatsApp | Jelas, dengan pesan pre-fill — bagus untuk konversi |

---

## Masalah yang DITEMUKAN & statusnya

### ✅ Sudah saya perbaiki di kode (siap deploy ulang)

1. **Judul ganda "| AutoManado | AutoManado"** — 4 landing page menulis "| AutoManado" padahal template layout sudah menambahkannya otomatis, jadi muncul dobel. Judul kepanjangan & terlihat tidak profesional di hasil Google. → Dirapikan jadi satu brand saja.

2. **Statistik tampil "0+" untuk Google** — angka (50+ mobil, 1200+ klien, 8 thn, 25+ mitra) dibuat dengan animasi yang mulai dari 0. Crawler & pengguna tanpa JavaScript melihat **"0+"** — sinyal kepercayaan yang buruk. → Sekarang server langsung menampilkan angka asli; animasi tetap jalan saat di-scroll.

3. **Gambar `og-image.jpg` error 404 di structured data** — `lib/site.ts` merujuk `/og-image.jpg` yang **tidak ada** di folder `public`. Akibatnya gambar di data bisnis (LocalBusiness) rusak, bisa menggagalkan rich result. → Diarahkan ke endpoint OG dinamis bawaan Next yang selalu valid.

4. **Open Graph per landing page** — dulu semua landing page memakai judul/URL OG milik homepage. Saat dibagikan ke WhatsApp/Facebook, link landing page tampil seperti homepage. → Tiap landing page kini punya OG sendiri.

5. **`priceRange` di schema hanya "Rp"** — kurang informatif. → Diubah jadi rentang nyata `Rp 350.000 - Rp 3.500.000` + tambah `currenciesAccepted: IDR`.

6. **Jam operasional belum ada di structured data** — → Ditambah `openingHoursSpecification` (08:00–21:00 tiap hari) agar sinkron dengan Google Business Profile.

> Untuk mengaktifkan perbaikan ini: **commit & push → Vercel auto-deploy**, lalu minta Google meng-crawl ulang (lihat "Cara verifikasi" di bawah).

### ⚠️ Perlu tindakan manual Anda (penting)

7. **www vs non-www — TIDAK konsisten (prioritas tinggi).**
   Canonical di kode menunjuk `https://automanado.com` (tanpa www), **tapi** situs Anda me-redirect ke `https://www.automanado.com` (pakai www). Google bisa bingung mana versi resmi, dan "kekuatan" SEO bisa terpecah dua.
   **Solusi (pilih salah satu, rekomendasi A):**
   - **A (paling mudah, sesuai kode):** Di **Vercel → Settings → Domains**, jadikan `automanado.com` (tanpa www) sebagai **Primary**, dan set `www.automanado.com` → **Redirect to** `automanado.com`. Selesai. Semua kode sudah pakai non-www.
   - **B:** Kalau Anda mau pakai www, beri tahu saya — nanti saya ubah semua referensi di kode ke `www.automanado.com`, dan Anda perlu sesuaikan properti di Search Console.
   - **Di Google Search Console:** gunakan **Domain property** (verifikasi via DNS), bukan URL-prefix, supaya mencakup www & non-www sekaligus.

### 💡 Rekomendasi perbaikan (belum mendesak, dampak menengah)

8. **Foto mobil mayoritas hanya 1 buah.** Mobil dengan 4–6 foto (depan, samping, interior, dashboard, bagasi) lebih dipercaya & lebih sering diklik. Target: minimal 3 foto/mobil.

9. **Review masih ±3.** Ini titik terlemah dibanding pesaing. Lihat dokumen strategi — bagian "Mesin Review".

10. **Belum ada blog/artikel.** Tidak ada cara gratis yang lebih kuat untuk kata kunci long-tail selain konten. Lihat dokumen strategi — bagian "Konten".

11. **`sitemap.xml` selalu menandai semua halaman "diubah hari ini".** Tiap kali di-render, `lastModified` = waktu sekarang. Idealnya pakai tanggal asli (mis. `created_at` mobil) agar sinyal ke Google lebih jujur. Dampak kecil — bisa dirapikan nanti.

12. **NAP (Nama–Alamat–Telepon) belum punya alamat jalan.** Wajar untuk marketplace, tapi untuk Local Pack yang kuat, alamat fisik (boleh alamat mitra/titik kumpul di Manado) sangat membantu. Minimal konsisten di mana-mana: situs, Google Business, direktori.

---

## Lanskap persaingan di Manado

Dari pencarian "rental mobil Manado", pesaing utama Anda:

| Pesaing | Jenis | Kekuatan | Celah yang bisa Anda ambil |
|---|---|---|---|
| Traveloka | Agregator nasional | Domain super kuat | Tidak personal, tidak lokal, tidak via WhatsApp langsung |
| Salsa Wisata, Niagatour, Fazza, Cakraloka | Agregator/tour nasional | Banyak halaman kota | Konten generik, bukan asli Manado |
| Global Transport, iCanRentACar, Smartrent | Rental multi-kota | SEO rapi | Kurang fokus Manado, brand kurang lokal |
| Rental lokal (situs Google Sites, dll) | Lokal | Punya Google Business + review | Situs jelek/lambat — Anda unggul di sini |

**Kesimpulan strategi:** Jangan adu jago melawan Traveloka di kata kunci umum. Menangkan **3 medan** ini dulu:

1. **Local Pack (Maps)** — lewat Google Business Profile + review. Ini yang dilihat 70%+ orang yang cari "rental mobil manado" dari HP.
2. **Long-tail spesifik** — "sewa [model] manado", "rental mobil + sopir tomohon", "sewa mobil bandara sam ratulangi", "rental hiace rombongan manado". Lebih mudah & niat belinya tinggi.
3. **Brand "AutoManado"** — pastikan saat orang cari "automanado" / "auto manado", Anda muncul #1 (sekarang seharusnya sudah, perlu dipastikan terindeks).

---

## Skor & prioritas tindakan

**Skor SEO saat ini: 8/10 teknis · 4/10 off-page · 3/10 konten**

Urutan kerja berdasarkan dampak vs usaha:

| # | Tindakan | Dampak | Usaha | Penanggung jawab |
|---|---|---|---|---|
| 1 | Deploy perbaikan kode hari ini | Tinggi | Rendah | Anda (push ke Vercel) |
| 2 | Benahi www/non-www di Vercel | Tinggi | Rendah | Anda |
| 3 | Optimasi penuh Google Business Profile | Sangat tinggi | Sedang | Anda + panduan saya |
| 4 | Mesin review (target 10 review/bulan) | Sangat tinggi | Sedang | Anda (rutin) |
| 5 | Submit sitemap & minta indexing di GSC | Tinggi | Rendah | Anda |
| 6 | Tambah foto mobil (min 3/unit) | Sedang | Sedang | Anda + mitra |
| 7 | Mulai blog (4 artikel/bulan) | Tinggi (jangka menengah) | Sedang | Anda + saya bantu tulis |
| 8 | Daftar direktori/citation lokal | Sedang | Rendah | Anda |

Detail langkah ada di **dokumen "02-Strategi-Growth"**. Pemantauan harian ada di **agent harian jam 07:00**.

---

## Cara verifikasi setelah deploy ulang

Setelah `git push` dan Vercel selesai deploy:

1. **Cek judul:** buka view-source halaman `/rental-mobil-manado` → pastikan `<title>` tidak lagi dobel "AutoManado".
2. **Rich Results Test:** buka `https://search.google.com/test/rich-results`, masukkan URL halaman mobil & homepage → pastikan Car, FAQ, LocalBusiness, Breadcrumb terdeteksi tanpa error gambar.
3. **Google Search Console → URL Inspection:** masukkan URL penting (homepage + 4 landing page) → klik **Request Indexing**.
4. **Cek statistik:** buka homepage dengan JavaScript dimatikan (atau lihat view-source) → angka 50+/1200+/8/25+ harus muncul, bukan 0.
5. **Cek domain:** ketik `automanado.com` (tanpa www) → harus konsisten (redirect satu arah saja, tidak bolak-balik).

---

*Dokumen ini bagian 1 dari paket SEO AutoManado. Lihat juga: 02-Strategi-Growth, 03-Agent-Harian.*

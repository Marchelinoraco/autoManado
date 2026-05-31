# 🚗 AutoManado — Rental & Jual Mobil Manado

Marketplace rental dan jual-beli mobil untuk Kota Manado, Sulawesi Utara.
Tahap ini berisi **tampilan/frontend** dengan data contoh (mock) — sudah bisa
langsung diakses tanpa Supabase. Integrasi database & panel admin menyusul.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- lucide-react

## Menjalankan
```bash
npm install
npm run dev
```
Buka http://localhost:3000

## Build
```bash
npm run build
npm start
```

## Struktur Halaman
- `/` Beranda (hero, statistik, armada unggulan, testimoni)
- `/katalog` Katalog + filter + search
- `/mobil/[slug]` Detail mobil + kalkulator sewa + tombol WhatsApp
- `/promo` Promo & diskon
- `/tentang` Tentang AutoManado

## WhatsApp
Semua tombol pesan mengarah ke `6282348135155` lewat `lib/whatsapp.ts`.

## Langkah berikutnya (belum dikerjakan)
- Integrasi Supabase (cars, testimonials) + RLS
- Supabase Auth + middleware proteksi `/admin`
- Admin dashboard CRUD + upload foto
- JSON-LD LocalBusiness, OG image dinamis

Data contoh ada di `lib/data.ts`. Ganti `cars`/`testimonials` dengan query
Supabase saat integrasi database dilakukan.

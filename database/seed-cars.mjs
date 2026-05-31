/**
 * Seed semua mobil dengan gambar lokal dari public/images/cars/
 * Jalankan dari root project: node database/seed-cars.mjs
 *
 * - INSERT baru untuk mobil yang belum ada (berdasarkan slug)
 * - UPDATE gambar untuk mobil yang sudah ada ke path lokal
 */

import { readFileSync } from "fs";
import { createConnection } from "mysql2/promise";

// Baca .env.local
function loadEnv() {
  try {
    const text = readFileSync(".env.local", "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  } catch { /* pakai env asli */ }
}
loadEnv();

const conn = await createConnection({
  host:     process.env.DB_HOST     ?? "localhost",
  port:     Number(process.env.DB_PORT ?? 3306),
  user:     process.env.DB_USER     ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME     ?? "otomanado",
});

// ─── Helper ────────────────────────────────────────────
const img = (...files) => JSON.stringify(files.map(f => `/images/cars/${f}`));

// ─── 1. UPDATE gambar mobil yang sudah ada → gunakan file lokal ────────
const updates = [
  ["toyota-avanza",          img("new-avanza.png", "toyota-avanza.png", "avanza-veloz.png")],
  ["mitsubishi-xpander",     img("xpander-ultimate.webp")],
  ["toyota-fortuner",        img("toyota-fortuner.png", "fortuner-trd-gr.png")],
  ["honda-brio",             img("honda-brio.png")],
  ["toyota-innova-reborn",   img("innova-reborn.png", "toyota-innova-reborn.png")],
  ["mitsubishi-pajero-sport",img("pajero-sport.png")],
  ["daihatsu-xenia",         img("daihatsu-xenia.png")],
  ["toyota-camry",           img("toyota-camry.png")],
];

for (const [slug, images] of updates) {
  const [res] = await conn.execute(
    "UPDATE cars SET images = ? WHERE slug = ?",
    [images, slug]
  );
  if (res.affectedRows > 0) {
    console.log(`  ✏️  Updated  : ${slug}`);
  } else {
    console.log(`  ⚠️  Not found: ${slug} (belum di-seed)`);
  }
}

// ─── 2. INSERT mobil baru ───────────────────────────────────────────────
//        INSERT IGNORE → lewati jika slug sudah ada
const INSERT = `
  INSERT IGNORE INTO cars
    (name, slug, type, category, status,
     price_rent, price_sell, year, seats, transmission, fuel,
     badge, kondisi, dengan_sopir, plat_asal, description, images)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const cars = [
  // ── MPV Premium ──────────────────────────────────────────────────────
  [
    "Toyota Alphard", "toyota-alphard", "MPV", "rental", "tersedia",
    2000000, null, 2022, 7, "Otomatis", "Bensin",
    "POPULER", "Baik Sekali", 1, "DB",
    "MPV mewah premium pilihan artis dan pejabat. Kabin VIP, suspensi halus, cocok untuk VIP transfer dan acara pernikahan di Manado.",
    img("alphard.png", "toyota-alphard.png"),
  ],
  // ── MPV ──────────────────────────────────────────────────────────────
  [
    "Toyota Avanza Veloz", "toyota-avanza-veloz", "MPV", "rental", "tersedia",
    380000, null, 2023, 7, "Otomatis", "Bensin",
    "BARU", "Baik Sekali", 0, "DB",
    "Varian sporty Toyota Avanza dengan transmisi otomatis. Responsif, lega, dan stylish untuk aktivitas keluarga maupun wisata.",
    img("avanza-veloz.png"),
  ],
  [
    "Toyota Calya", "toyota-calya", "MPV", "rental", "tersedia",
    270000, null, 2022, 7, "Manual", "Bensin",
    null, "Baik", 0, "DB",
    "MPV 7-penumpang yang hemat dan andal. Pilihan ekonomis untuk perjalanan keluarga sehari-hari di Manado dan sekitarnya.",
    img("calya.png"),
  ],
  [
    "Toyota Innova Zenix G", "toyota-innova-zenix-g", "MPV", "keduanya", "tersedia",
    700000, 430000000, 2024, 7, "Otomatis", "Bensin",
    "BARU", "Baik Sekali", 1, "DB",
    "Generasi terbaru Innova dengan platform TNGA. Interior lebih lega, fitur keselamatan lengkap, cocok untuk perjalanan dinas.",
    img("innova-zenix-g.png"),
  ],
  [
    "Toyota Innova Zenix Q", "toyota-innova-zenix-q", "MPV", "keduanya", "tersedia",
    850000, 540000000, 2024, 7, "Otomatis", "Hybrid",
    "BARU", "Baik Sekali", 1, "DB",
    "Innova Zenix varian tertinggi dengan teknologi Hybrid. Hemat BBM, senyap, dan mewah untuk perjalanan eksklusif.",
    img("innova-zenix-q.png"),
  ],
  [
    "Daihatsu Xenia", "daihatsu-xenia-baru", "MPV", "rental", "tersedia",
    290000, null, 2023, 7, "Otomatis", "Bensin",
    null, "Baik Sekali", 0, "DB",
    "All-New Xenia dengan desain segar dan mesin 1.500cc lebih bertenaga. Irit, nyaman, dan cocok untuk keluarga.",
    img("daihatsu-xenia.png"),
  ],
  [
    "Suzuki Ertiga", "suzuki-ertiga", "MPV", "rental", "tersedia",
    320000, null, 2022, 7, "Manual", "Bensin",
    null, "Baik", 0, "DB",
    "MPV kompak dengan ground clearance tinggi. Mesin 1.500cc HEARTECT irit dan performa baik di jalanan Manado.",
    img("suzuki-ertiga.webp"),
  ],
  [
    "Nissan Livina VL", "nissan-livina-vl", "MPV", "rental", "tersedia",
    350000, null, 2022, 7, "Otomatis", "Bensin",
    null, "Baik", 0, "DB",
    "MPV family car dengan kabin lega dan fitur lengkap. Transmisi otomatis yang halus membuat perjalanan lebih nyaman.",
    img("new-livina-vl.jpg", "new-livina-vl.png"),
  ],
  [
    "Mitsubishi Xpander Ultimate", "mitsubishi-xpander-ultimate", "MPV", "rental", "tersedia",
    500000, null, 2023, 7, "Otomatis", "Bensin",
    "BARU", "Baik Sekali", 1, "DB",
    "Xpander varian tertinggi dengan fitur premium. Kabin premium, fitur safety lengkap, dan desain elegan yang menawan.",
    img("xpander-ultimate.webp"),
  ],
  // ── SUV ──────────────────────────────────────────────────────────────
  [
    "Toyota Fortuner TRD GR Sport", "toyota-fortuner-trd-gr", "SUV", "keduanya", "tersedia",
    1100000, 620000000, 2023, 7, "Otomatis", "Solar",
    "BARU", "Baik Sekali", 0, "DB",
    "Fortuner versi sporty TRD GR Sport dengan tampilan agresif. Performa diesel tangguh untuk medan apapun di Sulawesi Utara.",
    img("fortuner-trd-gr.png"),
  ],
  [
    "Toyota Rush G", "toyota-rush-g", "SUV", "rental", "tersedia",
    500000, null, 2022, 7, "Otomatis", "Bensin",
    null, "Baik Sekali", 0, "DB",
    "SUV kompak dengan ground clearance tinggi. Lincah di dalam kota namun tangguh untuk jalan menanjak menuju Tomohon.",
    img("rush-g.png"),
  ],
  [
    "Mitsubishi Pajero", "mitsubishi-pajero", "SUV", "jual", "tersedia",
    null, 420000000, 2020, 7, "Otomatis", "Solar",
    null, "Baik", 0, "DB",
    "SUV off-road tangguh legendaris. Performa diesel 4WD mumpuni, cocok untuk medan berat dan perjalanan adventure di Sulawesi.",
    img("mitsubishi-pajero.png"),
  ],
  // ── Minibus ───────────────────────────────────────────────────────────
  [
    "Toyota Hiace Commuter", "toyota-hiace-commuter", "Minibus", "rental", "tersedia",
    700000, null, 2021, 14, "Manual", "Solar",
    null, "Baik", 1, "DB",
    "Minibus kapasitas 14 penumpang andalan untuk wisata rombongan. Tangki besar, mesin diesel tahan banting, ideal untuk perjalanan jauh.",
    img("hiace-commuter.png"),
  ],
  [
    "Toyota Hiace Premio", "toyota-hiace-premio", "Minibus", "rental", "tersedia",
    1200000, null, 2022, 10, "Otomatis", "Solar",
    "POPULER", "Baik Sekali", 1, "DB",
    "Hiace versi premium dengan kursi captain seat dan interior mewah. Pilihan utama untuk wisata VIP, travel eksekutif, dan pernikahan.",
    img("hiace-premio.png"),
  ],
  // ── Sedan ─────────────────────────────────────────────────────────────
  [
    "Honda Civic", "honda-civic", "Sedan", "keduanya", "tersedia",
    600000, 380000000, 2022, 5, "Otomatis", "Bensin",
    null, "Baik Sekali", 0, "DB",
    "Sedan sporty generasi terbaru dengan desain aerodinamis. Mesin VTEC Turbo 1.500cc bertenaga tinggi namun tetap irit.",
    img("honda-civic.jpg"),
  ],
  [
    "Mercedes-Benz E-Class", "mercedes-e-class", "Sedan", "keduanya", "tersedia",
    2500000, 1200000000, 2021, 5, "Otomatis", "Bensin",
    "POPULER", "Baik Sekali", 1, "DB",
    "Sedan eksekutif mewah Mercedes-Benz. Performa mesin inline-6 turbo, interior premium, teknologi terdepan untuk tamu VVIP.",
    img("mercedes-e-class.png"),
  ],
  // ── City Car ──────────────────────────────────────────────────────────
  [
    "Daihatsu Ayla", "daihatsu-ayla", "City Car", "rental", "tersedia",
    250000, null, 2022, 4, "Manual", "Bensin",
    null, "Baik", 0, "DB",
    "City car mungil hemat BBM untuk mobilitas harian. Mudah parkir di pusat kota Manado, sangat irit bensin.",
    img("ayla.webp"),
  ],
  [
    "Toyota Agya", "toyota-agya", "City Car", "rental", "tersedia",
    260000, null, 2023, 4, "Otomatis", "Bensin",
    "BARU", "Baik Sekali", 0, "DB",
    "City car terlaris Toyota dengan transmisi otomatis. Desain modern, fitur lengkap, dan konsumsi BBM sangat hemat.",
    img("new-agya.png"),
  ],
  [
    "Honda Jazz", "honda-jazz", "City Car", "rental", "tersedia",
    380000, null, 2020, 5, "Otomatis", "Bensin",
    null, "Baik", 0, "DB",
    "Hatchback premium Honda yang stylish dan fungsional. Kabin luas berkat Magic Seat, mesin VTEC responsif dan irit.",
    img("honda-jazz.webp"),
  ],
];

let inserted = 0;
let skipped = 0;

for (const car of cars) {
  const [res] = await conn.execute(INSERT, car);
  if (res.affectedRows > 0) {
    console.log(`  ✅ Inserted : ${car[0]}`);
    inserted++;
  } else {
    console.log(`  ⏭️  Skipped  : ${car[0]} (slug sudah ada)`);
    skipped++;
  }
}

console.log("\n──────────────────────────────");
console.log(`  Total baru   : ${inserted} mobil`);
console.log(`  Dilewati     : ${skipped} mobil`);
console.log(`  Gambar update: ${updates.length} mobil`);
console.log("──────────────────────────────");
console.log("  Selesai! Buka /katalog untuk melihat hasilnya.");

await conn.end();

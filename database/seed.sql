-- ============================================================
-- ManaRent — Seed Data (8 mobil + 3 testimoni)
-- Jalankan SETELAH schema.sql
-- ============================================================

USE otomanado;

TRUNCATE TABLE testimonials;
TRUNCATE TABLE cars;

INSERT INTO cars
  (name, slug, type, category, status, price_rent, price_sell, year, seats, transmission, fuel, badge, description, images)
VALUES
  (
    'Toyota Avanza', 'toyota-avanza', 'MPV', 'rental', 'tersedia',
    300000, NULL, 2022, 7, 'Manual', 'Bensin', 'POPULER',
    'MPV keluarga paling laris di Manado. Irit, lega, dan nyaman untuk perjalanan ke Tomohon, Bunaken, maupun dalam kota.',
    '["https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"]'
  ),
  (
    'Mitsubishi Xpander', 'mitsubishi-xpander', 'MPV', 'rental', 'tersedia',
    400000, NULL, 2023, 7, 'Otomatis', 'Bensin', 'BARU',
    'MPV modern dengan kabin luas dan suspensi empuk. Cocok untuk perjalanan keluarga jarak jauh di Sulawesi Utara.',
    '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80"]'
  ),
  (
    'Toyota Fortuner', 'toyota-fortuner', 'SUV', 'keduanya', 'tersedia',
    900000, 480000000, 2021, 7, 'Otomatis', 'Solar', 'POPULER',
    'SUV tangguh bertenaga diesel. Gagah untuk acara penting maupun medan menanjak khas Minahasa.',
    '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"]'
  ),
  (
    'Honda Brio', 'honda-brio', 'City Car', 'rental', 'disewa',
    280000, NULL, 2022, 5, 'Otomatis', 'Bensin', 'PROMO',
    'City car lincah dan irit, ideal untuk mobilitas harian di pusat Kota Manado.',
    '["https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?auto=format&fit=crop&w=1200&q=80"]'
  ),
  (
    'Toyota Innova Reborn', 'toyota-innova-reborn', 'MPV', 'keduanya', 'tersedia',
    600000, 380000000, 2020, 7, 'Otomatis', 'Solar', NULL,
    'MPV premium yang nyaman dan bertenaga. Favorit untuk perjalanan dinas dan rombongan.',
    '["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80"]'
  ),
  (
    'Mitsubishi Pajero Sport', 'mitsubishi-pajero-sport', 'SUV', 'jual', 'tersedia',
    NULL, 520000000, 2021, 7, 'Otomatis', 'Solar', 'BARU',
    'SUV mewah dengan performa diesel tangguh dan fitur lengkap. Siap pakai, surat lengkap.',
    '["https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80"]'
  ),
  (
    'Daihatsu Xenia', 'daihatsu-xenia', 'MPV', 'rental', 'tersedia',
    290000, NULL, 2021, 7, 'Manual', 'Bensin', NULL,
    'MPV ekonomis dan andal untuk kebutuhan keluarga maupun usaha dengan biaya operasional rendah.',
    '["https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80"]'
  ),
  (
    'Toyota Camry', 'toyota-camry', 'Sedan', 'keduanya', 'tersedia',
    750000, 420000000, 2020, 5, 'Otomatis', 'Bensin', 'POPULER',
    'Sedan eksekutif elegan dan senyap. Pilihan tepat untuk tamu VIP, pernikahan, dan acara resmi.',
    '["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80"]'
  );

INSERT INTO testimonials (name, location, message, rating) VALUES
  ('Reynaldo S.', 'Manado', 'Pelayanan cepat lewat WhatsApp, mobil bersih dan terawat. Avanza-nya nyaman dipakai liburan ke Tomohon.', 5),
  ('Gracia W.', 'Tomohon', 'Booking Xpander gampang banget, harga jelas tanpa biaya tersembunyi. Recommended!', 5),
  ('Hendrik P.', 'Bitung', 'Beli Fortuner bekas lewat ManaRent, surat lengkap dan kondisi prima. Mantap pelayanannya.', 4);

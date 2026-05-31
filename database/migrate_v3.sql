-- ============================================================
-- ManaRent — Migrasi v3: foto & mobil di testimonial
-- Jalankan di phpMyAdmin: pilih database otomanado → tab SQL → paste & jalankan
-- ============================================================

USE otomanado;

ALTER TABLE testimonials
  ADD COLUMN photo     VARCHAR(500) NULL COMMENT 'URL foto klien (opsional)' AFTER rating,
  ADD COLUMN car_name  VARCHAR(120) NULL COMMENT 'Nama mobil yang disewa/dibeli' AFTER photo,
  ADD COLUMN service   ENUM('rental','jual') NULL COMMENT 'Jenis layanan yang digunakan' AFTER car_name;

-- Update data seed agar lebih kaya
UPDATE testimonials SET
  car_name = 'Toyota Avanza',
  service  = 'rental'
WHERE name = 'Reynaldo S.';

UPDATE testimonials SET
  car_name = 'Mitsubishi Xpander',
  service  = 'rental'
WHERE name = 'Gracia W.';

UPDATE testimonials SET
  car_name = 'Toyota Fortuner',
  service  = 'jual'
WHERE name = 'Hendrik P.';

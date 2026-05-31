-- ============================================================
-- ManaRent — Migrasi v2 (sesuai rencana bisnis)
-- Jalankan di phpMyAdmin: pilih database otomanado → tab SQL → paste & jalankan
-- ============================================================

USE otomanado;

ALTER TABLE cars
  ADD COLUMN kondisi     ENUM('Baik Sekali','Baik','Cukup','Perlu Service') NULL AFTER badge,
  ADD COLUMN kelengkapan TEXT NULL COMMENT 'Contoh: STNK, BPKB, Ban Serep, dll' AFTER kondisi,
  ADD COLUMN dengan_sopir TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1=bisa dengan sopir' AFTER kelengkapan,
  ADD COLUMN plat_asal   VARCHAR(10) NULL COMMENT 'Contoh: DB, DM' AFTER dengan_sopir;

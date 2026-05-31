-- ============================================================
-- ManaRent — MySQL Schema
-- Jalankan di phpMyAdmin atau: mysql -u root -p manarent < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS otomanado
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE otomanado;

-- ──────────────────────────────────────────────────────────
-- Tabel mobil
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  type          VARCHAR(50)  NOT NULL COMMENT 'MPV, SUV, Sedan, City Car, Pickup, Minibus',
  category      ENUM('rental','jual','keduanya') NOT NULL DEFAULT 'rental',
  status        ENUM('tersedia','disewa','terjual') NOT NULL DEFAULT 'tersedia',
  price_rent    INT UNSIGNED NULL COMMENT 'Harga sewa per hari (Rp)',
  price_sell    BIGINT UNSIGNED NULL COMMENT 'Harga jual (Rp)',
  year          SMALLINT UNSIGNED NOT NULL,
  seats         TINYINT UNSIGNED NOT NULL,
  transmission  ENUM('Manual','Otomatis') NOT NULL,
  fuel          ENUM('Bensin','Solar','Hybrid') NOT NULL,
  badge         ENUM('POPULER','BARU','PROMO') NULL,
  description   TEXT NULL,
  images        JSON NOT NULL DEFAULT ('[]') COMMENT 'Array URL foto',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────
-- Tabel testimoni
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  location    VARCHAR(100) NULL,
  message     TEXT NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL DEFAULT 5,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────
-- Admin users
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

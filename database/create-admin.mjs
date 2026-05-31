/**
 * Buat akun admin pertama.
 * Jalankan: node database/create-admin.mjs
 *
 * Pastikan .env.local sudah diisi (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
 * Script membaca variabel dari .env.local secara manual.
 */
import { readFileSync } from "fs";
import { createConnection } from "mysql2/promise";
import { createHash } from "crypto";

// Baca .env.local manual (tanpa dotenv)
function loadEnv() {
  try {
    const text = readFileSync(".env.local", "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  } catch {
    // .env.local tidak ada, pakai env asli
  }
}
loadEnv();

// Hash password pakai SHA-256 + bcrypt via native crypto
// Tapi bcrypt tidak tersedia di pure ESM tanpa build.
// Gunakan bcrypt via dynamic require.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");

const EMAIL = process.argv[2] || "admin@manarent.id";
const PASSWORD = process.argv[3] || "admin123";

const conn = await createConnection({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "otomanado",
});

const hash = await bcrypt.hash(PASSWORD, 12);

await conn.execute(
  `INSERT INTO admin_users (email, password_hash)
   VALUES (?, ?)
   ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
  [EMAIL, hash]
);

console.log(`✅ Admin berhasil dibuat: ${EMAIL}`);
console.log(`   Password: ${PASSWORD}`);
console.log(`   Login di: http://localhost:3000/admin/login`);

await conn.end();

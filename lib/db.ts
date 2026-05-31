import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "otomanado",
    waitForConnections: true,
    connectionLimit: 10,
    timezone: "+00:00",
  });
}

// Reuse pool across hot-reloads in development
const pool = global._mysqlPool ?? createPool();
if (process.env.NODE_ENV !== "production") global._mysqlPool = pool;

export default pool;

export async function query<T = unknown>(sql: string, values?: (string | number | null)[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, values);
  return rows as T[];
}

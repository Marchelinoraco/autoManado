import { query } from "./db";
import { Car, Testimonial } from "./types";

function parseCar(row: Record<string, unknown>): Car {
  return {
    ...row,
    images: typeof row.images === "string" ? JSON.parse(row.images) : (row.images ?? []),
    dengan_sopir: Boolean(row.dengan_sopir),
  } as Car;
}

export async function getCars(): Promise<Car[]> {
  const rows = await query<Record<string, unknown>>(
    "SELECT * FROM cars ORDER BY created_at DESC"
  );
  return rows.map(parseCar);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const rows = await query<Record<string, unknown>>(
    "SELECT * FROM cars WHERE slug = ? LIMIT 1",
    [slug]
  );
  return rows.length ? parseCar(rows[0]) : null;
}

export async function getAllSlugs(): Promise<string[]> {
  const rows = await query<{ slug: string }>("SELECT slug FROM cars");
  return rows.map((r) => r.slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return query<Testimonial>(
    "SELECT * FROM testimonials ORDER BY created_at DESC"
  );
}

export async function createTestimonial(
  data: Omit<Testimonial, "id" | "created_at">
): Promise<number> {
  const pool = (await import("./db")).default;
  const [result] = await pool.execute(
    `INSERT INTO testimonials (name, location, message, rating, photo, car_name, service)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.location ?? null,
      data.message,
      data.rating,
      data.photo ?? null,
      data.car_name ?? null,
      data.service ?? null,
    ]
  );
  return (result as { insertId: number }).insertId;
}

export async function updateTestimonial(
  id: number,
  data: Partial<Omit<Testimonial, "id" | "created_at">>
) {
  const pool = (await import("./db")).default;
  const entries = Object.entries(data);
  const fields = entries.map(([k]) => `\`${k}\` = ?`).join(", ");
  const values = entries.map(([, v]) => v ?? null);
  await pool.execute(
    `UPDATE testimonials SET ${fields} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteTestimonial(id: number) {
  const pool = (await import("./db")).default;
  await pool.execute("DELETE FROM testimonials WHERE id = ?", [id]);
}

export async function createCar(data: Omit<Car, "id" | "created_at">): Promise<number> {
  const pool = (await import("./db")).default;
  const [result] = await pool.execute(
    `INSERT INTO cars
       (name,slug,type,category,status,price_rent,price_sell,year,seats,
        transmission,fuel,badge,kondisi,kelengkapan,dengan_sopir,plat_asal,description,images)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      data.name, data.slug, data.type, data.category, data.status,
      data.price_rent ?? null, data.price_sell ?? null,
      data.year, data.seats, data.transmission, data.fuel,
      data.badge ?? null,
      data.kondisi ?? null,
      data.kelengkapan ?? null,
      data.dengan_sopir ? 1 : 0,
      data.plat_asal ?? null,
      data.description ?? null,
      JSON.stringify(data.images),
    ]
  );
  return (result as { insertId: number }).insertId;
}

export async function updateCar(id: number, data: Partial<Omit<Car, "id" | "created_at">>) {
  const pool = (await import("./db")).default;
  const entries = Object.entries(data).map(([k, v]) => {
    if (k === "images") return [k, JSON.stringify(v)];
    if (k === "dengan_sopir") return [k, v ? 1 : 0];
    return [k, v ?? null];
  });
  const fields = entries.map(([k]) => `\`${k}\` = ?`).join(", ");
  const values = entries.map(([, v]) => v);
  await pool.execute(
    `UPDATE cars SET ${fields} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteCar(id: number) {
  const pool = (await import("./db")).default;
  await pool.execute("DELETE FROM cars WHERE id = ?", [id]);
}

import type { Metadata } from "next";
import { getCars } from "@/lib/cars";
import KatalogClient from "./KatalogClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Katalog Mobil — Rental & Jual Mobil Manado",
  description:
    "Lihat daftar lengkap mobil rental dan jual di Manado: MPV, SUV, Sedan, City Car. Filter & cari mobil sesuai kebutuhan Anda.",
  alternates: { canonical: "/katalog" },
};

export default async function KatalogPage() {
  const cars = await getCars().catch(() => []);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Katalog Mobil Manado</h1>
      <p className="mt-2 text-gray-400">Temukan mobil rental & jual terbaik di Kota Manado.</p>
      <KatalogClient cars={cars} />
    </section>
  );
}

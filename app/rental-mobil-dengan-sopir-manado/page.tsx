import type { Metadata } from "next";
import { getCars } from "@/lib/cars";
import LandingTemplate from "@/components/LandingTemplate";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Rental Mobil dengan Sopir Manado — Sopir Berpengalaman | AutoManado",
  description:
    "Rental mobil dengan sopir di Manado untuk wisata Bunaken, Tomohon & dinas. Sopir ramah dan paham rute, duduk santai sampai tujuan. Pesan via WhatsApp di AutoManado.",
  alternates: { canonical: "/rental-mobil-dengan-sopir-manado" },
};

export default async function Page() {
  const cars = await getCars().catch(() => []);
  const withDriver = cars.filter(
    (c) => c.dengan_sopir && (c.category === "rental" || c.category === "keduanya") && c.status !== "terjual"
  );
  // fallback: jika belum ada unit bertanda sopir, tampilkan semua rental
  const list = withDriver.length
    ? withDriver
    : cars.filter((c) => (c.category === "rental" || c.category === "keduanya") && c.status !== "terjual");

  return (
    <LandingTemplate
      eyebrow="Rental + Sopir Berpengalaman"
      title="Rental Mobil dengan Sopir di Manado"
      intro="Nikmati perjalanan tanpa lelah menyetir. AutoManado menyediakan rental mobil dengan sopir berpengalaman yang hafal rute Manado, Tomohon, Bitung, hingga objek wisata Bunaken dan Likupang. Cocok untuk wisata keluarga, perjalanan dinas, dan tamu kantor — Anda tinggal duduk santai sampai tujuan."
      highlights={[
        "Sopir ramah & hafal rute",
        "Cocok untuk wisata & dinas",
        "Paket wisata Tomohon & Bunaken",
        "Aman untuk keluarga & rombongan",
      ]}
      carsHeading="Mobil dengan Layanan Sopir"
      cars={list}
      waMessage="Halo AutoManado, saya ingin rental mobil dengan sopir di Manado. Boleh info harga + sopir?"
      path="/rental-mobil-dengan-sopir-manado"
      breadcrumbName="Rental Mobil dengan Sopir Manado"
      sections={[
        {
          heading: "Kenapa pilih rental dengan sopir?",
          body: "Dengan sopir berpengalaman, Anda tak perlu pusing soal rute, parkir, atau medan jalan yang asing. Sopir kami paham titik-titik wisata terbaik di Sulawesi Utara dan mengutamakan keselamatan. Ideal bagi wisatawan luar kota, lansia, atau rombongan yang ingin perjalanan nyaman.",
        },
        {
          heading: "Paket wisata Manado & sekitarnya",
          body: "Tersedia paket mobil + sopir untuk tur Tomohon (Bukit Kasih, Danau Linow), Bunaken, Likupang, hingga kuliner khas Manado. Durasi dan itinerary bisa disesuaikan. Hubungi kami untuk menyusun paket sesuai kebutuhan dan anggaran Anda.",
        },
        {
          heading: "Harga sopir & ketentuan",
          body: "Biaya sopir dihitung terpisah dari sewa mobil dan dikonfirmasi transparan via WhatsApp. Untuk perjalanan ke luar kota, biasanya ada penyesuaian uang makan/menginap sopir. Semua dijelaskan di awal agar tidak ada kejutan biaya.",
        },
      ]}
    />
  );
}

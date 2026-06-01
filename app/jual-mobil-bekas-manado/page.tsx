import type { Metadata } from "next";
import { getCars } from "@/lib/cars";
import LandingTemplate from "@/components/LandingTemplate";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Jual Beli Mobil Bekas Manado — Berkualitas & Terawat | AutoManado",
  description:
    "Jual beli mobil bekas berkualitas di Manado. Unit terawat, kondisi jelas, harga nego transparan. Lihat foto & detail lengkap, lalu tanya langsung via WhatsApp di AutoManado.",
  alternates: { canonical: "/jual-mobil-bekas-manado" },
};

export default async function Page() {
  const cars = await getCars().catch(() => []);
  const forSale = cars.filter(
    (c) => (c.category === "jual" || c.category === "keduanya") && c.status !== "terjual"
  );

  return (
    <LandingTemplate
      eyebrow="Jual Beli Mobil di Kota Manado"
      title="Jual Mobil Bekas Berkualitas di Manado"
      intro="Cari mobil bekas berkualitas di Manado? AutoManado menampilkan unit-unit terawat dengan kondisi yang dijelaskan apa adanya, lengkap dengan foto dan spesifikasi. Mulai dari city car, MPV keluarga, hingga SUV — semua dengan harga yang bisa dinegosiasi secara transparan langsung lewat WhatsApp."
      highlights={[
        "Unit terawat & kondisi jelas",
        "Foto & spesifikasi lengkap",
        "Harga nego transparan",
        "Cek langsung di Manado",
      ]}
      carsHeading="Mobil Dijual di Manado"
      cars={forSale}
      waMessage="Halo AutoManado, saya tertarik membeli mobil yang dijual. Boleh info detail & harga?"
      path="/jual-mobil-bekas-manado"
      breadcrumbName="Jual Mobil Bekas Manado"
      sections={[
        {
          heading: "Beli mobil bekas dengan tenang",
          body: "Setiap mobil yang dijual di AutoManado dilengkapi informasi tahun, transmisi, bahan bakar, kelengkapan dokumen, serta catatan kondisi. Anda bisa melihat foto detail dan mengajukan pertanyaan langsung sebelum memutuskan — tanpa tekanan, transparan, dan bisa cek fisik unit di Manado.",
        },
        {
          heading: "Proses pembelian yang mudah",
          body: "Pilih mobil yang Anda minati, klik tombol tanya di halaman detail, dan Anda terhubung ke WhatsApp kami. Kami bantu jadwalkan pengecekan unit, jelaskan kondisi apa adanya, dan diskusikan harga. Proses cepat dan jujur menjadi prioritas kami.",
        },
        {
          heading: "Mau jual mobil Anda?",
          body: "Punya mobil yang ingin dijual di area Manado dan sekitarnya? Hubungi kami via WhatsApp — kami bantu pasarkan unit Anda ke calon pembeli yang tepat melalui platform AutoManado.",
        },
      ]}
    />
  );
}

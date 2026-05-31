import type { Metadata } from "next";
import { Tag, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Promo & Diskon Rental Mobil Manado",
  description:
    "Promo spesial rental mobil Manado: diskon sewa mingguan & bulanan, paket wisata, dan penawaran terbatas dari AutoManado.",
};

const promos = [
  {
    title: "Diskon 10% Sewa Mingguan",
    desc: "Sewa mobil minimal 7 hari, otomatis dapat potongan 10% dari total.",
    tag: "MINGGUAN",
  },
  {
    title: "Diskon 20% Sewa Bulanan",
    desc: "Hemat lebih banyak! Sewa 30 hari langsung diskon 20%.",
    tag: "BULANAN",
  },
  {
    title: "Paket Wisata Tomohon & Bunaken",
    desc: "Mobil + sopir berpengalaman untuk liburan keluarga. Harga spesial.",
    tag: "WISATA",
  },
];

export default function PromoPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Promo & Diskon</h1>
      <p className="mt-2 text-gray-400">Penawaran terbaik untuk Anda di Kota Manado.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {promos.map((p) => (
          <div
            key={p.title}
            className="relative overflow-hidden rounded-2xl border border-emas/30 bg-gradient-to-br from-merah/20 to-emas/5 p-6"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-emas px-3 py-1 text-xs font-bold text-ink">
              <Tag className="h-3 w-3" /> {p.tag}
            </span>
            <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-300">{p.desc}</p>
            <a
              href={waLink(`Halo ManaRent, saya tertarik dengan promo: ${p.title}`)}
              target="_blank"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-merah px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Klaim Promo
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

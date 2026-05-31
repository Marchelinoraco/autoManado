import type { Metadata } from "next";
import { ShieldCheck, Users, Heart, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tentang AutoManado — Marketplace Mobil Manado",
  description:
    "ManaRent adalah marketplace rental dan jual-beli mobil yang menghubungkan pelanggan dengan pengusaha rental & dealer terpercaya di Kota Manado, Sulawesi Utara.",
};

export default function TentangPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Tentang AutoManado</h1>
      <p className="mt-5 leading-relaxed text-gray-300">
        <strong className="text-emas">ManaRent</strong> adalah marketplace yang
        menghubungkan pelanggan dengan pengusaha rental dan dealer mobil
        terpercaya di Kota Manado, Sulawesi Utara. Kami hadir untuk memudahkan
        Anda menyewa maupun membeli mobil berkualitas dengan proses yang cepat,
        transparan, dan langsung lewat WhatsApp.
      </p>
      <p className="mt-4 leading-relaxed text-gray-300">
        Baik untuk kebutuhan harian, perjalanan dinas, liburan keluarga ke
        Tomohon dan Bunaken, maupun acara spesial — AutoManado punya armada yang
        sesuai dengan kebutuhan dan anggaran Anda.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, t: "Terpercaya", d: "Mitra terverifikasi & mobil terawat." },
          { icon: Users, t: "Berpengalaman", d: "Melayani ribuan pelanggan di Sulut." },
          { icon: Heart, t: "Pelayanan Ramah", d: "Respon cepat & solusi terbaik." },
        ].map((v) => (
          <div key={v.t} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <v.icon className="mx-auto h-8 w-8 text-emas" />
            <h3 className="mt-3 font-bold">{v.t}</h3>
            <p className="mt-2 text-sm text-gray-400">{v.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-merah/30 bg-merah/10 p-8 text-center">
        <h2 className="text-2xl font-bold">Punya pertanyaan?</h2>
        <p className="mt-2 text-gray-300">Tim kami siap membantu Anda kapan saja.</p>
        <a
          href={waLink("Halo ManaRent, saya ingin bertanya.")}
          target="_blank"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" /> Chat WhatsApp
        </a>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { ShieldCheck, Users, Heart, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tentang AutoManado — Marketplace Mobil Manado",
  description:
    "AutoManado adalah marketplace rental dan jual-beli mobil yang menghubungkan pelanggan dengan pengusaha rental & dealer terpercaya di Kota Manado, Sulawesi Utara.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Tentang AutoManado</h1>
      <p className="mt-5 leading-relaxed text-gray-600 dark:text-gray-400">
        <strong className="text-teal">AutoManado</strong> adalah marketplace yang
        menghubungkan pelanggan dengan pengusaha rental dan dealer mobil
        terpercaya di Kota Manado, Sulawesi Utara. Kami hadir untuk memudahkan
        Anda menyewa maupun membeli mobil berkualitas dengan proses yang cepat,
        transparan, dan langsung lewat WhatsApp.
      </p>
      <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
        Baik untuk kebutuhan harian, perjalanan dinas, liburan keluarga ke
        Tomohon dan Bunaken, maupun acara spesial — AutoManado punya armada yang
        sesuai dengan kebutuhan dan anggaran Anda.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, t: "Terpercaya", d: "Mitra terverifikasi & mobil terawat." },
          { icon: Users, t: "Berpengalaman", d: "Melayani ribuan pelanggan di Sulut." },
          { icon: Heart, t: "Pelayanan Ramah", d: "Respon cepat & solusi terbaik." },
        ].map((v) => (
          <div key={v.t} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <v.icon className="mx-auto h-8 w-8 text-teal" />
            <h3 className="mt-3 font-bold text-gray-900 dark:text-white">{v.t}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{v.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-teal/20 bg-teal/5 p-8 text-center dark:bg-teal/10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Punya pertanyaan?</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Tim kami siap membantu Anda kapan saja.</p>
        <a
          href={waLink("Halo AutoManado, saya ingin bertanya.")}
          target="_blank"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" /> Chat WhatsApp
        </a>
      </div>
    </section>
  );
}

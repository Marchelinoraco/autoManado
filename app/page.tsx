import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, Sparkles } from "lucide-react";
import { getCars, getTestimonials } from "@/lib/cars";
import CarCard from "@/components/CarCard";
import Counter from "@/components/Counter";
import TestimonialGallery from "@/components/TestimonialGallery";
import ScrollReveal from "@/components/ScrollReveal";
import WaveDivider from "@/components/WaveDivider";
import TrustStrip from "@/components/TrustStrip";
import Faq from "@/components/Faq";
import { faqs } from "@/lib/faqs";
import { waLink } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function Home() {
  const [allCars, testimonials] = await Promise.all([
    getCars().catch(() => []),
    getTestimonials().catch(() => []),
  ]);
  const featured = allCars
    .filter((c) => c.badge === "POPULER" || c.badge === "BARU")
    .slice(0, 6);
  const showcase = featured.length ? featured : allCars.slice(0, 6);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ═══ HERO SINEMATIK ═══ */}
      <section className="relative -mt-[68px] min-h-[92vh] overflow-hidden">
        {/* Foto background + kenburns */}
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80"
            alt="Mobil mewah rental Manado"
            className="h-full w-full animate-kenburns object-cover"
          />
        </div>
        {/* Overlay gelap + sunset glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(255,111,94,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_60%,_rgba(20,184,166,0.18),_transparent_55%)]" />

        <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 pb-24 pt-36 md:min-h-[92vh]">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emas/30 bg-emas/10 px-4 py-1.5 text-sm font-medium text-emas">
              <MapPin className="h-3.5 w-3.5" /> #1 Marketplace Mobil di Sulawesi Utara
            </span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] md:text-7xl">
              Sewa &amp; Beli Mobil di{" "}
              <span className="text-gradient">Surga Sulawesi</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-gray-300">
              Jelajahi keindahan Manado, Tomohon, hingga Likupang dengan mobil
              pilihan terbaik. Proses mudah, harga transparan, langsung lewat
              WhatsApp.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/katalog"
                className="group flex items-center gap-2 rounded-full gradient-sunset px-7 py-3.5 font-semibold text-ink transition hover:opacity-90"
              >
                Jelajahi Armada
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href={waLink("Halo AutoManado, saya ingin menyewa/membeli mobil di Manado.")}
                target="_blank"
                className="flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold text-white transition hover:border-emas/40"
              >
                <MessageCircle className="h-4 w-4 text-teal" /> Hubungi WhatsApp
              </a>
            </div>
          </ScrollReveal>

          {/* Stats inline */}
          <ScrollReveal delay={320}>
            <div className="mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
              <Counter to={allCars.filter((c) => c.status === "tersedia").length || 50} suffix="+" label="Mobil Tersedia" />
              <Counter to={1200} suffix="+" label="Klien Puas" />
              <Counter to={8} suffix=" Thn" label="Pengalaman" />
              <Counter to={25} suffix="+" label="Mitra" />
            </div>
          </ScrollReveal>
        </div>

        <WaveDivider className="absolute bottom-0 left-0 text-ink" />
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <ScrollReveal>
          <TrustStrip />
        </ScrollReveal>
      </section>

      {/* ═══ ARMADA UNGGULAN ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <ScrollReveal className="flex items-end justify-between">
          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-coral">
              <Sparkles className="h-4 w-4" /> Pilihan Terbaik
            </span>
            <h2 className="mt-2 font-display text-4xl font-extrabold">Armada Unggulan</h2>
            <p className="mt-2 text-gray-400">Mobil paling diminati pelanggan kami.</p>
          </div>
          <Link href="/katalog" className="hidden items-center gap-1 text-emas hover:underline sm:flex">
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((car, i) => (
            <ScrollReveal key={car.id} delay={i * 70}>
              <CarCard car={car} />
            </ScrollReveal>
          ))}
        </div>
        {showcase.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            Belum ada mobil. Tambahkan lewat panel admin.
          </p>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/katalog" className="text-emas hover:underline">
            Lihat semua armada →
          </Link>
        </div>
      </section>

      {/* ═══ TESTIMONI ═══ */}
      <ScrollReveal>
        <TestimonialGallery testimonials={testimonials} />
      </ScrollReveal>

      {/* ═══ FAQ ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <ScrollReveal className="mb-10 text-center">
          <span className="text-sm font-medium text-teal">Pertanyaan Umum</span>
          <h2 className="mt-2 font-display text-4xl font-extrabold">Yang Sering Ditanyakan</h2>
        </ScrollReveal>
        <ScrollReveal>
          <Faq />
        </ScrollReveal>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-emas/20 p-10 text-center md:p-16">
            <div className="absolute inset-0 -z-10 gradient-sunset opacity-10" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(255,111,94,0.15),_transparent_70%)]" />
            <h2 className="font-display text-4xl font-extrabold md:text-5xl">
              Siap Menjelajah Manado?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-300">
              Pesan mobil impian Anda sekarang. Tim kami siap membantu, respon cepat 24/7.
            </p>
            <a
              href={waLink("Halo AutoManado, saya ingin memesan mobil.")}
              target="_blank"
              className="mt-8 inline-flex items-center gap-2 rounded-full gradient-sunset px-8 py-4 font-semibold text-ink transition hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Pesan via WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

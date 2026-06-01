import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, Star } from "lucide-react";
import Logo from "@/components/Logo";
import { getCars, getTestimonials } from "@/lib/cars";
import CarCard from "@/components/CarCard";
import Counter from "@/components/Counter";
import TestimonialGallery from "@/components/TestimonialGallery";
import ActivityGallery from "@/components/ActivityGallery";
import ScrollReveal from "@/components/ScrollReveal";
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

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900">
        {/* Background glow — dark mode only */}
        <div className="pointer-events-none absolute inset-0 -z-10 dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.15),transparent)]" />

        <div className="mx-auto max-w-7xl px-4 py-16 pb-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* ── Kiri: Teks ── */}
            <div>
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
                  <MapPin className="h-3.5 w-3.5" /> #1 Marketplace Mobil di
                  Sulawesi Utara
                </span>
              </ScrollReveal>

              <ScrollReveal delay={80}>
                <h1 className="mt-5 text-4xl font-bold leading-[1.15] text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  Rental &amp; Beli
                  <br />
                  Mobil di <span className="text-teal">Manado</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <p className="mt-5 text-base leading-relaxed text-gray-500 dark:text-gray-400 sm:text-lg">
                  Jelajahi keindahan Manado, Tomohon, hingga Likupang dengan
                  mobil pilihan terbaik. Proses mudah, harga transparan,
                  langsung lewat WhatsApp.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/katalog"
                    className="group inline-flex items-center gap-2 rounded-full bg-teal px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-teal/90 hover:shadow-md"
                  >
                    Jelajahi Armada
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                  <a
                    href={waLink(
                      "Halo AutoManado, saya ingin menyewa/membeli mobil di Manado.",
                    )}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
                  >
                    <MessageCircle className="h-4 w-4 text-teal" /> Hubungi
                    WhatsApp
                  </a>
                </div>
              </ScrollReveal>

              {/* Stats inline */}
              <ScrollReveal delay={320}>
                <div className="mt-10 grid grid-cols-4 gap-2 border-t border-gray-100 pt-8 dark:border-gray-800">
                  {[
                    {
                      value:
                        allCars.filter((c) => c.status === "tersedia").length ||
                        50,
                      suffix: "+",
                      label: "Mobil",
                    },
                    { value: 1200, suffix: "+", label: "Klien Puas" },
                    { value: 8, suffix: " Thn", label: "Pengalaman" },
                    { value: 25, suffix: "+", label: "Mitra" },
                  ].map((s) => (
                    <div key={s.label}>
                      <Counter
                        to={s.value}
                        suffix={s.suffix}
                        label={s.label}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* ── Kanan: Gambar + floating card ── */}
            <ScrollReveal delay={120} className="hidden lg:block">
              <div className="relative">
                {/* Gambar utama */}
                <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80"
                    alt="Mobil rental Manado"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Floating card kiri bawah */}
                <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <Logo size={28} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {allCars.filter((c) => c.status === "tersedia").length ||
                        50}
                      + Armada
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Siap disewa hari ini
                    </p>
                  </div>
                </div>

                {/* Floating card kanan atas */}
                <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    4.9
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    · 1200+ klien
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section className="bg-gray-50 py-12 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal>
            <TrustStrip />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ ARMADA UNGGULAN ═══ */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="flex items-end justify-between">
            <div>
              <span className="text-sm font-medium text-teal">
                Pilihan Terbaik
              </span>
              <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                Armada Unggulan
              </h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Mobil paling diminati pelanggan kami.
              </p>
            </div>
            <Link
              href="/katalog"
              className="hidden items-center gap-1 text-sm font-medium text-teal hover:underline sm:flex"
            >
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((car, i) => (
              <ScrollReveal key={car.id} delay={i * 60}>
                <CarCard car={car} />
              </ScrollReveal>
            ))}
          </div>
          {showcase.length === 0 && (
            <p className="py-16 text-center text-gray-400">
              Belum ada mobil. Tambahkan lewat panel admin.
            </p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/katalog"
              className="text-sm font-medium text-teal hover:underline"
            >
              Lihat semua armada →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ GALERI AKTIVITAS ═══ */}
      <ActivityGallery />

      {/* ═══ TESTIMONI ═══ */}
      <section className="bg-gray-50 py-4 dark:bg-gray-800/50">
        <ScrollReveal>
          <TestimonialGallery testimonials={testimonials} />
        </ScrollReveal>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-10 text-center">
            <span className="text-sm font-medium text-teal">
              Pertanyaan Umum
            </span>
            <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              Yang Sering Ditanyakan
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <Faq />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal>
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Siap Menjelajah Manado?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-gray-500 dark:text-gray-400">
                Pesan mobil impian Anda sekarang. Tim kami siap membantu, respon
                cepat 24/7.
              </p>
              <a
                href={waLink("Halo AutoManado, saya ingin memesan mobil.")}
                target="_blank"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal px-8 py-4 font-semibold text-white transition hover:bg-teal/90"
              >
                <MessageCircle className="h-5 w-5" /> Pesan via WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

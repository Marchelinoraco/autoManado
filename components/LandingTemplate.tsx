import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, Check } from "lucide-react";
import { Car } from "@/lib/types";
import CarCard from "@/components/CarCard";
import TrustStrip from "@/components/TrustStrip";
import ScrollReveal from "@/components/ScrollReveal";
import { waLink } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site";

export type LandingContent = {
  /** Label kecil di atas judul */
  eyebrow: string;
  /** H1 — mengandung keyword utama */
  title: string;
  /** Paragraf pembuka (kaya keyword, natural) */
  intro: string;
  /** Poin keunggulan (bullet) */
  highlights: string[];
  /** Blok konten tambahan untuk kedalaman SEO */
  sections: { heading: string; body: string }[];
  /** Mobil yang ditampilkan */
  cars: Car[];
  /** Teks judul daftar mobil */
  carsHeading: string;
  /** Pesan WhatsApp pre-fill */
  waMessage: string;
  /** Path halaman (untuk breadcrumb), mis. "/rental-mobil-manado" */
  path: string;
  /** Nama untuk breadcrumb terakhir */
  breadcrumbName: string;
};

export default function LandingTemplate(c: LandingContent) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: c.breadcrumbName, item: `${SITE_URL}${c.path}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── HERO ── */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-teal/5 to-white dark:border-gray-800 dark:from-teal/10 dark:to-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
              <MapPin className="h-3.5 w-3.5" /> {c.eyebrow}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              {c.title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-gray-400 sm:text-lg">
              {c.intro}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/katalog"
                className="group inline-flex items-center gap-2 rounded-full bg-teal px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-teal/90"
              >
                Lihat Semua Armada
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href={waLink(c.waMessage)}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <MessageCircle className="h-4 w-4 text-teal" /> Tanya via WhatsApp
              </a>
            </div>
          </ScrollReveal>

          {/* Highlights */}
          <ScrollReveal delay={320}>
            <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="h-4 w-4 text-teal" /> {h}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-gray-50 py-12 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4">
          <TrustStrip />
        </div>
      </section>

      {/* ── DAFTAR MOBIL ── */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              {c.carsHeading}
            </h2>
          </ScrollReveal>

          {c.cars.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.cars.map((car, i) => (
                <ScrollReveal key={car.id} delay={i * 50}>
                  <CarCard car={car} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-gray-400">
              Armada sedang diperbarui. Hubungi kami via WhatsApp untuk ketersediaan terbaru.
            </p>
          )}

          <div className="mt-8">
            <Link href="/katalog" className="text-sm font-medium text-teal hover:underline">
              Lihat katalog lengkap →
            </Link>
          </div>
        </div>
      </section>

      {/* ── KONTEN SEO ── */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-3xl space-y-8 px-4">
          {c.sections.map((s) => (
            <ScrollReveal key={s.heading}>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{s.heading}</h2>
                <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-14">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Siap pesan sekarang?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500 dark:text-gray-400">
              Tim AutoManado merespons cepat di WhatsApp, kurang dari 10 menit pada jam kerja.
            </p>
            <a
              href={waLink(c.waMessage)}
              target="_blank"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

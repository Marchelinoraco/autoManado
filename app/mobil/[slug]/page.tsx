import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Users, Fuel, Settings2, Calendar, Car as CarIcon,
  ClipboardList, MapPin, UserCheck, ShieldCheck,
} from "lucide-react";
import { getCarBySlug, getAllSlugs } from "@/lib/cars";
import { formatRupiah } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site";
import RentCalculator from "@/components/RentCalculator";
import BuyButton from "@/components/BuyButton";
import TanyaButton from "@/components/TanyaButton";
import PhotoGallery from "@/components/PhotoGallery";
import TrustStrip from "@/components/TrustStrip";
import { Zap, BadgeCheck } from "lucide-react";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const car = await getCarBySlug(params.slug);
  if (!car) return { title: "Mobil tidak ditemukan" };
  return {
    title: `${car.name} ${car.year} — ${car.category === "jual" ? "Jual" : "Sewa"} Mobil Manado`,
    description: `${car.name} ${car.year}, ${car.type}, ${car.transmission}, ${car.fuel}${car.kondisi ? `, kondisi ${car.kondisi}` : ""}. ${car.description ?? ""}`.slice(0, 160),
    alternates: { canonical: `/mobil/${car.slug}` },
    openGraph: {
      title: `${car.name} ${car.year} | AutoManado`,
      description: car.description ?? "",
      type: "website",
      images: car.images.length ? [{ url: car.images[0] }] : [],
    },
  };
}

const kondisiColor: Record<string, string> = {
  "Baik Sekali": "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
  "Baik": "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
  "Cukup": "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
  "Perlu Service": "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
};

export default async function CarDetail({ params }: { params: { slug: string } }) {
  const car = await getCarBySlug(params.slug);
  if (!car) notFound();

  const canRent = car.category === "rental" || car.category === "keduanya";
  const canBuy  = car.category === "jual"   || car.category === "keduanya";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${car.name} ${car.year}`,
    model: car.name,
    url: `${SITE_URL}/mobil/${car.slug}`,
    vehicleModelDate: String(car.year),
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    seatingCapacity: car.seats,
    vehicleConfiguration: car.type,
    image: car.images,
    description: car.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: car.price_sell ?? car.price_rent ?? 0,
      url: `${SITE_URL}/mobil/${car.slug}`,
      availability:
        car.status === "tersedia"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "AutoRental", name: "AutoManado", "@id": `${SITE_URL}/#business` },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Katalog", item: `${SITE_URL}/katalog` },
      { "@type": "ListItem", position: 3, name: car.name, item: `${SITE_URL}/mobil/${car.slug}` },
    ],
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }}
      />

      <div className="grid gap-10 lg:grid-cols-3">
        {/* ── KIRI: Galeri + Info ── */}
        <div className="lg:col-span-2">
          <PhotoGallery images={car.images} name={car.name} />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">{car.type}</span>
              {car.dengan_sopir && (
                <span className="flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
                  <UserCheck className="h-3 w-3" /> Tersedia dengan Sopir
                </span>
              )}
              {car.kondisi && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${kondisiColor[car.kondisi] ?? "text-gray-500 bg-gray-50"}`}>
                  Kondisi: {car.kondisi}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">{car.name}</h1>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Calendar,  l: "Tahun",      v: String(car.year) },
                { icon: Users,     l: "Kursi",       v: `${car.seats} kursi` },
                { icon: Settings2, l: "Transmisi",   v: car.transmission },
                { icon: Fuel,      l: "Bahan Bakar", v: car.fuel },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <s.icon className="h-5 w-5 text-teal" />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{s.l}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{s.v}</p>
                </div>
              ))}
            </div>

            {(car.plat_asal || car.kelengkapan || car.kondisi) && (
              <div className="mt-5 space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                  <ClipboardList className="h-4 w-4 text-teal" /> Detail &amp; Kelengkapan
                </h2>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  {car.plat_asal && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-teal shrink-0" />
                      <span>Plat Asal: <strong>{car.plat_asal}</strong></span>
                    </div>
                  )}
                  {car.kondisi && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
                      <span>Kondisi: <strong>{car.kondisi}</strong></span>
                    </div>
                  )}
                  {car.kelengkapan && (
                    <div className="col-span-full flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <ClipboardList className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                      <span>Kelengkapan: <strong>{car.kelengkapan}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {car.description && (
              <div className="mt-5">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                  <CarIcon className="h-5 w-5 text-teal" /> Deskripsi
                </h2>
                <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{car.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── KANAN: Harga + Aksi ── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {car.price_rent != null && (
              <p className="text-2xl font-bold text-teal">
                {formatRupiah(car.price_rent)}
                <span className="text-base font-normal text-gray-400"> / hari</span>
              </p>
            )}
            {car.price_sell != null && (
              <p className="mt-1 text-lg">
                <span className="text-gray-400">Harga jual: </span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{formatRupiah(car.price_sell)}</span>
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
                ${car.status === "tersedia" ? "bg-teal/10 text-teal" :
                  car.status === "disewa"   ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                  "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"}`}>
                {car.status}
              </span>
              {car.images.length > 0 && (
                <span className="text-xs text-gray-400">{car.images.length} foto tersedia</span>
              )}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs dark:border-gray-700">
              <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Zap className="h-3.5 w-3.5 text-teal" /> Respon WhatsApp &lt; 10 menit
              </p>
              <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <BadgeCheck className="h-3.5 w-3.5 text-teal" /> Harga final dikonfirmasi langsung, transparan
              </p>
            </div>
          </div>

          {canBuy  && <BuyButton car={car} />}
          <TanyaButton car={car} />
          {canRent && car.price_rent != null && <RentCalculator car={car} />}
        </div>
      </div>

      <div className="mt-12">
        <TrustStrip compact />
      </div>
    </section>
  );
}

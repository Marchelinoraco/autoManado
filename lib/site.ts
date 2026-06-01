// Konfigurasi terpusat situs — sumber kebenaran untuk URL & data bisnis (SEO/local SEO)
import { WA_NUMBER } from "./whatsapp";

export const SITE_URL = "https://automanado.com";

export const SITE = {
  name: "AutoManado",
  legalName: "AutoManado",
  url: SITE_URL,
  /** Deskripsi default untuk metadata & structured data */
  description:
    "AutoManado — marketplace rental dan jual-beli mobil terpercaya di Kota Manado, Sulawesi Utara. Sewa mobil harian, mingguan, bulanan & beli mobil berkualitas. Pesan mudah via WhatsApp.",
  city: "Manado",
  region: "Sulawesi Utara",
  regionCode: "ID-SA",
  country: "ID",
  /** Nomor WhatsApp bisnis dalam format internasional */
  whatsapp: WA_NUMBER,
  /** Untuk schema telephone (E.164) */
  telephone: `+${WA_NUMBER}`,
  /** Koordinat pusat layanan (Kota Manado) */
  geo: { lat: 1.4748, lng: 124.8421 },
  /** Area layanan untuk LocalBusiness areaServed */
  areaServed: ["Manado", "Tomohon", "Bitung", "Minahasa", "Likupang", "Airmadidi"],
  ogImage: `${SITE_URL}/og-image.jpg`,
} as const;

/** JSON-LD AutoRental (LocalBusiness) — dipasang sekali di layout untuk local SEO */
export const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  "@id": `${SITE_URL}/#business`,
  name: SITE.name,
  description: SITE.description,
  url: SITE_URL,
  telephone: SITE.telephone,
  priceRange: "Rp",
  image: SITE.ogImage,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE.geo.lat,
    longitude: SITE.geo.lng,
  },
  areaServed: SITE.areaServed.map((name) => ({ "@type": "City", name })),
  sameAs: [`https://wa.me/${SITE.whatsapp}`],
};

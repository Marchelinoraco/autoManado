import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/cars";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs().catch(() => []);

  const landingPages = [
    "/rental-mobil-manado",
    "/sewa-mobil-lepas-kunci-manado",
    "/rental-mobil-dengan-sopir-manado",
    "/jual-mobil-bekas-manado",
  ];

  const staticPages = ["", "/katalog", "/promo", "/banding", "/tentang", ...landingPages].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : landingPages.includes(p) ? 0.9 : 0.8,
  }));

  const carPages = slugs.map((slug) => ({
    url: `${SITE_URL}/mobil/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...carPages];
}

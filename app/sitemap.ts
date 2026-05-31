import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/cars";

const BASE = "https://manarent.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs().catch(() => []);

  const staticPages = ["", "/katalog", "/promo", "/tentang"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const carPages = slugs.map((slug) => ({
    url: `${BASE}/mobil/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...carPages];
}

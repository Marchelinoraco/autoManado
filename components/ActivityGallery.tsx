"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type GalleryImage = {
  id: number;
  filename: string;
  url: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
};

export default function ActivityGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal" />
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center">
            <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-sm font-semibold text-teal">
              GALERI AKTIVITAS
            </span>
            <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Momen AutoManado
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Lihat aktivitas dan pengalaman pelanggan kami di Manado
            </p>
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <ScrollReveal key={img.id} delay={i * 80}>
              <div className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition hover:shadow-md dark:bg-gray-800">
                {/* Image Container */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.url}
                    alt={img.filename}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition group-hover:opacity-100">
                    <div className="w-full p-4">
                      <p className="text-sm font-medium text-white">{img.filename}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Button */}
        <ScrollReveal delay={images.length * 80} className="mt-12 flex justify-center">
          <Link
            href="/admin/login"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-teal hover:bg-teal/5 hover:text-teal dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-teal dark:hover:text-teal"
          >
            Lihat Lebih Banyak
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

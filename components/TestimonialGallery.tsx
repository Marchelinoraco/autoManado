"use client";

import Image from "next/image";
import { Star, Quote, Car, ShoppingCart, User } from "lucide-react";
import { Testimonial } from "@/lib/types";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-emas text-emas" : "fill-white/10 text-white/10"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ photo, name }: { photo: string | null; name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (photo) {
    return (
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-emas/50 shadow-lg">
        <Image src={photo} alt={name} fill sizes="64px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-emas/30 bg-gradient-to-br from-merah/40 to-emas/20 text-lg font-bold text-emas shadow-lg">
      {initials}
    </div>
  );
}

export default function TestimonialGallery({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;

  // Bagi menjadi featured (rating 5) dan sisanya
  const featured = testimonials.filter((t) => t.rating === 5).slice(0, 1)[0];
  const rest = testimonials.filter((t) => t !== featured);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      {/* Heading */}
      <div className="text-center">
        <span className="inline-block rounded-full border border-emas/30 bg-emas/10 px-4 py-1 text-sm font-medium text-emas">
          Klien Kami
        </span>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Mereka Sudah Mempercayai <span className="text-emas">AutoManado</span>
        </h2>
        <p className="mt-3 text-gray-400">
          Ratusan pelanggan dari Manado dan seluruh Indonesia sudah merasakan kemudahannya.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {/* Card featured (besar, jika ada) */}
        {featured && (
          <div className="relative overflow-hidden rounded-3xl border border-emas/20 bg-gradient-to-br from-emas/10 via-white/5 to-merah/5 p-8">
            <Quote className="absolute right-6 top-6 h-16 w-16 text-emas/10" />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Avatar photo={featured.photo} name={featured.name} />
              <div className="flex-1">
                <StarRow rating={featured.rating} />
                <p className="mt-3 text-lg leading-relaxed text-gray-100">
                  &ldquo;{featured.message}&rdquo;
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div>
                    <p className="font-bold text-white">{featured.name}</p>
                    {featured.location && (
                      <p className="text-sm text-gray-400">{featured.location}</p>
                    )}
                  </div>
                  {featured.car_name && (
                    <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                      {featured.service === "jual"
                        ? <ShoppingCart className="h-3 w-3 text-biru" />
                        : <Car className="h-3 w-3 text-emas" />}
                      {featured.service === "jual" ? "Beli" : "Sewa"} {featured.car_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid kartu lainnya */}
        {rest.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((t) => (
              <div
                key={t.id}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emas/30 hover:bg-white/8"
              >
                <Quote className="absolute right-4 top-4 h-8 w-8 text-white/5 group-hover:text-emas/10 transition" />

                <StarRow rating={t.rating} />

                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-300">
                  &ldquo;{t.message}&rdquo;
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <Avatar photo={t.photo} name={t.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{t.name}</p>
                    {t.location && (
                      <p className="truncate text-xs text-gray-500">{t.location}</p>
                    )}
                    {t.car_name && (
                      <span className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        {t.service === "jual"
                          ? <ShoppingCart className="h-3 w-3 text-biru shrink-0" />
                          : <Car className="h-3 w-3 text-emas shrink-0" />}
                        {t.service === "jual" ? "Beli" : "Sewa"} {t.car_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <div>
          <p className="text-2xl font-extrabold text-emas">
            {testimonials.filter((t) => t.rating === 5).length}
          </p>
          <p className="mt-1 text-xs text-gray-400">Rating Bintang 5</p>
        </div>
        <div className="border-x border-white/10">
          <p className="text-2xl font-extrabold text-emas">{testimonials.length}+</p>
          <p className="mt-1 text-xs text-gray-400">Ulasan Klien</p>
        </div>
        <div>
          <p className="text-2xl font-extrabold text-emas">
            {testimonials.length > 0
              ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
              : "5.0"}
          </p>
          <p className="mt-1 text-xs text-gray-400">Rata-rata Rating</p>
        </div>
      </div>
    </section>
  );
}

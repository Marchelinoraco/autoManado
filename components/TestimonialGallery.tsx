"use client";

import Image from "next/image";
import { Star, Quote, Car, ShoppingCart } from "lucide-react";
import { Testimonial } from "@/lib/types";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`}
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
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-teal/30">
        <Image src={photo} alt={name} fill sizes="48px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal/10 text-sm font-bold text-teal">
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

  const featured = testimonials.filter((t) => t.rating === 5).slice(0, 1)[0];
  const rest = testimonials.filter((t) => t !== featured);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full border border-teal/30 bg-teal/10 px-4 py-1 text-sm font-medium text-teal">
          Klien Kami
        </span>
        <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
          Mereka Sudah Mempercayai <span className="text-teal">AutoManado</span>
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Ratusan pelanggan dari Manado dan seluruh Indonesia sudah merasakan kemudahannya.
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {/* Card featured */}
        {featured && (
          <div className="relative overflow-hidden rounded-2xl border border-teal/20 bg-teal/5 p-8 dark:bg-teal/10">
            <Quote className="absolute right-6 top-6 h-12 w-12 text-teal/10" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Avatar photo={featured.photo} name={featured.name} />
              <div className="flex-1">
                <StarRow rating={featured.rating} />
                <p className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  &ldquo;{featured.message}&rdquo;
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{featured.name}</p>
                    {featured.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{featured.location}</p>
                    )}
                  </div>
                  {featured.car_name && (
                    <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {featured.service === "jual"
                        ? <ShoppingCart className="h-3 w-3 text-teal" />
                        : <Car className="h-3 w-3 text-teal" />}
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
                className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-teal/30 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <Quote className="absolute right-4 top-4 h-8 w-8 text-gray-100 dark:text-gray-700" />
                <StarRow rating={t.rating} />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  &ldquo;{t.message}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <Avatar photo={t.photo} name={t.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    {t.location && (
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">{t.location}</p>
                    )}
                    {t.car_name && (
                      <span className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        {t.service === "jual"
                          ? <ShoppingCart className="h-3 w-3 text-teal shrink-0" />
                          : <Car className="h-3 w-3 text-teal shrink-0" />}
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
      <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div>
          <p className="text-2xl font-bold text-teal">
            {testimonials.filter((t) => t.rating === 5).length}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Rating Bintang 5</p>
        </div>
        <div className="border-x border-gray-100 dark:border-gray-700">
          <p className="text-2xl font-bold text-teal">{testimonials.length}+</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Ulasan Klien</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-teal">
            {testimonials.length > 0
              ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
              : "5.0"}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Rata-rata Rating</p>
        </div>
      </div>
    </section>
  );
}

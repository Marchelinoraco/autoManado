"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Settings2, Calendar, UserCheck, Check, GitCompareArrows } from "lucide-react";
import { Car } from "@/lib/types";
import { formatRupiah } from "@/lib/whatsapp";
import { useCompare } from "./CompareProvider";

const badgeColor: Record<string, string> = {
  POPULER: "gradient-sunset text-ink",
  BARU: "bg-teal text-ink",
  PROMO: "bg-merah text-white",
};

const statusColor: Record<string, string> = {
  tersedia: "bg-teal/20 text-teal",
  disewa: "bg-emas/20 text-emas",
  terjual: "bg-merah/20 text-merah",
};

export default function CarCard({ car }: { car: Car }) {
  const { has, toggle, full } = useCompare();
  const selected = has(car.id);
  const photoCount = car.images.length;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1.5 hover:border-emas/40 hover:shadow-2xl hover:shadow-coral/10">
      {/* Tombol banding */}
      <button
        onClick={() => toggle(car)}
        disabled={!selected && full}
        title={selected ? "Hapus dari perbandingan" : "Tambah ke perbandingan"}
        className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition ${
          selected
            ? "gradient-sunset text-ink"
            : "bg-black/50 text-white hover:bg-black/70 disabled:opacity-40"
        }`}
      >
        {selected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
      </button>

      <Link href={`/mobil/${car.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          {car.images[0] ? (
            <Image
              src={car.images[0]}
              alt={`${car.name} ${car.year} - rental & jual mobil Manado`}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-white/5 text-sm text-gray-600">
              Foto belum tersedia
            </div>
          )}
          {/* overlay gradient bawah */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute left-3 top-3 flex gap-1.5">
            {car.badge && (
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeColor[car.badge]}`}>
                {car.badge}
              </span>
            )}
            {car.dengan_sopir && (
              <span className="flex items-center gap-1 rounded-full bg-laut/80 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                <UserCheck className="h-3 w-3" /> Sopir
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="rounded-md bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur">
              {car.type}
            </span>
            {photoCount > 0 && (
              <span className="rounded-md bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                {photoCount} foto
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold leading-tight">{car.name}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColor[car.status]}`}>
              {car.status}
            </span>
          </div>

          {car.kondisi && (
            <p className="mt-1 text-xs text-gray-500">Kondisi: {car.kondisi}</p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar  className="h-3.5 w-3.5 text-emas/70" /> {car.year}</span>
            <span className="flex items-center gap-1"><Users     className="h-3.5 w-3.5 text-emas/70" /> {car.seats} kursi</span>
            <span className="flex items-center gap-1"><Settings2 className="h-3.5 w-3.5 text-emas/70" /> {car.transmission}</span>
            <span className="flex items-center gap-1"><Fuel      className="h-3.5 w-3.5 text-emas/70" /> {car.fuel}</span>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
            <div>
              {car.price_rent != null && (
                <p className="text-sm">
                  <span className="font-display text-xl font-extrabold text-gradient">{formatRupiah(car.price_rent)}</span>
                  <span className="text-xs text-gray-400"> /hari</span>
                </p>
              )}
              {car.price_sell != null && (
                <p className="text-xs">
                  <span className="text-gray-500">Jual: </span>
                  <span className="font-semibold text-biru">{formatRupiah(car.price_sell)}</span>
                </p>
              )}
            </div>
            <span className="rounded-full border border-emas/30 px-3 py-1 text-[11px] font-semibold text-emas transition group-hover:gradient-sunset group-hover:text-ink group-hover:border-transparent">
              Lihat Detail
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

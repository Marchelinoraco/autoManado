"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Settings2, Calendar, UserCheck, Check, GitCompareArrows } from "lucide-react";
import { Car } from "@/lib/types";
import { formatRupiah } from "@/lib/whatsapp";
import { useCompare } from "./CompareProvider";

const badgeColor: Record<string, string> = {
  POPULER: "bg-teal text-white",
  BARU: "bg-gray-800 text-white",
  PROMO: "bg-red-500 text-white",
};

const statusColor: Record<string, string> = {
  tersedia: "bg-teal/10 text-teal",
  disewa: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  terjual: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400",
};

export default function CarCard({ car }: { car: Car }) {
  const { has, toggle, full } = useCompare();
  const selected = has(car.id);
  const photoCount = car.images.length;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Tombol banding */}
      <button
        onClick={() => toggle(car)}
        disabled={!selected && full}
        title={selected ? "Hapus dari perbandingan" : "Tambah ke perbandingan"}
        className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition ${
          selected
            ? "bg-teal text-white"
            : "bg-white/90 text-gray-500 shadow hover:bg-white hover:text-gray-700 disabled:opacity-40 dark:bg-gray-900/80 dark:text-gray-400 dark:hover:bg-gray-900"
        }`}
      >
        {selected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
      </button>

      <Link href={`/mobil/${car.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-700">
          {car.images[0] ? (
            <Image
              src={car.images[0]}
              alt={`${car.name} ${car.year} - rental & jual mobil Manado`}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Foto belum tersedia
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-1.5">
            {car.badge && (
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeColor[car.badge]}`}>
                {car.badge}
              </span>
            )}
            {car.dengan_sopir && (
              <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-gray-700 shadow-sm dark:bg-gray-900/80 dark:text-gray-200">
                <UserCheck className="h-3 w-3 text-teal" /> Sopir
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-600 shadow-sm dark:bg-gray-900/80 dark:text-gray-300">
              {car.type}
            </span>
            {photoCount > 0 && (
              <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] text-gray-500 shadow-sm dark:bg-gray-900/80 dark:text-gray-400">
                {photoCount} foto
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold leading-tight text-gray-900 dark:text-white">{car.name}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColor[car.status]}`}>
              {car.status}
            </span>
          </div>

          {car.kondisi && (
            <p className="mt-1 text-xs text-gray-400">{`Kondisi: ${car.kondisi}`}</p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Calendar  className="h-3.5 w-3.5 text-teal/70" /> {car.year}</span>
            <span className="flex items-center gap-1"><Users     className="h-3.5 w-3.5 text-teal/70" /> {car.seats} kursi</span>
            <span className="flex items-center gap-1"><Settings2 className="h-3.5 w-3.5 text-teal/70" /> {car.transmission}</span>
            <span className="flex items-center gap-1"><Fuel      className="h-3.5 w-3.5 text-teal/70" /> {car.fuel}</span>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
            <div>
              {car.price_rent != null && (
                <p className="text-sm">
                  <span className="text-xl font-bold text-teal">{formatRupiah(car.price_rent)}</span>
                  <span className="text-xs text-gray-400"> /hari</span>
                </p>
              )}
              {car.price_sell != null && (
                <p className="text-xs">
                  <span className="text-gray-400">Jual: </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{formatRupiah(car.price_sell)}</span>
                </p>
              )}
            </div>
            <span className="rounded-full bg-teal/10 px-3 py-1 text-[11px] font-semibold text-teal transition group-hover:bg-teal group-hover:text-white">
              Lihat Detail
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

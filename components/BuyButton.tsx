"use client";

import { Car } from "@/lib/types";
import { formatRupiah, waLink } from "@/lib/whatsapp";
import { ShoppingCart } from "lucide-react";

export default function BuyButton({ car }: { car: Car }) {
  const message = `🚗 MINAT BELI - AUTOMANADO
🚙 Mobil: ${car.name} (${car.year})
💰 Harga: ${formatRupiah(car.price_sell)}
Halo, saya tertarik membeli mobil ini. Mohon info lebih lanjut.`;

  return (
    <a
      href={waLink(message)}
      target="_blank"
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 font-semibold text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      <ShoppingCart className="h-5 w-5" /> Beli — {formatRupiah(car.price_sell)}
    </a>
  );
}

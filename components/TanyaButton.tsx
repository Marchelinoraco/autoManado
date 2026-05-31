import { Car } from "@/lib/types";
import { waLink, formatRupiah } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export default function TanyaButton({ car }: { car: Car }) {
  const message = `Halo AutoManado 👋

Saya ingin menanyakan ketersediaan mobil berikut:
🚗 *${car.name}* (${car.year})
🏷️ Tipe: ${car.type} | ${car.transmission} | ${car.fuel}
${car.price_rent ? `💵 Harga sewa: ${formatRupiah(car.price_rent)}/hari` : ""}
${car.price_sell ? `💰 Harga jual: ${formatRupiah(car.price_sell)}` : ""}

Apakah mobil ini masih tersedia? Terima kasih.`;

  return (
    <a
      href={waLink(message)}
      target="_blank"
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 font-semibold text-gray-200 transition hover:border-emas hover:text-emas"
    >
      <MessageCircle className="h-5 w-5" /> Tanya Ketersediaan
    </a>
  );
}

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
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:border-teal hover:text-teal dark:border-gray-700 dark:text-gray-300 dark:hover:border-teal dark:hover:text-teal"
    >
      <MessageCircle className="h-5 w-5" /> Tanya Ketersediaan
    </a>
  );
}

import Link from "next/link";
import { Car, MapPin, Phone, Clock } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-noir">
      {/* aksen gradient atas */}
      <div className="hairline" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-sunset">
              <Car className="h-5 w-5 text-ink" />
            </span>
            <span className="font-display text-xl font-bold">
              Auto<span className="text-gradient">Manado</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Marketplace rental &amp; jual-beli mobil terpercaya di Kota Manado,
            Sulawesi Utara. Jelajahi surga Sulawesi bersama kami.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-emas">Menu</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li><Link href="/katalog" className="transition hover:text-white">Katalog Mobil</Link></li>
            <li><Link href="/banding" className="transition hover:text-white">Bandingkan Mobil</Link></li>
            <li><Link href="/promo" className="transition hover:text-white">Promo</Link></li>
            <li><Link href="/tentang" className="transition hover:text-white">Tentang Kami</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-emas">Layanan</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>Rental Mobil Harian</li>
            <li>Sewa + Sopir</li>
            <li>Jual Beli Mobil</li>
            <li>Antar-Jemput Bandara</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-emas">Kontak</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>
              <a href={waLink("Halo AutoManado")} target="_blank" className="flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4 text-teal" /> 0823-4813-5155
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-coral" /> Kota Manado, Sulut
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emas" /> Setiap hari, 08.00–21.00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} AutoManado. Semua hak dilindungi. · Dibuat dengan ❤️ untuk Sulawesi Utara
      </div>
    </footer>
  );
}

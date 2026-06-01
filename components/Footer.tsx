import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import Logo from "./Logo";
import { waLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Auto<span className="text-teal">Manado</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Marketplace rental &amp; jual-beli mobil terpercaya di Kota Manado,
            Sulawesi Utara. Jelajahi surga Sulawesi bersama kami.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">Menu</h4>
          <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/katalog" className="transition hover:text-gray-900 dark:hover:text-white">Katalog Mobil</Link></li>
            <li><Link href="/banding" className="transition hover:text-gray-900 dark:hover:text-white">Bandingkan Mobil</Link></li>
            <li><Link href="/promo" className="transition hover:text-gray-900 dark:hover:text-white">Promo</Link></li>
            <li><Link href="/blog" className="transition hover:text-gray-900 dark:hover:text-white">Artikel & Tips</Link></li>
            <li><Link href="/tentang" className="transition hover:text-gray-900 dark:hover:text-white">Tentang Kami</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">Layanan</h4>
          <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/rental-mobil-manado" className="transition hover:text-gray-900 dark:hover:text-white">Rental Mobil Manado</Link></li>
            <li><Link href="/sewa-mobil-lepas-kunci-manado" className="transition hover:text-gray-900 dark:hover:text-white">Sewa Mobil Lepas Kunci</Link></li>
            <li><Link href="/rental-mobil-dengan-sopir-manado" className="transition hover:text-gray-900 dark:hover:text-white">Rental Mobil + Sopir</Link></li>
            <li><Link href="/jual-mobil-bekas-manado" className="transition hover:text-gray-900 dark:hover:text-white">Jual Mobil Bekas Manado</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">Kontak</h4>
          <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <a href={waLink("Halo AutoManado")} target="_blank" className="flex items-center gap-2 transition hover:text-gray-900 dark:hover:text-white">
                <Phone className="h-4 w-4 text-teal" /> 0823-4813-5155
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal" /> Kota Manado, Sulut
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal" /> Setiap hari, 08.00–21.00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-5 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
        © {new Date().getFullYear()} AutoManado. Semua hak dilindungi. · Dibuat dengan ❤️ untuk Sulawesi Utara
      </div>
    </footer>
  );
}

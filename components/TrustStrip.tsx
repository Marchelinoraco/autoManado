import { ShieldCheck, Zap, Tag, Camera } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Mitra Terverifikasi", desc: "Rental & dealer tepercaya" },
  { icon: Zap, title: "Respon Cepat", desc: "Balas WhatsApp < 10 menit" },
  { icon: Tag, title: "Harga Transparan", desc: "Tanpa biaya tersembunyi" },
  { icon: Camera, title: "5 Foto Jelas", desc: "Lihat mobil sebelum pesan" },
];

export default function TrustStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`grid gap-3 ${compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-4"}`}
    >
      {items.map((it) => (
        <div
          key={it.title}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal/10">
            <it.icon className="h-5 w-5 text-teal" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-white">{it.title}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{it.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

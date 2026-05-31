"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/components/CompareProvider";
import { formatRupiah, waLink } from "@/lib/whatsapp";
import { X, GitCompareArrows, MessageCircle, ArrowLeft, Check, Minus } from "lucide-react";

export default function BandingPage() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 text-center">
        <GitCompareArrows className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Belum Ada Mobil Dibandingkan</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Pilih 2-3 mobil dari katalog (klik ikon banding di kartu mobil) untuk
          membandingkan spesifikasinya berdampingan.
        </p>
        <Link
          href="/katalog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 font-semibold text-white transition hover:bg-teal/90"
        >
          <ArrowLeft className="h-4 w-4" /> Ke Katalog
        </Link>
      </section>
    );
  }

  const rows: { label: string; render: (c: (typeof items)[number]) => React.ReactNode }[] = [
    { label: "Tipe", render: (c) => c.type },
    { label: "Kategori", render: (c) => <span className="capitalize">{c.category}</span> },
    { label: "Status", render: (c) => <span className="capitalize">{c.status}</span> },
    { label: "Harga Sewa/hari", render: (c) => c.price_rent ? <span className="font-semibold text-teal">{formatRupiah(c.price_rent)}</span> : "—" },
    { label: "Harga Jual", render: (c) => c.price_sell ? <span className="font-semibold text-gray-700 dark:text-gray-200">{formatRupiah(c.price_sell)}</span> : "—" },
    { label: "Tahun", render: (c) => c.year },
    { label: "Jumlah Kursi", render: (c) => `${c.seats} kursi` },
    { label: "Transmisi", render: (c) => c.transmission },
    { label: "Bahan Bakar", render: (c) => c.fuel },
    { label: "Kondisi", render: (c) => c.kondisi ?? "—" },
    { label: "Plat Asal", render: (c) => c.plat_asal ?? "—" },
    {
      label: "Dengan Sopir",
      render: (c) => c.dengan_sopir
        ? <Check className="mx-auto h-4 w-4 text-teal" />
        : <Minus className="mx-auto h-4 w-4 text-gray-300 dark:text-gray-600" />,
    },
    { label: "Kelengkapan", render: (c) => c.kelengkapan ?? "—" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Bandingkan Mobil</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{items.length} mobil dibandingkan</p>
        </div>
        <button
          onClick={clear}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          Kosongkan semua
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr>
              <th className="w-40 bg-gray-50 p-4 text-left text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">Spesifikasi</th>
              {items.map((c) => (
                <th key={c.id} className="border-l border-gray-100 p-4 align-top dark:border-gray-700">
                  <div className="relative mx-auto aspect-[16/10] w-full max-w-[200px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    {c.images[0] ? (
                      <Image src={c.images[0]} alt={c.name} fill sizes="200px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-50 text-xs text-gray-400 dark:bg-gray-800">No foto</div>
                    )}
                    <button
                      onClick={() => remove(c.id)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-1 text-white"
                      aria-label="Hapus"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-3 font-bold text-gray-900 dark:text-white">{c.name}</p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700 dark:text-gray-300">
            {rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"}>
                <td className="bg-gray-50 p-4 font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">{row.label}</td>
                {items.map((c) => (
                  <td key={c.id} className="border-l border-gray-100 p-4 text-center dark:border-gray-700">
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}

            <tr className="bg-white dark:bg-gray-900">
              <td className="bg-gray-50 p-4 dark:bg-gray-800" />
              {items.map((c) => (
                <td key={c.id} className="border-l border-gray-100 p-4 text-center dark:border-gray-700">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/mobil/${c.slug}`}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:border-teal/40 hover:text-teal dark:border-gray-700 dark:text-gray-400"
                    >
                      Lihat Detail
                    </Link>
                    <a
                      href={waLink(`Halo AutoManado, saya tertarik dengan ${c.name} (${c.year}). Mohon info lebih lanjut.`)}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Link href="/katalog" className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:underline">
          <ArrowLeft className="h-4 w-4" /> Tambah mobil lain dari katalog
        </Link>
      </div>
    </section>
  );
}

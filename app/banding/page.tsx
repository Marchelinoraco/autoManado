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
        <GitCompareArrows className="mx-auto h-14 w-14 text-gray-600" />
        <h1 className="mt-6 font-display text-3xl font-extrabold">Belum Ada Mobil Dibandingkan</h1>
        <p className="mt-3 text-gray-400">
          Pilih 2-3 mobil dari katalog (klik ikon banding di kartu mobil) untuk
          membandingkan spesifikasinya berdampingan.
        </p>
        <Link
          href="/katalog"
          className="mt-8 inline-flex items-center gap-2 rounded-full gradient-sunset px-6 py-3 font-semibold text-ink transition hover:opacity-90"
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
    { label: "Harga Sewa/hari", render: (c) => c.price_rent ? <span className="font-semibold text-emas">{formatRupiah(c.price_rent)}</span> : "—" },
    { label: "Harga Jual", render: (c) => c.price_sell ? <span className="font-semibold text-biru">{formatRupiah(c.price_sell)}</span> : "—" },
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
        : <Minus className="mx-auto h-4 w-4 text-gray-600" />,
    },
    { label: "Kelengkapan", render: (c) => c.kelengkapan ?? "—" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            Bandingkan Mobil
          </h1>
          <p className="mt-2 text-gray-400">{items.length} mobil dibandingkan</p>
        </div>
        <button
          onClick={clear}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 hover:text-white"
        >
          Kosongkan semua
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px]">
          {/* Header: foto + nama */}
          <thead>
            <tr>
              <th className="w-40 bg-white/5 p-4 text-left text-sm text-gray-400">Spesifikasi</th>
              {items.map((c) => (
                <th key={c.id} className="border-l border-white/10 p-4 align-top">
                  <div className="relative mx-auto aspect-[16/10] w-full max-w-[200px] overflow-hidden rounded-xl border border-white/10">
                    {c.images[0] ? (
                      <Image src={c.images[0]} alt={c.name} fill sizes="200px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/5 text-xs text-gray-600">No foto</div>
                    )}
                    <button
                      onClick={() => remove(c.id)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-merah p-1 text-white"
                      aria-label="Hapus"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-3 font-display text-lg font-bold">{c.name}</p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm">
            {rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 ? "bg-white/[0.02]" : ""}>
                <td className="bg-white/5 p-4 font-medium text-gray-400">{row.label}</td>
                {items.map((c) => (
                  <td key={c.id} className="border-l border-white/10 p-4 text-center">
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Aksi WA */}
            <tr>
              <td className="bg-white/5 p-4" />
              {items.map((c) => (
                <td key={c.id} className="border-l border-white/10 p-4 text-center">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/mobil/${c.slug}`}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-200 hover:border-emas/40"
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
        <Link href="/katalog" className="inline-flex items-center gap-2 text-emas hover:underline">
          <ArrowLeft className="h-4 w-4" /> Tambah mobil lain dari katalog
        </Link>
      </div>
    </section>
  );
}

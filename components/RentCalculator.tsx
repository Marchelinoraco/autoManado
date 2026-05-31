"use client";

import { useMemo, useState } from "react";
import { Car } from "@/lib/types";
import { formatRupiah, waLink } from "@/lib/whatsapp";
import { CalendarDays, MessageCircle, UserCheck } from "lucide-react";

type Mode = "hari" | "minggu" | "bulan";

const config: Record<Mode, { days: number; discount: number; label: string }> = {
  hari:   { days: 1,  discount: 0,   label: "Per Hari" },
  minggu: { days: 7,  discount: 0.1, label: "Per Minggu (diskon 10%)" },
  bulan:  { days: 30, discount: 0.2, label: "Per Bulan (diskon 20%)" },
};

export default function RentCalculator({ car }: { car: Car }) {
  const [mode, setMode] = useState<Mode>("hari");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [withDriver, setWithDriver] = useState(false);
  const [note, setNote] = useState("");

  const rate = car.price_rent ?? 0;
  const { days, discount } = config[mode];
  const totalDays = days * qty;

  const { subtotal, potongan, total, endDate } = useMemo(() => {
    const subtotal = rate * totalDays;
    const potongan = Math.round(subtotal * discount);
    const total = subtotal - potongan;
    let endDate = "";
    if (startDate) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + totalDays);
      endDate = d.toISOString().slice(0, 10);
    }
    return { subtotal, potongan, total, endDate };
  }, [rate, totalDays, discount, startDate]);

  const message =
`🚗 *BOOKING RENTAL — MANARENT*

👤 Nama       : ${name || "-"}
🚙 Mobil      : ${car.name} (${car.year})
🏷️ Tipe       : ${car.type} | ${car.transmission} | ${car.fuel}
${car.plat_asal ? `🔢 Plat        : ${car.plat_asal}\n` : ""}${car.kondisi ? `✅ Kondisi     : ${car.kondisi}\n` : ""}📅 Mulai       : ${startDate || "-"}
📅 Selesai     : ${endDate || "-"}
⏱️ Durasi      : ${totalDays} hari (${config[mode].label})
🧑‍✈️ Dengan Sopir: ${withDriver ? "Ya" : "Tidak"}
💵 Est. Total  : ${formatRupiah(total)}${potongan > 0 ? ` (sudah diskon ${Math.round(discount * 100)}%)` : ""}
📝 Catatan     : ${note || "-"}

Mohon konfirmasi ketersediaan & harga final. Terima kasih! 🙏`;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <CalendarDays className="h-5 w-5 text-emas" /> Kalkulator Sewa
      </h3>

      {/* Pilih durasi */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(Object.keys(config) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg border px-2 py-2 text-xs font-semibold capitalize transition ${
              mode === m
                ? "border-emas bg-emas text-ink"
                : "border-white/10 text-gray-300 hover:border-emas/50"
            }`}
          >
            {m}
            {m !== "hari" && (
              <span className={`ml-1 text-[10px] ${mode === m ? "text-ink/70" : "text-green-400"}`}>
                {m === "minggu" ? "-10%" : "-20%"}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <label className="block text-sm">
          <span className="text-gray-400">Nama Anda *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama Anda"
            className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-gray-400">Tanggal Mulai</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-400">
              Jumlah {mode === "hari" ? "hari" : mode === "minggu" ? "minggu" : "bulan"}
            </span>
            <input
              type="number"
              min={1}
              max={90}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
            />
          </label>
        </div>

        {/* Sopir toggle */}
        {car.dengan_sopir && (
          <button
            type="button"
            onClick={() => setWithDriver((v) => !v)}
            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
              withDriver
                ? "border-emas/60 bg-emas/10 text-emas"
                : "border-white/10 text-gray-300 hover:border-emas/30"
            }`}
          >
            <UserCheck className="h-4 w-4 shrink-0" />
            <span>{withDriver ? "✓ Dengan Sopir dipilih" : "Tambah Sopir (opsional)"}</span>
          </button>
        )}

        <label className="block text-sm">
          <span className="text-gray-400">Catatan (lokasi antar, permintaan, dll.)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Misal: antar ke Bandara Sam Ratulangi pukul 08.00"
            className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
          />
        </label>
      </div>

      {/* Ringkasan harga */}
      <div className="mt-4 space-y-1.5 rounded-xl bg-black/30 p-4 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>{formatRupiah(rate)} × {totalDays} hari</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        {potongan > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Diskon {Math.round(discount * 100)}% ({config[mode].label.split(" ")[1]})</span>
            <span>− {formatRupiah(potongan)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold">
          <span>Estimasi Total</span>
          <span className="text-emas">{formatRupiah(total)}</span>
        </div>
        <p className="pt-1 text-[11px] text-gray-500">
          * Harga final dikonfirmasi via WhatsApp
        </p>
      </div>

      <a
        href={waLink(message)}
        target="_blank"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-white shadow-lg shadow-[#25D366]/20 transition hover:opacity-90"
      >
        <MessageCircle className="h-5 w-5" /> Booking via WhatsApp
      </a>
    </div>
  );
}

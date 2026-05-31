"use client";

import { useState } from "react";
import { Car } from "@/lib/types";
import { AlertTriangle, Images } from "lucide-react";

const TYPES         = ["MPV", "SUV", "Sedan", "City Car", "Pickup", "Minibus"];
const TRANSMISSIONS = ["Manual", "Otomatis"];
const FUELS         = ["Bensin", "Solar", "Hybrid"];
const CATEGORIES    = ["rental", "jual", "keduanya"] as const;
const STATUSES      = ["tersedia", "disewa", "terjual"] as const;
const BADGES        = ["", "POPULER", "BARU", "PROMO"] as const;
const KONDISI       = ["", "Baik Sekali", "Baik", "Cukup", "Perlu Service"] as const;

type Props = {
  initial?: Car;
  onSaved: (car: Car) => void;
  onCancel: () => void;
};

export default function CarForm({ initial, onSaved, onCancel }: Props) {
  const [form, setForm] = useState({
    name:          initial?.name          ?? "",
    type:          initial?.type          ?? "MPV",
    category:      initial?.category      ?? "rental",
    status:        initial?.status        ?? "tersedia",
    price_rent:    initial?.price_rent    ?? "",
    price_sell:    initial?.price_sell    ?? "",
    year:          initial?.year          ?? new Date().getFullYear(),
    seats:         initial?.seats         ?? 5,
    transmission:  initial?.transmission  ?? "Otomatis",
    fuel:          initial?.fuel          ?? "Bensin",
    badge:         initial?.badge         ?? "",
    kondisi:       initial?.kondisi       ?? "",
    kelengkapan:   initial?.kelengkapan   ?? "",
    dengan_sopir:  initial?.dengan_sopir  ?? false,
    plat_asal:     initial?.plat_asal     ?? "",
    description:   initial?.description   ?? "",
    images:        initial?.images.join("\n") ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k: string, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const imageList = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
  const photoWarning = imageList.length < 5;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      price_rent:   form.price_rent  === "" ? null : Number(form.price_rent),
      price_sell:   form.price_sell  === "" ? null : Number(form.price_sell),
      year:         Number(form.year),
      seats:        Number(form.seats),
      badge:        form.badge   === "" ? null : form.badge,
      kondisi:      form.kondisi === "" ? null : form.kondisi,
      kelengkapan:  form.kelengkapan  || null,
      plat_asal:    form.plat_asal    || null,
      images:       imageList,
    };

    const url    = initial ? `/api/admin/cars/${initial.id}` : "/api/admin/cars";
    const method = initial ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.message ?? "Terjadi kesalahan.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    const saved: Car = {
      ...(initial ?? {}),
      ...payload,
      id:   initial?.id  ?? data.id,
      slug: initial?.slug ?? data.slug,
    } as Car;
    onSaved(saved);
  }

  const field = (
    label: string,
    key: string,
    extra?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <label className="block text-sm">
      <span className="text-gray-400">{label}</span>
      <input
        {...extra}
        value={String(form[key as keyof typeof form])}
        onChange={(e) => set(key, e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
      />
    </label>
  );

  const select = (label: string, key: string, options: readonly string[]) => (
    <label className="block text-sm">
      <span className="text-gray-400">{label}</span>
      <select
        value={String(form[key as keyof typeof form])}
        onChange={(e) => set(key, e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o || "— Tidak ada —"}</option>
        ))}
      </select>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {field("Nama Mobil *", "name", { required: true, placeholder: "Toyota Avanza" })}

      <div className="grid grid-cols-2 gap-4">
        {select("Tipe *",      "type",     TYPES)}
        {select("Kategori *",  "category", CATEGORIES)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {select("Status",  "status", STATUSES)}
        {select("Badge",   "badge",  BADGES)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field("Harga Sewa/hari (Rp)", "price_rent", { type: "number", placeholder: "300000" })}
        {field("Harga Jual (Rp)",      "price_sell", { type: "number", placeholder: "200000000" })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {field("Tahun *", "year",  { type: "number", required: true })}
        {field("Kursi *", "seats", { type: "number", required: true })}
        {select("Transmisi", "transmission", TRANSMISSIONS)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {select("Bahan Bakar", "fuel",    FUELS)}
        {select("Kondisi",     "kondisi", KONDISI)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field("Plat Asal", "plat_asal", { placeholder: "DB / DM / B / dll" })}
        <label className="block text-sm">
          <span className="text-gray-400">Dengan Sopir</span>
          <div className="mt-1">
            <button
              type="button"
              onClick={() => set("dengan_sopir", !form.dengan_sopir)}
              className={`h-10 w-full rounded-lg border px-3 text-left text-sm font-medium transition ${
                form.dengan_sopir
                  ? "border-biru/60 bg-biru/10 text-biru"
                  : "border-white/10 text-gray-400 hover:border-white/30"
              }`}
            >
              {form.dengan_sopir ? "✓ Tersedia dengan sopir" : "Tidak tersedia sopir"}
            </button>
          </div>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-gray-400">Kelengkapan Dokumen</span>
        <input
          value={form.kelengkapan}
          onChange={(e) => set("kelengkapan", e.target.value)}
          placeholder="Contoh: STNK Ada, BPKB Ada, Ban Serep, Dongkrak"
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
        />
      </label>

      <label className="block text-sm">
        <span className="text-gray-400">Deskripsi</span>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Ceritakan keunggulan dan kondisi mobil..."
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas"
        />
      </label>

      {/* Kolom foto */}
      <div>
        <label className="block text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-400">
              <Images className="h-4 w-4" />
              URL Foto (1 URL per baris, urutan: Depan · Samping · Belakang · Interior · Dashboard)
            </span>
            <span className={`text-xs font-semibold ${imageList.length >= 5 ? "text-green-400" : "text-yellow-400"}`}>
              {imageList.length}/5 foto
            </span>
          </div>
          <textarea
            value={form.images}
            onChange={(e) => set("images", e.target.value)}
            rows={6}
            placeholder={
              "https://link-foto-1.jpg  ← Tampak Depan\n" +
              "https://link-foto-2.jpg  ← Tampak Samping\n" +
              "https://link-foto-3.jpg  ← Tampak Belakang\n" +
              "https://link-foto-4.jpg  ← Interior\n" +
              "https://link-foto-5.jpg  ← Dashboard"
            }
            className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 font-mono text-xs outline-none focus:border-emas"
          />
        </label>

        {photoWarning && (
          <p className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Standar AutoManado: 5 foto (Depan, Samping, Belakang, Interior, Dashboard).
            Saat ini baru {imageList.length} foto.
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-merah py-2.5 font-semibold text-white transition hover:bg-merah/90 disabled:opacity-60"
        >
          {loading ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Tambah Mobil"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-gray-300 hover:text-white"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

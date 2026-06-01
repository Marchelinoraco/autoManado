"use client";

import { useRef, useState } from "react";
import { Car } from "@/lib/types";
import { AlertTriangle, Images, Upload, Loader2, X } from "lucide-react";

const TYPES         = ["MPV", "SUV", "Sedan", "City Car", "Pickup", "Minibus"];
const TRANSMISSIONS = ["Manual", "Otomatis"];
const FUELS         = ["Bensin", "Solar", "Hybrid"];
const CATEGORIES    = ["rental", "jual", "keduanya"] as const;
const STATUSES      = ["tersedia", "disewa", "terjual"] as const;
const BADGES        = ["", "POPULER", "BARU", "PROMO"] as const;
const KONDISI       = ["", "Baik Sekali", "Baik", "Cukup", "Perlu Service"] as const;

type Props = {
  initial?: Car;
  defaultCategory?: "rental" | "jual" | "keduanya";
  onSaved: (car: Car) => void;
  onCancel: () => void;
};

const inputClass = "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500";

export default function CarForm({ initial, defaultCategory = "rental", onSaved, onCancel }: Props) {
  const [form, setForm] = useState({
    name:          initial?.name          ?? "",
    type:          initial?.type          ?? "MPV",
    category:      initial?.category      ?? defaultCategory,
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
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const imageList = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
  const photoWarning = imageList.length < 5;

  // ── Upload gambar via API ──────────────────────────────────
  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadErr("");
    setUploading(true);
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadErr(data.message ?? "Upload gagal.");
        break;
      }
      urls.push(data.url);
    }

    if (urls.length > 0) {
      const existing = form.images.trim();
      const newImages = existing ? `${existing}\n${urls.join("\n")}` : urls.join("\n");
      set("images", newImages);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ── Submit form ────────────────────────────────────────────
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
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <input
        {...extra}
        value={String(form[key as keyof typeof form])}
        onChange={(e) => set(key, e.target.value)}
        className={inputClass}
      />
    </label>
  );

  const select = (label: string, key: string, options: readonly string[]) => (
    <label className="block text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <select
        value={String(form[key as keyof typeof form])}
        onChange={(e) => set(key, e.target.value)}
        className={inputClass}
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
          <span className="text-gray-600 dark:text-gray-400">Dengan Sopir</span>
          <div className="mt-1">
            <button
              type="button"
              onClick={() => set("dengan_sopir", !form.dengan_sopir)}
              className={`h-10 w-full rounded-lg border px-3 text-left text-sm font-medium transition ${
                form.dengan_sopir
                  ? "border-teal/60 bg-teal/10 text-teal"
                  : "border-gray-200 text-gray-500 hover:border-teal/30 dark:border-gray-700"
              }`}
            >
              {form.dengan_sopir ? "✓ Tersedia dengan sopir" : "Tidak tersedia sopir"}
            </button>
          </div>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-gray-600 dark:text-gray-400">Kelengkapan Dokumen</span>
        <input
          value={form.kelengkapan}
          onChange={(e) => set("kelengkapan", e.target.value)}
          placeholder="Contoh: STNK Ada, BPKB Ada, Ban Serep, Dongkrak"
          className={inputClass}
        />
      </label>

      <label className="block text-sm">
        <span className="text-gray-600 dark:text-gray-400">Deskripsi</span>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Ceritakan keunggulan dan kondisi mobil..."
          className={inputClass}
        />
      </label>

      {/* ── Kolom foto ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Images className="h-4 w-4" />
            Foto Mobil
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${imageList.length >= 5 ? "text-green-600" : "text-amber-500"}`}>
              {imageList.length}/5 foto
            </span>
            {/* Upload button */}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal transition hover:bg-teal hover:text-white disabled:opacity-60"
            >
              {uploading
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengupload...</>
                : <><Upload className="h-3.5 w-3.5" /> Upload Gambar</>
              }
            </button>
          </div>
        </div>

        {uploadErr && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            {uploadErr}
          </p>
        )}

        {/* Preview thumbnails */}
        {imageList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imageList.map((url, i) => (
              <div key={i} className="group relative h-16 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <img src={url} alt={`foto ${i+1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    const newList = imageList.filter((_, idx) => idx !== i);
                    set("images", newList.join("\n"));
                  }}
                  className="absolute right-0.5 top-0.5 hidden rounded-full bg-red-500 p-0.5 text-white group-hover:flex"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* URL textarea */}
        <textarea
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          rows={4}
          placeholder={
            "https://link-foto-1.jpg  ← Tampak Depan\n" +
            "https://link-foto-2.jpg  ← Tampak Samping\n" +
            "https://link-foto-3.jpg  ← Interior\n" +
            "(atau upload langsung dengan tombol di atas)"
          }
          className={`${inputClass} font-mono text-xs`}
        />

        {photoWarning && imageList.length > 0 && (
          <p className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Rekomendasi 5 foto (Depan, Samping, Belakang, Interior, Dashboard).
            Saat ini {imageList.length} foto.
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-teal py-2.5 font-semibold text-white transition hover:bg-teal/90 disabled:opacity-60"
        >
          {loading ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Tambah Mobil"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-gray-600 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

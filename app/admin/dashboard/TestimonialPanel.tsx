"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star, Quote, X } from "lucide-react";
import { Testimonial } from "@/lib/types";

type Props = { initialList: Testimonial[] };

const EMPTY: Omit<Testimonial, "id" | "created_at"> = {
  name: "", location: "", message: "", rating: 5,
  photo: "", car_name: "", service: null,
};

export default function TestimonialPanel({ initialList }: Props) {
  const [list, setList]       = useState(initialList);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [adding, setAdding]   = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Hapus testimoni ini?")) return;
    setDeleting(id);
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setList((p) => p.filter((t) => t.id !== id));
    setDeleting(null);
  }

  function handleSaved(t: Testimonial, isNew: boolean) {
    setList((p) => isNew ? [t, ...p] : p.map((x) => (x.id === t.id ? t : x)));
    setEditing(null);
    setAdding(false);
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Testimoni Klien</h2>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal/90"
        >
          <Plus className="h-4 w-4" /> Tambah Testimoni
        </button>
      </div>

      {/* Modal form */}
      {(adding || editing) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editing ? "Edit Testimoni" : "Tambah Testimoni"}
              </h3>
              <button onClick={() => { setAdding(false); setEditing(null); }}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <TestimonialForm
              initial={editing ?? undefined}
              onSaved={(t) => handleSaved(t, !editing)}
              onCancel={() => { setAdding(false); setEditing(null); }}
            />
          </div>
        </div>
      )}

      {/* Daftar */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <div key={t.id} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <Quote className="absolute right-4 top-4 h-6 w-6 text-gray-100" />

            {/* Rating */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
              ))}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
              &ldquo;{t.message}&rdquo;
            </p>

            <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
              {t.photo ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-teal/30">
                  <Image src={t.photo} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/10 text-sm font-bold text-teal">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{t.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {[t.location, t.car_name].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => { setEditing(t); setAdding(false); }}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-teal hover:border-teal/30"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="col-span-full py-10 text-center text-gray-400">
            Belum ada testimoni.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Form ────────────────────────────────────────────────────
function TestimonialForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Testimonial;
  onSaved: (t: Testimonial) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name:     initial?.name     ?? "",
    location: initial?.location ?? "",
    message:  initial?.message  ?? "",
    rating:   initial?.rating   ?? 5,
    photo:    initial?.photo    ?? "",
    car_name: initial?.car_name ?? "",
    service:  initial?.service  ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const inputClass = "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-teal focus:ring-1 focus:ring-teal/20";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      rating:  Number(form.rating),
      photo:   form.photo    || null,
      car_name: form.car_name || null,
      service: (form.service || null) as "rental" | "jual" | null,
      location: form.location || null,
    };

    const url    = initial ? `/api/admin/testimonials/${initial.id}` : "/api/admin/testimonials";
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
    onSaved({ ...payload, id: initial?.id ?? data.id } as Testimonial);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="text-gray-600">Nama Klien *</span>
        <input required value={form.name} onChange={(e) => set("name", e.target.value)}
          placeholder="Reynaldo S." className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="text-gray-600">Kota / Asal</span>
          <input value={form.location} onChange={(e) => set("location", e.target.value)}
            placeholder="Manado" className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="text-gray-600">Rating Bintang</span>
          <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))}
            className={inputClass}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-gray-600">Ulasan / Komentar *</span>
        <textarea required value={form.message} onChange={(e) => set("message", e.target.value)}
          rows={3} placeholder="Pelayanan cepat, mobil bersih..."
          className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="text-gray-600">Nama Mobil</span>
          <input value={form.car_name} onChange={(e) => set("car_name", e.target.value)}
            placeholder="Toyota Avanza" className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="text-gray-600">Jenis Layanan</span>
          <select value={form.service} onChange={(e) => set("service", e.target.value)}
            className={inputClass}>
            <option value="">— Pilih —</option>
            <option value="rental">Rental / Sewa</option>
            <option value="jual">Beli Mobil</option>
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-gray-600">URL Foto Klien (opsional)</span>
        <input value={form.photo} onChange={(e) => set("photo", e.target.value)}
          placeholder="https://link-foto-klien.jpg"
          className={`${inputClass} font-mono text-xs`} />
        {form.photo && (
          <div className="mt-2 flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-teal/30">
              <Image src={form.photo} alt="preview" fill sizes="40px" className="object-cover" />
            </div>
            <span className="text-xs text-gray-500">Preview foto</span>
          </div>
        )}
      </label>

      {error && <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 rounded-xl bg-teal py-2.5 font-semibold text-white transition hover:bg-teal/90 disabled:opacity-60">
          {loading ? "Menyimpan…" : initial ? "Simpan" : "Tambah"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-gray-600 hover:text-gray-900">
          Batal
        </button>
      </div>
    </form>
  );
}

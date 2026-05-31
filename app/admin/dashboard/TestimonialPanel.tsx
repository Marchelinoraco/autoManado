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
        <h2 className="text-xl font-bold">Testimoni Klien</h2>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="flex items-center gap-2 rounded-xl bg-emas px-4 py-2 text-sm font-semibold text-ink transition hover:bg-emas/90"
        >
          <Plus className="h-4 w-4" /> Tambah Testimoni
        </button>
      </div>

      {/* Modal form */}
      {(adding || editing) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#161616] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editing ? "Edit Testimoni" : "Tambah Testimoni"}
              </h3>
              <button onClick={() => { setAdding(false); setEditing(null); }}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
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
          <div key={t.id} className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
            <Quote className="absolute right-4 top-4 h-6 w-6 text-white/5" />

            {/* Rating */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-emas text-emas" : "fill-white/10 text-white/10"}`} />
              ))}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-300 line-clamp-3">
              &ldquo;{t.message}&rdquo;
            </p>

            <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3">
              {t.photo ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emas/30">
                  <Image src={t.photo} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-merah/20 text-sm font-bold text-merah">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{t.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {[t.location, t.car_name].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => { setEditing(t); setAdding(false); }}
                  className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:text-emas"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                  className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:text-merah disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="col-span-full py-10 text-center text-gray-500">
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
        <span className="text-gray-400">Nama Klien *</span>
        <input required value={form.name} onChange={(e) => set("name", e.target.value)}
          placeholder="Reynaldo S." className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="text-gray-400">Kota / Asal</span>
          <input value={form.location} onChange={(e) => set("location", e.target.value)}
            placeholder="Manado" className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas" />
        </label>
        <label className="block text-sm">
          <span className="text-gray-400">Rating Bintang</span>
          <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-gray-400">Ulasan / Komentar *</span>
        <textarea required value={form.message} onChange={(e) => set("message", e.target.value)}
          rows={3} placeholder="Pelayanan cepat, mobil bersih..."
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="text-gray-400">Nama Mobil</span>
          <input value={form.car_name} onChange={(e) => set("car_name", e.target.value)}
            placeholder="Toyota Avanza" className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas" />
        </label>
        <label className="block text-sm">
          <span className="text-gray-400">Jenis Layanan</span>
          <select value={form.service} onChange={(e) => set("service", e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 outline-none focus:border-emas">
            <option value="">— Pilih —</option>
            <option value="rental">Rental / Sewa</option>
            <option value="jual">Beli Mobil</option>
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-gray-400">URL Foto Klien (opsional)</span>
        <input value={form.photo} onChange={(e) => set("photo", e.target.value)}
          placeholder="https://link-foto-klien.jpg"
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 font-mono text-xs outline-none focus:border-emas" />
        {form.photo && (
          <div className="mt-2 flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-emas/30">
              <Image src={form.photo} alt="preview" fill sizes="40px" className="object-cover" />
            </div>
            <span className="text-xs text-gray-500">Preview foto</span>
          </div>
        )}
      </label>

      {error && <p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 rounded-xl bg-emas py-2.5 font-semibold text-ink transition hover:bg-emas/90 disabled:opacity-60">
          {loading ? "Menyimpan…" : initial ? "Simpan" : "Tambah"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-gray-300 hover:text-white">
          Batal
        </button>
      </div>
    </form>
  );
}

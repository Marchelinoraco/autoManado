"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car as CarIcon, Plus, Pencil, Trash2, LogOut,
  CheckCircle2, Clock, XCircle, LayoutDashboard, MessageSquareQuote,
} from "lucide-react";
import { Car, Testimonial } from "@/lib/types";
import { formatRupiah } from "@/lib/whatsapp";
import CarForm from "./CarForm";
import TestimonialPanel from "./TestimonialPanel";

type Stats = { total: number; tersedia: number; disewa: number; terjual: number };

export default function DashboardClient({
  initialCars,
  stats,
  initialTestimonials,
}: {
  initialCars: Car[];
  stats: Stats;
  initialTestimonials: Testimonial[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"mobil" | "testimoni">("mobil");
  const [cars, setCars] = useState(initialCars);
  const [editing, setEditing] = useState<Car | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus mobil ini? Tindakan tidak bisa dibatalkan.")) return;
    setDeleting(id);
    await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
    setCars((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  function handleSaved(car: Car, isNew: boolean) {
    if (isNew) {
      setCars((prev) => [car, ...prev]);
    } else {
      setCars((prev) => prev.map((c) => (c.id === car.id ? car : c)));
    }
    setEditing(null);
    setAdding(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <LayoutDashboard className="h-6 w-6 text-emas" /> Dashboard Admin
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Mobil", value: stats.total, icon: CarIcon, color: "text-emas" },
          { label: "Tersedia", value: stats.tersedia, icon: CheckCircle2, color: "text-green-400" },
          { label: "Sedang Disewa", value: stats.disewa, icon: Clock, color: "text-yellow-400" },
          { label: "Terjual", value: stats.terjual, icon: XCircle, color: "text-merah" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <s.icon className={`h-6 w-6 ${s.color}`} />
            <p className="mt-3 text-3xl font-extrabold">{s.value}</p>
            <p className="text-sm text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="mt-8 flex gap-2 border-b border-white/10 pb-0">
        {[
          { key: "mobil",      label: "Daftar Mobil",  icon: CarIcon },
          { key: "testimoni",  label: "Testimoni Klien", icon: MessageSquareQuote },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex items-center gap-2 rounded-t-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ─── TAB MOBIL ─── */}
      {tab === "mobil" && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Daftar Mobil</h2>
            <button
              onClick={() => { setAdding(true); setEditing(null); }}
              className="flex items-center gap-2 rounded-xl bg-merah px-4 py-2 text-sm font-semibold text-white transition hover:bg-merah/90"
            >
              <Plus className="h-4 w-4" /> Tambah Mobil
            </button>
          </div>

          {(adding || editing) && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 py-8">
              <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#161616] p-6">
                <h3 className="mb-5 text-xl font-bold">
                  {editing ? "Edit Mobil" : "Tambah Mobil Baru"}
                </h3>
                <CarForm
                  initial={editing ?? undefined}
                  onSaved={(car) => handleSaved(car, !editing)}
                  onCancel={() => { setAdding(false); setEditing(null); }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/5 text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Tipe</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Sewa/hari</th>
                  <th className="px-4 py-3 text-left">Harga Jual</th>
                  <th className="px-4 py-3 text-left">Tahun</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{car.name}</td>
                    <td className="px-4 py-3 text-gray-400">{car.type}</td>
                    <td className="px-4 py-3 capitalize text-gray-400">{car.category}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize
                        ${car.status === "tersedia" ? "bg-green-500/20 text-green-400" :
                          car.status === "disewa"   ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"}`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-emas">{formatRupiah(car.price_rent)}</td>
                    <td className="px-4 py-3 text-biru">{formatRupiah(car.price_sell)}</td>
                    <td className="px-4 py-3 text-gray-400">{car.year}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditing(car); setAdding(false); }}
                          className="rounded-lg border border-white/10 p-1.5 text-gray-300 hover:text-emas"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deleting === car.id}
                          className="rounded-lg border border-white/10 p-1.5 text-gray-300 hover:text-merah disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cars.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      Belum ada data mobil.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ─── TAB TESTIMONI ─── */}
      {tab === "testimoni" && (
        <TestimonialPanel initialList={initialTestimonials} />
      )}
    </div>
  );
}

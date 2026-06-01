"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car as CarIcon, Plus, Pencil, Trash2, LogOut,
  CheckCircle2, Clock, XCircle, LayoutDashboard,
  MessageSquareQuote, Images, ShoppingCart, Key,
} from "lucide-react";
import { Car, Testimonial } from "@/lib/types";
import { formatRupiah } from "@/lib/whatsapp";
import CarForm from "./CarForm";
import TestimonialPanel from "./TestimonialPanel";
import ActivityGalleryPanel from "./GalleryPanel";

type Stats = { total: number; tersedia: number; disewa: number; terjual: number };
type MainTab = "sewa" | "jual" | "galeri" | "testimoni";

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
  const [tab, setTab] = useState<MainTab>("sewa");
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

  // Filter berdasarkan tab aktif
  const sewaList = cars.filter((c) => c.category === "rental" || c.category === "keduanya");
  const jualList = cars.filter((c) => c.category === "jual" || c.category === "keduanya");
  const activeCars = tab === "sewa" ? sewaList : tab === "jual" ? jualList : [];

  const mainTabs = [
    { key: "sewa",      label: "Sewa",     icon: Key,                count: sewaList.length },
    { key: "jual",      label: "Jual",     icon: ShoppingCart,       count: jualList.length },
    { key: "galeri",    label: "Galeri",   icon: Images,             count: null },
    { key: "testimoni", label: "Testimoni",icon: MessageSquareQuote, count: null },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <LayoutDashboard className="h-6 w-6 text-teal" /> Dashboard Admin
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Mobil",    value: stats.total,    icon: CarIcon,       color: "text-teal" },
          { label: "Tersedia",       value: stats.tersedia, icon: CheckCircle2,  color: "text-green-500" },
          { label: "Sedang Disewa",  value: stats.disewa,   icon: Clock,         color: "text-amber-500" },
          { label: "Terjual",        value: stats.terjual,  icon: XCircle,       color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <s.icon className={`h-6 w-6 ${s.color}`} />
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="mt-8 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800/50">
        {mainTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-white text-teal shadow-sm dark:bg-gray-800 dark:text-teal"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
            {t.count !== null && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                tab === t.key ? "bg-teal/10 text-teal" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── TAB SEWA & JUAL ─── */}
      {(tab === "sewa" || tab === "jual") && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Mobil {tab === "sewa" ? "Sewa (Rental)" : "Jual"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tab === "sewa"
                  ? "Kategori rental & keduanya"
                  : "Kategori jual & keduanya"}
              </p>
            </div>
            <button
              onClick={() => { setAdding(true); setEditing(null); }}
              className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal/90"
            >
              <Plus className="h-4 w-4" /> Tambah Mobil
            </button>
          </div>

          {/* Modal Form */}
          {(adding || editing) && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8">
              <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <h3 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
                  {editing ? "Edit Mobil" : `Tambah Mobil ${tab === "sewa" ? "Sewa" : "Jual"}`}
                </h3>
                <CarForm
                  initial={editing ?? undefined}
                  defaultCategory={tab === "jual" ? "jual" : "rental"}
                  onSaved={(car) => handleSaved(car, !editing)}
                  onCancel={() => { setAdding(false); setEditing(null); }}
                />
              </div>
            </div>
          )}

          {/* Tabel mobil */}
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">Foto</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Tipe</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  {tab === "sewa" && <th className="px-4 py-3 text-left">Sewa/hari</th>}
                  {tab === "jual" && <th className="px-4 py-3 text-left">Harga Jual</th>}
                  <th className="px-4 py-3 text-left">Tahun</th>
                  <th className="px-4 py-3 text-left">Foto</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {activeCars.map((car) => (
                  <tr key={car.id} className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      {car.images[0] ? (
                        <img
                          src={car.images[0]}
                          alt={car.name}
                          className="h-10 w-14 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                          <CarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{car.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{car.type}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize
                        ${car.status === "tersedia" ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" :
                          car.status === "disewa"   ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                          "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"}`}>
                        {car.status}
                      </span>
                    </td>
                    {tab === "sewa" && (
                      <td className="px-4 py-3 font-medium text-teal">{formatRupiah(car.price_rent)}</td>
                    )}
                    {tab === "jual" && (
                      <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{formatRupiah(car.price_sell)}</td>
                    )}
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{car.year}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{car.images.length} foto</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditing(car); setAdding(false); }}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-teal hover:border-teal/30 dark:border-gray-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deleting === car.id}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-40 dark:border-gray-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {activeCars.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Belum ada mobil {tab === "sewa" ? "sewa" : "jual"}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ─── TAB GALERI AKTIVITAS ─── */}
      {tab === "galeri" && <ActivityGalleryPanel />}

      {/* ─── TAB TESTIMONI ─── */}
      {tab === "testimoni" && <TestimonialPanel initialList={initialTestimonials} />}
    </div>
  );
}

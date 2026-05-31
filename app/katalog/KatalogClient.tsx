"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ArrowDownUp } from "lucide-react";
import { Car } from "@/lib/types";
import CarCard from "@/components/CarCard";
import ScrollReveal from "@/components/ScrollReveal";

const categoryFilters = [
  { key: "semua", label: "Semua" },
  { key: "rental", label: "Rental" },
  { key: "jual", label: "Jual" },
];
const typeFilters = ["MPV", "SUV", "Sedan", "City Car", "Pickup", "Minibus"];
const transmissions = ["Manual", "Otomatis"];
const fuels = ["Bensin", "Solar", "Hybrid"];

const sortOptions = [
  { key: "terbaru", label: "Terbaru" },
  { key: "harga-asc", label: "Harga Termurah" },
  { key: "harga-desc", label: "Harga Termahal" },
  { key: "tahun-desc", label: "Tahun Terbaru" },
];

export default function KatalogClient({ cars }: { cars: Car[] }) {
  const priceBounds = useMemo(() => {
    const prices = cars.map((c) => c.price_rent ?? 0).filter(Boolean);
    return { min: 0, max: prices.length ? Math.max(...prices) : 1000000 };
  }, [cars]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("semua");
  const [type, setType] = useState<string | null>(null);
  const [transmission, setTransmission] = useState<string | null>(null);
  const [fuel, setFuel] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [sort, setSort] = useState("terbaru");
  const [showFilters, setShowFilters] = useState(false);

  const result = useMemo(() => {
    let r = cars.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(query.toLowerCase());
      let matchCat = true;
      if (category === "rental") matchCat = c.category === "rental" || c.category === "keduanya";
      else if (category === "jual") matchCat = c.category === "jual" || c.category === "keduanya";
      const matchType = !type || c.type === type;
      const matchTrans = !transmission || c.transmission === transmission;
      const matchFuel = !fuel || c.fuel === fuel;
      const matchPrice = (c.price_rent ?? 0) <= maxPrice || c.price_rent == null;
      return matchSearch && matchCat && matchType && matchTrans && matchFuel && matchPrice;
    });

    r = [...r].sort((a, b) => {
      switch (sort) {
        case "harga-asc": return (a.price_rent ?? Infinity) - (b.price_rent ?? Infinity);
        case "harga-desc": return (b.price_rent ?? 0) - (a.price_rent ?? 0);
        case "tahun-desc": return b.year - a.year;
        default: return b.id - a.id;
      }
    });
    return r;
  }, [cars, query, category, type, transmission, fuel, maxPrice, sort]);

  const activeChips = [
    category !== "semua" && { label: categoryFilters.find((f) => f.key === category)?.label, clear: () => setCategory("semua") },
    type && { label: type, clear: () => setType(null) },
    transmission && { label: transmission, clear: () => setTransmission(null) },
    fuel && { label: fuel, clear: () => setFuel(null) },
    maxPrice < priceBounds.max && { label: `≤ Rp ${(maxPrice / 1000).toLocaleString("id-ID")}rb`, clear: () => setMaxPrice(priceBounds.max) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  function resetAll() {
    setQuery(""); setCategory("semua"); setType(null);
    setTransmission(null); setFuel(null); setMaxPrice(priceBounds.max); setSort("terbaru");
  }

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-teal text-white"
        : "border border-gray-200 bg-white text-gray-600 hover:border-teal/40 hover:text-teal dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-teal/40 dark:hover:text-teal"
    }`;

  return (
    <div className="mt-8">
      {/* Search + sort + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama mobil..."
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        <div className="relative">
          <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-8 text-sm text-gray-700 outline-none focus:border-teal dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {sortOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>

        <button onClick={() => setShowFilters((v) => !v)} className={pill(showFilters)}>
          <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filter</span>
        </button>
      </div>

      {/* Kategori chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categoryFilters.map((f) => (
          <button key={f.key} onClick={() => setCategory(f.key)} className={pill(category === f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Panel filter lanjutan */}
      {showFilters && (
        <div className="mt-4 grid gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tipe Mobil</p>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((t) => (
                <button key={t} onClick={() => setType(type === t ? null : t)} className={pill(type === t)}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Transmisi</p>
            <div className="flex flex-wrap gap-2">
              {transmissions.map((t) => (
                <button key={t} onClick={() => setTransmission(transmission === t ? null : t)} className={pill(transmission === t)}>{t}</button>
              ))}
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Bahan Bakar</p>
            <div className="flex flex-wrap gap-2">
              {fuels.map((f) => (
                <button key={f} onClick={() => setFuel(fuel === f ? null : f)} className={pill(fuel === f)}>{f}</button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Maks. Harga Sewa / hari</p>
              <span className="text-sm font-semibold text-teal">Rp {maxPrice.toLocaleString("id-ID")}</span>
            </div>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal"
            />
          </div>
        </div>
      )}

      {/* Chip filter aktif */}
      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Filter aktif:</span>
          {activeChips.map((chip, i) => (
            <button
              key={i}
              onClick={chip.clear}
              className="flex items-center gap-1 rounded-full bg-teal/10 px-3 py-1 text-xs text-teal hover:bg-teal/20"
            >
              {chip.label} <X className="h-3 w-3" />
            </button>
          ))}
          <button onClick={resetAll} className="text-xs text-red-500 hover:underline">Reset semua</button>
        </div>
      )}

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{result.length}</span> mobil
      </p>

      {result.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
          <p className="text-gray-400">Tidak ada mobil yang cocok dengan filter Anda.</p>
          <button onClick={resetAll} className="mt-4 rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white hover:bg-teal/90">
            Reset filter
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.map((car, i) => (
            <ScrollReveal key={car.id} delay={Math.min(i, 6) * 50}>
              <CarCard car={car} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

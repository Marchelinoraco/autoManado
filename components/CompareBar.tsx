"use client";

import Image from "next/image";
import Link from "next/link";
import { X, GitCompareArrows, Trash2 } from "lucide-react";
import { useCompare } from "./CompareProvider";

export default function CompareBar() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-emas/30 bg-ink/90 p-3 shadow-2xl shadow-black/60 backdrop-blur-lg">
        <div className="flex items-center gap-2 overflow-x-auto">
          {items.map((c) => (
            <div key={c.id} className="relative shrink-0">
              <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-white/10">
                {c.images[0] ? (
                  <Image src={c.images[0]} alt={c.name} fill sizes="64px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white/5 text-[8px] text-gray-500">
                    {c.name}
                  </div>
                )}
              </div>
              <button
                onClick={() => remove(c.id)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-merah p-0.5 text-white"
                aria-label="Hapus"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {/* slot kosong */}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div
              key={i}
              className="hidden h-12 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/10 text-[9px] text-gray-600 sm:flex"
            >
              kosong
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={clear}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 transition hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Kosongkan</span>
          </button>
          <Link
            href="/banding"
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              items.length >= 2
                ? "gradient-sunset text-ink hover:opacity-90"
                : "pointer-events-none bg-white/10 text-gray-500"
            }`}
          >
            <GitCompareArrows className="h-4 w-4" />
            Bandingkan ({items.length})
          </Link>
        </div>
      </div>
    </div>
  );
}

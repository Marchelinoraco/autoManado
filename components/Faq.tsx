"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { faqs } from "@/lib/faqs";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`overflow-hidden rounded-xl border transition ${
                isOpen ? "border-emas/40 bg-white/5" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <HelpCircle className={`h-4 w-4 shrink-0 ${isOpen ? "text-emas" : "text-gray-500"}`} />
                  {f.q}
                </span>
                {isOpen ? (
                  <Minus className="h-4 w-4 shrink-0 text-emas" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 pl-12 text-sm leading-relaxed text-gray-400">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/lib/faqs";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-2">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`overflow-hidden rounded-xl border transition ${
                isOpen
                  ? "border-teal/30 bg-teal/5 dark:bg-teal/10"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className={`text-sm font-semibold ${isOpen ? "text-teal" : "text-gray-800 dark:text-gray-100"}`}>
                  {f.q}
                </span>
                {isOpen ? (
                  <Minus className="h-4 w-4 shrink-0 text-teal" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                )}
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Slide = {
  url: string;
  name: string;
  type: string;
};

const INTERVAL = 3500;

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (transitioning || slides.length < 2) return;
      setPrev(active);
      setTransitioning(true);
      setTimeout(() => {
        setActive((idx + slides.length) % slides.length);
        setPrev(null);
        setTransitioning(false);
      }, 600);
    },
    [active, transitioning, slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      goTo(active + 1);
    }, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, slides.length, goTo]);

  if (slides.length === 0) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 shadow-xl dark:bg-gray-800" />
    );
  }

  return (
    <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
      <div className="relative h-full w-full">
        {/* Gambar sebelumnya (fade out) */}
        {prev !== null && (
          <div className="absolute inset-0 animate-[fadeOut_0.6s_ease_forwards]">
            <Image
              src={slides[prev].url}
              alt={slides[prev].name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Gambar aktif (fade in) */}
        <div
          className={`absolute inset-0 ${
            transitioning ? "animate-[fadeIn_0.6s_ease_forwards]" : ""
          }`}
        >
          <Image
            src={slides[active].url}
            alt={slides[active].name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Label nama mobil */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-4 pt-8">
          <span className="rounded-full bg-teal/90 px-2.5 py-0.5 text-xs font-semibold text-white">
            {slides[active].type}
          </span>
          <p className="mt-1 text-base font-bold text-white drop-shadow">
            {slides[active].name}
          </p>
        </div>

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div className="absolute right-4 top-4 flex flex-col gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "h-5 w-2 bg-teal"
                    : "h-2 w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {slides.length > 1 && (
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/20">
            <div
              key={active}
              className="h-full bg-teal"
              style={{ animation: `progressBar ${INTERVAL}ms linear forwards` }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes progressBar { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
}

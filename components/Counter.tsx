"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({
  to,
  suffix = "",
  label,
  size = "lg",
}: {
  to: number;
  suffix?: string;
  label: string;
  size?: "sm" | "lg";
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setValue(Math.floor(p * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  if (size === "sm") {
    return (
      <div ref={ref}>
        <div className="text-2xl font-bold text-teal">
          {value}{suffix}
        </div>
        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-teal md:text-5xl">
        {value}{suffix}
      </div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

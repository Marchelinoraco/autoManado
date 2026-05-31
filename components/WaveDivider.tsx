type Props = {
  /** posisi gelombang: "top" untuk di atas seksi, "bottom" untuk bawah */
  position?: "top" | "bottom";
  /** warna fill (tailwind text-color via currentColor) */
  className?: string;
};

/**
 * Pembatas seksi bermotif ombak laut Manado.
 * Pakai currentColor agar warnanya bisa diatur lewat className (text-*).
 */
export default function WaveDivider({ position = "bottom", className = "text-ink" }: Props) {
  return (
    <div className={`pointer-events-none w-full overflow-hidden leading-[0] ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`h-[60px] w-full md:h-[100px] ${position === "top" ? "rotate-180" : ""}`}
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,64 C240,128 480,0 720,48 C960,96 1200,32 1440,80 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}

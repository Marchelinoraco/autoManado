export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AutoManado"
      style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" }}
    >
      <defs>
        {/* Silver-chrome gradient untuk outer ring */}
        <linearGradient id="am-ring" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="50%"  stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#b8c4d0" />
        </linearGradient>

        {/* Teal gradient dengan depth */}
        <linearGradient id="am-teal" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%"   stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>

        {/* Gloss overlay transparan di bagian atas */}
        <linearGradient id="am-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Outer octagon — silver ring */}
      <path
        d="M13 0.5 L27 0.5 L39.5 13 L39.5 27 L27 39.5 L13 39.5 L0.5 27 L0.5 13 Z"
        fill="url(#am-ring)"
      />

      {/* Inner octagon — teal fill */}
      <path
        d="M15.5 4 L24.5 4 L36 15.5 L36 24.5 L24.5 36 L15.5 36 L4 24.5 L4 15.5 Z"
        fill="url(#am-teal)"
      />

      {/* Gloss highlight (setengah atas inner) */}
      <path
        d="M15.5 4 L24.5 4 L36 15.5 L36 20 L4 20 L4 15.5 Z"
        fill="url(#am-gloss)"
      />

      {/* Monogram AM */}
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fill="white"
        fontFamily="'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif"
        fontSize="17"
        fontWeight="900"
        letterSpacing="-1"
      >
        AM
      </text>
    </svg>
  );
}

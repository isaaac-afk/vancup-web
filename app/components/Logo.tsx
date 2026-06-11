// VanCup crest — an abstract maple leaf holding a geometric soccer-ball
// pattern. Original artwork (no FIFA / copyrighted marks). Server Component.

const LEAF_PATH =
  "M32 4 L28 18 L16 14 L23 25 L8 27 L22 33 L14 41 L26 38 L29 47 L32 60 " +
  "L35 47 L38 38 L50 41 L42 33 L56 27 L41 25 L48 14 L36 18 Z";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="40"
      height="40"
      className={className}
      role="img"
      aria-label="VanCup logo — a maple leaf and soccer ball"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="vancup-leaf-clip">
          <path d={LEAF_PATH} />
        </clipPath>
        <linearGradient id="vancup-leaf-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7A45" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>

      {/* Maple leaf — sunset orange */}
      <path d={LEAF_PATH} fill="url(#vancup-leaf-fill)" />

      {/* Soccer-ball pattern — golden highlights, clipped inside the leaf */}
      <g
        clipPath="url(#vancup-leaf-clip)"
        stroke="#FFB627"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon
          points="32,23 38.7,27.8 36.1,35.7 27.9,35.7 25.3,27.8"
          fill="#FFB627"
          fillOpacity="0.92"
          stroke="none"
        />
        <line x1="32" y1="23" x2="32" y2="15" />
        <line x1="38.7" y1="27.8" x2="46" y2="24" />
        <line x1="36.1" y1="35.7" x2="41" y2="44" />
        <line x1="27.9" y1="35.7" x2="23" y2="44" />
        <line x1="25.3" y1="27.8" x2="18" y2="24" />
      </g>
    </svg>
  );
}

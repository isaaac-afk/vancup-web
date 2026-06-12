// Floating soccer-ball hero accent — original inline SVG (classic dark pentagons
// on an off-white sphere), clipped to the ball. The wrapper bobs and the inner
// SVG slowly spins (see `.ball-bob` / `.ball-spin` in globals.css).
// Server Component — no "use client", no image assets.

const PATCH = "#16202e"; // near-black navy patches (palette-friendly)
const BALL = "#fff8e7"; // warm cream sphere

export default function FloatingBall({ className = "" }: { className?: string }) {
  return (
    <div className={`ball-bob ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        className="ball-spin h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="vancup-ball-clip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>

        {/* Sphere */}
        <circle cx="50" cy="50" r="48" fill={BALL} />

        {/* Seams + patches, clipped to the sphere */}
        <g clipPath="url(#vancup-ball-clip)">
          {/* Seams from the central pentagon out to the rim patches */}
          <g
            stroke={PATCH}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          >
            <line x1="50" y1="34" x2="50" y2="13" />
            <line x1="65.2" y1="45.1" x2="85.2" y2="38.6" />
            <line x1="59.4" y1="62.9" x2="71.8" y2="80" />
            <line x1="40.6" y1="62.9" x2="28.2" y2="80" />
            <line x1="34.8" y1="45.1" x2="14.8" y2="38.6" />
          </g>

          {/* Central pentagon */}
          <polygon points="50,34 65.2,45.1 59.4,62.9 40.6,62.9 34.8,45.1" fill={PATCH} />

          {/* Five rim patches (mostly clipped by the sphere edge) */}
          <polygon points="50,13 37.6,4 42.4,-10.5 57.6,-10.5 62.4,4" fill={PATCH} />
          <polygon points="85.2,38.6 90,24.1 105.2,24.1 110,38.6 97.6,47.6" fill={PATCH} />
          <polygon points="71.8,80 87,80 91.8,94.5 79.4,103.5 67,94.5" fill={PATCH} />
          <polygon points="28.2,80 33,94.5 20.6,103.5 8.2,94.5 13,80" fill={PATCH} />
          <polygon points="14.8,38.6 2.4,47.6 -10,38.6 -5.2,24.1 10,24.1" fill={PATCH} />
        </g>

        {/* Subtle rim outline */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke={PATCH}
          strokeOpacity="0.35"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// One-point-perspective soccer pitch, drawn as inline SVG. Sits behind the hero
// content as faint white field markings receding into the distance, with a faint
// floodlight shimmer sweeping across it (see `.field-shimmer` in globals.css).
// Server Component — no "use client", no image assets.

const FADE = "linear-gradient(to bottom, white 0%, white 60%, transparent 100%)";

export default function FieldGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} overflow-hidden`} aria-hidden="true">
      {/* Pitch markings — faded out toward the bottom and dimmed overall */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.15,
          maskImage: FADE,
          WebkitMaskImage: FADE,
        }}
      >
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="1"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer touchlines + goal lines — bottom wide, top pulled to centre */}
          <polygon points="400,0 800,0 1200,600 0,600" />

          {/* Halfway line (at the perspective midpoint) */}
          <line x1="200" y1="300" x2="1000" y2="300" />

          {/* Centre circle — flattened ellipse to match the perspective */}
          <ellipse cx="600" cy="300" rx="130" ry="42" />
          <circle cx="600" cy="300" r="3" fill="#FFFFFF" stroke="none" />

          {/* Near penalty area (bottom) */}
          <polygon points="330,600 430,460 770,460 870,600" />
          {/* Near goal area (smaller box inside) */}
          <polygon points="455,600 510,535 690,535 745,600" />

          {/* Far penalty area (top, partially visible) */}
          <polygon points="470,90 730,90 760,160 440,160" />
        </svg>
      </div>

      {/* Floodlight glint sweeping slowly across the pitch */}
      <div className="field-shimmer absolute inset-0" />
    </div>
  );
}

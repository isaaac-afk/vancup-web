// Scroll-linked atmosphere — three stacked gradient layers that "transition"
// from golden-hour sky → field → twilight as you scroll. No JS scroll listeners:
// the component is positioned `absolute` and stretches to the FULL height of its
// (relative) parent, so each layer's vertical `mask-image` range maps directly
// onto a scroll depth. The masks are static but track scroll because the layer
// is as tall as the page. Server Component — no "use client", no image assets.

// Layer 1 — golden-hour sky: dominant across the top (0–45%).
const SKY = "linear-gradient(to bottom, #000 0%, #000 28%, transparent 46%)";
// Layer 2 — field/grass: dominant through the middle (30–72%).
const FIELD =
  "linear-gradient(to bottom, transparent 28%, #000 42%, #000 60%, transparent 74%)";
// Layer 3 — twilight glow: dominant toward the bottom (60–100%).
const TWILIGHT =
  "linear-gradient(to bottom, transparent 58%, #000 76%, #000 100%)";

export default function AtmosphereLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1 — golden-hour sky */}
      <div
        className="atmo-drift-1 absolute inset-0 opacity-30 motion-reduce:opacity-10"
        style={{
          maskImage: SKY,
          WebkitMaskImage: SKY,
          backgroundImage:
            "radial-gradient(90% 60% at 50% 0%, rgba(255,182,39,0.55), transparent 62%)," +
            "radial-gradient(70% 55% at 82% 8%, rgba(255,107,53,0.5), transparent 58%)",
        }}
      />

      {/* Layer 2 — field / grass diagonal stripes */}
      <div
        className="atmo-drift-2 absolute inset-0 opacity-25 motion-reduce:opacity-10"
        style={{
          maskImage: FIELD,
          WebkitMaskImage: FIELD,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(58,125,68,0.45) 0, rgba(58,125,68,0.45) 22px, transparent 22px, transparent 46px)",
        }}
      />

      {/* Layer 3 — twilight glow */}
      <div
        className="atmo-drift-3 absolute inset-0 opacity-35 motion-reduce:opacity-10"
        style={{
          maskImage: TWILIGHT,
          WebkitMaskImage: TWILIGHT,
          backgroundImage:
            "radial-gradient(100% 80% at 50% 100%, rgba(26,35,50,0.85), transparent 60%)," +
            "linear-gradient(to bottom, transparent 40%, rgba(15,26,20,0.9) 100%)",
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

// Live countdown to a match kickoff. Renders nothing on the server (and on the
// very first client paint) to avoid a hydration mismatch — it only produces
// output once the post-mount effect has set the current time.
export default function Countdown({ targetDate }: { targetDate: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;

  const diff = new Date(targetDate).getTime() - now;

  if (diff <= 0) {
    return (
      <span className="animate-pulse font-semibold text-sunset">
        Kicking off now!
      </span>
    );
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let text: string;
  if (days > 7) {
    // Far out — coarse precision only.
    text = `${days}d ${hours}h`;
  } else {
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`); // always show seconds in the live window
    text = parts.join(" ");
  }

  return (
    <span className="font-semibold tabular-nums text-golden">{text}</span>
  );
}

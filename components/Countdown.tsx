"use client";
import { useEffect, useState } from "react";
// `endsAt` comes from store settings in the database (admin-configurable).
export default function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => { const t = () => setLeft(Math.max(0, new Date(endsAt).getTime() - Date.now())); t(); const i = setInterval(t, 1000); return () => clearInterval(i); }, [endsAt]);
  if (left === null) return <div className="h-16" />;
  const u = [["Days", 864e5], ["Hours", 36e5], ["Min", 6e4], ["Sec", 1e3]] as const;
  return <div className="flex gap-3" role="timer">{u.map(([l, ms]) => <div key={l} className="bg-white/10 rounded-xl px-4 py-2 text-center min-w-[64px]"><div className="text-2xl font-bold tabular-nums">{String(Math.floor(left / ms) % (l === "Days" ? 999 : l === "Hours" ? 24 : 60)).padStart(2, "0")}</div><div className="text-xs text-white/60">{l}</div></div>)}</div>;
}

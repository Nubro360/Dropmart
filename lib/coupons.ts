import { adminClient } from "@/lib/supabase/server";
// Returns percent off, or null if invalid. Demo mode: WELCOME10 only.
export async function findCoupon(raw: string): Promise<{ code: string; percentOff: number } | null> {
  const code = raw.trim().toUpperCase(); if (!code) return null;
  const db = adminClient();
  if (!db) return code === "WELCOME10" ? { code, percentOff: 10 } : null;
  const { data } = await db.from("coupons").select("code,percent_off,expires_at").eq("code", code).eq("active", true).maybeSingle();
  if (!data?.percent_off || (data.expires_at && new Date(data.expires_at) < new Date())) return null;
  return { code, percentOff: data.percent_off };
}

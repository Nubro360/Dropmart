import { createClient } from "@supabase/supabase-js";
// Server only. Returns null when Supabase isn't configured (demo mode).
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

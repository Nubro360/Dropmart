import { redirect } from "next/navigation";
import { sb } from "@/lib/supabase/ssr";
// Call at the top of EVERY admin page and server action (actions are public endpoints).
export async function requireAdmin() {
  const db = sb();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (data?.role !== "admin") redirect("/admin/login?error=forbidden");
  return db;
}

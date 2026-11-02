"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { sb } from "@/lib/supabase/ssr";
const g = (fd: FormData, k: string) => { const v = String(fd.get(k) ?? "").trim(); return v === "" ? undefined : v; };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export async function signIn(fd: FormData) {
  const { error } = await sb().auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
  redirect(error ? "/admin/login?error=invalid" : "/admin");
}
export async function signOut() { await sb().auth.signOut(); redirect("/admin/login"); }

const product = z.object({
  name: z.string().min(2).max(150), description: z.string().max(5000).optional(), category_id: z.string().uuid().optional(),
  price: z.coerce.number().positive(), sale_price: z.coerce.number().positive().optional(), stock: z.coerce.number().int().min(0),
  supplier_name: z.string().max(150).optional(), supplier_url: z.string().url().optional(), supplier_cost: z.coerce.number().min(0).optional(),
});
export async function saveProduct(fd: FormData) {
  const db = await requireAdmin();
  const p = product.safeParse(Object.fromEntries(["name","description","category_id","price","sale_price","stock","supplier_name","supplier_url","supplier_cost"].map((k) => [k, g(fd, k)])));
  const id = g(fd, "id");
  if (!p.success) redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent("Check the form fields.")}`);
  const images = (g(fd, "image_urls") ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  for (const f of fd.getAll("images") as File[]) {
    if (!f.size || !f.type.startsWith("image/") || f.size > 5_000_000) continue;
    const path = `${crypto.randomUUID()}.${f.type.split("/")[1].replace("jpeg", "jpg")}`;
    const up = await db.storage.from("product-images").upload(path, f, { contentType: f.type });
    if (!up.error) images.push(db.storage.from("product-images").getPublicUrl(path).data.publicUrl);
  }
  const specs = Object.fromEntries((g(fd, "specs") ?? "").split("\n").map((l) => l.split(":").map((s) => s.trim())).filter((a) => a[0] && a[1]).map((a) => [a[0], a.slice(1).join(":")]));
  const [vl, vo] = (g(fd, "variants") ?? "").split(":");
  const variants = vl && vo ? { label: vl.trim(), options: vo.split(",").map((s) => s.trim()).filter(Boolean) } : null;
  const row = { ...p.data, slug: slugify(g(fd, "slug") ?? p.data.name), images, specs, variants, active: fd.get("active") === "on", is_demo: fd.get("is_demo") === "on" };
  const { error } = id ? await db.from("products").update(row).eq("id", id) : await db.from("products").insert(row);
  if (error) redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/products"); redirect("/admin/products");
}
export async function deleteProduct(fd: FormData) { const db = await requireAdmin(); await db.from("products").delete().eq("id", String(fd.get("id"))); revalidatePath("/admin/products"); }

export async function updateOrder(fd: FormData) {
  const db = await requireAdmin(); const status = String(fd.get("status"));
  if (!ORDER_STATUSES.includes(status)) return;
  const url = g(fd, "tracking_url");
  await db.from("orders").update({ status, tracking_number: g(fd, "tracking_number") ?? null, tracking_url: url && /^https?:\/\//.test(url) ? url : null }).eq("id", String(fd.get("id")));
  revalidatePath("/admin/orders");
}
export async function saveCoupon(fd: FormData) {
  const db = await requireAdmin(); const pct = Number(g(fd, "percent_off")), code = (g(fd, "code") ?? "").toUpperCase().slice(0, 40);
  if (!code || !(pct > 0 && pct <= 100)) return;
  await db.from("coupons").insert({ code, percent_off: Math.round(pct), expires_at: g(fd, "expires_at") ? new Date(g(fd, "expires_at")!).toISOString() : null });
  revalidatePath("/admin/coupons");
}
export async function deleteCoupon(fd: FormData) { const db = await requireAdmin(); await db.from("coupons").delete().eq("id", String(fd.get("id"))); revalidatePath("/admin/coupons"); }
export async function saveCategory(fd: FormData) {
  const db = await requireAdmin(); const name = g(fd, "name"); if (!name) return;
  await db.from("categories").insert({ name: name.slice(0, 80), slug: slugify(name) }); revalidatePath("/admin/categories");
}
export async function deleteCategory(fd: FormData) { const db = await requireAdmin(); await db.from("categories").delete().eq("id", String(fd.get("id"))); revalidatePath("/admin/categories"); }
export async function saveSettings(fd: FormData) {
  const db = await requireAdmin(); const d = g(fd, "deal_ends_at"); if (!d) return;
  await db.from("store_settings").upsert({ key: "deal_ends_at", value: new Date(d).toISOString() }); revalidatePath("/admin/settings");
}

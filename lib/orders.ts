import { z } from "zod";
import { adminClient } from "@/lib/supabase/server";
import { products } from "@/lib/demo-products";
export const orderInput = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(150), phone: z.string().trim().min(5).max(30),
    country: z.string().trim().min(2).max(60), state: z.string().trim().min(1).max(80), address: z.string().trim().min(5).max(250),
    postal: z.string().trim().min(2).max(20), notes: z.string().trim().max(500).optional().default(""),
  }),
  items: z.array(z.object({ slug: z.string().max(120), qty: z.number().int().min(1).max(10) })).min(1).max(30),
  coupon: z.string().max(40).optional(),
  paymentMethod: z.enum(["cod", "stripe", "manual"]),
});
export type OrderInput = z.infer<typeof orderInput>;
// Authoritative prices/stock come from the database (or demo data when Supabase isn't configured).
export async function lookupProducts(slugs: string[]) {
  const db = adminClient(); const map = new Map<string, { name: string; price: number; stock: number }>();
  if (!db) { products.forEach((p) => map.set(p.slug, { name: p.name, price: p.salePrice, stock: 999 })); return map; }
  const { data } = await db.from("products").select("slug,name,price,sale_price,stock").in("slug", slugs).eq("active", true);
  (data || []).forEach((p) => map.set(p.slug, { name: p.name, price: Number(p.sale_price ?? p.price), stock: p.stock ?? 0 }));
  return map;
}
export const newOrderNumber = () => `DM-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

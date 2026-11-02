import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { products as demo, details, categories as demoCats, type Product } from "@/lib/demo-products";
// Storefront data layer: Supabase when configured, demo data otherwise.
export type Item = Product & { images: string[]; description: string; specs: [string, string][]; variants?: { label: string; options: string[] }; stock: number };
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
const COLS = "slug,name,description,price,sale_price,images,specs,variants,stock,is_demo,categories(name)";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromRow = (r: any): Item => { const images: string[] = r.images?.length ? r.images : ["/placeholder.svg"];
  return { slug: r.slug, name: r.name, price: Number(r.price), salePrice: Number(r.sale_price ?? r.price), category: r.categories?.name ?? "", image: images[0], images, demo: !!r.is_demo,
    description: r.description ?? "", specs: Object.entries(r.specs ?? {}) as [string, string][], variants: r.variants?.options ? r.variants : undefined, stock: r.stock ?? 0 }; };
const fromDemo = (p: Product): Item => ({ ...p, images: [p.image], description: details[p.slug].description, specs: details[p.slug].specs, variants: details[p.slug].variants, stock: 999 });
export const getItems = cache(async (): Promise<Item[]> => {
  if (!db) return demo.map(fromDemo);
  const { data } = await db.from("products").select(COLS).eq("active", true).order("created_at", { ascending: false });
  return (data ?? []).map(fromRow);
});
export async function getItem(slug: string): Promise<Item | null> {
  if (!db) { const p = demo.find((x) => x.slug === slug); return p ? fromDemo(p) : null; }
  const { data } = await db.from("products").select(COLS).eq("slug", slug).eq("active", true).maybeSingle();
  return data ? fromRow(data) : null;
}
export async function getCategories(): Promise<string[]> {
  if (!db) return demoCats;
  return ((await db.from("categories").select("name").order("name")).data ?? []).map((c) => c.name);
}
export async function getDealEnd(): Promise<string | null> {
  if (!db) return new Date(Date.now() + 3 * 864e5).toISOString();
  const v = (await db.from("store_settings").select("value").eq("key", "deal_ends_at").maybeSingle()).data?.value as string | undefined;
  return v && new Date(v) > new Date() ? v : null; // hide the banner when no active deal is set
}

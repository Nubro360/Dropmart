import type { MetadataRoute } from "next";
import { getItems } from "@/lib/catalog";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const items = await getItems().catch(() => []);
  return [...["", "/shop", "/about", "/contact", "/faq", "/shipping-policy", "/returns", "/privacy", "/terms"].map((p) => ({ url: site + p })), ...items.map((i) => ({ url: `${site}/products/${i.slug}` }))];
}

import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getItems, getCategories } from "@/lib/catalog";
export const metadata: Metadata = { title: "Shop all products", description: "Browse electronics, gadgets and home products at great prices.", alternates: { canonical: "/shop" } };
type SP = { q?: string; category?: string; sort?: string };
export default async function Shop({ searchParams }: { searchParams: SP }) {
  const [products, categories] = await Promise.all([getItems(), getCategories()]);
  const q = (searchParams.q || "").toLowerCase();
  let list = products.filter((p) => (!q || p.name.toLowerCase().includes(q)) && (!searchParams.category || p.category === searchParams.category));
  if (searchParams.sort === "price-asc") list = [...list].sort((a, b) => a.salePrice - b.salePrice);
  if (searchParams.sort === "price-desc") list = [...list].sort((a, b) => b.salePrice - a.salePrice);
  const cls = "rounded-full bg-white px-4 py-2 text-sm border border-gray-200";
  return (<div className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Shop</h1>
    <form className="mt-6 flex flex-wrap gap-3">
      <input name="q" defaultValue={searchParams.q} placeholder="Search" aria-label="Search" className={cls} />
      <select name="category" defaultValue={searchParams.category || ""} aria-label="Category" className={cls}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
      <select name="sort" defaultValue={searchParams.sort || ""} aria-label="Sort" className={cls}><option value="">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
      <button className="rounded-full bg-navy text-white px-5 py-2 text-sm">Apply</button>
    </form>
    {list.length ? <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      : <p className="mt-10 bg-white rounded-2xl p-8 text-center text-gray-500">No products match. Try clearing a filter.</p>}
  </div>);
}

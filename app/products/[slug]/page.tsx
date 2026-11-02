import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import { getItems, getItem } from "@/lib/catalog";
import { money } from "@/lib/demo-products";
export const revalidate = 60;
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export async function generateStaticParams() { try { return (await getItems()).map((p) => ({ slug: p.slug })); } catch { return []; } }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getItem(params.slug); if (!p) return {};
  const d = (p.description || p.name).slice(0, 155);
  return { title: p.name, description: d, alternates: { canonical: `/products/${p.slug}` }, openGraph: { title: p.name, description: d, images: [p.image], type: "website" } };
}
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getItem(params.slug); if (!p) notFound();
  const off = p.salePrice < p.price ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
  const related = (await getItems()).filter((x) => x.slug !== p.slug).slice(0, 4);
  const ld = [
    { "@context": "https://schema.org", "@type": "Product", name: p.name, image: p.images, description: p.description, offers: { "@type": "Offer", url: `${site}/products/${p.slug}`, priceCurrency: (process.env.STORE_CURRENCY || "usd").toUpperCase(), price: p.salePrice.toFixed(2), availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Shop", "/shop"], [p.name, `/products/${p.slug}`]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: site + u })) },
  ];
  return (<div className="mx-auto max-w-7xl px-4 py-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{p.name}</span></nav>
    <div className="grid lg:grid-cols-2 gap-10">
      <Gallery images={p.images} alt={p.name} />
      <div>
        {p.demo && <p className="text-xs bg-navy text-white inline-block rounded px-2 py-0.5">Demo product</p>}
        <h1 className="mt-2 text-3xl font-bold">{p.name}</h1>
        <p className="mt-4 flex items-center gap-3"><span className="text-3xl font-bold">{money(p.salePrice)}</span>{off > 0 && <><s className="text-gray-400">{money(p.price)}</s><span className="bg-sale text-white text-xs font-bold rounded-full px-2 py-1">-{off}%</span></>}</p>
        <p className="mt-4 text-gray-600 max-w-prose whitespace-pre-line">{p.description}</p>
        {p.stock > 0 ? <AddToCart slug={p.slug} name={p.name} price={p.salePrice} image={p.image} variants={p.variants} /> : <p className="mt-6 rounded-xl bg-white p-4 text-sm">Sold out. Check back soon.</p>}
        <ul className="mt-6 text-sm space-y-1 text-gray-600"><li>Free shipping on orders over $50; otherwise $4.99 flat.</li><li>See our <Link href="/returns" className="underline">return policy</Link>.</li></ul>
        {p.specs.length > 0 && <><h2 className="mt-8 font-semibold">Specifications</h2><dl className="mt-2 bg-white rounded-2xl divide-y">{p.specs.map(([k, v]) => <div key={k} className="flex justify-between px-4 py-2 text-sm"><dt className="text-gray-500">{k}</dt><dd>{v}</dd></div>)}</dl></>}
      </div>
    </div>
    <section className="mt-12"><h2 className="text-xl font-bold">Customer reviews</h2><p className="mt-2 bg-white rounded-2xl p-6 text-gray-500">No reviews yet. Verified-buyer reviews will appear here.</p></section>
    {related.length > 0 && <section className="mt-12"><h2 className="text-xl font-bold mb-4">Related products</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div></section>}
  </div>);
}

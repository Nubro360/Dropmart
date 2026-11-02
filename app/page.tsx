import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Countdown from "@/components/Countdown";
import { getItems, getCategories, getDealEnd } from "@/lib/catalog";
export const revalidate = 60;
const why = [["Free shipping","On qualifying orders"],["Secure checkout","Encrypted payments"],["Quality products","Checked before listing"],["Easy returns","Clear return window"],["Customer support","Real people, quick replies"]];
export default async function Home() {
  const [products, categories, dealEnds] = await Promise.all([getItems(), getCategories(), getDealEnd()]);
  const empty = <p className="bg-white rounded-2xl p-8 text-center text-gray-500">No products yet. Add some in the admin dashboard.</p>;
  return (<>
    <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy2 to-navy text-white">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/30 blur-3xl animate-glow" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">Smarter Shopping. Happier You.</h1>
          <p className="mt-5 text-lg text-white/70 max-w-md">Discover innovative products at unbeatable prices — delivered to your doorstep.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-full bg-accent text-navy font-semibold px-7 py-3 hover:brightness-110">Shop Now</Link>
            <Link href="#best-sellers" className="rounded-full border border-white/30 px-7 py-3 hover:bg-white/10">Explore Best Sellers</Link>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=75" alt="Premium wireless headphones" className="rounded-3xl shadow-2xl shadow-accent/20 w-full max-h-[460px] object-cover" fetchPriority="high" />
      </div>
    </section>

    <section id="categories" className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl font-bold mb-6">Shop by category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((c) => <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} className="bg-white rounded-2xl p-5 text-center font-medium shadow-sm hover:shadow-md hover:text-accent transition">{c}</Link>)}
      </div>
    </section>

    <section id="trending" className="mx-auto max-w-7xl px-4">
      <h2 className="text-2xl font-bold mb-6">Trending products</h2>
      {products.length ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">{products.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}</div> : empty}
    </section>

    {dealEnds && <section id="deals" className="mx-auto max-w-7xl px-4 mt-14">
      <div className="rounded-3xl bg-gradient-to-r from-navy to-navy2 text-white p-8 lg:p-12 flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
        <div><h2 className="text-3xl font-bold">Limited-Time Deals – Save More Today!</h2><p className="mt-2 text-white/70">Offer ends when the clock hits zero.</p></div>
        <Countdown endsAt={dealEnds!} />
      </div>
    </section>}

    <section id="best-sellers" className="mx-auto max-w-7xl px-4 mt-14">
      <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">Best sellers</h2><Link href="/shop" className="text-sm text-accent font-medium">View all</Link></div>
      {products.length ? <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">{products.map((p) => <ProductCard key={p.slug} p={p} />)}</div> : empty}
    </section>

    <section className="mx-auto max-w-7xl px-4 mt-14"><h2 className="text-2xl font-bold mb-6">Why shop with us</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{why.map(([t, d]) => <div key={t} className="bg-white rounded-2xl p-5"><h3 className="font-semibold">{t}</h3><p className="text-sm text-gray-500 mt-1">{d}</p></div>)}</div></section>

    <section className="mx-auto max-w-7xl px-4 mt-14"><h2 className="text-2xl font-bold mb-2">Customer reviews</h2>
      <p className="bg-white rounded-2xl p-6 text-gray-500">Reviews from verified buyers will appear here once you have real orders. No placeholder ratings are shown.</p></section>

    <section className="mx-auto max-w-7xl px-4 mt-14"><div className="bg-navy text-white rounded-3xl p-8 lg:p-12 text-center">
      <h2 className="text-2xl font-bold">Get deals in your inbox</h2>
      <form action="/api/newsletter" method="post" className="mt-5 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input type="email" name="email" required placeholder="you@example.com" aria-label="Email address" className="flex-1 rounded-full px-5 py-3 text-ink" />
        <button className="rounded-full bg-accent text-navy font-semibold px-6 py-3">Subscribe</button></form></div></section>
  </>);
}

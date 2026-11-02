"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/demo-products";
export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart(); const off = Math.round((1 - p.salePrice / p.price) * 100);
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <Link href={`/products/${p.slug}`} className="block relative aspect-square bg-bg">
        <Image src={p.image} alt={p.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" loading="lazy" />
        {off > 0 && <span className="absolute top-3 left-3 bg-sale text-white text-xs font-bold rounded-full px-2 py-1">-{off}%</span>}
        {p.demo && <span className="absolute top-3 right-3 bg-navy/80 text-white text-[10px] rounded px-1.5 py-0.5">Demo</span>}
      </Link>
      <div className="p-4">
        <h3 className="font-semibold leading-snug"><Link href={`/products/${p.slug}`}>{p.name}</Link></h3>
        <p className="mt-2"><span className="text-lg font-bold">${p.salePrice.toFixed(2)}</span> {off > 0 && <s className="text-sm text-gray-400">${p.price.toFixed(2)}</s>}</p>
        <button onClick={() => add({ slug: p.slug, name: p.name, price: p.salePrice, image: p.image })} className="mt-3 w-full rounded-full bg-navy text-white py-2 text-sm font-medium hover:bg-accent hover:text-navy transition-colors">Add to cart</button>
      </div>
    </article>);
}

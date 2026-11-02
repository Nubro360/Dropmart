"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
export default function AddToCart({ slug, name, price, image, variants }: { slug: string; name: string; price: number; image: string; variants?: { label: string; options: string[] } }) {
  const { add } = useCart(); const router = useRouter();
  const [qty, setQty] = useState(1); const [v, setV] = useState(variants?.options[0]); const [added, setAdded] = useState(false);
  const put = () => { for (let i = 0; i < qty; i++) add({ slug: v ? `${slug}--${v}` : slug, name: v ? `${name} (${v})` : name, price, image }); };
  return (<div className="mt-6 space-y-4">
    {variants && <fieldset><legend className="text-sm font-medium mb-2">{variants.label}</legend><div className="flex gap-2">{variants.options.map((o) => <button key={o} type="button" aria-pressed={v === o} onClick={() => setV(o)} className={`rounded-full border px-4 py-1.5 text-sm ${v === o ? "bg-navy text-white border-navy" : "bg-white"}`}>{o}</button>)}</div></fieldset>}
    <div className="flex items-center gap-3"><span className="text-sm font-medium">Quantity</span>
      <div className="flex items-center bg-white rounded-full border"><button type="button" aria-label="Decrease" className="px-4 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span className="w-8 text-center" aria-live="polite">{qty}</span><button type="button" aria-label="Increase" className="px-4 py-2" onClick={() => setQty(Math.min(10, qty + 1))}>+</button></div></div>
    <div className="flex gap-3">
      <button onClick={() => { put(); setAdded(true); setTimeout(() => setAdded(false), 1500); }} className="flex-1 rounded-full bg-navy text-white py-3 font-semibold hover:bg-accent hover:text-navy transition-colors">{added ? "Added to cart" : "Add to cart"}</button>
      <button onClick={() => { put(); router.push("/cart"); }} className="flex-1 rounded-full bg-accent text-navy py-3 font-semibold hover:brightness-110">Buy now</button></div>
  </div>);
}

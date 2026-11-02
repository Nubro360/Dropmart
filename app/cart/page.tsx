"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { totals } from "@/lib/pricing";
import { money } from "@/lib/demo-products";
export default function CartPage() {
  const { items, remove, setQty } = useCart();
  const [code, setCode] = useState(""); const [coupon, setCoupon] = useState<{ code: string; percentOff: number } | null>(null); const [msg, setMsg] = useState("");
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const t = totals(sub, coupon?.percentOff || 0);
  async function apply() {
    setMsg("");
    const r = await fetch("/api/coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
    const j = await r.json();
    if (r.ok) { setCoupon(j); setMsg(`${j.code} applied: ${j.percentOff}% off`); } else { setCoupon(null); setMsg(j.error || "Could not apply coupon."); }
  }
  if (!items.length) return (<div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Your cart is empty</h1><Link href="/shop" className="mt-6 inline-block rounded-full bg-navy text-white px-6 py-3">Browse products</Link></div>);
  return (<div className="mx-auto max-w-5xl px-4 py-10 grid lg:grid-cols-[1fr_320px] gap-8">
    <div><h1 className="text-2xl font-bold mb-4">Cart</h1><ul className="space-y-3">{items.map((i) => (
      <li key={i.slug} className="bg-white rounded-2xl p-3 flex gap-4 items-center">
        <Image src={i.image} alt={i.name} width={72} height={72} className="rounded-xl object-cover" />
        <div className="flex-1"><p className="font-medium text-sm">{i.name}</p><p className="text-sm text-gray-500">{money(i.price)}</p></div>
        <div className="flex items-center border rounded-full"><button aria-label="Decrease" className="px-3 py-1" onClick={() => setQty(i.slug, i.qty - 1)}>−</button><span className="w-6 text-center">{i.qty}</span><button aria-label="Increase" className="px-3 py-1" onClick={() => setQty(i.slug, i.qty + 1)}>+</button></div>
        <button onClick={() => remove(i.slug)} className="text-sm text-sale">Remove</button></li>))}</ul></div>
    <aside className="bg-white rounded-2xl p-5 h-fit space-y-3">
      <h2 className="font-semibold">Order summary</h2>
      <div className="flex gap-2"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="flex-1 border rounded-full px-4 py-2 text-sm" /><button onClick={apply} className="rounded-full bg-navy text-white px-4 text-sm">Apply</button></div>
      {msg && <p className="text-xs text-gray-600" role="status">{msg}</p>}
      <dl className="text-sm space-y-1"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
        {t.discount > 0 && <div className="flex justify-between text-green-700"><dt>Discount</dt><dd>-{money(t.discount)}</dd></div>}
        <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping ? money(t.shipping) : "Free"}</dd></div>
        <div className="flex justify-between font-bold text-base pt-2 border-t"><dt>Total</dt><dd>{money(t.total)}</dd></div></dl>
      <Link href="/checkout" className="block text-center rounded-full bg-accent text-navy font-semibold py-3">Checkout</Link>
      <p className="text-xs text-gray-400">Prices and coupons are re-verified on the server at checkout.</p>
    </aside></div>);
}

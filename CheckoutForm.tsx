"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { totals } from "@/lib/pricing";
import { money } from "@/lib/demo-products";
const labels: Record<string, string> = { cod: "Cash on delivery", stripe: "Pay online (card)", manual: "Manual payment (bank transfer)" };
export default function CheckoutForm({ methods }: { methods: string[] }) {
  const { items } = useCart(); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const [pm, setPm] = useState(methods[0]); const [coupon, setCoupon] = useState("");
  const t = totals(items.reduce((s, i) => s + i.price * i.qty, 0));
  if (!items.length) return <div className="text-center py-20"><p>Your cart is empty.</p><Link href="/shop" className="underline">Browse products</Link></div>;
  if (!methods.length) return <p className="py-20 text-center">No payment methods are enabled. See the README.</p>;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      customer: { name: f.name, email: f.email, phone: f.phone, country: f.country, state: f.state, address: f.address, postal: f.postal, notes: f.notes },
      items: items.map((i) => ({ slug: i.slug, qty: i.qty })), coupon: coupon || undefined, paymentMethod: pm }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { window.location.href = j.redirect; return; }
    setErr(j.error || "Something went wrong. Please try again."); setBusy(false);
  }
  const inp = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm";
  const F = ({ n, l, t = "text", req = true }: { n: string; l: string; t?: string; req?: boolean }) => <label className="block text-sm"><span className="mb-1 block font-medium">{l}</span><input name={n} type={t} required={req} className={inp} /></label>;
  return (<form onSubmit={submit} className="grid lg:grid-cols-[1fr_320px] gap-8">
    <div className="space-y-4"><h1 className="text-2xl font-bold">Checkout</h1>
      <div className="grid sm:grid-cols-2 gap-4"><F n="name" l="Full name" /><F n="email" l="Email" t="email" /><F n="phone" l="Phone number" t="tel" /><F n="country" l="Country" /><F n="state" l="State / City" /><F n="postal" l="Postal code" /></div>
      <F n="address" l="Full shipping address" />
      <label className="block text-sm"><span className="mb-1 block font-medium">Order notes (optional)</span><textarea name="notes" rows={3} className={inp} /></label>
      <fieldset><legend className="font-medium text-sm mb-2">Payment</legend>{methods.map((m) => <label key={m} className="flex gap-2 items-center bg-white rounded-xl p-3 mb-2 text-sm"><input type="radio" name="pm" checked={pm === m} onChange={() => setPm(m)} />{labels[m]}</label>)}</fieldset>
    </div>
    <aside className="bg-white rounded-2xl p-5 h-fit space-y-3 text-sm">
      <h2 className="font-semibold">Summary</h2>
      <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code (applied by the server)" aria-label="Coupon" className={inp} />
      <div className="flex justify-between"><span>Subtotal</span><span>{money(t.subtotal)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{t.shipping ? money(t.shipping) : "Free"}</span></div>
      <p className="text-xs text-gray-400">Coupon discount and final total are confirmed when you place the order.</p>
      {err && <p role="alert" className="text-sale">{err}</p>}
      <button disabled={busy} className="w-full rounded-full bg-accent text-navy font-semibold py-3 disabled:opacity-60">{busy ? "Placing order…" : "Place order"}</button>
    </aside></form>);
}

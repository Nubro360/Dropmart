import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "@/components/ClearCart";
import { adminClient } from "@/lib/supabase/server";
import { money } from "@/lib/demo-products";
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };
export const dynamic = "force-dynamic";
export default async function Confirmation({ params }: { params: { number: string } }) {
  const n = params.number.slice(0, 40);
  const db = adminClient();
  const o = db ? (await db.from("orders").select("order_number,status,payment_status,payment_method,total,items").eq("order_number", n).maybeSingle()).data : null;
  return (<div className="mx-auto max-w-xl px-4 py-16 text-center"><ClearCart />
    <h1 className="text-3xl font-bold">Thank you! Your order is in.</h1>
    <p className="mt-3">Order number <b>{n}</b></p>
    {o && <div className="mt-6 bg-white rounded-2xl p-5 text-left text-sm space-y-1">
      {(o.items as { name: string; qty: number }[]).map((i, k) => <p key={k}>{i.qty} × {i.name}</p>)}
      <p className="pt-2 font-bold">Total {money(Number(o.total))}</p>
      <p className="text-gray-500">Status: {o.status} · Payment: {o.payment_status}</p>
      {o.payment_method === "manual" && <p className="pt-2 border-t">{process.env.MANUAL_PAYMENT_INSTRUCTIONS || "We'll email you payment instructions."}</p>}</div>}
    {!db && <p className="mt-4 text-sm text-gray-500">Demo mode: Supabase isn't configured, so this order was not saved.</p>}
    <Link href="/shop" className="mt-8 inline-block rounded-full bg-navy text-white px-6 py-3">Keep shopping</Link></div>);
}

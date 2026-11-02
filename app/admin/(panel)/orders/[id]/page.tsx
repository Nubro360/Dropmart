import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { updateOrder, ORDER_STATUSES } from "../../../actions";
export default async function Order({ params }: { params: { id: string } }) {
  const db = await requireAdmin();
  const o = (await db.from("orders").select("*").eq("id", params.id).maybeSingle()).data; if (!o) notFound();
  const c = o.customer as Record<string, string>; const items = o.items as { name: string; qty: number; price: number }[];
  const i = "w-full rounded-xl border bg-white px-3 py-2 text-sm";
  return (<div className="max-w-2xl space-y-6"><h1 className="text-2xl font-bold">Order {o.order_number}</h1>
    <section className="bg-white rounded-2xl p-5 text-sm space-y-1"><h2 className="font-semibold">Customer</h2><p>{c.name} · {c.email} · {c.phone}</p><p>{c.address}, {c.state}, {c.postal}, {c.country}</p>{c.notes && <p>Notes: {c.notes}</p>}</section>
    <section className="bg-white rounded-2xl p-5 text-sm space-y-1"><h2 className="font-semibold">Items</h2>{items.map((it, k) => <p key={k}>{it.qty} × {it.name} — ${(it.price * it.qty).toFixed(2)}</p>)}
      <p className="pt-2 border-t">Shipping ${Number(o.shipping).toFixed(2)} · Discount ${Number(o.discount).toFixed(2)} · <b>Total ${Number(o.total).toFixed(2)}</b></p><p className="text-gray-500">{o.payment_method} · {o.payment_status}</p></section>
    <form action={updateOrder} className="bg-white rounded-2xl p-5 space-y-3"><h2 className="font-semibold">Fulfillment</h2><input type="hidden" name="id" value={o.id} />
      <select name="status" defaultValue={o.status} aria-label="Status" className={i}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</select>
      <input name="tracking_number" defaultValue={o.tracking_number ?? ""} placeholder="Tracking number" aria-label="Tracking number" className={i} />
      <input name="tracking_url" type="url" defaultValue={o.tracking_url ?? ""} placeholder="Tracking URL" aria-label="Tracking URL" className={i} />
      <button className="rounded-full bg-navy text-white px-6 py-2.5 text-sm">Save</button></form></div>);
}

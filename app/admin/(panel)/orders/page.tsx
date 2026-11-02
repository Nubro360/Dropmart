import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
export default async function Orders() {
  const db = await requireAdmin();
  const list = (await db.from("orders").select("id,order_number,status,payment_status,total,customer,created_at").order("created_at", { ascending: false }).limit(200)).data ?? [];
  return (<div><h1 className="text-2xl font-bold mb-4">Orders</h1>
    {list.length ? <div className="overflow-x-auto bg-white rounded-2xl"><table className="w-full text-sm"><thead className="text-left text-gray-500"><tr>{["Order","Customer","Total","Status","Payment","Date"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>
      {list.map((o) => <tr key={o.id} className="border-t"><td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium text-accent">{o.order_number}</Link></td><td className="p-3">{(o.customer as { name: string }).name}</td><td className="p-3">${Number(o.total).toFixed(2)}</td><td className="p-3 capitalize">{o.status}</td><td className="p-3">{o.payment_status}</td><td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>
      : <p className="bg-white rounded-2xl p-8 text-center text-gray-500">No orders yet.</p>}</div>);
}

import { requireAdmin } from "@/lib/admin";
export default async function Customers() {
  const db = await requireAdmin();
  const orders = (await db.from("orders").select("customer,total,status").limit(5000)).data ?? [];
  const map = new Map<string, { name: string; phone: string; n: number; spent: number }>();
  for (const o of orders) { const c = o.customer as { name: string; email: string; phone: string }; const e = c.email.toLowerCase(); const r = map.get(e) ?? { name: c.name, phone: c.phone, n: 0, spent: 0 };
    r.n++; if (!["cancelled", "refunded"].includes(o.status)) r.spent += Number(o.total); map.set(e, r); }
  return (<div><h1 className="text-2xl font-bold mb-4">Customers</h1>{map.size ? <div className="overflow-x-auto bg-white rounded-2xl"><table className="w-full text-sm"><thead className="text-left text-gray-500"><tr>{["Name","Email","Phone","Orders","Spent"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>
    {[...map].map(([e, r]) => <tr key={e} className="border-t"><td className="p-3">{r.name}</td><td className="p-3">{e}</td><td className="p-3">{r.phone}</td><td className="p-3">{r.n}</td><td className="p-3">${r.spent.toFixed(2)}</td></tr>)}</tbody></table></div> : <p className="bg-white rounded-2xl p-8 text-center text-gray-500">Customers appear after their first order.</p>}</div>);
}

import { requireAdmin } from "@/lib/admin";
import { ORDER_STATUSES } from "../actions";
const m = (n: number) => `$${n.toFixed(2)}`;
export default async function Dashboard() {
  const db = await requireAdmin();
  const rows = (await db.from("orders").select("total,status").limit(5000)).data ?? [];
  const live = rows.filter((o) => !["cancelled", "refunded"].includes(o.status));
  const revenue = live.reduce((s, o) => s + Number(o.total), 0);
  const cards: [string, string][] = [["Orders", String(rows.length)], ["Revenue (excl. cancelled/refunded)", m(revenue)], ["Average order", m(live.length ? revenue / live.length : 0)]];
  return (<div><h1 className="text-2xl font-bold mb-4">Sales analytics</h1>
    <div className="grid sm:grid-cols-3 gap-4">{cards.map(([l, v]) => <div key={l} className="bg-white rounded-2xl p-5"><p className="text-sm text-gray-500">{l}</p><p className="text-2xl font-bold">{v}</p></div>)}</div>
    <h2 className="font-semibold mt-8 mb-3">Orders by status</h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">{ORDER_STATUSES.map((s) => <div key={s} className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500 capitalize">{s}</p><p className="text-xl font-bold">{rows.filter((o) => o.status === s).length}</p></div>)}</div></div>);
}

import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { deleteProduct } from "../../actions";
export default async function Products() {
  const db = await requireAdmin();
  const list = (await db.from("products").select("id,name,price,sale_price,stock,supplier_cost,active").order("created_at", { ascending: false })).data ?? [];
  return (<div><div className="flex justify-between mb-4"><h1 className="text-2xl font-bold">Products</h1><Link href="/admin/products/new" className="rounded-full bg-navy text-white px-5 py-2 text-sm">Add product</Link></div>
    {list.length ? <div className="overflow-x-auto bg-white rounded-2xl"><table className="w-full text-sm"><thead className="text-left text-gray-500"><tr>{["Name","Price","Cost","Margin","Stock",""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>
      {list.map((p) => { const price = Number(p.sale_price ?? p.price); const margin = p.supplier_cost != null ? `${Math.round(((price - Number(p.supplier_cost)) / price) * 100)}%` : "—";
        return <tr key={p.id} className="border-t"><td className="p-3"><Link href={`/admin/products/${p.id}`} className="font-medium">{p.name}</Link>{!p.active && <span className="ml-2 text-xs text-gray-400">hidden</span>}</td><td className="p-3">${price.toFixed(2)}</td><td className="p-3">{p.supplier_cost != null ? `$${Number(p.supplier_cost).toFixed(2)}` : "—"}</td><td className="p-3">{margin}</td><td className="p-3">{p.stock}</td>
        <td className="p-3"><form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><button className="text-sale">Delete</button></form></td></tr>; })}</tbody></table></div>
      : <p className="bg-white rounded-2xl p-8 text-center text-gray-500">No products yet. Add your first one.</p>}</div>);
}

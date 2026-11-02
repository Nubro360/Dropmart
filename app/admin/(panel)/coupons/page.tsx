import { requireAdmin } from "@/lib/admin";
import { saveCoupon, deleteCoupon } from "../../actions";
export default async function Coupons() {
  const db = await requireAdmin(); const list = (await db.from("coupons").select("id,code,percent_off,expires_at").order("code")).data ?? [];
  const i = "rounded-xl border bg-white px-3 py-2 text-sm";
  return (<div className="max-w-xl"><h1 className="text-2xl font-bold mb-4">Coupons</h1>
    <form action={saveCoupon} className="flex flex-wrap gap-2 mb-4"><input name="code" required placeholder="CODE" aria-label="Code" className={i} /><input name="percent_off" type="number" min="1" max="100" required placeholder="% off" aria-label="Percent off" className={`${i} w-24`} /><input name="expires_at" type="date" aria-label="Expires" className={i} /><button className="rounded-full bg-navy text-white px-5 text-sm">Create</button></form>
    <ul className="bg-white rounded-2xl divide-y">{list.map((c) => <li key={c.id} className="flex justify-between p-3 text-sm"><span><b>{c.code}</b> · {c.percent_off}% off{c.expires_at && ` · expires ${new Date(c.expires_at).toLocaleDateString()}`}</span><form action={deleteCoupon}><input type="hidden" name="id" value={c.id} /><button className="text-sale">Delete</button></form></li>)}{!list.length && <li className="p-4 text-sm text-gray-500">No coupons yet.</li>}</ul></div>);
}

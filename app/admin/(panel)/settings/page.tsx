import { requireAdmin } from "@/lib/admin";
import { saveSettings } from "../../actions";
export default async function Settings() {
  const db = await requireAdmin(); const v = (await db.from("store_settings").select("value").eq("key", "deal_ends_at").maybeSingle()).data?.value as string | undefined;
  return (<div className="max-w-md"><h1 className="text-2xl font-bold mb-4">Store settings</h1>
    <form action={saveSettings} className="bg-white rounded-2xl p-5 space-y-3"><label className="block text-sm"><span className="block mb-1 font-medium">Deals countdown ends</span><input name="deal_ends_at" type="datetime-local" required defaultValue={v ? v.slice(0, 16) : ""} className="w-full rounded-xl border px-3 py-2" /></label><button className="rounded-full bg-navy text-white px-6 py-2.5 text-sm">Save</button></form></div>);
}

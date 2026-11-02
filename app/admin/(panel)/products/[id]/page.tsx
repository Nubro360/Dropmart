import { requireAdmin } from "@/lib/admin";
import { saveProduct } from "../../../actions";
export default async function Edit({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  const db = await requireAdmin(); const isNew = params.id === "new";
  const p = isNew ? null : (await db.from("products").select("*").eq("id", params.id).maybeSingle()).data;
  const cats = (await db.from("categories").select("id,name")).data ?? [];
  const i = "w-full rounded-xl border bg-white px-3 py-2 text-sm";
  const F = ({ n, l, t = "text", v, req }: { n: string; l: string; t?: string; v?: unknown; req?: boolean }) => <label className="block text-sm"><span className="block mb-1 font-medium">{l}</span><input name={n} type={t} step={t === "number" ? "0.01" : undefined} defaultValue={v as string ?? ""} required={req} className={i} /></label>;
  const specs = p?.specs ? Object.entries(p.specs as Record<string, string>).map(([k, v]) => `${k}: ${v}`).join("\n") : "";
  const vr = p?.variants as { label: string; options: string[] } | null;
  return (<form action={saveProduct} className="max-w-2xl space-y-4"><h1 className="text-2xl font-bold">{isNew ? "Add product" : "Edit product"}</h1>
    {searchParams.error && <p role="alert" className="text-sale text-sm">{searchParams.error}</p>}
    {p && <input type="hidden" name="id" value={p.id} />}
    <F n="name" l="Name" v={p?.name} req /><F n="slug" l="URL slug (optional)" v={p?.slug} />
    <label className="block text-sm"><span className="block mb-1 font-medium">Description</span><textarea name="description" rows={4} defaultValue={p?.description ?? ""} className={i} /></label>
    <label className="block text-sm"><span className="block mb-1 font-medium">Category</span><select name="category_id" defaultValue={p?.category_id ?? ""} className={i}><option value="">None</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <div className="grid grid-cols-3 gap-3"><F n="price" l="Price" t="number" v={p?.price} req /><F n="sale_price" l="Sale price" t="number" v={p?.sale_price} /><F n="stock" l="Stock" t="number" v={p?.stock ?? 0} req /></div>
    <fieldset className="grid sm:grid-cols-3 gap-3 bg-white rounded-2xl p-4"><legend className="text-sm font-medium px-1">Supplier</legend><F n="supplier_name" l="Name" v={p?.supplier_name} /><F n="supplier_url" l="Product URL" t="url" v={p?.supplier_url} /><F n="supplier_cost" l="Cost" t="number" v={p?.supplier_cost} /></fieldset>
    <label className="block text-sm"><span className="block mb-1 font-medium">Image URLs (one per line)</span><textarea name="image_urls" rows={3} defaultValue={(p?.images ?? []).join("\n")} className={i} /></label>
    <label className="block text-sm"><span className="block mb-1 font-medium">Upload images (max 5 MB each)</span><input type="file" name="images" accept="image/*" multiple /></label>
    <label className="block text-sm"><span className="block mb-1 font-medium">Specifications (Key: Value per line)</span><textarea name="specs" rows={3} defaultValue={specs} className={i} /></label>
    <F n="variants" l="Variants (Label: option, option)" v={vr ? `${vr.label}: ${vr.options.join(", ")}` : ""} />
    <label className="flex gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} />Visible in store</label>
    <label className="flex gap-2 text-sm"><input type="checkbox" name="is_demo" defaultChecked={p?.is_demo ?? false} />Demo product</label>
    <button className="rounded-full bg-navy text-white px-6 py-3">Save product</button></form>);
}

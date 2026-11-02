import { requireAdmin } from "@/lib/admin";
import { saveCategory, deleteCategory } from "../../actions";
export default async function Categories() {
  const db = await requireAdmin(); const list = (await db.from("categories").select("id,name").order("name")).data ?? [];
  return (<div className="max-w-md"><h1 className="text-2xl font-bold mb-4">Categories</h1>
    <form action={saveCategory} className="flex gap-2 mb-4"><input name="name" required placeholder="New category" aria-label="Category name" className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm" /><button className="rounded-full bg-navy text-white px-5 text-sm">Add</button></form>
    <ul className="bg-white rounded-2xl divide-y">{list.map((c) => <li key={c.id} className="flex justify-between p-3 text-sm">{c.name}<form action={deleteCategory}><input type="hidden" name="id" value={c.id} /><button className="text-sale">Delete</button></form></li>)}{!list.length && <li className="p-4 text-sm text-gray-500">No categories yet.</li>}</ul></div>);
}

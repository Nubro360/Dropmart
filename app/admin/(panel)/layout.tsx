import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "../actions";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
const nav = [["Dashboard","/admin"],["Products","/admin/products"],["Orders","/admin/orders"],["Customers","/admin/customers"],["Categories","/admin/categories"],["Coupons","/admin/coupons"],["Settings","/admin/settings"]];
export default async function Panel({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (<div className="mx-auto max-w-7xl px-4 py-6"><div className="flex flex-wrap items-center gap-4 border-b pb-4 mb-6">
    <b>DropMart Admin</b><nav aria-label="Admin" className="flex flex-wrap gap-4 text-sm">{nav.map(([l, h]) => <Link key={h} href={h} className="hover:text-accent">{l}</Link>)}</nav>
    <form action={signOut} className="ml-auto"><button className="text-sm underline">Sign out</button></form></div>{children}</div>);
}

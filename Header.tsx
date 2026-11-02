"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
const nav = [["Home","/"],["Shop","/shop"],["Categories","/#categories"],["Best Sellers","/#best-sellers"],["Deals","/#deals"],["About Us","/about"],["Contact","/contact"]];
export default function Header() {
  const { count } = useCart(); const [open, setOpen] = useState(false);
  return (<>
    <div className="bg-accent text-navy text-center text-sm font-medium py-2 px-4">Free shipping on orders over $50 — limited-time deals live now</div>
    <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur text-white border-b border-white/10">
      <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 h-16">
        <button className="lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        <Link href="/" className="text-xl font-bold tracking-tight">Drop<span className="text-accent">Mart</span></Link>
        <nav aria-label="Main" className="hidden lg:flex gap-6 text-sm ml-6">{nav.map(([l, h]) => <Link key={l} href={h} className="hover:text-accent transition-colors">{l}</Link>)}</nav>
        <form action="/shop" className="ml-auto hidden md:block"><input name="q" placeholder="Search products" aria-label="Search" className="rounded-full bg-white/10 px-4 py-2 text-sm w-60 placeholder:text-white/50" /></form>
        <Link href="/account" aria-label="Account">👤</Link>
        <Link href="/wishlist" aria-label="Wishlist">♡</Link>
        <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative">🛒{count > 0 && <span className="absolute -top-2 -right-3 bg-accent text-navy text-xs font-bold rounded-full px-1.5">{count}</span>}</Link>
      </div>
      {open && <nav aria-label="Mobile" className="lg:hidden flex flex-col px-4 pb-4 gap-3 text-sm">{nav.map(([l, h]) => <Link key={l} href={h} onClick={() => setOpen(false)}>{l}</Link>)}</nav>}
    </header></>);
}

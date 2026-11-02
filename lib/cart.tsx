"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
export type CartItem = { slug: string; name: string; price: number; image: string; qty: number };
type Ctx = { items: CartItem[]; count: number; add: (i: Omit<CartItem, "qty">) => void; remove: (slug: string) => void; setQty: (slug: string, q: number) => void };
const C = createContext<Ctx | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("dm-cart") || "[]")); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("dm-cart", JSON.stringify(items)); } catch {} }, [items]);
  const add: Ctx["add"] = (i) => setItems((p) => p.some((x) => x.slug === i.slug) ? p.map((x) => x.slug === i.slug ? { ...x, qty: x.qty + 1 } : x) : [...p, { ...i, qty: 1 }]);
  const remove = (s: string) => setItems((p) => p.filter((x) => x.slug !== s));
  const setQty = (s: string, q: number) => setItems((p) => q < 1 ? p.filter((x) => x.slug !== s) : p.map((x) => x.slug === s ? { ...x, qty: q } : x));
  return <C.Provider value={{ items, count: items.reduce((n, i) => n + i.qty, 0), add, remove, setQty }}>{children}</C.Provider>;
}
export const useCart = () => { const c = useContext(C); if (!c) throw new Error("CartProvider missing"); return c; };

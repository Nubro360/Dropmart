"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
export default function ClearCart() { const { items, setQty } = useCart(); useEffect(() => { items.forEach((i) => setQty(i.slug, 0)); /* eslint-disable-next-line */ }, []); return null; }

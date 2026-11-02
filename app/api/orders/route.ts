import { NextResponse } from "next/server";
import { orderInput, lookupProducts, newOrderNumber } from "@/lib/orders";
import { findCoupon } from "@/lib/coupons";
import { totals } from "@/lib/pricing";
import { adminClient } from "@/lib/supabase/server";
import { sendOrderEmail } from "@/lib/email";
const enabled = { cod: process.env.ENABLE_COD !== "false", manual: process.env.ENABLE_MANUAL_PAYMENT === "true", stripe: !!process.env.STRIPE_SECRET_KEY };
export async function POST(req: Request) {
  const parsed = orderInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  const input = parsed.data;
  if (!enabled[input.paymentMethod]) return NextResponse.json({ error: "That payment method is not available." }, { status: 400 });

  const base = input.items.map((i) => i.slug.split("--")[0]);
  const prices = await lookupProducts([...new Set(base)]);
  const items = [];
  for (const i of input.items) {
    const p = prices.get(i.slug.split("--")[0]);
    if (!p) return NextResponse.json({ error: "An item in your cart is no longer available." }, { status: 400 });
    if (p.stock < i.qty) return NextResponse.json({ error: `${p.name} has only ${p.stock} left in stock.` }, { status: 409 });
    const variant = i.slug.includes("--") ? i.slug.split("--")[1].slice(0, 40) : null;
    items.push({ slug: i.slug, name: variant ? `${p.name} (${variant})` : p.name, price: p.price, qty: i.qty });
  }
  const coupon = input.coupon ? await findCoupon(input.coupon) : null;
  const t = totals(items.reduce((s, i) => s + i.price * i.qty, 0), coupon?.percentOff || 0);
  const order_number = newOrderNumber();
  const row = { order_number, status: "pending", payment_status: "unpaid", customer: input.customer, items, subtotal: t.subtotal, shipping: t.shipping, discount: t.discount, total: t.total, payment_method: input.paymentMethod };

  const db = adminClient();
  if (db) { const { error } = await db.from("orders").insert(row); if (error) { console.error(error); return NextResponse.json({ error: "We couldn't save your order. Please try again." }, { status: 500 }); } }

  if (input.paymentMethod === "stripe") {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const body = new URLSearchParams({ mode: "payment", success_url: `${site}/order/${order_number}`, cancel_url: `${site}/cart`, customer_email: input.customer.email,
      "line_items[0][quantity]": "1", "line_items[0][price_data][currency]": (process.env.STORE_CURRENCY || "usd").toLowerCase(),
      "line_items[0][price_data][unit_amount]": String(Math.round(t.total * 100)), "line_items[0][price_data][product_data][name]": `DropMart order ${order_number}`, "metadata[order_number]": order_number });
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
    const s = await r.json();
    if (!r.ok || !s.url) { console.error(s); return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 502 }); }
    return NextResponse.json({ order_number, redirect: s.url }); // email is sent after the webhook confirms payment
  }
  await sendOrderEmail({ order_number, total: t.total, customer: input.customer, items });
  return NextResponse.json({ order_number, redirect: `/order/${order_number}` });
}

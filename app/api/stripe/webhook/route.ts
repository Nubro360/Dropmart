import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminClient } from "@/lib/supabase/server";
import { sendOrderEmail } from "@/lib/email";
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET, db = adminClient();
  if (!secret || !db) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const raw = await req.text(); const header = req.headers.get("stripe-signature") || "";
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${raw}`).digest("hex");
  const ok = parts.v1 && parts.v1.length === expected.length && crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected));
  if (!ok || Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  const event = JSON.parse(raw);
  if (event.type === "checkout.session.completed") {
    const n = event.data.object.metadata?.order_number;
    const { data } = await db.from("orders").update({ payment_status: "paid", status: "confirmed" }).eq("order_number", n).select().maybeSingle();
    if (data) await sendOrderEmail(data);
  }
  return NextResponse.json({ received: true });
}

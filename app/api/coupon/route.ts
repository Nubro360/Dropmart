import { NextResponse } from "next/server";
import { findCoupon } from "@/lib/coupons";
export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };
  const c = typeof code === "string" ? await findCoupon(code.slice(0, 40)) : null;
  return c ? NextResponse.json(c) : NextResponse.json({ error: "Coupon is invalid or expired." }, { status: 404 });
}

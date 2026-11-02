import { NextResponse } from "next/server";
import { z } from "zod";
import { adminClient } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  const email = z.string().trim().email().max(150).safeParse(fd?.get("email"));
  if (!email.success) return NextResponse.redirect(new URL("/", req.url), 303);
  const db = adminClient();
  if (db) await db.from("newsletter_subscribers").upsert({ email: email.data.toLowerCase() }, { onConflict: "email", ignoreDuplicates: true });
  return NextResponse.redirect(new URL("/newsletter/thanks", req.url), 303);
}

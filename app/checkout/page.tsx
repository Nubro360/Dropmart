import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
export const dynamic = "force-dynamic";
export default function Checkout() {
  const methods = [process.env.ENABLE_COD !== "false" && "cod", process.env.STRIPE_SECRET_KEY && "stripe", process.env.ENABLE_MANUAL_PAYMENT === "true" && "manual"].filter(Boolean) as string[];
  return <div className="mx-auto max-w-5xl px-4 py-10"><CheckoutForm methods={methods} /></div>;
}

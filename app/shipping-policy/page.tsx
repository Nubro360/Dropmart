import type { Metadata } from "next";
import Policy from "@/components/Policy";
import { pages } from "@/lib/pages";
export const metadata: Metadata = { title: pages["shipping-policy"].title, description: pages["shipping-policy"].desc, alternates: { canonical: "/shipping-policy" } };
export default function Page() { return <Policy slug="shipping-policy" />; }

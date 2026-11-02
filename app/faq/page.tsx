import type { Metadata } from "next";
import Policy from "@/components/Policy";
import { pages } from "@/lib/pages";
export const metadata: Metadata = { title: pages["faq"].title, description: pages["faq"].desc, alternates: { canonical: "/faq" } };
export default function Page() { return <Policy slug="faq" />; }

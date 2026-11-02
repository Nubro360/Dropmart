import type { Metadata } from "next";
import Policy from "@/components/Policy";
import { pages } from "@/lib/pages";
export const metadata: Metadata = { title: pages["privacy"].title, description: pages["privacy"].desc, alternates: { canonical: "/privacy" } };
export default function Page() { return <Policy slug="privacy" />; }

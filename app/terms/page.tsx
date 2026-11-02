import type { Metadata } from "next";
import Policy from "@/components/Policy";
import { pages } from "@/lib/pages";
export const metadata: Metadata = { title: pages["terms"].title, description: pages["terms"].desc, alternates: { canonical: "/terms" } };
export default function Page() { return <Policy slug="terms" />; }

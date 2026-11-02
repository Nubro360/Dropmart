import type { Metadata } from "next";
import Policy from "@/components/Policy";
import { pages } from "@/lib/pages";
export const metadata: Metadata = { title: pages["about"].title, description: pages["about"].desc, alternates: { canonical: "/about" } };
export default function Page() { return <Policy slug="about" />; }

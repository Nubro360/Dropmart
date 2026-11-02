import type { Metadata } from "next";
import Policy from "@/components/Policy";
import { pages } from "@/lib/pages";
export const metadata: Metadata = { title: pages["contact"].title, description: pages["contact"].desc, alternates: { canonical: "/contact" } };
export default function Page() { return <Policy slug="contact" />; }

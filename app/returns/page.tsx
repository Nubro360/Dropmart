import type { Metadata } from "next";
import Policy from "@/components/Policy";
import { pages } from "@/lib/pages";
export const metadata: Metadata = { title: pages["returns"].title, description: pages["returns"].desc, alternates: { canonical: "/returns" } };
export default function Page() { return <Policy slug="returns" />; }

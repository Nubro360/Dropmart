import Link from "next/link";
export const metadata = { title: "Thanks for subscribing", robots: { index: false } };
export default function Thanks() { return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">You're on the list</h1><Link href="/" className="mt-6 inline-block rounded-full bg-navy text-white px-6 py-3">Back to the store</Link></div>; }

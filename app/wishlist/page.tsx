import Link from "next/link";
export const metadata = { title: "Wishlist", robots: { index: false } };
export default function Wishlist() { return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Your wishlist is empty</h1><p className="mt-2 text-gray-500">Saving favorites isn't available yet.</p><Link href="/shop" className="mt-6 inline-block rounded-full bg-navy text-white px-6 py-3">Browse products</Link></div>; }

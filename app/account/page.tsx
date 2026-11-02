import Link from "next/link";
export const metadata = { title: "Account", robots: { index: false } };
export default function Account() { return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Checkout as a guest</h1><p className="mt-2 text-gray-500">Customer accounts aren't enabled. You can order without signing up, and we email your order details. Need help with an order? <Link href="/contact" className="underline">Contact us</Link>.</p></div>; }

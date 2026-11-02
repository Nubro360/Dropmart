import Link from "next/link";
const cols: [string, [string, string][]][] = [
  ["Help", [["FAQs","/faq"],["Shipping Policy","/shipping-policy"],["Return & Refund Policy","/returns"]]],
  ["Company", [["About DropMart","/about"],["Contact","/contact"],["Privacy Policy","/privacy"],["Terms & Conditions","/terms"]]],
];
export default function Footer() {
  return (<footer className="bg-navy text-white/80 mt-20"><div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
    <div><p className="text-xl font-bold text-white">Drop<span className="text-accent">Mart</span></p><p className="mt-2 text-sm">Smarter Shopping. Happier You.</p><p className="mt-4 text-sm">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@yourdomain.com"}</p></div>
    {cols.map(([t, ls]) => <div key={t}><h2 className="font-semibold text-white mb-3">{t}</h2><ul className="space-y-2 text-sm">{ls.map(([l, h]) => <li key={h}><Link href={h} className="hover:text-accent">{l}</Link></li>)}</ul></div>)}
    <div><h2 className="font-semibold text-white mb-3">Follow us</h2><ul className="space-y-2 text-sm"><li><a href="#">Facebook</a></li><li><a href="#">Instagram</a></li><li><a href="#">TikTok</a></li></ul></div>
  </div><p className="border-t border-white/10 text-center text-xs py-4">© {new Date().getFullYear()} DropMart</p></footer>);
}

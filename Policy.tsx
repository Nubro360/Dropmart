import { pages } from "@/lib/pages";
export default function Policy({ slug }: { slug: string }) {
  const p = pages[slug]; const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@yourdomain.com";
  return (<article className="mx-auto max-w-2xl px-4 py-12"><h1 className="text-3xl font-bold mb-6">{p.title}</h1><div className="space-y-4 text-gray-700">{p.body.map((t, i) => <p key={i}>{t}</p>)}
    {slug === "contact" && <p><a className="text-accent underline" href={`mailto:${email}`}>{email}</a></p>}</div></article>);
}

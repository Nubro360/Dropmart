import type { Metadata } from "next";
import { signIn } from "../actions";
export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  const msg = searchParams.error === "forbidden" ? "This account isn't an admin." : searchParams.error ? "Email or password is incorrect." : "";
  return (<div className="mx-auto max-w-sm px-4 py-20"><h1 className="text-2xl font-bold mb-6">Admin sign in</h1>
    <form action={signIn} className="space-y-3">
      <input name="email" type="email" required placeholder="Email" aria-label="Email" className="w-full rounded-xl border px-4 py-2.5" />
      <input name="password" type="password" required placeholder="Password" aria-label="Password" className="w-full rounded-xl border px-4 py-2.5" />
      {msg && <p role="alert" className="text-sm text-sale">{msg}</p>}
      <button className="w-full rounded-full bg-navy text-white py-3">Sign in</button></form></div>);
}

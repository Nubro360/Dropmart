// Sends via Resend when RESEND_API_KEY is set; otherwise silently skips (demo mode).
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export async function sendOrderEmail(o: { order_number: string; total: number; customer: { name: string; email: string }; items: { name: string; qty: number }[] }) {
  const key = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!key || !from) return;
  const html = `<h2>Thanks for your order, ${esc(o.customer.name)}</h2><p>Order <b>${esc(o.order_number)}</b></p><ul>${o.items.map((i) => `<li>${i.qty} × ${esc(i.name)}</li>`).join("")}</ul><p>Total: $${o.total.toFixed(2)}</p>`;
  try { await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: o.customer.email, subject: `DropMart order ${o.order_number}`, html }) }); } catch (e) { console.error("email failed", e); }
}

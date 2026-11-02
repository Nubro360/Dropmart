export const FREE_SHIPPING_OVER = 50;
export const FLAT_SHIPPING = 4.99;
export const shippingFor = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING);
export function totals(subtotal: number, percentOff = 0) {
  const discount = Math.round(subtotal * percentOff) / 100;
  const shipping = shippingFor(subtotal - discount);
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping) };
}

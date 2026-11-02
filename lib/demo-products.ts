// DEMO DATA — replace with Supabase `products` rows (see supabase/schema.sql).
export type Product = { slug: string; name: string; price: number; salePrice: number; category: string; image: string; demo: boolean };
const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;
export const products: Product[] = [
  { slug: "wireless-bluetooth-headphones", name: "Wireless Bluetooth Headphones", price: 89.99, salePrice: 59.99, category: "Electronics", image: img("photo-1505740420928-5e560c06d30e"), demo: boolean },
  { slug: "smart-watch", name: "Smart Watch", price: 129.99, salePrice: 89.99, category: "Smart Gadgets", image: img("photo-1523275335684-37898b6baf30"), demo: boolean },
  { slug: "portable-mini-projector", name: "Portable Mini Projector", price: 159.99, salePrice: 119.99, category: "Electronics", image: img("photo-1478720568477-152d9b164e26"), demo: boolean },
  { slug: "led-desk-lamp", name: "LED Desk Lamp", price: 44.99, salePrice: 29.99, category: "Home & Kitchen", image: img("photo-1507473885765-e6ed057f782c"), demo: boolean },
  { slug: "magnetic-phone-holder", name: "Magnetic Phone Holder", price: 24.99, salePrice: 14.99, category: "Smart Gadgets", image: img("photo-1586953208448-b95a79798f07"), demo: boolean },
  { slug: "portable-blender", name: "Portable Blender", price: 49.99, salePrice: 34.99, category: "Home & Kitchen", image: img("photo-1570197788417-0e82375c9371"), demo: boolean },
];
export const categories = ["Electronics", "Smart Gadgets", "Home & Kitchen", "Fashion & Accessories", "Beauty & Personal Care", "Fitness & Lifestyle"];

export const details: Record<string, { description: string; specs: [string, string][]; variants?: { label: string; options: string[] } }> = {
  "wireless-bluetooth-headphones": { description: "Over-ear wireless headphones with Bluetooth 5.3, soft ear cushions and a foldable design. Demo listing: replace with your supplier's details.", specs: [["Connectivity","Bluetooth 5.3"],["Battery","Up to 30 hours"],["Charging","USB-C"]], variants: { label: "Color", options: ["Black","White","Blue"] } },
  "smart-watch": { description: "Fitness-focused smart watch with a bright touchscreen, step and sleep tracking, and phone notifications. Demo listing.", specs: [["Display","1.7\" touchscreen"],["Water resistance","IP67"],["Battery","Up to 7 days"]], variants: { label: "Strap", options: ["Black","Silver","Rose"] } },
  "portable-mini-projector": { description: "Compact projector for movies and presentations at home, with HDMI and USB inputs. Demo listing.", specs: [["Resolution","1080p supported"],["Inputs","HDMI, USB"],["Screen size","Up to 100\""]] },
  "led-desk-lamp": { description: "Dimmable LED desk lamp with adjustable arm and three light modes. Demo listing.", specs: [["Modes","3 color temperatures"],["Power","USB powered"],["Arm","Flexible"]] },
  "magnetic-phone-holder": { description: "Magnetic holder for car dashboards or desks, with a firm grip and 360° rotation. Demo listing.", specs: [["Mount","Dashboard / vent"],["Rotation","360°"],["Fit","Most smartphones"]] },
  "portable-blender": { description: "Rechargeable personal blender for smoothies and shakes, sized for a bag or gym locker. Demo listing.", specs: [["Capacity","380 ml"],["Charging","USB-C"],["Blades","6-blade stainless steel"]] },
};
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const money = (n: number) => `$${n.toFixed(2)}`;

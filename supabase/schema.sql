-- Run in Supabase SQL editor. Phase 1 schema (extend in later phases).
create table categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null);
create table products (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, description text,
  category_id uuid references categories(id), price numeric(10,2) not null, sale_price numeric(10,2),
  images text[] default '{}', variants jsonb default '[]', specs jsonb default '{}', stock int default 0, active boolean default true,
  is_demo boolean default false,
  supplier_name text, supplier_url text, supplier_cost numeric(10,2), created_at timestamptz default now());
create table coupons (id uuid primary key default gen_random_uuid(), code text unique not null, percent_off int, amount_off numeric(10,2), active boolean default true, expires_at timestamptz);
create table orders (
  id uuid primary key default gen_random_uuid(), order_number text unique not null,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  customer jsonb not null, items jsonb not null, subtotal numeric(10,2), shipping numeric(10,2), discount numeric(10,2), total numeric(10,2),
  payment_method text, tracking_number text, tracking_url text, created_at timestamptz default now());
create table profiles (id uuid primary key references auth.users on delete cascade, role text not null default 'customer');
create table store_settings (key text primary key, value jsonb);

create or replace function is_admin() returns boolean language sql security definer as
$$ select exists (select 1 from profiles where id = auth.uid() and role = 'admin') $$;

alter table categories enable row level security; alter table products enable row level security;
alter table coupons enable row level security; alter table orders enable row level security;
alter table profiles enable row level security; alter table store_settings enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read active products" on products for select using (active);
create policy "public read settings" on store_settings for select using (true);
create policy "admin all categories" on categories for all using (is_admin()) with check (is_admin());
create policy "admin all products" on products for all using (is_admin()) with check (is_admin());
create policy "admin all coupons" on coupons for all using (is_admin()) with check (is_admin());
create policy "admin all orders" on orders for all using (is_admin()) with check (is_admin());
create policy "admin all settings" on store_settings for all using (is_admin()) with check (is_admin());
create policy "read own profile" on profiles for select using (id = auth.uid());
-- Orders are inserted server-side only (service role) after validating prices and stock.

create table if not exists newsletter_subscribers (id uuid primary key default gen_random_uuid(), email text unique not null, created_at timestamptz default now());
alter table newsletter_subscribers enable row level security;
create policy "admin read subscribers" on newsletter_subscribers for select using (is_admin());
-- inserts happen server-side with the service role

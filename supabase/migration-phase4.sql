-- Admin: image storage + auto-create profiles on signup
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;
create policy "public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
create or replace function handle_new_user() returns trigger language plpgsql security definer as
$$ begin insert into profiles (id) values (new.id) on conflict do nothing; return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
-- Make an admin (create the user first in Supabase → Authentication → Users):
-- insert into profiles (id, role) select id, 'admin' from auth.users where email = 'you@example.com'
--   on conflict (id) do update set role = 'admin';

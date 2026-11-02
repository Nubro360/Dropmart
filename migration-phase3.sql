alter table orders add column if not exists payment_status text not null default 'unpaid';

-- ============================================================
-- Teba Dauh Cash Flow - Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Members (anggota keluarga)
create table if not exists members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now() not null
);

-- Expense categories (kategori pengeluaran)
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now() not null
);

-- Transactions
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('in', 'out')),
  amount bigint not null check (amount > 0),
  member_id uuid references members(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  notes text,
  proof_image_url text,
  created_at timestamptz default now() not null
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table members enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;

-- Public can read everything (for the public dashboard)
create policy "public_read_members" on members for select using (true);
create policy "public_read_categories" on categories for select using (true);
create policy "public_read_transactions" on transactions for select using (true);

-- Service role (used server-side) can write everything
-- The service role key bypasses RLS automatically, so no extra policies needed.

-- ============================================================
-- Storage Bucket for proof images
-- ============================================================

insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;

-- Allow public to read proof images
create policy "public_read_proofs" on storage.objects
  for select using (bucket_id = 'proofs');

-- ============================================================
-- Seed default categories (optional)
-- ============================================================

insert into categories (name) values
  ('Makan & Minum'),
  ('Transport'),
  ('Kesehatan'),
  ('Pendidikan'),
  ('Tagihan & Utilitas'),
  ('Hiburan'),
  ('Perlengkapan Rumah'),
  ('Lainnya')
on conflict do nothing;

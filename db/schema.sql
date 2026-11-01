-- ============================================================
-- Teba Dauh Cash Flow - Database Schema
-- Run this in the Neon SQL Editor (or psql "$DATABASE_URL" -f db/schema.sql)
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

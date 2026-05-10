-- =================================================================
-- Teba Dauh — Data Iuran Historis 2023–2025
-- Jalankan SEKALI di Supabase SQL Editor
--
-- Catatan:
--   Mei 2023 dicatat sebagai "Saldo awal" tanpa nama anggota.
-- =================================================================

DO $$
DECLARE
  m_brama   uuid;
  m_edy     uuid;
  m_enggi   uuid;
  m_jaffran uuid;
  m_jeffrin uuid;
  m_wahyu   uuid;
  m_wangga  uuid;
BEGIN

  -- ── Anggota (insert jika belum ada) ──────────────────────────

  SELECT id INTO m_brama FROM members WHERE name = 'Brama Reksa' LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO members (name, created_at)
    VALUES ('Brama Reksa', '2023-05-01 12:00:00+07')
    RETURNING id INTO m_brama;
  END IF;

  SELECT id INTO m_edy FROM members WHERE name = 'Edy Wiranata' LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO members (name, created_at)
    VALUES ('Edy Wiranata', '2023-05-01 12:00:00+07')
    RETURNING id INTO m_edy;
  END IF;

  SELECT id INTO m_enggi FROM members WHERE name = 'Enggi Suryadyana' LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO members (name, created_at)
    VALUES ('Enggi Suryadyana', '2023-05-01 12:00:00+07')
    RETURNING id INTO m_enggi;
  END IF;

  SELECT id INTO m_jaffran FROM members WHERE name = 'Jaffran Tirta' LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO members (name, created_at)
    VALUES ('Jaffran Tirta', '2023-05-01 12:00:00+07')
    RETURNING id INTO m_jaffran;
  END IF;

  SELECT id INTO m_jeffrin FROM members WHERE name = 'Jeffrin Martiana' LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO members (name, created_at)
    VALUES ('Jeffrin Martiana', '2023-05-01 12:00:00+07')
    RETURNING id INTO m_jeffrin;
  END IF;

  SELECT id INTO m_wahyu FROM members WHERE name = 'Wahyu Prayama' LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO members (name, created_at)
    VALUES ('Wahyu Prayama', '2023-05-01 12:00:00+07')
    RETURNING id INTO m_wahyu;
  END IF;

  SELECT id INTO m_wangga FROM members WHERE name = 'Wangga Suryadiva' LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO members (name, created_at)
    VALUES ('Wangga Suryadiva', '2023-05-01 12:00:00+07')
    RETURNING id INTO m_wangga;
  END IF;

  -- ================================================================
  -- 2023
  -- ================================================================

  -- Mei 2023 — Rp150.000 (saldo awal / initial balance)
  INSERT INTO transactions (type, amount, member_id, notes, created_at) VALUES
    ('in', 150000, NULL, 'Saldo awal', '2023-05-01 12:00:00+07');

  -- Juni 2023 — Rp400.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in',  50000, m_brama,   '2023-06-01 12:00:00+07'),
    ('in',  50000, m_edy,     '2023-06-01 12:00:00+07'),
    ('in',  50000, m_enggi,   '2023-06-01 12:00:00+07'),
    ('in',  50000, m_jaffran, '2023-06-01 12:00:00+07'),
    ('in',  50000, m_jeffrin, '2023-06-01 12:00:00+07'),
    ('in',  50000, m_wahyu,   '2023-06-01 12:00:00+07'),
    ('in', 100000, m_wangga,  '2023-06-01 12:00:00+07');

  -- Juli 2023 — Rp350.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 50000, m_brama,   '2023-07-01 12:00:00+07'),
    ('in', 50000, m_edy,     '2023-07-01 12:00:00+07'),
    ('in', 50000, m_enggi,   '2023-07-01 12:00:00+07'),
    ('in', 50000, m_jaffran, '2023-07-01 12:00:00+07'),
    ('in', 50000, m_jeffrin, '2023-07-01 12:00:00+07'),
    ('in', 50000, m_wahyu,   '2023-07-01 12:00:00+07'),
    ('in', 50000, m_wangga,  '2023-07-01 12:00:00+07');

  -- Agustus 2023 — Rp350.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 50000, m_brama,   '2023-08-01 12:00:00+07'),
    ('in', 50000, m_edy,     '2023-08-01 12:00:00+07'),
    ('in', 50000, m_enggi,   '2023-08-01 12:00:00+07'),
    ('in', 50000, m_jaffran, '2023-08-01 12:00:00+07'),
    ('in', 50000, m_jeffrin, '2023-08-01 12:00:00+07'),
    ('in', 50000, m_wahyu,   '2023-08-01 12:00:00+07'),
    ('in', 50000, m_wangga,  '2023-08-01 12:00:00+07');

  -- September 2023 — Rp650.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in',  50000, m_brama,   '2023-09-01 12:00:00+07'),
    ('in', 100000, m_edy,     '2023-09-01 12:00:00+07'),
    ('in', 100000, m_enggi,   '2023-09-01 12:00:00+07'),
    ('in', 100000, m_jaffran, '2023-09-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2023-09-01 12:00:00+07'),
    ('in', 100000, m_wahyu,   '2023-09-01 12:00:00+07'),
    ('in', 100000, m_wangga,  '2023-09-01 12:00:00+07');

  -- Oktober 2023 — Rp600.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_brama,   '2023-10-01 12:00:00+07'),
    ('in', 100000, m_edy,     '2023-10-01 12:00:00+07'),
    ('in', 100000, m_enggi,   '2023-10-01 12:00:00+07'),
    ('in',  50000, m_jaffran, '2023-10-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2023-10-01 12:00:00+07'),
    ('in', 100000, m_wahyu,   '2023-10-01 12:00:00+07'),
    ('in',  50000, m_wangga,  '2023-10-01 12:00:00+07');

  -- November 2023 — Rp500.000  (Brama tidak bayar)
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_edy,     '2023-11-01 12:00:00+07'),
    ('in', 100000, m_enggi,   '2023-11-01 12:00:00+07'),
    ('in',  50000, m_jaffran, '2023-11-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2023-11-01 12:00:00+07'),
    ('in', 100000, m_wahyu,   '2023-11-01 12:00:00+07'),
    ('in',  50000, m_wangga,  '2023-11-01 12:00:00+07');

  -- Desember 2023 — Rp650.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 150000, m_brama,   '2023-12-01 12:00:00+07'),
    ('in', 100000, m_edy,     '2023-12-01 12:00:00+07'),
    ('in', 100000, m_enggi,   '2023-12-01 12:00:00+07'),
    ('in',  50000, m_jaffran, '2023-12-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2023-12-01 12:00:00+07'),
    ('in', 100000, m_wahyu,   '2023-12-01 12:00:00+07'),
    ('in',  50000, m_wangga,  '2023-12-01 12:00:00+07');

  -- ================================================================
  -- 2024
  -- ================================================================

  -- Januari 2024 — Rp250.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_jaffran, '2024-01-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2024-01-01 12:00:00+07'),
    ('in',  50000, m_wangga,  '2024-01-01 12:00:00+07');

  -- Februari 2024 — Rp450.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_enggi,   '2024-02-01 12:00:00+07'),
    ('in',  50000, m_jaffran, '2024-02-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2024-02-01 12:00:00+07'),
    ('in', 100000, m_wahyu,   '2024-02-01 12:00:00+07'),
    ('in', 100000, m_wangga,  '2024-02-01 12:00:00+07');

  -- Maret 2024 — Rp400.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_enggi,   '2024-03-01 12:00:00+07'),
    ('in',  50000, m_jaffran, '2024-03-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2024-03-01 12:00:00+07'),
    ('in', 100000, m_wahyu,   '2024-03-01 12:00:00+07'),
    ('in',  50000, m_wangga,  '2024-03-01 12:00:00+07');

  -- April 2024 — Rp150.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_jeffrin, '2024-04-01 12:00:00+07'),
    ('in',  50000, m_wangga,  '2024-04-01 12:00:00+07');

  -- Mei 2024 — Rp300.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_brama,   '2024-05-01 12:00:00+07'),
    ('in',  50000, m_jaffran, '2024-05-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2024-05-01 12:00:00+07'),
    ('in',  50000, m_wangga,  '2024-05-01 12:00:00+07');

  -- Juni 2024 — Rp100.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_jaffran, '2024-06-01 12:00:00+07');

  -- ================================================================
  -- 2025
  -- ================================================================

  -- Januari–April 2025: tidak ada pemasukan (Rp0)

  -- Mei 2025 — Rp500.000
  INSERT INTO transactions (type, amount, member_id, created_at) VALUES
    ('in', 100000, m_enggi,   '2025-05-01 12:00:00+07'),
    ('in', 100000, m_jaffran, '2025-05-01 12:00:00+07'),
    ('in', 100000, m_jeffrin, '2025-05-01 12:00:00+07'),
    ('in', 100000, m_wahyu,   '2025-05-01 12:00:00+07'),
    ('in', 100000, m_wangga,  '2025-05-01 12:00:00+07');

  RAISE NOTICE 'Selesai! Data iuran 2023–2025 berhasil diimpor.';
END $$;

-- ELDOOB.DZ — متجر الدب — PostgreSQL 15+
-- المبالغ بالدينار الجزائري كأعداد صحيحة (بدون كسور).

CREATE TYPE user_role     AS ENUM ('admin', 'affiliate');
CREATE TYPE order_status  AS ENUM ('pending', 'shipped', 'delivered', 'cancelled', 'retour');
CREATE TYPE delivery_type AS ENUM ('home', 'desk');   -- منزل / مكتب (Stop Desk)
CREATE TYPE payout_method AS ENUM ('flexy', 'baridimob', 'direct');
CREATE TYPE payout_status AS ENUM ('requested', 'completed', 'rejected');
CREATE TYPE ledger_type   AS ENUM ('order_profit', 'order_reversal', 'payout_hold', 'payout_refund');

-- ───────── المستخدمون ─────────
CREATE TABLE users (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role           user_role NOT NULL DEFAULT 'affiliate',
  full_name      TEXT NOT NULL,
  phone          TEXT NOT NULL UNIQUE,
  username       TEXT NOT NULL CHECK (username ~ '^[a-z0-9_]{3,20}$'),   -- فريد (انظر الفهرس أدناه)
  email          TEXT NOT NULL UNIQUE,           -- موثّق بالرمز (OTP) قبل إنشاء الحساب
  email_verified_at TIMESTAMPTZ,
  avatar_url     TEXT,                           -- الصورة الشخصية
  password_changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),   -- أي توكن أقدم منها يُرفض
  rejected_at    TIMESTAMPTZ,                    -- رُفض طلب الانضمام
  password_hash  TEXT NOT NULL,                 -- argon2/bcrypt فقط
  payout_method  payout_method,
  payout_account TEXT,                          -- رقم فليكسي أو RIP/CCP

-- ============================================================
--  ULTRACK — Supabase Database Schema
--  Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================


-- ── 1. USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    avatar_url      TEXT,
    auth_provider   VARCHAR(50)  NOT NULL,
    provider_id     VARCHAR(255) NOT NULL,
    email_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
    role            VARCHAR(50)  NOT NULL DEFAULT 'user',
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    last_login      TIMESTAMP
);


-- ── 2. TASKS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    task_id     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(50)  NOT NULL DEFAULT 'pending',
    priority    VARCHAR(50)  NOT NULL DEFAULT 'medium',
    due_date    TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);


-- ── 3. TRANSACTIONS (Budget Tracker) ────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id  SERIAL         PRIMARY KEY,
    user_id         UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expense_desc    TEXT,
    type            VARCHAR(50)    NOT NULL,
    amount          DECIMAL(10, 2) NOT NULL
);


-- ── 4. RESOURCES (Resource Vault) ───────────────────────────
CREATE TABLE IF NOT EXISTS resources (
    resource_id  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_title VARCHAR(255),
    user_notes   TEXT,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);


-- ── 5. COURSES (GWA Calculator) ─────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_code  VARCHAR(50)   NOT NULL,
    units        INT           NOT NULL,
    course_grade DECIMAL(5, 2) NOT NULL
);


-- ============================================================
--  ROW LEVEL SECURITY (RLS)
--  Ensures users can only access their own data.
-- ============================================================

ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources    ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses      ENABLE ROW LEVEL SECURITY;

-- Users: can read and update their own row
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Tasks
CREATE POLICY "Users manage own tasks"
    ON tasks FOR ALL USING (auth.uid()::text = user_id::text);

-- Transactions
CREATE POLICY "Users manage own transactions"
    ON transactions FOR ALL USING (auth.uid()::text = user_id::text);

-- Resources
CREATE POLICY "Users manage own resources"
    ON resources FOR ALL USING (auth.uid()::text = user_id::text);

-- Courses
CREATE POLICY "Users manage own courses"
    ON courses FOR ALL USING (auth.uid()::text = user_id::text);

-- ==========================================
-- Metaphrase AI Enterprise Database Schema
-- SQLite3 with WAL Mode & High-Speed Indexing
-- ==========================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT,
    password TEXT,
    role TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. History Table
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    original_text TEXT,
    paraphrased_text TEXT,
    difficulty TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Custom Personas Table
CREATE TABLE IF NOT EXISTS personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    title TEXT,
    instruction TEXT,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    feature_name TEXT,
    action TEXT,
    details TEXT,
    word_count INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indices
CREATE INDEX IF NOT EXISTS idx_history_email_time ON history(email, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_personas_email ON personas(email);
CREATE INDEX IF NOT EXISTS idx_activity_email_time ON activity_logs(email, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feature ON activity_logs(feature_name);

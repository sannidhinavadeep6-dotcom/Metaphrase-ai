import os
import sqlite3
import hashlib
try:
    import bcrypt
    HAS_BCRYPT = True
except ImportError:
    HAS_BCRYPT = False
import json
import secrets
from datetime import datetime
from contextlib import contextmanager

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB_PATH = os.path.join(DB_DIR, 'metaphrase_app.db')
DB_NAME = os.environ.get('DB_PATH', DEFAULT_DB_PATH)

def hash_password(password: str) -> str:
    """Generates a secure salted password hash (bcrypt if available, PBKDF2/SHA-256 fallback)."""
    if HAS_BCRYPT:
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"pbkdf2${salt}${key.hex()}"

def verify_password(plain_password: str, stored_hash: str) -> bool:
    """
    Verifies a password against stored hash.
    Supports salted bcrypt hashes, PBKDF2, and legacy SHA-256 backwards compatibility.
    """
    if not stored_hash or not plain_password:
        return False

    # Check for bcrypt hash prefix
    if (stored_hash.startswith('$2b$') or stored_hash.startswith('$2a$') or stored_hash.startswith('$2y$')) and HAS_BCRYPT:
        try:
            return bcrypt.checkpw(plain_password.encode('utf-8'), stored_hash.encode('utf-8'))
        except Exception:
            return False

    # Check for PBKDF2
    if stored_hash.startswith('pbkdf2$'):
        try:
            _, salt, key_hex = stored_hash.split('$')
            key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return secrets.compare_digest(key.hex(), key_hex)
        except Exception:
            return False

    # Fallback for legacy SHA-256
    legacy_sha256 = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
    return legacy_sha256 == stored_hash

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_NAME, timeout=30.0)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("PRAGMA busy_timeout=30000;")
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        c = conn.cursor()
        # Users table
        c.execute('''
            CREATE TABLE IF NOT EXISTS users (
                email TEXT PRIMARY KEY,
                name TEXT,
                password TEXT,
                role TEXT,
                status TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_active DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Ensure new columns exist for backwards compatibility with older databases
        c.execute("PRAGMA table_info(users)")
        existing_cols = [row[1] for row in c.fetchall()]
        if 'created_at' not in existing_cols:
            c.execute("ALTER TABLE users ADD COLUMN created_at TEXT;")
        if 'last_active' not in existing_cols:
            c.execute("ALTER TABLE users ADD COLUMN last_active TEXT;")

        c.execute("UPDATE users SET created_at = datetime('now') WHERE created_at IS NULL;")
        c.execute("UPDATE users SET last_active = datetime('now') WHERE last_active IS NULL;")
        # Auto-approve any pending users so all users have immediate access
        c.execute("UPDATE users SET status = 'accepted' WHERE status = 'pending';")

        # History table for analytics
        c.execute('''
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                original_text TEXT,
                paraphrased_text TEXT,
                difficulty TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Custom Personas table
        c.execute('''
            CREATE TABLE IF NOT EXISTS personas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                title TEXT,
                instruction TEXT,
                icon TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Comprehensive Feature Activity & Usage Logs
        c.execute('''
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                feature_name TEXT,
                action TEXT,
                details TEXT,
                word_count INTEGER DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Fast lookup indices
        c.execute("CREATE INDEX IF NOT EXISTS idx_history_email_time ON history(email, timestamp DESC);")
        c.execute("CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);")
        c.execute("CREATE INDEX IF NOT EXISTS idx_personas_email ON personas(email);")
        c.execute("CREATE INDEX IF NOT EXISTS idx_activity_email_time ON activity_logs(email, timestamp DESC);")
        c.execute("CREATE INDEX IF NOT EXISTS idx_activity_feature ON activity_logs(feature_name);")
        
        # Default Admin Account
        admin_email = 'sannidhinavadeep6@gmail.com'
        
        c.execute("SELECT password FROM users WHERE email=?", (admin_email,))
        existing_admin = c.fetchone()
        
        if not existing_admin:
            admin_pw_hash = hash_password('admin123')
            c.execute(
                "INSERT INTO users (email, name, password, role, status) VALUES (?, ?, ?, ?, ?)", 
                (admin_email, 'Admin', admin_pw_hash, 'admin', 'accepted')
            )
        else:
            # Upgrade existing admin to bcrypt if still using legacy SHA-256
            curr_pw = existing_admin[0]
            if not (curr_pw.startswith('$2b$') or curr_pw.startswith('$2a$')):
                new_hash = hash_password('admin123')
                c.execute("UPDATE users SET password=? WHERE email=?", (new_hash, admin_email))

        conn.commit()

# --- User Management Functions ---
def register_user(name, email, password):
    with get_db() as conn:
        c = conn.cursor()
        clean_email = email.strip().lower()
        try:
            # Auto-approve new user registries by default
            c.execute(
                "INSERT INTO users (email, name, password, role, status, created_at, last_active) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", 
                (clean_email, name.strip(), hash_password(password), 'user', 'accepted')
            )
            # Log registration activity
            c.execute(
                "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
                (clean_email, 'Authentication', 'Registered account', 'New user registered and auto-approved', 0)
            )
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False

def verify_login(email, password):
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute("SELECT password, role, status, name FROM users WHERE email=?", (clean_email,))
        row = c.fetchone()
        if not row:
            return None
        
        stored_hash, role, status, name = row
        if verify_password(password, stored_hash):
            # Update last active timestamp
            c.execute("UPDATE users SET last_active=CURRENT_TIMESTAMP WHERE email=?", (clean_email,))
            
            # If user had a legacy SHA-256 hash, upgrade transparently to bcrypt
            if not (stored_hash.startswith('$2b$') or stored_hash.startswith('$2a$')):
                new_bcrypt_hash = hash_password(password)
                c.execute("UPDATE users SET password=? WHERE email=?", (new_bcrypt_hash, clean_email))
            
            # Log successful login
            if status == 'accepted':
                c.execute(
                    "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
                    (clean_email, 'Authentication', 'Logged in', 'User logged in successfully', 0)
                )
            
            conn.commit()
            return (role, status, name)
        return None

def google_auth_user(name: str, email: str):
    clean_email = email.strip().lower()
    clean_name = name.strip() if name and name.strip() else clean_email.split('@')[0].capitalize()
    with get_db() as conn:
        c = conn.cursor()
        c.execute("SELECT password, role, status, name FROM users WHERE email=?", (clean_email,))
        row = c.fetchone()
        if row:
            stored_hash, role, status, existing_name = row
            if status == 'rejected':
                return (None, 'rejected', existing_name or clean_name)
            
            # Ensure accepted status and update last active
            c.execute("UPDATE users SET status='accepted', last_active=CURRENT_TIMESTAMP WHERE email=?", (clean_email,))
            c.execute(
                "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
                (clean_email, 'Authentication', 'Logged in with Google', 'Authenticated seamlessly via Google Sign-In', 0)
            )
            conn.commit()
            return (role, 'accepted', existing_name or clean_name)
        else:
            # New user registration via Google Sign-In
            role = 'admin' if clean_email == 'sannidhinavadeep6@gmail.com' else 'user'
            random_pw = secrets.token_urlsafe(24)
            c.execute(
                "INSERT INTO users (email, name, password, role, status, created_at, last_active) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                (clean_email, clean_name, hash_password(random_pw), role, 'accepted')
            )
            c.execute(
                "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
                (clean_email, 'Authentication', 'Registered with Google', 'New user registered seamlessly via Google Sign-In', 0)
            )
            conn.commit()
            return (role, 'accepted', clean_name)

def get_all_users():
    with get_db() as conn:
        c = conn.cursor()
        c.execute("SELECT name, email, role, status, created_at, last_active FROM users WHERE role != 'admin' ORDER BY rowid DESC")
        return c.fetchall()

def update_status(email, new_status):
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute("UPDATE users SET status=?, last_active=CURRENT_TIMESTAMP WHERE email=?", (new_status, clean_email))
        c.execute(
            "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
            (clean_email, 'Admin Management', f'Status changed to {new_status}', f'Account status set to {new_status}', 0)
        )
        conn.commit()

# --- Activity Logging ---
def log_activity(email: str, feature_name: str, action: str, details: str = "", word_count: int = 0):
    if not email:
        return
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
            (clean_email, feature_name, action, details, word_count)
        )
        c.execute("UPDATE users SET last_active=CURRENT_TIMESTAMP WHERE email=?", (clean_email,))
        conn.commit()

def get_user_activity_logs(email: str, limit: int = 100):
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id, feature_name, action, details, word_count, timestamp FROM activity_logs WHERE email=? ORDER BY timestamp DESC LIMIT ?",
            (clean_email, limit)
        )
        return [
            {
                "id": r[0],
                "feature_name": r[1],
                "action": r[2],
                "details": r[3],
                "word_count": r[4],
                "timestamp": r[5]
            }
            for r in c.fetchall()
        ]

# --- Custom Personas Functions ---
def create_custom_persona(email: str, title: str, instruction: str, icon: str = "sparkles") -> int:
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO personas (email, title, instruction, icon) VALUES (?, ?, ?, ?)",
            (clean_email, title.strip(), instruction.strip(), icon.strip())
        )
        persona_id = c.lastrowid
        # Log persona creation
        c.execute(
            "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
            (clean_email, 'Custom Personas', f"Created persona: {title.strip()}", instruction[:100], 0)
        )
        c.execute("UPDATE users SET last_active=CURRENT_TIMESTAMP WHERE email=?", (clean_email,))
        conn.commit()
        return persona_id

def get_user_personas(email: str):
    with get_db() as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id, title, instruction, icon, created_at FROM personas WHERE email=? ORDER BY id ASC",
            (email.strip().lower(),)
        )
        return [
            {"id": row[0], "title": row[1], "instruction": row[2], "icon": row[3], "created_at": row[4]}
            for row in c.fetchall()
        ]

def delete_custom_persona(persona_id: int, email: str) -> bool:
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute("SELECT title FROM personas WHERE id=? AND email=?", (persona_id, clean_email))
        p = c.fetchone()
        title = p[0] if p else f"Persona #{persona_id}"
        
        c.execute("DELETE FROM personas WHERE id=? AND email=?", (persona_id, clean_email))
        deleted = c.rowcount > 0
        if deleted:
            c.execute(
                "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
                (clean_email, 'Custom Personas', f"Deleted persona: {title}", "", 0)
            )
            c.execute("UPDATE users SET last_active=CURRENT_TIMESTAMP WHERE email=?", (clean_email,))
            conn.commit()
        return deleted

# --- History & Analytics Functions ---
def add_history(email, original, paraphrased, difficulty):
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO history (email, original_text, paraphrased_text, difficulty) VALUES (?, ?, ?, ?)",
            (clean_email, original, paraphrased, difficulty)
        )
        words = len(original.split()) if original else 0
        feature = "AI Humanizer" if difficulty == "Humanized" else ("Batch Processing" if "Batch Doc" in difficulty else "Neural Paraphrase")
        c.execute(
            "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
            (clean_email, feature, f"Transformed text ({difficulty})", f"{words} words processed", words)
        )
        c.execute("UPDATE users SET last_active=CURRENT_TIMESTAMP WHERE email=?", (clean_email,))
        conn.commit()

def get_user_history(email, limit=50):
    with get_db() as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id, original_text, paraphrased_text, difficulty, timestamp FROM history WHERE email=? ORDER BY timestamp DESC LIMIT ?", 
            (email.strip().lower(), limit)
        )
        return c.fetchall()

def clear_user_history(email):
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute("DELETE FROM history WHERE email=?", (clean_email,))
        c.execute(
            "INSERT INTO activity_logs (email, feature_name, action, details, word_count) VALUES (?, ?, ?, ?, ?)",
            (clean_email, 'History', 'Cleared transformation history', '', 0)
        )
        conn.commit()

def delete_history_item(item_id, email):
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        c.execute("DELETE FROM history WHERE id=? AND email=?", (item_id, clean_email))
        conn.commit()

# --- All Enterprise Features List ---
ALL_FEATURES = [
    {
        "id": "paraphrase",
        "name": "Neural Paraphraser",
        "category": "Core AI",
        "desc": "Tone-based paraphrasing with neural style transfer"
    },
    {
        "id": "humanize",
        "name": "AI Humanizer",
        "category": "Core AI",
        "desc": "AI marker removal & burstiness enhancement"
    },
    {
        "id": "batch",
        "name": "Batch Document Processor",
        "category": "Automation",
        "desc": "Multi-chunk transformation of DOCX & TXT documents"
    },
    {
        "id": "ocr",
        "name": "Optical Character Recognition (OCR)",
        "category": "Vision",
        "desc": "Extract text from image scans, textbook photos, screenshots"
    },
    {
        "id": "personas",
        "name": "Custom Personas",
        "category": "Customization",
        "desc": "Personalized system prompts and tailored writing styles"
    },
    {
        "id": "sentence_editor",
        "name": "Sentence Rewriter & Synonyms",
        "category": "Interactive",
        "desc": "Sentence-level alternatives and contextual thesaurus"
    },
    {
        "id": "ai_detector",
        "name": "AI Content Detection",
        "category": "Verification",
        "desc": "Perplexity & burstiness statistical AI analyzer"
    },
    {
        "id": "originality",
        "name": "Originality & Plagiarism",
        "category": "Verification",
        "desc": "Lexical uniqueness & cross-source similarity checking"
    },
    {
        "id": "citations",
        "name": "Citation Generator",
        "category": "Academic",
        "desc": "APA, MLA, Chicago, and IEEE citation formatting"
    },
    {
        "id": "docx_export",
        "name": "Microsoft Word Export",
        "category": "Export",
        "desc": "Export formatted DOCX transformation reports"
    }
]

# --- Comprehensive User Progress & Analytics Aggregator ---
def get_user_progress(email: str):
    clean_email = email.strip().lower()
    with get_db() as conn:
        c = conn.cursor()
        
        # User details
        c.execute("SELECT name, email, role, status, created_at, last_active FROM users WHERE email=?", (clean_email,))
        u_row = c.fetchone()
        if not u_row:
            return None
        
        user_info = {
            "name": u_row[0],
            "email": u_row[1],
            "role": u_row[2],
            "status": u_row[3],
            "created_at": u_row[4],
            "last_active": u_row[5]
        }

        # History stats
        c.execute("SELECT original_text, paraphrased_text, difficulty, timestamp FROM history WHERE email=?", (clean_email,))
        history_rows = c.fetchall()
        
        total_transformations = len(history_rows)
        total_words_processed = 0
        tone_counts = {}
        
        for row in history_rows:
            orig = row[0] or ""
            diff = row[2] or "Simple"
            words = len(orig.split())
            total_words_processed += words
            
            # Tones
            tone_name = diff.split('(')[0].strip()
            tone_counts[tone_name] = tone_counts.get(tone_name, 0) + 1

        # Activity logs stats
        c.execute("SELECT id, feature_name, action, details, word_count, timestamp FROM activity_logs WHERE email=? ORDER BY timestamp DESC", (clean_email,))
        activity_rows = c.fetchall()
        
        feature_counts = {}
        feature_last_used = {}
        for r in activity_rows:
            feat = r[1]
            act = r[2]
            w = r[4] or 0
            ts = r[5]
            feature_counts[feat] = feature_counts.get(feat, 0) + 1
            if feat not in feature_last_used:
                feature_last_used[feat] = ts
            
            # Add words from activity if not in history
            if "Transformed text" not in act:
                total_words_processed += w

        # Personas
        c.execute("SELECT id, title, instruction, icon, created_at FROM personas WHERE email=? ORDER BY id ASC", (clean_email,))
        personas = [
            {"id": p[0], "title": p[1], "instruction": p[2], "icon": p[3], "created_at": p[4]}
            for p in c.fetchall()
        ]
        
        # Build comprehensive feature usage matrix
        feature_matrix = []
        features_used_count = 0
        
        # Mapping helpers
        feature_map = {
            "paraphrase": ["Neural Paraphrase", "Paraphrase", "Neural Paraphraser"],
            "humanize": ["AI Humanizer", "Humanize"],
            "batch": ["Batch Processing", "Batch Document Processing"],
            "ocr": ["Optical Character Recognition (OCR)", "OCR Extraction", "OCR"],
            "personas": ["Custom Personas", "Personas"],
            "sentence_editor": ["Sentence Rewriter & Synonyms", "Sentence Rewrite", "Synonyms", "Interactive Editor"],
            "ai_detector": ["AI Content Detection", "AI Detection", "AI Detector"],
            "originality": ["Originality & Plagiarism", "Originality Check", "Originality"],
            "citations": ["Citation Generator", "Academic Citations", "Citations"],
            "docx_export": ["Microsoft Word Export", "DOCX Export", "Word Export"]
        }

        for feat in ALL_FEATURES:
            fid = feat["id"]
            alias_list = feature_map.get(fid, [feat["name"]])
            count = sum(feature_counts.get(alias, 0) for alias in alias_list)
            
            # Backfill inference from history or personas if activity_logs is new
            if fid == "paraphrase" and total_transformations > 0:
                count = max(count, sum(v for k, v in tone_counts.items() if k != "Humanized" and "Batch" not in k))
            elif fid == "humanize" and tone_counts.get("Humanized", 0) > 0:
                count = max(count, tone_counts.get("Humanized", 0))
            elif fid == "batch" and any("Batch" in k for k in tone_counts.keys()):
                count = max(count, sum(v for k, v in tone_counts.items() if "Batch" in k))
            elif fid == "personas" and len(personas) > 0:
                count = max(count, len(personas))

            last_used = None
            for alias in alias_list:
                if alias in feature_last_used:
                    if not last_used or feature_last_used[alias] > last_used:
                        last_used = feature_last_used[alias]
            
            is_used = count > 0
            if is_used:
                features_used_count += 1

            feature_matrix.append({
                **feat,
                "usage_count": count,
                "last_used": last_used,
                "status": "Active" if is_used else "Unexplored"
            })

        # Calculate Mastery Level
        if total_transformations >= 50 or total_words_processed >= 10000:
            mastery = {"level": 4, "title": "Master Synthesizer", "badge": "Master", "color": "purple"}
        elif total_transformations >= 20 or total_words_processed >= 3500:
            mastery = {"level": 3, "title": "Advanced Linguist", "badge": "Advanced", "color": "indigo"}
        elif total_transformations >= 5 or total_words_processed >= 500:
            mastery = {"level": 2, "title": "Active Wordsmith", "badge": "Intermediate", "color": "sky"}
        else:
            mastery = {"level": 1, "title": "Novice Explorer", "badge": "Novice", "color": "emerald"}

        # Estimated reading time saved (assuming average reading speed 200 wpm)
        time_saved_minutes = round((total_words_processed / 200) * 1.5, 1)

        # Recent history items with structured details
        c.execute("SELECT id, original_text, paraphrased_text, difficulty, timestamp FROM history WHERE email=? ORDER BY timestamp DESC LIMIT 30", (clean_email,))
        recent_history = [
            {
                "id": h[0],
                "original_text": h[1],
                "paraphrased_text": h[2],
                "difficulty": h[3],
                "timestamp": h[4],
                "original_word_count": len((h[1] or "").split()),
                "paraphrased_word_count": len((h[2] or "").split())
            }
            for h in c.fetchall()
        ]

        # Recent activity logs
        recent_activity = [
            {
                "id": a[0],
                "feature_name": a[1],
                "action": a[2],
                "details": a[3],
                "word_count": a[4],
                "timestamp": a[5]
            }
            for a in activity_rows[:50]
        ]

        adoption_percentage = round((features_used_count / len(ALL_FEATURES)) * 100)

        return {
            "user": user_info,
            "metrics": {
                "total_transformations": total_transformations,
                "total_words_processed": total_words_processed,
                "time_saved_minutes": time_saved_minutes,
                "features_used_count": features_used_count,
                "total_features": len(ALL_FEATURES),
                "feature_adoption_rate": adoption_percentage,
                "personas_count": len(personas)
            },
            "mastery": mastery,
            "feature_matrix": feature_matrix,
            "favorite_tones": sorted([{"tone": k, "count": v} for k, v in tone_counts.items()], key=lambda x: x["count"], reverse=True),
            "personas": personas,
            "history": recent_history,
            "activity_logs": recent_activity
        }

# --- Get All Users With Aggregated Stats For Admin Table ---
def get_all_users_with_stats():
    with get_db() as conn:
        c = conn.cursor()
        c.execute("SELECT name, email, role, status, created_at, last_active FROM users WHERE role != 'admin' ORDER BY last_active DESC")
        users_raw = c.fetchall()
        
        users_list = []
        for u in users_raw:
            email = u[1]
            # Get transformation count and words count
            c.execute("SELECT COUNT(*) FROM history WHERE email=?", (email,))
            trans_count = c.fetchone()[0]
            
            c.execute("SELECT original_text FROM history WHERE email=?", (email,))
            words = sum(len((r[0] or "").split()) for r in c.fetchall())
            
            # Distinct features used
            c.execute("SELECT DISTINCT feature_name FROM activity_logs WHERE email=?", (email,))
            feat_logs = [r[0] for r in c.fetchall()]
            
            # Personas count
            c.execute("SELECT COUNT(*) FROM personas WHERE email=?", (email,))
            personas_count = c.fetchone()[0]

            feat_count = len(feat_logs)
            if trans_count > 0 and 'Neural Paraphrase' not in feat_logs and 'Neural Paraphraser' not in feat_logs:
                feat_count += 1
            if personas_count > 0 and 'Custom Personas' not in feat_logs:
                feat_count += 1
            feat_count = min(max(feat_count, 1 if trans_count > 0 else 0), len(ALL_FEATURES))

            if trans_count >= 50 or words >= 10000:
                mastery_badge = "Master"
            elif trans_count >= 20 or words >= 3500:
                mastery_badge = "Advanced"
            elif trans_count >= 5 or words >= 500:
                mastery_badge = "Intermediate"
            else:
                mastery_badge = "Novice"

            users_list.append({
                "name": u[0],
                "email": u[1],
                "role": u[2],
                "status": u[3],
                "created_at": u[4],
                "last_active": u[5],
                "transformations_count": trans_count,
                "words_count": words,
                "features_used_count": feat_count,
                "personas_count": personas_count,
                "mastery_badge": mastery_badge
            })
            
        return users_list

# --- Platform-Wide Admin Dashboard Stats ---
def get_admin_dashboard_stats():
    with get_db() as conn:
        c = conn.cursor()
        
        # User counts by status
        c.execute("SELECT status, COUNT(*) FROM users WHERE role != 'admin' GROUP BY status")
        status_counts = dict(c.fetchall())
        
        c.execute("SELECT COUNT(*) FROM users WHERE role != 'admin'")
        total_users = c.fetchone()[0]
        
        # History global stats
        c.execute("SELECT COUNT(*) FROM history")
        total_transformations = c.fetchone()[0]
        
        c.execute("SELECT original_text FROM history")
        total_words = sum(len((r[0] or "").split()) for r in c.fetchall())

        # Feature distribution from activity logs
        c.execute("SELECT feature_name, COUNT(*) FROM activity_logs GROUP BY feature_name ORDER BY COUNT(*) DESC")
        raw_feat_dist = dict(c.fetchall())
        
        # Build feature popularity list
        feature_popularity = []
        for feat in ALL_FEATURES:
            name = feat["name"]
            count = raw_feat_dist.get(name, 0)
            if feat["id"] == "paraphrase":
                count += raw_feat_dist.get("Paraphrase", 0) + raw_feat_dist.get("Neural Paraphrase", 0)
                if count == 0 and total_transformations > 0:
                    count = total_transformations
            elif feat["id"] == "humanize":
                count += raw_feat_dist.get("Humanize", 0)
            elif feat["id"] == "batch":
                count += raw_feat_dist.get("Batch Processing", 0)
            elif feat["id"] == "ocr":
                count += raw_feat_dist.get("Optical Character Recognition (OCR)", 0) + raw_feat_dist.get("OCR Extraction", 0)
            elif feat["id"] == "personas":
                count += raw_feat_dist.get("Custom Personas", 0) + raw_feat_dist.get("Personas", 0)
            elif feat["id"] == "docx_export":
                count += raw_feat_dist.get("Microsoft Word Export", 0) + raw_feat_dist.get("DOCX Export", 0)
            elif feat["id"] == "sentence_editor":
                count += raw_feat_dist.get("Sentence Rewriter & Synonyms", 0) + raw_feat_dist.get("Sentence Rewrite", 0) + raw_feat_dist.get("Synonyms", 0)
            elif feat["id"] == "ai_detector":
                count += raw_feat_dist.get("AI Content Detection", 0) + raw_feat_dist.get("AI Detection", 0)
            elif feat["id"] == "originality":
                count += raw_feat_dist.get("Originality & Plagiarism", 0) + raw_feat_dist.get("Originality Check", 0)
            elif feat["id"] == "citations":
                count += raw_feat_dist.get("Citation Generator", 0) + raw_feat_dist.get("Academic Citations", 0)
            
            feature_popularity.append({
                "feature_id": feat["id"],
                "name": feat["name"],
                "category": feat["category"],
                "count": count
            })

        feature_popularity.sort(key=lambda x: x["count"], reverse=True)

        # Recent platform activity (across all users)
        c.execute('''
            SELECT a.id, a.email, u.name, a.feature_name, a.action, a.details, a.word_count, a.timestamp 
            FROM activity_logs a 
            LEFT JOIN users u ON a.email = u.email 
            ORDER BY a.timestamp DESC LIMIT 20
        ''')
        recent_activity = [
            {
                "id": r[0],
                "email": r[1],
                "user_name": r[2] or r[1].split('@')[0],
                "feature_name": r[3],
                "action": r[4],
                "details": r[5],
                "word_count": r[6],
                "timestamp": r[7]
            }
            for r in c.fetchall()
        ]

        # Top active users
        c.execute('''
            SELECT email, COUNT(*) as cnt FROM history 
            GROUP BY email ORDER BY cnt DESC LIMIT 5
        ''')
        top_users_raw = c.fetchall()
        top_users = []
        for u in top_users_raw:
            c.execute("SELECT name FROM users WHERE email=?", (u[0],))
            name_row = c.fetchone()
            top_users.append({
                "email": u[0],
                "name": name_row[0] if name_row else u[0],
                "transformations": u[1]
            })

        return {
            "total_users": total_users,
            "accepted_users": status_counts.get('accepted', 0),
            "pending_users": status_counts.get('pending', 0),
            "rejected_users": status_counts.get('rejected', 0),
            "total_transformations": total_transformations,
            "total_words_transformed": total_words,
            "feature_popularity": feature_popularity,
            "recent_activity": recent_activity,
            "top_users": top_users
        }
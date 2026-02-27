import sqlite3
import hashlib

DB_NAME = 'metaphrase_app.db' 

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT,
            password TEXT,
            role TEXT,
            status TEXT
        )
    ''')
    
    # NEW: History table for analytics
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
    
    # Admin Account
    admin_email = 'sannidhinavadeep6@gmail.com'
    admin_pw = hash_password('admin123') 
    
    c.execute("INSERT OR IGNORE INTO users (email, name, password, role, status) VALUES (?, ?, ?, ?, ?)", 
              (admin_email, 'Admin', admin_pw, 'admin', 'accepted'))
    
    conn.commit()
    conn.close()

# --- User Management Functions ---
def register_user(name, email, password):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (email, name, password, role, status) VALUES (?, ?, ?, ?, ?)", 
                  (email, name, hash_password(password), 'user', 'pending'))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_login(email, password):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT role, status, name FROM users WHERE email=? AND password=?", (email, hash_password(password)))
    user = c.fetchone()
    conn.close()
    return user

def get_all_users():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT name, email, role, status FROM users WHERE role != 'admin'")
    users = c.fetchall()
    conn.close()
    return users

def update_status(email, new_status):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("UPDATE users SET status=? WHERE email=?", (new_status, email))
    conn.commit()
    conn.close()

# --- NEW: History Functions ---
def add_history(email, original, paraphrased, difficulty):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO history (email, original_text, paraphrased_text, difficulty) VALUES (?, ?, ?, ?)",
              (email, original, paraphrased, difficulty))
    conn.commit()
    conn.close()

def get_user_history(email):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT original_text, paraphrased_text, difficulty, timestamp FROM history WHERE email=? ORDER BY timestamp DESC", (email,))
    records = c.fetchall()
    conn.close()
    return records
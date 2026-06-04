import sqlite3

conn = sqlite3.connect("campusflow.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS assignments(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    completion_message TEXT
)
""")
# Users table

cursor.execute("""
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

# Add user_id column to assignments table

try:
    cursor.execute("""
    ALTER TABLE assignments
    ADD COLUMN user_id INTEGER
    """)
except:
    pass
conn.commit()
conn.close()

print("Database Created")

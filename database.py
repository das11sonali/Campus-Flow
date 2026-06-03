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

conn.commit()
conn.close()

print("Database Created")
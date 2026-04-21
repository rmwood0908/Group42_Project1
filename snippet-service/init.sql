CREATE TABLE IF NOT EXISTS snippets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(100),
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

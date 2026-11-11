CREATE TABLE IF NOT EXISTS castle_ratings (
  uid_hash TEXT PRIMARY KEY,
  choice TEXT NOT NULL CHECK (choice IN ('like', 'dislike')),
  created_at INTEGER NOT NULL
);

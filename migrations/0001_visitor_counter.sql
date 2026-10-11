CREATE TABLE IF NOT EXISTS visitor_totals (
  visitor_hash TEXT PRIMARY KEY,
  first_seen INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_visitor_marks (
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  first_seen INTEGER NOT NULL,
  PRIMARY KEY (day, visitor_hash)
);

CREATE INDEX IF NOT EXISTS daily_visitor_marks_day_idx
  ON daily_visitor_marks (day);

CREATE TABLE IF NOT EXISTS active_sessions (
  session_hash TEXT PRIMARY KEY,
  last_seen INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS active_sessions_last_seen_idx
  ON active_sessions (last_seen);

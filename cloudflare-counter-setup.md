# Cloudflare visitor counter

The browser counter uses the Cloudflare Pages Function at `/api/visitor-counter` and a D1 database. It does not use Firebase. Other site features may continue to use Firebase for sign-in, chat, or visitor posts.

## Cloudflare Pages setup

1. Create a D1 database for the Sakaker Pages project.
2. Add a Pages Function D1 binding named `VISITOR_DB` and connect it to that database.
3. Apply `migrations/0001_visitor_counter.sql` to the database.
4. Deploy the Pages project and verify `POST /api/visitor-counter` returns `online`, `total`, and `today`.

The function stores SHA-256 hashes of random browser identifiers, not IP addresses or account details. It adds the existing 1,410 historical unique visitors to the new unique visitor records. Daily counts use the Asia/Riyadh date; online sessions expire after 60 seconds and send a heartbeat every 20 seconds.

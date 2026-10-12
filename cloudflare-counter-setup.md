# Cloudflare visitor counter

The visitor counter uses the same-origin Cloudflare Pages Function at `/api/visitor-counter` and D1. It does not use Firebase for the counter. Firebase sign-in, chat, and Visitor Posts stay unchanged.

## D1 databases and Pages bindings

1. Create a production D1 database named `sakaker-visitor-counter`.
2. Create a separate preview D1 database (for example, `sakaker-visitor-counter-preview`). Keeping preview separate prevents test POST requests from increasing production visitor totals.
3. In the Sakaker Pages project, add a D1 binding named `VISITOR_DB` in both Preview and Production. Select the preview database for Preview and the production database for Production. Redeploy after changing bindings.
4. Apply the migration to each database:
   ```sh
   npx wrangler d1 execute sakaker-visitor-counter --remote --file=migrations/0001_visitor_counter.sql
   npx wrangler d1 execute sakaker-visitor-counter-preview --remote --file=migrations/0001_visitor_counter.sql
   ```

## Preserve the displayed counts at cutover

Immediately before switching Production to the new Function, record the current displayed total and today's count from the existing counter. In Pages > Settings > Variables and Secrets, set these non-secret Production variables:

- `VISITOR_TOTAL_BASELINE`: the complete displayed total at cutover, including the historical 1,410 baseline.
- `VISITOR_TODAY_BASELINE`: the displayed unique visitors for the current day.
- `VISITOR_BASELINE_DAY`: the cutover date in `YYYY-MM-DD`, using Asia/Riyadh.

The Function adds new D1 visitors to the total baseline. It adds the daily baseline only on the matching Riyadh date, then the daily offset expires automatically at midnight. If these variables are absent, the total falls back to 1,410 and today's count starts at zero, so do not switch Production before setting them.

Use separate Preview values (or leave the preview database isolated) for smoke tests; never run test POST requests against the Production database. The baseline preserves the displayed aggregate. It does not import Firebase visitor identities, so a returning browser can be counted again after cutover.

## Verify Preview before Production

Deploy Preview and POST two times with the same UUIDs. The second request should leave `total` and `today` unchanged; a new `visitorId` should increase them once. Confirm the JSON contains `online`, `total`, and `today`, then check that the counter hydrates in Arabic and English and that sign-in, chat, and Visitor Posts still work.

The Function stores SHA-256 hashes of random browser identifiers, not IP addresses or account details. Online sessions expire after 60 seconds and send a heartbeat every 20 seconds.

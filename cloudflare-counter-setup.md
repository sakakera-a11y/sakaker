# Sakaker visitor counter: Cloudflare Analytics + D1 presence

The counter keeps the existing three-item display. Cloudflare GraphQL Analytics supplies total and daily traffic metrics; D1 is used only for active sessions. Firebase sign-in, chat, Visitor Posts, and the rest of the site are not changed.

## Runtime behavior

- Total: sum of Cloudflare daily unique-IP counts over the longest historical interval allowed by the zone's httpRequests1dGroups settings (notOlderThan), split into queries no wider than maxDuration.
- Today: Cloudflare daily unique-IP count for the current UTC date.
- Online now: active D1 sessions seen within the last 60 seconds.
- Analytics results are cached for five minutes. D1 presence continues to refresh every 30 seconds.
- The hard-coded 4,000 value and D1 visitor-total baselines are not used.

## Meaning of the metrics

Cloudflare daily uniq.uniques counts unique IP addresses per day, not identified people. The displayed total is the sum of daily unique-IP counts across available history. An IP seen on multiple days may therefore be counted more than once. The current-day metric follows Cloudflare's UTC daily rollup, not the Riyadh calendar day. The UI labels and tooltips disclose these definitions.

## Cloudflare settings (deferred)

When ready, add these server-side values to the Sakaker Pages project for Preview and Production as appropriate:

- CF_ANALYTICS_API_TOKEN: secret token with Analytics Read permission, scoped to the sakaker.co zone.
- CF_ZONE_ID: Zone ID for sakaker.co (non-secret).

Never place the API token in browser code or GitHub. This code change does not configure Cloudflare or create secrets.

The function discovers enabled, maxDuration, maxPageSize, notOlderThan, and availableFields at runtime. It does not assume a fixed retention period. If the dataset or unique-IP field is unavailable, the endpoint returns an error and the two Analytics values remain blank; it never substitutes a made-up baseline.

## D1 binding

Keep the existing VISITOR_DB binding and active_sessions table. The function now writes only hashed session identifiers to active_sessions. Historical visitor-total tables are left untouched and are no longer read or modified. No D1 migration is required.

## Preview verification before production

1. Configure the two Analytics values only when ready; use a separately scoped Preview token if available.
2. Verify the API returns total, today, online, historyStart, historyEnd, and daysReturned.
3. Confirm Analytics values refresh no more frequently than the five-minute cache and Online now updates with the 30-second heartbeat.
4. Confirm the total is understood as a sum of daily unique-IP counts, not lifetime distinct people, and today's count uses UTC.
5. Confirm sign-in, chat, Visitor Posts, Arabic/English switching, and mobile layout remain unaffected.

This branch does not configure Cloudflare, change secrets, merge to main, or deploy the site.

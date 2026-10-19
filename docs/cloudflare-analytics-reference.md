# Cloudflare Analytics reference endpoint

The optional `GET /api/cloudflare-analytics-reference` endpoint reads a 24-hour Cloudflare GraphQL Analytics snapshot for `sakaker.co` and `www.sakaker.co`.

## Safety properties

- Read-only: it does not write to D1, Firebase, or the displayed visitor counter.
- Separate from `/api/visitor-counter`; do not add its metrics to `VISITOR_TOTAL_BASELINE`.
- Requires an `Authorization: Bearer ...` header matching the server-side `ANALYTICS_REFERENCE_KEY` secret (at least 32 characters).
- Does not enable browser CORS or return Cloudflare API credentials.
- Reports Cloudflare's 24-hour visits and unique visitors as a comparison reference, not a lifetime cumulative total.

## Configure in Cloudflare Pages

Add these as encrypted secrets / environment variables to the relevant Pages environment before testing:

- `CLOUDFLARE_API_TOKEN`: a dedicated Cloudflare API token with the minimum read-only Zone Analytics permission, scoped only to the `sakaker.co` zone.
- `CLOUDFLARE_ZONE_ID`: the zone ID for `sakaker.co`.
- `ANALYTICS_REFERENCE_KEY`: a separate high-entropy secret, at least 32 characters, used to authorize requests to this endpoint.

Never put any of these values in repository files, client-side JavaScript, URLs, or commit messages. Configure Preview first. Use a request with the Authorization header to test; an unauthenticated request should return HTTP 401. If configuration is missing, the endpoint should return HTTP 503. Do not switch or alter the live counter based on this reference response.

## Metric interpretation

Cloudflare Analytics metrics are traffic aggregates over the requested window. They are not interchangeable with D1's cumulative unique-browser count and must not be added to that count. Historical data availability depends on the dataset and account plan.

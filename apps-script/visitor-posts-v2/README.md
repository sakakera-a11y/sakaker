# Visitor Posts v2

A fresh bilingual Google Apps Script window for the existing Visitor Posts icon. The window follows the site's emerald, gold, and glass style and has three tabs: videos, photos, and text posts.

## Submission and review

- Videos are MP4, WebM, or MOV, up to one minute and 10 MB.
- Photos are JPEG, PNG, GIF, WebP, or HEIC, up to 10 MB.
- Text posts are limited to 2,000 characters.
- Every submission is saved privately for review.
- Review controls are available only to the site account sakakera@gmail.com.
- Uploaded media remains private until explicit approval. Approval grants that individual media file viewer access by link.
- The published-posts area remains marked as coming soon; approved text is not publicly listed yet.

## Drive folders

- Private pending uploads folder: مشاركات الزوار - قيد المراجعة (خاص)
- Private metadata folder: _visitor-posts-data
- Both new folders were verified owner-only under sakakera@gmail.com.
- The older temporary folder with anyone-with-the-link viewer access is intentionally not used.

## Deployment

Copy Code.gs, Index.html, and appsscript.json into a new Apps Script project owned by sakakera@gmail.com. Authorize Drive and UrlFetchApp, then deploy the web app to execute as the owner so visitors do not need a separate Drive sign-in. The app verifies each site's Firebase ID token through Identity Toolkit.

After deployment, update VISITOR_APP_URL in assets/visitor-posts.js to the new /exec URL. The existing icon remains in place. Until that URL is connected, the live icon continues to use the existing Apps Script app.
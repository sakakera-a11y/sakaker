# Visitor Posts v2 (upload-only)

This is a fresh Google Apps Script web app for the existing Visitor Posts icon. It accepts file uploads only and saves them privately for review. The interface follows the site's glassy emerald and gold window style and supports Arabic and English.

## Drive settings

- Private pending uploads folder: مشاركات الزوار - قيد المراجعة (خاص)
- Private metadata folder: _visitor-posts-data
- The older temporary folder shared as anyone with the link is not used.
- Files stay private until the site administrator approves one. Approval is the first action that grants anyone-with-link viewer access.
- Maximum file size: 10 MB. The interface checks that videos are no longer than one minute.
- Admin review controls appear only for the site account sakakera@gmail.com.

## Source files

Copy Code.gs, Index.html, and appsscript.json into a new Apps Script project owned by sakakera@gmail.com. The project requires Drive and UrlFetchApp scopes. Deploy the web app to execute as the owner account. Visitors authenticate with the site's Firebase session; the script verifies ID tokens through Identity Toolkit before saving.

After deployment, update VISITOR_APP_URL in assets/visitor-posts.js to the new /exec URL. The existing site icon remains unchanged. Until the deployment URL is connected, the live icon continues to use the existing Apps Script app.

Do not change sharing on either private folder. The new upload folder and metadata folder have been verified as owner-only.
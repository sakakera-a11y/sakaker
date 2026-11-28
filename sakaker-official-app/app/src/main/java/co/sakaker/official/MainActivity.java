package co.sakaker.official;

import android.Manifest;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.browser.customtabs.CustomTabsCallback;
import androidx.browser.customtabs.CustomTabsClient;
import androidx.browser.customtabs.CustomTabsServiceConnection;
import androidx.browser.customtabs.CustomTabsSession;
import androidx.browser.trusted.TrustedWebActivityIntentBuilder;

public class MainActivity extends Activity {
    private static final int OVERLAY_REQUEST = 7104;
    private static final int FILE_CHOOSER_REQUEST = 7105;
    private static final int WEB_PERMISSION_REQUEST = 7106;
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private PermissionRequest pendingWebPermissionRequest;
    private static final String SITE_URL = "https://www.sakaker.co/";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(0xFF04191C);
        getWindow().setNavigationBarColor(0xFF04191C);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(0xFF041216);

        LinearLayout header = new LinearLayout(this);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setPadding(12, 6, 12, 6);
        header.setBackgroundColor(0xFF07383A);

        TextView title = new TextView(this);
        title.setText("✦ سكاكر | SAKAKER");
        title.setTextColor(0xFF9CFFEA);
        title.setTextSize(18);
        title.setTypeface(null, 1);
        header.addView(title, new LinearLayout.LayoutParams(0, -2, 1));

        Button fullSite = new Button(this);
        fullSite.setText("الموقع الكامل");
        fullSite.setOnClickListener(v -> openFullSite());
        header.addView(fullSite);

        Button channel = new Button(this);
        channel.setText("القناة");
        channel.setOnClickListener(v -> startActivity(new Intent(Intent.ACTION_VIEW,
                Uri.parse(FloatingChannelService.CHANNEL_URL))));
        header.addView(channel);
        root.addView(header);

        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        // Some sites restrict embedded WebViews; identify as the regular Android browser.
        String browserAgent = settings.getUserAgentString().replace("; wv", "");
        settings.setUserAgentString(browserAgent);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        webView.setWebViewClient(new WebViewClient() {
            @Override public void onReceivedError(WebView view, WebResourceRequest request,
                    android.webkit.WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    Toast.makeText(MainActivity.this,
                            "تعذر تحميل موقع سكاكر. تحقق من الإنترنت واضغط الرئيسية لإعادة المحاولة.",
                            Toast.LENGTH_LONG).show();
                }
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleExternalScheme(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleExternalScheme(Uri.parse(url));
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                    FileChooserParams params) {
                if (filePathCallback != null) filePathCallback.onReceiveValue(null);
                filePathCallback = callback;
                try {
                    Intent picker = params.createIntent();
                    startActivityForResult(picker, FILE_CHOOSER_REQUEST);
                    return true;
                } catch (Exception error) {
                    filePathCallback = null;
                    Toast.makeText(MainActivity.this, "تعذر فتح منتقي الملفات", Toast.LENGTH_SHORT).show();
                    return false;
                }
            }

            @Override public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> requestWebPermissions(request));
            }
        });
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            try {
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.setMimeType(mimeType);
                String cookie = CookieManager.getInstance().getCookie(url);
                if (cookie != null && !cookie.isEmpty()) request.addRequestHeader("Cookie", cookie);
                request.addRequestHeader("User-Agent", userAgent);
                request.setTitle("تنزيل من سكاكر");
                request.setDescription("جارٍ تنزيل الملف");
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,
                        android.webkit.URLUtil.guessFileName(url, contentDisposition, mimeType));
                ((DownloadManager) getSystemService(DOWNLOAD_SERVICE)).enqueue(request);
                Toast.makeText(this, "بدأ التنزيل", Toast.LENGTH_SHORT).show();
            } catch (Exception error) {
                Toast.makeText(this, "تعذر بدء التنزيل", Toast.LENGTH_SHORT).show();
            }
        });
        webView.loadUrl(SITE_URL);
        root.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1));

        LinearLayout footer = new LinearLayout(this);
        footer.setPadding(8, 4, 8, 4);
        footer.setBackgroundColor(0xFF07383A);
        Button home = new Button(this);
        home.setText("الرئيسية");
        home.setOnClickListener(v -> webView.loadUrl(SITE_URL));
        footer.addView(home, new LinearLayout.LayoutParams(0, -2, 1));
        Button back = new Button(this);
        back.setText("رجوع");
        back.setOnClickListener(v -> { if (webView.canGoBack()) webView.goBack(); });
        footer.addView(back, new LinearLayout.LayoutParams(0, -2, 1));
        Button floating = new Button(this);
        floating.setText("نافذة القناة");
        floating.setOnClickListener(v -> startFloating());
        footer.addView(floating, new LinearLayout.LayoutParams(0, -2, 1));
        root.addView(footer);
        setContentView(root);
    }

    private void openFullSite() {
        String browserPackage = CustomTabsClient.getPackageName(this, null);
        if (browserPackage == null) {
            openBrowserFallback();
            return;
        }

        CustomTabsServiceConnection connection = new CustomTabsServiceConnection() {
            @Override public void onCustomTabsServiceConnected(ComponentName name, CustomTabsClient client) {
                try {
                    client.warmup(0L);
                    CustomTabsSession session = client.newSession(new CustomTabsCallback());
                    if (session == null) {
                        openBrowserFallback();
                    } else {
                        new TrustedWebActivityIntentBuilder(Uri.parse(SITE_URL))
                                .build(session)
                                .launchTrustedWebActivity(MainActivity.this);
                    }
                } catch (Exception error) {
                    openBrowserFallback();
                } finally {
                    try { unbindService(this); } catch (Exception ignored) {}
                }
            }

            @Override public void onServiceDisconnected(ComponentName name) {}
        };

        try {
            boolean bound = CustomTabsClient.bindCustomTabsService(this, browserPackage, connection);
            if (!bound) openBrowserFallback();
        } catch (Exception error) {
            openBrowserFallback();
        }
    }

    private void openBrowserFallback() {
        try {
            androidx.browser.customtabs.CustomTabsIntent tabs =
                    new androidx.browser.customtabs.CustomTabsIntent.Builder().build();
            tabs.launchUrl(this, Uri.parse(SITE_URL));
        } catch (Exception error) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(SITE_URL)));
        }
    }

    private boolean handleExternalScheme(Uri uri) {
        String scheme = uri.getScheme();
        if (scheme == null || "http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme)) return false;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception ignored) {
            Toast.makeText(this, "لا يوجد تطبيق مناسب لفتح هذا الرابط", Toast.LENGTH_SHORT).show();
        }
        return true;
    }

    private void requestWebPermissions(PermissionRequest request) {
        java.util.ArrayList<String> needed = new java.util.ArrayList<>();
        for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)
                    && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED)
                needed.add(Manifest.permission.RECORD_AUDIO);
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)
                    && checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
                needed.add(Manifest.permission.CAMERA);
        }
        if (needed.isEmpty()) {
            request.grant(request.getResources());
        } else {
            pendingWebPermissionRequest = request;
            requestPermissions(needed.toArray(new String[0]), WEB_PERMISSION_REQUEST);
        }
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == WEB_PERMISSION_REQUEST && pendingWebPermissionRequest != null) {
            boolean allowed = grantResults.length > 0;
            for (int result : grantResults) allowed &= result == PackageManager.PERMISSION_GRANTED;
            if (allowed) pendingWebPermissionRequest.grant(pendingWebPermissionRequest.getResources());
            else pendingWebPermissionRequest.deny();
            pendingWebPermissionRequest = null;
        }
    }

    private void startFloating() {
        if (!Settings.canDrawOverlays(this)) {
            Intent permission = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));
            startActivityForResult(permission, OVERLAY_REQUEST);
            return;
        }
        Intent service = new Intent(this, FloatingChannelService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) startForegroundService(service);
        else startService(service);
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == OVERLAY_REQUEST && Settings.canDrawOverlays(this)) startFloating();
        if (request == FILE_CHOOSER_REQUEST && filePathCallback != null) {
            Uri[] results = null;
            if (result == RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    results = new Uri[count];
                    for (int i = 0; i < count; i++) results[i] = data.getClipData().getItemAt(i).getUri();
                } else if (data.getData() != null) {
                    results = new Uri[]{data.getData()};
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (filePathCallback != null) { filePathCallback.onReceiveValue(null); filePathCallback = null; }
        if (pendingWebPermissionRequest != null) { pendingWebPermissionRequest.deny(); pendingWebPermissionRequest = null; }
        if (webView != null) { webView.destroy(); webView = null; }
        super.onDestroy();
    }
}

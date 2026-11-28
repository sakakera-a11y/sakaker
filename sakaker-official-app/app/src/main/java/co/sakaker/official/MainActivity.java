package co.sakaker.official;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final int OVERLAY_REQUEST = 7104;
    private WebView webView;
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
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
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
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (webView != null) { webView.destroy(); webView = null; }
        super.onDestroy();
    }
}

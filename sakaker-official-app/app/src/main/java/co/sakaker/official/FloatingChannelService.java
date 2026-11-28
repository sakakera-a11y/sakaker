package co.sakaker.official;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.graphics.PixelFormat;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class FloatingChannelService extends Service {
    public static final String CHANNEL_URL = "https://www.youtube.com/@sakakera";
    public static final String SITE_URL = "https://www.sakaker.co/";
    private static final String APP_DOWNLOAD_URL = "https://github.com/sakakera-a11y/sakaker/releases";
    private static final String NOTIFICATION_CHANNEL = "sakaker_fullscreen_overlay";
    private WindowManager windowManager;
    private View overlay;
    private WebView content;

    @Override public void onCreate() {
        super.onCreate();
        createNotification();
        if (!Settings.canDrawOverlays(this)) { stopSelf(); return; }
        showFullScreenOverlay();
    }

    private void createNotification() {
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (Build.VERSION.SDK_INT >= 26) {
            manager.createNotificationChannel(new NotificationChannel(
                    NOTIFICATION_CHANNEL, "نافذة سكاكر فوق التطبيقات",
                    NotificationManager.IMPORTANCE_LOW));
        }
        Intent open = new Intent(this, MainActivity.class);
        PendingIntent pending = PendingIntent.getActivity(this, 0, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder builder = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(this, NOTIFICATION_CHANNEL)
                : new Notification.Builder(this);
        Notification notification = builder.setContentTitle("سكاكر أوفيكل")
                .setContentText("الموقع مفتوح فوق محتوى التطبيقات")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pending).setOngoing(true).build();
        startForeground(41, notification);
    }

    private Button actionButton(String text) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextSize(12);
        button.setAllCaps(false);
        return button;
    }

    private void openLink(String url) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (Exception error) {
            Toast.makeText(this, "تعذر فتح الرابط", Toast.LENGTH_SHORT).show();
        }
    }

    private void showFullScreenOverlay() {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        LinearLayout shell = new LinearLayout(this);
        shell.setOrientation(LinearLayout.VERTICAL);
        shell.setBackgroundColor(0xFF061719);
        shell.setElevation(24f);

        LinearLayout bar = new LinearLayout(this);
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setPadding(8, 4, 8, 4);
        bar.setBackgroundColor(0xFF07383A);
        TextView label = new TextView(this);
        label.setText("✦ سكاكر أوفيكل | قلعة أبو القمر زمرد");
        label.setTextColor(0xFF9CFFEA);
        label.setTextSize(15);
        label.setTypeface(null, 1);
        bar.addView(label, new LinearLayout.LayoutParams(0, -2, 1));
        Button close = actionButton("إغلاق");
        close.setOnClickListener(v -> stopSelf());
        bar.addView(close);
        shell.addView(bar, new LinearLayout.LayoutParams(-1, -2));

        LinearLayout actions = new LinearLayout(this);
        actions.setGravity(Gravity.CENTER);
        actions.setPadding(3, 2, 3, 2);
        actions.setBackgroundColor(0xFF102F32);
        Button site = actionButton("الموقع");
        site.setOnClickListener(v -> content.loadUrl(SITE_URL));
        actions.addView(site, new LinearLayout.LayoutParams(0, -2, 1));
        Button channel = actionButton("القناة");
        channel.setOnClickListener(v -> content.loadUrl(CHANNEL_URL));
        actions.addView(channel, new LinearLayout.LayoutParams(0, -2, 1));
        shell.addView(actions, new LinearLayout.LayoutParams(-1, -2));

        // A dedicated, high-contrast download action keeps it clear on narrow screens.
        Button download = actionButton("⬇  تحميل التطبيق الرسمي\\nقلعة أبو القمر زمرد");
        download.setTextSize(15);
        download.setTypeface(null, 1);
        download.setTextColor(0xFF062B25);
        download.setBackgroundTintList(android.content.res.ColorStateList.valueOf(0xFFFFD66B));
        download.setPadding(18, 12, 18, 12);
        download.setMinHeight(58);
        download.setElevation(8f);
        download.setContentDescription("تحميل تطبيق قلعة أبو القمر زمرد من صفحة الإصدارات الرسمية");
        download.setOnClickListener(v -> openLink(APP_DOWNLOAD_URL));
        LinearLayout.LayoutParams downloadParams = new LinearLayout.LayoutParams(-1, -2);
        downloadParams.setMargins(10, 8, 10, 8);
        shell.addView(download, downloadParams);

        content = new WebView(this);
        WebSettings settings = content.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        content.setWebChromeClient(new WebChromeClient());
        content.setBackgroundColor(0xFF000000);
        content.loadUrl(SITE_URL);
        shell.addView(content, new LinearLayout.LayoutParams(-1, 0, 1));

        overlay = shell;
        int type = Build.VERSION.SDK_INT >= 26
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                type, WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT);
        params.gravity = Gravity.TOP | Gravity.START;
        windowManager.addView(overlay, params);
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        return START_NOT_STICKY;
    }

    @Override public void onDestroy() {
        if (content != null) {
            content.stopLoading();
            content.destroy();
            content = null;
        }
        if (windowManager != null && overlay != null) {
            try { windowManager.removeView(overlay); } catch (Exception ignored) {}
        }
        overlay = null;
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}
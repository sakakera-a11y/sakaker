package co.sakaker.official;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.view.Gravity;
import android.view.MotionEvent;
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
    private static final String RELEASES_URL = "https://github.com/sakakera-a11y/sakaker/releases/latest/download/sakaker-official.apk";
    private static final String NOTIFICATION_CHANNEL = "sakaker_floating_channel";
    private WindowManager windowManager;
    private View overlay;
    private WebView content;
    private View actionsPanel;
    private WindowManager.LayoutParams overlayParams;
    private boolean minimized = false;

    @Override public void onCreate() {
        super.onCreate();
        createNotification();
        if (!Settings.canDrawOverlays(this)) { stopSelf(); return; }
        showOverlay();
    }

    private void createNotification() {
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (Build.VERSION.SDK_INT >= 26) {
            manager.createNotificationChannel(new NotificationChannel(
                    NOTIFICATION_CHANNEL, "نافذة سكاكر العائمة",
                    NotificationManager.IMPORTANCE_LOW));
        }
        Intent open = new Intent(this, MainActivity.class);
        PendingIntent pending = PendingIntent.getActivity(this, 0, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder builder = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(this, NOTIFICATION_CHANNEL)
                : new Notification.Builder(this);
        Notification notification = builder.setContentTitle("سكاكر أوفيكل")
                .setContentText("الموقع والقناة متاحان في النافذة العائمة")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pending)
                .setOngoing(true).build();
        startForeground(41, notification);
    }

    private Button actionButton(String text) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextSize(12);
        button.setAllCaps(false);
        return button;
    }

    private void showOverlay() {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        int width = (int) (getResources().getDisplayMetrics().widthPixels * 0.94f);
        int height = (int) (getResources().getDisplayMetrics().heightPixels * 0.55f);

        LinearLayout shell = new LinearLayout(this);
        shell.setOrientation(LinearLayout.VERTICAL);
        shell.setBackgroundColor(0xF20A2225);
        shell.setElevation(18f);

        LinearLayout bar = new LinearLayout(this);
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setPadding(8, 3, 6, 3);
        bar.setBackgroundColor(0xFF07383A);

        TextView label = new TextView(this);
        label.setText("✦ سكاكر أوفيكل");
        label.setTextColor(0xFF9CFFEA);
        label.setTextSize(15);
        label.setTypeface(null, 1);
        bar.addView(label, new LinearLayout.LayoutParams(0, -2, 1));

        Button minimize = actionButton("تصغير");
        bar.addView(minimize);
        Button close = actionButton("إغلاق");
        close.setOnClickListener(v -> stopSelf());
        bar.addView(close);
        shell.addView(bar, new LinearLayout.LayoutParams(-1, -2));

        LinearLayout actions = new LinearLayout(this);
        actionsPanel = actions;
        actions.setGravity(Gravity.CENTER);
        actions.setPadding(3, 2, 3, 2);
        actions.setBackgroundColor(0xFF102F32);

        Button site = actionButton("الموقع");
        site.setOnClickListener(v -> {
            restoreOverlay();
            content.loadUrl(SITE_URL);
        });
        actions.addView(site, new LinearLayout.LayoutParams(0, -2, 1));

        Button channel = actionButton("القناة");
        channel.setOnClickListener(v -> {
            restoreOverlay();
            content.loadUrl(CHANNEL_URL);
        });
        actions.addView(channel, new LinearLayout.LayoutParams(0, -2, 1));

        Button download = actionButton("تحميل التطبيق");
        download.setOnClickListener(v -> {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(RELEASES_URL));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (Exception error) {
                Toast.makeText(this, "تعذر فتح صفحة تحميل التطبيق", Toast.LENGTH_SHORT).show();
            }
        });
        actions.addView(download, new LinearLayout.LayoutParams(0, -2, 1));
        shell.addView(actions, new LinearLayout.LayoutParams(-1, -2));

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

        minimize.setOnClickListener(v -> {
            minimized = !minimized;
            content.setVisibility(minimized ? View.GONE : View.VISIBLE);
            actions.setVisibility(minimized ? View.GONE : View.VISIBLE);
            minimize.setText(minimized ? "فتح" : "تصغير");
            overlayParams.height = minimized
                    ? (int) (56 * getResources().getDisplayMetrics().density)
                    : height;
            windowManager.updateViewLayout(overlay, overlayParams);
        });

        overlay = shell;
        int type = Build.VERSION.SDK_INT >= 26
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;
        overlayParams = new WindowManager.LayoutParams(
                width, height, type,
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT);
        overlayParams.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
        overlayParams.y = 100;

        bar.setOnTouchListener(new View.OnTouchListener() {
            private int startX, startY;
            private float downX, downY;
            @Override public boolean onTouch(View view, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    startX = overlayParams.x;
                    startY = overlayParams.y;
                    downX = event.getRawX();
                    downY = event.getRawY();
                    return true;
                }
                if (event.getAction() == MotionEvent.ACTION_MOVE) {
                    overlayParams.x = startX + (int) (event.getRawX() - downX);
                    overlayParams.y = startY + (int) (event.getRawY() - downY);
                    windowManager.updateViewLayout(overlay, overlayParams);
                    return true;
                }
                return event.getAction() == MotionEvent.ACTION_UP;
            }
        });
        windowManager.addView(overlay, overlayParams);
    }

    private void restoreOverlay() {
        if (minimized && overlay != null) {
            minimized = false;
            content.setVisibility(View.VISIBLE);
            if (actionsPanel != null) actionsPanel.setVisibility(View.VISIBLE);
            overlayParams.height = (int) (getResources().getDisplayMetrics().heightPixels * 0.55f);
            windowManager.updateViewLayout(overlay, overlayParams);
        }
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

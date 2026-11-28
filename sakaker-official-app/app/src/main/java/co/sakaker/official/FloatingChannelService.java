package co.sakaker.official;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
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

public class FloatingChannelService extends Service {
    public static final String CHANNEL_URL = "https://www.youtube.com/@sakakera";
    private static final String NOTIFICATION_CHANNEL = "sakaker_floating_channel";
    private WindowManager windowManager;
    private View overlay;

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
                .setContentText("القناة تعمل في النافذة العائمة")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pending)
                .setOngoing(true).build();
        startForeground(41, notification);
    }

    private void showOverlay() {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        int width = (int) (getResources().getDisplayMetrics().widthPixels * 0.92f);
        int height = (int) (getResources().getDisplayMetrics().heightPixels * 0.42f);

        LinearLayout shell = new LinearLayout(this);
        shell.setOrientation(LinearLayout.VERTICAL);
        shell.setBackgroundColor(0xF20A2225);
        shell.setElevation(18f);

        LinearLayout bar = new LinearLayout(this);
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setPadding(12, 5, 8, 5);
        bar.setBackgroundColor(0xFF07383A);

        TextView label = new TextView(this);
        label.setText("✦ سكاكر أوفيكل");
        label.setTextColor(0xFF9CFFEA);
        label.setTextSize(15);
        label.setTypeface(null, 1);
        bar.addView(label, new LinearLayout.LayoutParams(0, -2, 1));

        Button close = new Button(this);
        close.setText("إغلاق");
        close.setOnClickListener(v -> stopSelf());
        bar.addView(close);
        shell.addView(bar, new LinearLayout.LayoutParams(-1, -2));

        WebView player = new WebView(this);
        WebSettings settings = player.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        player.setWebChromeClient(new WebChromeClient());
        player.setBackgroundColor(0xFF000000);
        player.loadUrl(CHANNEL_URL);
        shell.addView(player, new LinearLayout.LayoutParams(-1, 0, 1));

        overlay = shell;
        int type = Build.VERSION.SDK_INT >= 26
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                width, height, type,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT);
        params.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
        params.y = 100;

        bar.setOnTouchListener(new View.OnTouchListener() {
            private int startX, startY;
            private float downX, downY;
            @Override public boolean onTouch(View view, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    startX = params.x; startY = params.y;
                    downX = event.getRawX(); downY = event.getRawY();
                    return true;
                }
                if (event.getAction() == MotionEvent.ACTION_MOVE) {
                    params.x = startX + (int) (event.getRawX() - downX);
                    params.y = startY + (int) (event.getRawY() - downY);
                    windowManager.updateViewLayout(overlay, params);
                    return true;
                }
                return event.getAction() == MotionEvent.ACTION_UP;
            }
        });
        windowManager.addView(overlay, params);
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        return START_NOT_STICKY;
    }

    @Override public void onDestroy() {
        if (windowManager != null && overlay != null) {
            try { windowManager.removeView(overlay); } catch (Exception ignored) {}
        }
        overlay = null;
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}

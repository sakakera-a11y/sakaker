package co.sakaker.official;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final int OVERLAY_REQUEST = 7104;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(0xFF04191C);
        getWindow().setNavigationBarColor(0xFF04191C);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(28, 36, 28, 36);
        root.setBackgroundColor(0xFF041216);

        TextView title = new TextView(this);
        title.setText("سكاكر أوفيكل\nSAKAKER OFFICIAL");
        title.setTextColor(0xFF8CFFE8);
        title.setTextSize(27);
        title.setGravity(Gravity.CENTER);
        title.setPadding(8, 8, 8, 24);
        title.setTypeface(null, 1);
        root.addView(title);

        TextView description = new TextView(this);
        description.setText("شاهد القناة داخل التطبيق، أو افتح نافذتها العائمة فوق التطبيقات الأخرى. يلزم السماح بصلاحية الظهور فوق التطبيقات.");
        description.setTextColor(0xFFE2F7F2);
        description.setTextSize(17);
        description.setGravity(Gravity.CENTER);
        description.setPadding(8, 8, 8, 26);
        root.addView(description);

        Button open = new Button(this);
        open.setText("فتح القناة");
        open.setOnClickListener(v -> startActivity(new Intent(Intent.ACTION_VIEW,
                Uri.parse(FloatingChannelService.CHANNEL_URL))));
        root.addView(open, new LinearLayout.LayoutParams(-1, -2));

        Button floating = new Button(this);
        floating.setText("تشغيل النافذة العائمة");
        floating.setOnClickListener(v -> startFloating());
        LinearLayout.LayoutParams fp = new LinearLayout.LayoutParams(-1, -2);
        fp.topMargin = 16;
        root.addView(floating, fp);

        TextView note = new TextView(this);
        note.setText("يمكنك تحريك النافذة وسحبها، وإغلاقها من زر الإغلاق. يعتمد تشغيل الفيديو على دعم YouTube والاتصال بالإنترنت.");
        note.setTextColor(0xFF9ABCB5);
        note.setTextSize(13);
        note.setGravity(Gravity.CENTER);
        note.setPadding(8, 26, 8, 8);
        root.addView(note);

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
        finish();
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == OVERLAY_REQUEST && Settings.canDrawOverlays(this)) startFloating();
    }
}

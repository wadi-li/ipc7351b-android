package com.vlymar.ipc7351b;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final int REQ_SAVE = 1001;
    private WebView web;
    private String pendingText;
    private String pendingName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setBuiltInZoomControls(true);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if ("file".equals(u.getScheme())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, u));
                return true;
            }
        });
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.androidBack&&window.androidBack()", v -> {
            if (!"true".equals(v)) finish();
        });
    }

    private void toast(String t) {
        runOnUiThread(() -> Toast.makeText(MainActivity.this, t, Toast.LENGTH_SHORT).show());
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_SAVE) return;
        if (resultCode != RESULT_OK || data == null || data.getData() == null || pendingText == null) {
            toast("Сохранение отменено");
            pendingText = null;
            return;
        }
        try (OutputStream os = getContentResolver().openOutputStream(data.getData())) {
            os.write(pendingText.getBytes(StandardCharsets.UTF_8));
            toast("Файл сохранён: " + pendingName);
        } catch (Exception e) {
            toast("Ошибка сохранения: " + e.getMessage());
        }
        pendingText = null;
    }

    private class Bridge {
        @JavascriptInterface
        public void copy(String text) {
            runOnUiThread(() -> {
                ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                cm.setPrimaryClip(ClipData.newPlainText("IPC-7351B", text));
            });
        }

        @JavascriptInterface
        public void saveFile(String name, String mime, String text) {
            runOnUiThread(() -> {
                pendingText = text;
                pendingName = name;
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType(mime == null || mime.isEmpty() ? "*/*" : mime);
                i.putExtra(Intent.EXTRA_TITLE, name);
                try {
                    startActivityForResult(i, REQ_SAVE);
                } catch (Exception e) {
                    toast("Нет приложения для сохранения файлов");
                }
            });
        }

        @JavascriptInterface
        public void setDark(boolean dark) {
            runOnUiThread(() -> {
                int c = dark ? Color.parseColor("#0a0e12") : Color.parseColor("#1d2733");
                getWindow().setStatusBarColor(c);
                getWindow().setNavigationBarColor(c);
                web.setBackgroundColor(dark ? Color.parseColor("#0f1419") : Color.parseColor("#f4f6f9"));
            });
        }
    }
}

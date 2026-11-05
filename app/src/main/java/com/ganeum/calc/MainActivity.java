package com.ganeum.calc;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * 가늠: 계산기 화면(assets/index.html)을 띄우고, 화면이 부탁하는 폰 기능을 대신 해 준다.
 * 하는 일: 복사, 공유, 환율 받기(정해진 3곳만), 새 버전 확인. 그 밖의 권한·정보 수집 없음.
 */
public class MainActivity extends Activity {
    private static final String RELEASE_API = "https://api.github.com/repos/dlsdml99-create/ganeum/releases/latest";
    private static final String PAGE = "https://dlsdml99-create.github.io/ganeum/";
    // 환율은 이 주소들에서만 받는다 (그 밖의 주소는 거절)
    private static final String[] RATE_HOSTS = {"open.er-api.com", "cdn.jsdelivr.net", "latest.currency-api.pages.dev"};

    private WebView web;
    private boolean pageReady;
    private final List<String> pendingJs = new ArrayList<>();
    private long latestVersion = 0;
    private String latestUrl = null;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        paintBars();
        web = new WebView(this);
        web.setBackgroundColor(isNight() ? 0xFF0E1512 : 0xFFEDF1EE);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setTextZoom(100);              // 폰 글꼴 크기 설정에 화면이 깨지지 않게
        s.setSupportZoom(false);
        s.setAllowContentAccess(false);
        s.setGeolocationEnabled(false);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.addJavascriptInterface(new Bridge(), "Android");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                pageReady = true;
                for (String c : pendingJs) web.evaluateJavascript(c, null);
                pendingJs.clear();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("file".equals(u.getScheme())) return false;
                // 화면 안의 링크(환율 출처 등)는 폰 브라우저로 연다
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }
        });
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
        checkUpdate();
        takeIntent(getIntent());
    }

    // 다크 모드에 맞춰 위·아래 막대 색과 아이콘 색을 맞춘다
    private void paintBars() {
        Window w = getWindow();
        int c = isNight() ? 0xFF0E1512 : 0xFFEDF1EE;
        w.setStatusBarColor(c);
        w.setNavigationBarColor(c);
        int flags = 0;
        if (!isNight()) {
            flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            if (Build.VERSION.SDK_INT >= 26) flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        w.getDecorView().setSystemUiVisibility(flags);
    }

    private boolean isNight() {
        return (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
    }

    @Override
    public void onConfigurationChanged(Configuration c) {
        super.onConfigurationChanged(c);
        paintBars();
        web.setBackgroundColor(isNight() ? 0xFF0E1512 : 0xFFEDF1EE);
    }

    // 공유받은 글('공유 → 가늠') 또는 공유 링크 페이지 버튼(ganeum://p/코드)
    private void takeIntent(Intent i) {
        if (i == null) return;
        if (Intent.ACTION_SEND.equals(i.getAction()) && "text/plain".equals(i.getType())) {
            String t = i.getStringExtra(Intent.EXTRA_TEXT);
            if (t != null && t.length() < 20000) js("window.onSharedText&&window.onSharedText(" + JSONObject.quote(t) + ")");
        } else if (Intent.ACTION_VIEW.equals(i.getAction()) && i.getData() != null && "ganeum".equals(i.getData().getScheme())) {
            String code = i.getData().getLastPathSegment();
            if (code != null && code.matches("[A-Za-z0-9_-]{8,3000}")) js("window.ddImportPreset&&window.ddImportPreset(" + JSONObject.quote(code) + ")");
        } else return;
        i.setAction(Intent.ACTION_MAIN);   // 화면을 돌려도 다시 처리하지 않게
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        takeIntent(intent);
    }

    @Override
    protected void onPause() {
        super.onPause();
        // 앱을 나갈 때 계산 기록·프리셋을 바로 저장
        if (pageReady) web.evaluateJavascript("window.dispatchEvent(new Event('pagehide'))", null);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onBackKey?String(window.onBackKey()):'false'", v -> {
            if (v == null || !v.contains("true")) finish();
        });
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        backupResult(req, res, data);
    }

    // ── 내 데이터 백업 (파일 저장·불러오기) ──
    private static final int REQ_BK_SAVE = 7301, REQ_BK_OPEN = 7302;
    private String bkData;

    private boolean backupResult(int req, int res, Intent data) {
        if (req != REQ_BK_SAVE && req != REQ_BK_OPEN) return false;
        final android.net.Uri u = (res == RESULT_OK && data != null) ? data.getData() : null;
        if (req == REQ_BK_SAVE) {
            final String text = bkData; bkData = null;
            if (u == null || text == null) { js("window.AppInfo&&AppInfo.backupDone(false,'cancel')"); return true; }
            new Thread(() -> {
                boolean ok;
                try (java.io.OutputStream o = getContentResolver().openOutputStream(u, "wt")) {
                    o.write(text.getBytes(java.nio.charset.StandardCharsets.UTF_8)); ok = true;
                } catch (Exception e) { ok = false; }
                js("window.AppInfo&&AppInfo.backupDone(" + ok + ")");
            }).start();
            return true;
        }
        if (u == null) { js("window.AppInfo&&AppInfo.backupOpened(null)"); return true; }
        new Thread(() -> {
            String out;
            try (java.io.InputStream in = getContentResolver().openInputStream(u)) {
                java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream();
                byte[] buf = new byte[65536]; int n;
                while ((n = in.read(buf)) > 0) { b.write(buf, 0, n); if (b.size() > 80 * 1024 * 1024) throw new java.io.IOException("too big"); }
                out = new String(b.toByteArray(), java.nio.charset.StandardCharsets.UTF_8);
            } catch (Exception e) { out = null; }
            js("window.AppInfo&&AppInfo.backupOpened(" + (out == null ? "null" : org.json.JSONObject.quote(out)) + ")");
        }).start();
        return true;
    }

    private void js(String code) {
        runOnUiThread(() -> {
            if (pageReady) web.evaluateJavascript(code, null);
            else pendingJs.add(code);
        });
    }

    // ── 화면에서 부르는 기능 ──
    class Bridge {
        /** 백업 파일 저장: 사용자가 '파일' 창에서 고른 곳에만 써요 (권한 필요 없음, 인터넷으로 보내지 않음) */
        @JavascriptInterface
        public void backupSave(String name, String json) {
            runOnUiThread(() -> {
                bkData = json;
                try {
                    startActivityForResult(new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                            .setType("application/json").putExtra(Intent.EXTRA_TITLE, name), REQ_BK_SAVE);
                } catch (Exception e) { bkData = null; js("window.AppInfo&&AppInfo.backupDone(false)"); }
            });
        }

        /** 백업 파일 불러오기: 사용자가 고른 파일 하나만 읽어요 */
        @JavascriptInterface
        public void backupOpen() {
            runOnUiThread(() -> {
                try {
                    startActivityForResult(new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                            .setType("*/*").putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"}), REQ_BK_OPEN);
                } catch (Exception e) { js("window.AppInfo&&AppInfo.backupOpened(null)"); }
            });
        }

        @JavascriptInterface
        public String version() {
            try { return getPackageManager().getPackageInfo(getPackageName(), 0).versionName; } catch (Exception e) { return ""; }
        }

        @JavascriptInterface
        public void copy(String text) {
            runOnUiThread(() -> {
                ClipboardManager cm = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("가늠", text));
            });
        }

        @JavascriptInterface
        public void shareText(String text) {
            runOnUiThread(() -> {
                try {
                    Intent i = new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text);
                    startActivity(Intent.createChooser(i, "프리셋 보내기"));
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "보낼 앱을 찾지 못했어요", Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void fetchAsync(String id, String url) {
            new Thread(() -> {
                String body = null;
                try {
                    URL u = new URL(url);
                    if ("https".equals(u.getProtocol()) && allowed(u.getHost())) body = get(url, 8000);
                } catch (Exception ignored) { }
                js("window.__fetchDone&&window.__fetchDone(" + JSONObject.quote(id) + "," + (body == null ? "null" : JSONObject.quote(body)) + ")");
            }).start();
        }

        @JavascriptInterface
        public void openUpdate() {
            runOnUiThread(() -> {
                if (latestUrl != null && latestVersion > currentVersion()) showUpdate(latestVersion);
                else Toast.makeText(MainActivity.this, "지금 최신 버전이에요", Toast.LENGTH_SHORT).show();
            });
        }
    }

    private static boolean allowed(String host) {
        for (String h : RATE_HOSTS) if (h.equals(host)) return true;
        return false;
    }

    private static String get(String url, int timeout) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(timeout);
        c.setReadTimeout(timeout);
        c.setRequestProperty("Accept", "application/json");
        try {
            if (c.getResponseCode() != 200) return null;
            try (InputStream in = c.getInputStream(); BufferedReader r = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
                StringBuilder sb = new StringBuilder();
                char[] buf = new char[8192];
                int n;
                while ((n = r.read(buf)) > 0) {
                    sb.append(buf, 0, n);
                    if (sb.length() > 2_000_000) return null;
                }
                return sb.toString();
            }
        } finally {
            c.disconnect();
        }
    }

    // ── 반자동 업데이트: 열 때 GitHub에서 최신 버전을 확인하고, 새 버전이면 알려 줌 ──
    private void checkUpdate() {
        new Thread(() -> {
            try {
                String body = get(RELEASE_API, 8000);
                if (body == null) return;
                JSONObject o = new JSONObject(body);
                String digits = o.optString("tag_name", "").replaceAll("[^0-9]", "");
                if (digits.isEmpty()) return;
                long latest = Long.parseLong(digits);
                String url = null;
                JSONArray assets = o.optJSONArray("assets");
                if (assets != null) {
                    for (int i = 0; i < assets.length(); i++) {
                        JSONObject a = assets.getJSONObject(i);
                        if (a.optString("name").endsWith(".apk")) { url = a.optString("browser_download_url"); break; }
                    }
                }
                latestVersion = latest;
                latestUrl = url;
                js("window.onLatest&&window.onLatest(" + latest + "," + currentVersion() + ")");
                if (url != null && latest > currentVersion()) runOnUiThread(() -> showUpdate(latest));
            } catch (Exception ignored) { }
        }).start();
    }

    private void showUpdate(long latest) {
        if (isFinishing() || latestUrl == null) return;
        new AlertDialog.Builder(this)
            .setTitle("새 버전이 있어요")
            .setMessage("v1." + latest + " 업데이트가 나왔어요.\n'업데이트'를 누르면 파일이 받아져요. 다 받으면 파일을 눌러 설치하세요. 계산 기록과 프리셋은 그대로 남아요.")
            .setPositiveButton("업데이트", (d, w) -> {
                try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(latestUrl))); } catch (Exception ignored) { }
            })
            .setNeutralButton("새 기능 보기", (d, w) -> {
                try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(PAGE + "#updates"))); } catch (Exception ignored) { }
            })
            .setNegativeButton("나중에", null)
            .show();
    }

    private long currentVersion() {
        try {
            PackageInfo pi = getPackageManager().getPackageInfo(getPackageName(), 0);
            return Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
        } catch (Exception e) {
            return Long.MAX_VALUE;
        }
    }
}

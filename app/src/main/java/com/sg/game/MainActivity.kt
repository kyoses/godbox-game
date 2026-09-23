package com.sg.game

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var tvServer: TextView
    private lateinit var prefs: SharedPreferences

    private val defaultLocalUrl = "file:///android_asset/www/index.html"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 沉浸式（隐藏状态栏）
        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
        setContentView(R.layout.activity_main)

        StaticData.ensureLoaded(this)

        prefs = getSharedPreferences("sg_game", Context.MODE_PRIVATE)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        tvServer = findViewById(R.id.tvServer)
        findViewById<Button>(R.id.btnSettings).setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
        findViewById<Button>(R.id.btnReload).setOnClickListener {
            loadConfiguredUrl()
        }

        setupWebView()
        loadConfiguredUrl()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            cacheMode = WebSettings.LOAD_DEFAULT
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            // 启用 localStorage / IndexedDB（游戏存档）
            databaseEnabled = true
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val url = request.url.toString()
                // assets 内部文件不走网络
                if (url.startsWith("file:///android_asset/")) return false
                if (url.startsWith("file://")) return false
                if (url.startsWith("http://localhost") || url.startsWith("https://localhost")) {
                    return false
                }
                // 后端服务器地址：放行
                val configured = prefs.getString(PREF_SERVER_URL, "")
                if (!configured.isNullOrEmpty() && url.startsWith(configured)) {
                    return false
                }
                // 默认放行（用户配置的服务器域名）
                return false
            }

            override fun onPageFinished(view: WebView, url: String) {
                progressBar.visibility = View.GONE
                tvServer.text = "当前：${url.take(60)}"
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress >= 100) progressBar.visibility = View.GONE
            }
        }

        // 长按事件允许（用于游戏内文本选择）
        webView.setOnLongClickListener { false }

        // 注入 host 配置到 JS（替换 basic.js 中硬编码的 host）
        webView.addJavascriptInterface(
            SgBridge(this),
            "SgBridge"
        )
    }

    private fun loadConfiguredUrl() {
        val url = prefs.getString(PREF_SERVER_URL, null)
        when {
            url.isNullOrEmpty() -> {
                // 默认用本地 assets（离线优先）
                webView.loadUrl(defaultLocalUrl)
                tvServer.text = "本地资源"
            }
            url == "offline" -> {
                webView.loadUrl(defaultLocalUrl)
                tvServer.text = "本地资源（离线）"
            }
            url.startsWith("http") -> {
                webView.loadUrl(url)
                tvServer.text = "服务器：$url"
            }
            else -> {
                webView.loadUrl(defaultLocalUrl)
                tvServer.text = "本地资源"
            }
        }
        progressBar.visibility = View.VISIBLE
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        const val PREF_SERVER_URL = "server_url"
    }
}
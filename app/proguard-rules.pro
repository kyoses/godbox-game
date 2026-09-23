# WebView 项目保留规则
-keep class com.sg.game.** { *; }
-keepattributes *Annotation*
-keepclassmembers class * extends android.webkit.WebViewClient { *; }
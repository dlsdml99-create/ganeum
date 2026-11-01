# 화면(웹)에서 부르는 기능 이름은 그대로 둠
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
-keepattributes *Annotation*,JavascriptInterface

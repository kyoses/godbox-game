# sg-android · 三国霸业离线版

`sg-htdocs` 商业级三国页游（1287 文件 / 130MB）的 **Android 离线改造工程**。

## 阶段进度

- [x] **阶段 1**：Android 工程骨架 + WebView 壳 ← **当前**
- [ ] 阶段 2：核心战斗引擎 Kotlin 化（Fight/User/Npc/Utils）
- [ ] 阶段 3：装备/任务/强化系统 Kotlin 化
- [ ] 阶段 4：完整离线 Room/SQLite 数据层

## 阶段 1 功能

- Android 工程骨架（Kotlin + ViewBinding）
- WebView 装载 `assets/www/index.html`
- 顶部 URL 设置：用户填入本机 PHP 服务器地址即可联机
- 网络安全配置（允许 cleartext HTTP 调试）
- JS Bridge（`SgBridge`）：让 basic.js 替换硬编码的 115.29.14.233 host
- GitHub Actions 自动构建

## 限制（重要）

由于 Android WebView **不能运行 PHP**，本版本：
- ✅ UI 完整渲染（HTML + CSS + JS）
- ❌ 不能登录（需要 MySQL 写 c_user）
- ❌ 不能战斗（需要 PHP Fight.class 算伤害）
- ❌ 不能保存（需要 PHP 写 c_user_soul）

要真正离线运行，需要后续阶段把 PHP 业务重写成 Kotlin。

## 编译

1. 用 Android Studio 打开 `sg-android/`
2. Sync Project
3. `Build → Build Bundle(s)/APK(s) → Build APK(s)`
4. 输出：`app/build/outputs/apk/debug/app-debug.apk`

或通过 GitHub Actions（已配置）自动出 APK。

## 资源

| 路径 | 大小 |
|---|---|
| `assets/www/` | 19 MB（核心游戏资源 + 15MB image/game） |
| `image/sys/` (115MB UI 切图) | **未打包**，阶段 2 压缩后导入 |

## 包名

`com.sg.game`

## 测试场景

1. 启动 APK → 看到"离线 Demo"页面
2. 顶部齿轮 → 设置服务器 URL `http://192.168.x.x:8080`（电脑 IP）
3. 在电脑上跑 PHP 服务器（`php -S 0.0.0.0:8080 -t sg-htdocs`）
4. 返回主界面刷新 → 加载 index.php → 看到游戏 UI
5. 但所有 PHP 接口仍调用 `http://115.29.14.233/sgg/i/...`（硬编码）—— 需要 basic.js 替换为 `SgBridge.getHost()` 才正常
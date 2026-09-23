package com.sg.game

import android.content.Context
import android.content.SharedPreferences
import android.webkit.JavascriptInterface
import com.sg.game.data.StaticData
import com.sg.game.engine.BattleManager
import com.sg.game.engine.DatabaseHelper
import com.sg.game.engine.EquipManager
import com.sg.game.engine.NpcManager
import com.sg.game.engine.PropManager
import com.sg.game.engine.Qianghua
import com.sg.game.engine.TaskManager
import com.sg.game.engine.UserManager

/**
 * JS Bridge：让 basic.js 调用 Android 原生 Kotlin 业务逻辑。
 *
 * 阶段 2+：替换 PHP 后端的 58 个 sgg/i/ 接口。
 */
class SgBridge(context: Context) {

    private val ctx = context.applicationContext
    private val prefs: SharedPreferences =
        ctx.getSharedPreferences("sg_game", Context.MODE_PRIVATE)

    init {
        StaticData.ensureLoaded(ctx)
        DatabaseHelper.get(ctx)
    }

    /** 返回 host：阶段 1 默认本地 assets，阶段 2+ 全部走 Kotlin */
    @JavascriptInterface
    fun getHost(): String = "file:///android_asset/www"

    @JavascriptInterface
    fun getPlatform(): String = "android-kotlin"

    /**
     * 战斗
     */
    @JavascriptInterface
    fun battleFight(formation: String, sysIds: String): String {
        return try {
            BattleManager.fightToJson(formation, sysIds)
        } catch (e: Exception) {
            "{\"winner\":\"error\",\"error\":\"${e.message}\"}"
        }
    }

    /**
     * 用户
     */
    @JavascriptInterface
    fun userGetInfo(): String {
        return try {
            val raw = UserManager.getPlayerInfo(ctx)
            // 解析并补充 user.js 需要的字段（yb/vipLevel/img/formation）
            val obj = org.json.JSONObject(raw)
            obj.put("yb", 1000)        // 元宝
            obj.put("yb_total", 5000)
            obj.put("vipLevel", 0)
            obj.put("img", "1")
            obj.put("reputation", 100)
            obj.put("cbattle", "1 1 1 1 1 1 1 1 1")
            obj.put("id", 1)
            return obj.toString()
        } catch (e: Exception) {
            "{\"error\":\"${e.message}\"}"
        }
    }

    @JavascriptInterface
    fun userAddGold(delta: Int) {
        UserManager.addGold(ctx, delta)
    }

    /**
     * 武将
     */
    @JavascriptInterface
    fun npcList(): String {
        val list = NpcManager.listForPlayer(ctx)
        val sb = StringBuilder("[")
        for ((i, n) in list.withIndex()) {
            if (i > 0) sb.append(",")
            sb.append("{\"npc_id\":${n["npc_id"]},\"name\":\"${n["name"]}\",\"level\":${n["level"]},\"position\":${n["position"]}}")
        }
        sb.append("]")
        return sb.toString()
    }

    @JavascriptInterface
    fun npcAdd(npcId: Int): Boolean = NpcManager.addNpc(ctx, npcId)

    @JavascriptInterface
    fun npcSetPosition(npcDbId: Long, position: Int) {
        NpcManager.setPosition(ctx, npcDbId, position)
    }

    /**
     * 装备
     */
    @JavascriptInterface
    fun equipList(): String {
        val list = EquipManager.listForPlayer(ctx)
        val sb = StringBuilder("[")
        for ((i, e) in list.withIndex()) {
            if (i > 0) sb.append(",")
            sb.append("{\"equip_id\":${e["equip_id"]},\"up_level\":${e["up_level"]},\"status\":${e["status"]}}")
        }
        sb.append("]")
        return sb.toString()
    }

    @JavascriptInterface
    fun equipAdd(equipId: Int): Boolean = EquipManager.addEquip(ctx, equipId)

    @JavascriptInterface
    fun equipUpgrade(equipDbId: Long, equipType: Int, gold: Int): Boolean {
        return EquipManager.upgrade(ctx, equipDbId, equipType, gold)
    }

    @JavascriptInterface
    fun qianghuaCalc(level: Int, type: Int): Int = Qianghua.calculateCost(level, type)

    /**
     * 道具
     */
    @JavascriptInterface
    fun propAdd(propId: Int, num: Int): Boolean = PropManager.addProp(ctx, propId, num)

    /**
     * 任务
     */
    @JavascriptInterface
    fun taskList(): String {
        val list = TaskManager.listAvailable(ctx)
        val sb = StringBuilder("[")
        for ((i, t) in list.withIndex()) {
            if (i > 0) sb.append(",")
            sb.append("{\"task_id\":${t["task_id"]},\"status\":${t["status"]},\"title\":\"${t["title"]}\"}")
        }
        sb.append("]")
        return sb.toString()
    }

    @JavascriptInterface
    fun taskComplete(taskId: Int) {
        TaskManager.complete(ctx, taskId)
    }

    /**
     * 设置：清空所有数据
     */
    @JavascriptInterface
    fun resetGame() {
        ctx.deleteDatabase("sg_game")
    }
}
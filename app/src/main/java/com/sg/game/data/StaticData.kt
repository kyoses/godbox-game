package com.sg.game.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * 静态数据加载器：从 assets/data/static_data.json 读入。
 *
 * PHP 端 s_* 表对应这里。字段以 PHP 列名直接命名（snake_case）。
 */
object StaticData {

    private var loaded = false
    val data = mutableMapOf<String, JSONArray>()
    val allNpcTemplates: List<NpcTemplate> by lazy { loadNpcTemplates() }
    val allEquipTemplates: List<EquipTemplate> by lazy { loadEquipTemplates() }
    val allBattleTemplates: List<BattleTemplate> by lazy { loadBattleTemplates() }
    val allPropTemplates: List<PropTemplate> by lazy { loadPropTemplates() }
    val allTaskTemplates: List<TaskTemplate> by lazy { loadTaskTemplates() }

    private fun loadNpcTemplates(): List<NpcTemplate> = mutableListOf<NpcTemplate>().apply {
        val arr = data["s_npc"] ?: return@apply
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            add(NpcTemplate(o.optInt("id"), o.optString("name"), o.optString("img"),
                o.optInt("class", 1), o.optInt("phy_att", 50), o.optInt("mag_att", 50),
                o.optInt("phy_def", 30), o.optInt("mag_def", 30), o.optInt("strength", 30),
                o.optInt("intelligence", 30), o.optInt("speed", 50), o.optInt("crit", 30),
                o.optInt("crit_def", 0)))
        }
    }

    private fun loadEquipTemplates(): List<EquipTemplate> = mutableListOf<EquipTemplate>().apply {
        val arr = data["s_equip"] ?: return@apply
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            add(EquipTemplate(o.optInt("id"), o.optString("name"), o.optInt("type", 1),
                o.optInt("phy_att", 0), o.optInt("mag_att", 0), o.optInt("phy_def", 0),
                o.optInt("mag_def", 0), o.optInt("strength", 0), o.optInt("intelligence", 0),
                o.optInt("take_level", 1), o.optString("img")))
        }
    }

    private fun loadBattleTemplates(): List<BattleTemplate> = mutableListOf<BattleTemplate>().apply {
        val arr = data["s_battle"] ?: return@apply
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            add(BattleTemplate(o.optInt("id"), o.optString("name"), o.optInt("map_id", 1),
                o.optInt("type", 1), o.optInt("disp_order", i + 1),
                o.optString("sys_formation"), o.optString("sys_formation_extra", "")))
        }
    }

    private fun loadTaskTemplates(): List<TaskTemplate> = mutableListOf<TaskTemplate>().apply {
        val arr = data["s_task"] ?: return@apply
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            add(TaskTemplate(o.optInt("id"), o.optString("title"), o.optString("desc"),
                o.optInt("reward_gold", 0), o.optInt("reward_exp", 0), o.optInt("reward_prop", 0)))
        }
    }

    private fun loadPropTemplates(): List<PropTemplate> = mutableListOf<PropTemplate>().apply {
        val arr = data["s_prop"] ?: return@apply
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            add(PropTemplate(o.optInt("id"), o.optString("name"), o.optInt("type", 1),
                o.optString("effect_type"), o.optInt("effect_value", 0), o.optString("img")))
        }
    }

    fun ensureLoaded(ctx: Context) {
        if (loaded) return
        try {
            val jsonText = ctx.assets.open("data/static_data.json")
                .bufferedReader().use(BufferedReader::readText)
            val obj = JSONObject(jsonText)
            val keys = obj.keys()
            while (keys.hasNext()) {
                val k = keys.next()
                data[k] = obj.getJSONArray(k)
            }
            loaded = true
        } catch (e: Exception) {
            e.printStackTrace()
            // 占位：让游戏继续跑
            data["s_npc"] = JSONArray()
        }
    }

    fun getNpcTemplate(id: Int): JSONObject? {
        val arr = data["s_npc"] ?: return null
        for (i in 0 until arr.length()) {
            val item = arr.getJSONObject(i)
            if (item.optInt("id") == id) return item
        }
        return null
    }

    fun getEquipTemplate(id: Int): JSONObject? {
        val arr = data["s_equip"] ?: return null
        for (i in 0 until arr.length()) {
            val item = arr.getJSONObject(i)
            if (item.optInt("id") == id) return item
        }
        return null
    }

    fun getBattleTemplate(id: Int): JSONObject? {
        val arr = data["s_battle"] ?: return null
        for (i in 0 until arr.length()) {
            val item = arr.getJSONObject(i)
            if (item.optInt("id") == id) return item
        }
        return null
    }

    fun getPropTemplate(id: Int): JSONObject? {
        val arr = data["s_prop"] ?: return null
        for (i in 0 until arr.length()) {
            val item = arr.getJSONObject(i)
            if (item.optInt("id") == id) return item
        }
        return null
    }

    fun getTaskTemplate(id: Int): JSONObject? {
        val arr = data["s_task"] ?: return null
        for (i in 0 until arr.length()) {
            val item = arr.getJSONObject(i)
            if (item.optInt("id") == id) return item
        }
        return null
    }
}

/** 武将模板 */
data class NpcTemplate(
    val id: Int,
    val name: String,
    val img: String,
    val npcClass: Int,
    val phyAtt: Int,
    val magAtt: Int,
    val phyDef: Int,
    val magDef: Int,
    val strength: Int,
    val intelligence: Int,
    val speed: Int,
    val crit: Int,
    val critDef: Int
) {
    fun toNpcStats(level: Int): NpcStats = NpcStats(
        npcId = id, name = name, type = npcClass, level = level,
        hp = strength * 8 + level * 10, hpMax = strength * 8 + level * 10,
        phyAtt = phyAtt, magAtt = magAtt, phyDef = phyDef, magDef = magDef,
        strength = strength, intelligence = intelligence, speed = speed,
        crit = crit, critDef = critDef, img = img, imgSmall = img,
        npcClass = npcClass
    )
}

data class EquipTemplate(
    val id: Int, val name: String, val type: Int,
    val phyAtt: Int, val magAtt: Int, val phyDef: Int, val magDef: Int,
    val strength: Int, val intelligence: Int, val takeLevel: Int, val img: String
)

data class BattleTemplate(
    val id: Int, val name: String, val mapId: Int, val type: Int,
    val dispOrder: Int, val sysFormation: String, val extra: String
)

data class TaskTemplate(
    val id: Int, val title: String, val desc: String,
    val rewardGold: Int, val rewardExp: Int, val rewardProp: Int
)

data class PropTemplate(
    val id: Int, val name: String, val type: Int,
    val effectType: String, val effectValue: Int, val img: String
)

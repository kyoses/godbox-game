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
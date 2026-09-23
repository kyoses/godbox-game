package com.sg.game.engine

import android.content.ContentValues
import android.content.Context
import com.sg.game.data.StaticData

/**
 * 武将管理（翻译自 PHP Npc.class.php，简化版）
 */
object NpcManager {

    fun listForPlayer(ctx: Context): List<Map<String, Any>> {
        val db = DatabaseHelper.get(ctx).readableDatabase
        val cursor = db.rawQuery("SELECT * FROM c_npc", null)
        val list = mutableListOf<Map<String, Any>>()
        while (cursor.moveToNext()) {
            val npcId = cursor.getInt(cursor.getColumnIndexOrThrow("npc_id"))
            val name = cursor.getString(cursor.getColumnIndexOrThrow("name"))
            val level = cursor.getInt(cursor.getColumnIndexOrThrow("level"))
            val position = cursor.getInt(cursor.getColumnIndexOrThrow("position"))
            list.add(mapOf(
                "npc_id" to npcId,
                "name" to name,
                "level" to level,
                "position" to position
            ))
        }
        cursor.close()
        return list
    }

    /**
     * 给玩家添加一个武将（首次招募）
     */
    fun addNpc(ctx: Context, npcId: Int): Boolean {
        val tpl = StaticData.getNpcTemplate(npcId) ?: return false
        val name = tpl.optString("name", "武将$npcId")
        val db = DatabaseHelper.get(ctx).writableDatabase
        val cv = ContentValues().apply {
            put("npc_id", npcId)
            put("name", name)
            put("level", 1)
            put("exp", 0)
            put("position", -1)
            put("str_inte", 0)
        }
        val id = db.insert("c_npc", null, cv)
        return id > 0
    }

    /**
     * 设置阵型位置 0-8
     */
    fun setPosition(ctx: Context, npcDbId: Long, position: Int) {
        val db = DatabaseHelper.get(ctx).writableDatabase
        db.execSQL("UPDATE c_npc SET position = ? WHERE id = ?", arrayOf(position, npcDbId))
    }

    /**
     * 升 1 级
     */
    fun addExp(ctx: Context, npcDbId: Long, exp: Int) {
        val db = DatabaseHelper.get(ctx).writableDatabase
        db.execSQL("UPDATE c_npc SET exp = exp + ? WHERE id = ?", arrayOf(exp, npcDbId))
    }
}
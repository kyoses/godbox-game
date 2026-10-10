package com.sg.game.engine

import android.content.ContentValues
import android.content.Context

/**
 * 装备管理（翻译自 PHP Equip.class.php，简化版）
 */
object EquipManager {

    fun listForPlayer(ctx: Context): List<Map<String, Any>> {
        val db = DatabaseHelper.get(ctx).readableDatabase
        val cursor = db.rawQuery("SELECT * FROM c_equip", null)
        val list = mutableListOf<Map<String, Any>>()
        while (cursor.moveToNext()) {
            val dbId = cursor.getInt(cursor.getColumnIndexOrThrow("id"))
            val equipId = cursor.getInt(cursor.getColumnIndexOrThrow("equip_id"))
            val upLevel = cursor.getInt(cursor.getColumnIndexOrThrow("up_level"))
            val status = cursor.getInt(cursor.getColumnIndexOrThrow("status"))
            list.add(mapOf(
                "db_id" to dbId,
                "equip_id" to equipId,
                "up_level" to upLevel,
                "status" to status,
                "name" to "装备$equipId"
            ))
        }
        cursor.close()
        return list
    }

    fun addEquip(ctx: Context, equipId: Int): Boolean {
        val db = DatabaseHelper.get(ctx).writableDatabase
        val cv = ContentValues().apply {
            put("equip_id", equipId)
            put("up_level", 0)
            put("status", 0)
            put("position", -1)
        }
        val id = db.insert("c_equip", null, cv)
        return id > 0
    }

    fun upgrade(ctx: Context, dbId: Long, equipType: Int, gold: Int): Boolean {
        val db = DatabaseHelper.get(ctx).writableDatabase
        val cursor = db.rawQuery("SELECT up_level FROM c_equip WHERE id=?",
            arrayOf(dbId.toString()))
        if (!cursor.moveToFirst()) return false
        val currentLevel = cursor.getInt(0)
        cursor.close()

        val (newLevel, remainGold) = Qianghua.strengthen(currentLevel, equipType, gold)
        if (newLevel == currentLevel) return false

        db.execSQL("UPDATE c_equip SET up_level = ? WHERE id = ?",
            arrayOf(newLevel, dbId))
        db.execSQL("UPDATE c_player SET gold = ? WHERE id = 1", arrayOf(remainGold))
        return true
    }

    /**
     * 装备穿戴：status 0=待命 1=装备中
     * 一个武将同位置只能装一件
     */
    fun equip(ctx: Context, equipDbId: Long, npcDbId: Long, position: Int): Boolean {
        val db = DatabaseHelper.get(ctx).writableDatabase
        // 卸下该位置已装的
        db.execSQL("UPDATE c_equip SET status=0, position=-1 WHERE npc_id=? AND position=?",
            arrayOf(npcDbId, position))
        // 装上新的
        val rows = db.execSQL(
            "UPDATE c_equip SET status=1, position=? WHERE id=?",
            arrayOf(position, equipDbId))
        return rows > 0
    }

    /** 卸下 */
    fun unequip(ctx: Context, equipDbId: Long): Boolean {
        val db = DatabaseHelper.get(ctx).writableDatabase
        val rows = db.execSQL(
            "UPDATE c_equip SET status=0, position=-1 WHERE id=?",
            arrayOf(equipDbId))
        return rows > 0
    }

    /** 列已装备在某位置 */
    fun getEquippedAt(ctx: Context, npcDbId: Long, position: Int): Map<String, Any>? {
        val db = DatabaseHelper.get(ctx).readableDatabase
        val cursor = db.rawQuery(
            "SELECT * FROM c_equip WHERE status=1 AND npc_id=? AND position=?",
            arrayOf(npcDbId.toString(), position.toString()))
        return if (cursor.moveToFirst()) {
            val equipId = cursor.getInt(cursor.getColumnIndexOrThrow("equip_id"))
            val upLevel = cursor.getInt(cursor.getColumnIndexOrThrow("up_level"))
            val dbId = cursor.getLong(cursor.getColumnIndexOrThrow("id"))
            mapOf("db_id" to dbId, "equip_id" to equipId, "up_level" to upLevel)
        } else null
    }
}
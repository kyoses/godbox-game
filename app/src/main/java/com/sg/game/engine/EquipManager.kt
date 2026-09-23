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
            val equipId = cursor.getInt(cursor.getColumnIndexOrThrow("equip_id"))
            val upLevel = cursor.getInt(cursor.getColumnIndexOrThrow("up_level"))
            val status = cursor.getInt(cursor.getColumnIndexOrThrow("status"))
            list.add(mapOf(
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

    fun upgrade(ctx: Context, equipDbId: Long, equipType: Int, gold: Int): Boolean {
        val db = DatabaseHelper.get(ctx).writableDatabase
        val cursor = db.rawQuery("SELECT up_level FROM c_equip WHERE id=?",
            arrayOf(equipDbId.toString()))
        if (!cursor.moveToFirst()) return false
        val currentLevel = cursor.getInt(0)
        cursor.close()

        val (newLevel, remainGold) = Qianghua.strengthen(currentLevel, equipType, gold)
        if (newLevel == currentLevel) return false

        db.execSQL("UPDATE c_equip SET up_level = ? WHERE id = ?",
            arrayOf(newLevel, equipDbId))
        db.execSQL("UPDATE c_player SET gold = ? WHERE id = 1", arrayOf(remainGold))
        return true
    }
}
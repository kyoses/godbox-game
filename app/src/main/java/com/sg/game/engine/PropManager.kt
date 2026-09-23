package com.sg.game.engine

import android.content.ContentValues
import android.content.Context

/**
 * 道具管理（翻译自 PHP Prop.class.php，简化版）
 */
object PropManager {

    fun addProp(ctx: Context, propId: Int, num: Int = 1): Boolean {
        val db = DatabaseHelper.get(ctx).writableDatabase
        val cv = ContentValues().apply {
            put("prop_id", propId)
            put("num", num)
        }
        val id = db.insert("c_prop", null, cv)
        return id > 0
    }

    fun listForPlayer(ctx: Context): List<Map<String, Any>> {
        val db = DatabaseHelper.get(ctx).readableDatabase
        val cursor = db.rawQuery("SELECT * FROM c_prop", null)
        val list = mutableListOf<Map<String, Any>>()
        while (cursor.moveToNext()) {
            val propId = cursor.getInt(cursor.getColumnIndexOrThrow("prop_id"))
            val num = cursor.getInt(cursor.getColumnIndexOrThrow("num"))
            list.add(mapOf("prop_id" to propId, "num" to num))
        }
        cursor.close()
        return list
    }
}
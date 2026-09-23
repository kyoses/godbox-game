package com.sg.game.engine

import android.content.Context
import org.json.JSONObject

/**
 * 用户管理（翻译自 PHP User.class.php，简化版）
 */
object UserManager {

    fun getPlayerInfo(ctx: Context): String {
        val db = DatabaseHelper.get(ctx).readableDatabase
        val cursor = db.rawQuery("SELECT * FROM c_player WHERE id=1", null)
        cursor.moveToFirst()
        val name = cursor.getString(cursor.getColumnIndexOrThrow("name"))
        val gold = cursor.getInt(cursor.getColumnIndexOrThrow("gold"))
        val level = cursor.getInt(cursor.getColumnIndexOrThrow("level"))
        val exp = cursor.getInt(cursor.getColumnIndexOrThrow("exp"))
        val stamina = cursor.getInt(cursor.getColumnIndexOrThrow("stamina"))
        cursor.close()

        return JSONObject().apply {
            put("name", name)
            put("gold", gold)
            put("level", level)
            put("exp", exp)
            put("stamina", stamina)
        }.toString()
    }

    fun addGold(ctx: Context, delta: Int) {
        val db = DatabaseHelper.get(ctx).writableDatabase
        db.execSQL("UPDATE c_player SET gold = gold + ? WHERE id = 1", arrayOf(delta))
    }

    fun addExp(ctx: Context, delta: Int) {
        val db = DatabaseHelper.get(ctx).writableDatabase
        db.execSQL("UPDATE c_player SET exp = exp + ? WHERE id = 1", arrayOf(delta))
    }
}
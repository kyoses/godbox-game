package com.sg.game.engine

import android.content.ContentValues
import android.content.Context
import com.sg.game.data.StaticData

/**
 * 任务系统（翻译自 PHP Task.class.php，简化版）
 */
object TaskManager {

    fun listAvailable(ctx: Context): List<Map<String, Any>> {
        val db = DatabaseHelper.get(ctx).readableDatabase
        val cursor = db.rawQuery("SELECT * FROM c_task", null)
        val list = mutableListOf<Map<String, Any>>()
        while (cursor.moveToNext()) {
            val taskId = cursor.getInt(cursor.getColumnIndexOrThrow("task_id"))
            val status = cursor.getInt(cursor.getColumnIndexOrThrow("status"))
            val tpl = StaticData.getTaskTemplate(taskId)
            list.add(mapOf(
                "task_id" to taskId,
                "status" to status,
                "title" to (tpl?.optString("title", "任务") ?: "任务"),
                "desc" to (tpl?.optString("desc", "") ?: "")
            ))
        }
        cursor.close()
        return list
    }

    fun complete(ctx: Context, taskId: Int) {
        val db = DatabaseHelper.get(ctx).writableDatabase
        db.execSQL("UPDATE c_task SET status = 1, progress = 100 WHERE task_id = ?",
            arrayOf(taskId))
        val tpl = StaticData.getTaskTemplate(taskId)
        if (tpl != null) {
            val rewardGold = tpl.optInt("reward_gold", 0)
            val rewardExp = tpl.optInt("reward_exp", 0)
            if (rewardGold > 0) UserManager.addGold(ctx, rewardGold)
            if (rewardExp > 0) UserManager.addExp(ctx, rewardExp)
        }
    }
}
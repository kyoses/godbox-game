package com.sg.game.engine

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

/**
 * 玩家数据持久化（翻译自 PHP c_* 表）。
 *
 * 简化设计：单表 c_player_state + 子表 c_npcs/c_equips/c_props/c_tasks。
 * 避开 Room 依赖，手写 SQLiteOpenHelper。
 */
class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, "sg_game.db", null, 1) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS c_player (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL DEFAULT '主公',
                gold INTEGER DEFAULT 5000,
                exp INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1,
                hp INTEGER DEFAULT 100,
                stamina INTEGER DEFAULT 100
            )
        """.trimIndent())
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS c_npc (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                npc_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                level INTEGER DEFAULT 1,
                exp INTEGER DEFAULT 0,
                position INTEGER DEFAULT -1,
                str_inte INTEGER DEFAULT 0
            )
        """.trimIndent())
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS c_equip (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                equip_id INTEGER NOT NULL,
                up_level INTEGER DEFAULT 0,
                status INTEGER DEFAULT 0,
                position INTEGER DEFAULT -1
            )
        """.trimIndent())
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS c_prop (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prop_id INTEGER NOT NULL,
                num INTEGER DEFAULT 1
            )
        """.trimIndent())
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS c_battle (
                battle_id INTEGER DEFAULT 1,
                formation TEXT DEFAULT '0,0,0|0,0,0|0,0,0'
            )
        """.trimIndent())
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS c_task (
                task_id INTEGER PRIMARY KEY,
                status INTEGER DEFAULT 0,
                step INTEGER DEFAULT 0,
                progress INTEGER DEFAULT 0
            )
        """.trimIndent())

        // 默认玩家
        db.execSQL("INSERT OR IGNORE INTO c_player (id, name) VALUES (1, '主公')")
        db.execSQL("INSERT OR IGNORE INTO c_battle DEFAULT VALUES")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // 不做迁移（debug 版本）
    }

    companion object {
        @Volatile private var instance: DatabaseHelper? = null
        fun get(ctx: Context): DatabaseHelper {
            return instance ?: synchronized(this) {
                instance ?: DatabaseHelper(ctx.applicationContext).also { instance = it }
            }
        }
    }
}
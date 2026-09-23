package com.sg.game.data

/**
 * 行动队列元素（来自 Fight.fightTurn 排序后的元素）
 */
data class TurnSlot(
    val n: Int,        // 序号 1-9
    val team: Int,      // 0=左 1=右
    val row: Int,      // 0-2
    val col: Int,      // 0-2
    val dir: String,   // "left"/"right"  行动方向
    val npc: NpcStats
)
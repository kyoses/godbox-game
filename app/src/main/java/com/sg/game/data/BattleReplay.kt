package com.sg.game.data

/**
 * 战斗回放数据（输出 JSON 给前端 battle.js）
 */
data class BattleReplay(
    val left: Array<Array<NpcStats?>>,  // [3][3]
    val right: Array<Array<NpcStats?>>, // [3][3]
    val log: MutableList<LogEntry> = mutableListOf(),
    var winner: String = ""  // "left"/"right"/"draw"
) {
    data class LogEntry(
        val turn: Int,      // 第几轮
        val attacker: Int,  // npcId
        val defender: Int,  // npcId
        val damage: Int,
        val crit: Boolean,
        val type: Int  // 1=物理 2=法术
    )
}
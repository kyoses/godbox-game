package com.sg.game.data

/**
 * 生物属性。type=1 物理 / 2 法术。
 */
data class NpcStats(
    val npcId: Int,
    val name: String = "",
    val type: Int = 1,
    val level: Int = 1,
    var hp: Int = 100,
    val hpMax: Int = 100,
    var fury: Int = 0,
    val phyAtt: Int = 10,
    val magAtt: Int = 10,
    val phyDef: Int = 5,
    val magDef: Int = 5,
    val strength: Int = 10,
    val intelligence: Int = 10,
    val speed: Int = 10,
    val crit: Int = 50,
    val critDef: Int = 0,
    val hit: Int = 100,
    val miss: Int = 0,
    var buff1: Int = 0,  // 眩晕
    var buff2: Int = 0,  // 反伤
    var buff2K: String = "", // 反伤公式
    val img: String = "",
    val imgSmall: String = "",
    val npcClass: Int = 0,
    val formationIdx: Int = 0  // 阵型中位置 0-8
) {
    val isAlive: Boolean get() = hp > 0
    val isPhysical: Boolean get() = type == 1
}
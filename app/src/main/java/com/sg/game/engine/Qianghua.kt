package com.sg.game.engine

import kotlin.math.pow
import kotlin.math.roundToLong

/**
 * 装备强化公式（翻译自 PHP Qianghua::calculateEquipUpLCost）
 *
 * baseCost = pow(level, 3.25) / 30 + level × 5
 * 8 种 type 阶梯
 */
object Qianghua {

    /**
     * 计算强化到下一级所需的金币。
     */
    fun calculateCost(level: Int, type: Int): Int {
        val baseCost = level.toDouble().pow(3.25) / 30.0 + level * 5
        val (multiplier, addConst) = when (type) {
            1 -> Pair(40, 100)
            2 -> Pair(20, 50)
            3 -> Pair(20, 50)
            4 -> Pair(40, 100)
            5 -> Pair(40, 100)
            6 -> Pair(60, 150)
            7 -> Pair(80, 200)
            8 -> Pair(100, 300)
            else -> Pair(40, 100)
        }
        return roundToLong(baseCost * multiplier).toInt() + addConst
    }

    /**
     * 强化结果：返回新等级（up_level）
     */
    fun strengthen(level: Int, type: Int, gold: Int): Pair<Int, Int> {
        val cost = calculateCost(level, type)
        if (gold < cost) return Pair(level, gold)
        return Pair(level + 1, gold - cost)
    }
}
package com.sg.game.data

/**
 * 3x3 阵型。rows[i][j] = npcId（>0 表示有武将，0 表示空位）
 */
class Formation {
    val rows: Array<Array<IntArray>> = Array(3) { Array(3) { IntArray(3) } }

    fun parse(s: String) {
        for (i in 0 until 3) for (j in 0 until 3) for (k in 0 until 3) rows[i][j][k] = 0
        val rowStrs = s.split("|")
        for ((i, rowStr) in rowStrs.withIndex()) {
            if (i >= 3) break
            val cells = rowStr.split(",")
            for ((j, cell) in cells.withIndex()) {
                if (j >= 3) break
                val parts = cell.trim().split(Regex("\\s+"))
                for ((k, part) in parts.withIndex()) {
                    if (k >= 3) break
                    rows[i][j][k] = part.toIntOrNull() ?: 0
                }
            }
        }
    }

    fun toSerializedString(): String {
        val sb = StringBuilder()
        for (i in 0 until 3) {
            if (i > 0) sb.append('|')
            for (j in 0 until 3) {
                if (j > 0) sb.append(',')
                for (k in 0 until 3) {
                    if (k > 0) sb.append(' ')
                    sb.append(rows[i][j][k])
                }
            }
        }
        return sb.toString()
    }

    fun isCellOccupied(i: Int, j: Int, k: Int = 0): Boolean =
        i in 0..2 && j in 0..2 && k in 0..2 && rows[i][j][k] > 0

    fun getNpcId(i: Int, j: Int, k: Int = 0): Int =
        if (isCellOccupied(i, j, k)) rows[i][j][k] else 0
}
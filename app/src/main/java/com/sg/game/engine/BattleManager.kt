package com.sg.game.engine

import com.sg.game.data.BattleReplay
import com.sg.game.data.NpcStats

/**
 * 战斗对外接口：把战斗结果转成兼容原版 H5 battle.js 的 JSON。
 *
 * 数据结构（与 sg-htdocs f.php 输出对齐）：
 * {
 *   "st": 0,                     // 0=正常, 1=体力不足, 2=次数已满
 *   "result": "left",             // 胜利方
 *   "start": {
 *     "left":  [[null, {...}, null], ...],
 *     "right": [[null, {...}, null], ...]
 *   },
 *   "string": [
 *     {"att":{...}, "def":{...}}, ...
 *   ],
 *   "user": {"nowTL":..., "maxTL":...},
 *   "next": null
 * }
 */
object BattleManager {

    fun fightToJson(formation: String, sysIds: String): String {
        val replay = BattleEngine.runFight(formation, sysIds)
        return replayToJson(replay)
    }

    fun replayToJson(replay: BattleReplay): String {
        val sb = StringBuilder()
        sb.append("{")
        sb.append("\"st\":0,")
        sb.append("\"result\":\"").append(replay.winner).append("\",")
        sb.append("\"winner\":\"").append(replay.winner).append("\",")

        // start.left / start.right 3x3 矩阵
        sb.append("\"start\":{")
        sb.append("\"left\":")
        appendTeam3x(sb, replay.left)
        sb.append(",")
        sb.append("\"right\":")
        appendTeam3x(sb, replay.right)
        sb.append("},")

        // string 战报数组（模拟原版格式：att/def 对象）
        sb.append("\"string\":[")
        for ((i, log) in replay.log.withIndex()) {
            if (i > 0) sb.append(",")
            sb.append("{\"att\":{\"pos\":\"u").append(log.attacker)
                .append("\",\"hp\":").append(log.damage)
                .append(",\"nt\":\"").append(log.type).append("\"},")
                .append("\"def\":{\"id\":").append(log.defender)
                .append(",\"hp\":-").append(log.damage).append("}}")
        }
        sb.append("],")

        // 用户更新
        sb.append("\"user\":{\"nowTL\":99,\"maxTL\":100},")
        sb.append("\"next\":null")
        sb.append("}")
        return sb.toString()
    }

    /**
     * 输出 [[cell, cell, cell], ...] 每个 cell 是 null 或 {hp, fury, img, img_small, ...}
     */
    private fun appendTeam3x(sb: StringBuilder, team: Array<Array<NpcStats?>>) {
        sb.append("[")
        for (i in 0 until 3) {
            if (i > 0) sb.append(",")
            sb.append("[")
            for (j in 0 until 3) {
                if (j > 0) sb.append(",")
                val npc = team[i][j]
                if (npc == null) {
                    sb.append("0")
                } else {
                    sb.append("{")
                    sb.append("\"hp\":").append(npc.hp).append(",")
                    sb.append("\"hpMax\":").append(npc.hpMax).append(",")
                    sb.append("\"fury\":").append(npc.fury).append(",")
                    sb.append("\"img\":\"").append(npc.img).append("\",")
                    sb.append("\"img_small\":\"").append(npc.imgSmall).append("\",")
                    sb.append("\"npc_id\":").append(npc.npcId).append(",")
                    sb.append("\"name\":\"").append(npc.name).append("\",")
                    sb.append("\"level\":").append(npc.level)
                    sb.append("}")
                }
            }
            sb.append("]")
        }
        sb.append("]")
    }
}
package com.sg.game.engine

import com.sg.game.data.BattleReplay

/**
 * 战斗对外接口：把战斗结果转成 JSON 给 WebView JS。
 */
object BattleManager {

    /**
     * 触发战斗，返回 JSON 字符串。
     */
    fun fightToJson(formation: String, sysIds: String): String {
        val replay = BattleEngine.runFight(formation, sysIds)
        return replayToJson(replay)
    }

    fun replayToJson(replay: BattleReplay): String {
        val sb = StringBuilder()
        sb.append("{")
        sb.append("\"winner\":\"").append(replay.winner).append("\",")

        sb.append("\"left\":[")
        appendTeam3x(sb, replay.left)
        sb.append("],")

        sb.append("\"right\":[")
        appendTeam3x(sb, replay.right)
        sb.append("],")

        sb.append("\"log\":[")
        for ((i, log) in replay.log.withIndex()) {
            if (i > 0) sb.append(",")
            sb.append("{")
            sb.append("\"turn\":").append(log.turn).append(",")
            sb.append("\"attacker\":").append(log.attacker).append(",")
            sb.append("\"defender\":").append(log.defender).append(",")
            sb.append("\"damage\":").append(log.damage).append(",")
            sb.append("\"crit\":").append(if (log.crit) "true" else "false").append(",")
            sb.append("\"type\":").append(log.type)
            sb.append("}")
        }
        sb.append("]")
        sb.append("}")
        return sb.toString()
    }

    private fun appendTeam3x(sb: StringBuilder, team: Array<Array<com.sg.game.data.NpcStats?>>) {
        sb.append("[")
        for (i in 0 until 3) {
            if (i > 0) sb.append(",")
            sb.append("[")
            for (j in 0 until 3) {
                if (j > 0) sb.append(",")
                val npc = team[i][j]
                if (npc == null) sb.append("null")
                else {
                    sb.append("{")
                    sb.append("\"id\":").append(npc.npcId).append(",")
                    sb.append("\"name\":\"").append(npc.name).append("\",")
                    sb.append("\"hp\":").append(npc.hp).append(",")
                    sb.append("\"hpMax\":").append(npc.hpMax).append(",")
                    sb.append("\"level\":").append(npc.level)
                    sb.append("}")
                }
            }
            sb.append("]")
        }
        sb.append("]")
    }
}
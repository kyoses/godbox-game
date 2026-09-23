package com.sg.game.engine

import com.sg.game.data.BattleReplay
import com.sg.game.data.Formation
import com.sg.game.data.Formula
import com.sg.game.data.NpcStats
import com.sg.game.data.StaticData
import com.sg.game.data.TurnSlot
import kotlin.math.round
import kotlin.random.Random

/**
 * 战斗引擎：纯 Kotlin 翻译自 PHP Fight.class.php。
 *
 * 关键公式（来自 PHP 端分析）：
 * - attNormal：物理/法术伤害公式 + 等级差加成 + 暴击 + 反伤
 * - 回合排序：先手按速度总和决定，所有活参队形按 1,3,5,7 / 2,4,6 排
 * - 目标选择：同列 → 相邻列 → 任意
 */
object BattleEngine {

    /**
     * 战斗主入口。
     * @param formation 玩家阵型字符串 "u1,v1,r1|u2,v2,r2|f1,v1,r1"
     * @param sysIds 系统方阵型
     */
    fun runFight(formation: String, sysIds: String): BattleReplay {
        val left = buildTeam(formation, level = 10)
        val right = buildTeam(sysIds, level = 5)
        return fightInternal(left, right)
    }

    /**
     * 从阵型字符串构造 3x3 NpcStats 数组
     */
    fun buildTeam(formationStr: String, level: Int): Array<Array<NpcStats?>> {
        val team = Array(3) { arrayOfNulls<NpcStats>(3) }
        val form = Formation()
        form.parse(formationStr)
        for (i in 0 until 3) for (j in 0 until 3) for (k in 0 until 3) {
            val npcId = form.getNpcId(i, j, k)
            if (npcId > 0) {
                team[i][j] = buildNpcFromTemplate(npcId, level)
            }
        }
        return team
    }

    private fun buildNpcFromTemplate(npcId: Int, level: Int): NpcStats {
        val tpl = StaticData.getNpcTemplate(npcId)
        val pa = tpl?.optInt("phy_att", 50) ?: 50
        val ma = tpl?.optInt("mag_att", 50) ?: 50
        val pd = tpl?.optInt("phy_def", 30) ?: 30
        val md = tpl?.optInt("mag_def", 30) ?: 30
        val str = tpl?.optInt("strength", 30) ?: 30
        val itl = tpl?.optInt("intelligence", 30) ?: 30
        val spd = tpl?.optInt("speed", 50) ?: 50
        val crt = tpl?.optInt("crit", 30) ?: 30
        val crtd = tpl?.optInt("crit_def", 0) ?: 0
        val cls = tpl?.optInt("class", 1) ?: 1
        val name = tpl?.optString("name", "武将$npcId") ?: "武将$npcId"
        val img = tpl?.optString("img", "") ?: ""
        val imgs = tpl?.optString("img_small", "") ?: ""

        val hpMax = str * 8 + level * 10

        return NpcStats(
            npcId = npcId, name = name,
            type = cls,
            level = level,
            hp = hpMax, hpMax = hpMax,
            phyAtt = pa, magAtt = ma,
            phyDef = pd, magDef = md,
            strength = str, intelligence = itl,
            speed = spd, crit = crt, critDef = crtd,
            hit = 100, miss = 0,
            img = img, imgSmall = imgs,
            npcClass = cls
        )
    }

    /**
     * 战斗主逻辑（私有，被 runFight 调用）
     */
    private fun fightInternal(
        left: Array<Array<NpcStats?>>, right: Array<Array<NpcStats?>>
    ): BattleReplay {
        val replay = BattleReplay(left, right)

        val leftSpeed = formationSpeed(left)
        val rightSpeed = formationSpeed(right)
        val leftFirst = leftSpeed >= rightSpeed

        val order = mutableListOf<TurnSlot>()
        val firstTeam = if (leftFirst) 0 else 1
        val secondTeam = 1 - firstTeam
        val firstDir = if (leftFirst) "left" else "right"
        val secondDir = if (leftFirst) "right" else "left"

        var n = 1
        for (i in 0 until 3) for (j in 0 until 3) {
            val npc = (if (firstTeam == 0) left else right)[i][j] ?: continue
            if (npc.hp <= 0) continue
            order.add(TurnSlot(n, firstTeam, i, j, firstDir, npc))
            n += 2
        }
        n = 2
        for (i in 0 until 3) for (j in 0 until 3) {
            val npc = (if (secondTeam == 0) left else right)[i][j] ?: continue
            if (npc.hp <= 0) continue
            order.add(TurnSlot(n, secondTeam, i, j, secondDir, npc))
            n += 2
        }

        var turn = 0
        for (slot in order) {
            if (slot.npc.hp <= 0) continue
            val enemies = if (slot.team == 0) right else left
            if (allDead(enemies)) break
            val target = aim(slot.col, slot.team == 0, left, right)
            if (target != null) {
                val damageBefore = target.hp
                attNormal(slot.npc, target)
                val dealt = damageBefore - target.hp
                replay.log.add(
                    BattleReplay.LogEntry(
                        turn = turn,
                        attacker = slot.npc.npcId,
                        defender = target.npcId,
                        damage = dealt,
                        crit = false,
                        type = slot.npc.type
                    )
                )
            }
            turn++
        }

        replay.winner = when {
            allDead(right) -> "left"
            allDead(left) -> "right"
            else -> "draw"
        }
        return replay
    }

    private fun formationSpeed(team: Array<Array<NpcStats?>>): Int {
        var sum = 0
        for (i in 0 until 3) for (j in 0 until 3) {
            val npc = team[i][j] ?: continue
            if (npc.hp > 0) sum += npc.speed
        }
        return sum
    }

    private fun allDead(team: Array<Array<NpcStats?>>): Boolean {
        for (i in 0 until 3) for (j in 0 until 3) {
            val npc = team[i][j]
            if (npc != null && npc.hp > 0) return false
        }
        return true
    }

    /**
     * 目标选择：
     * 1) 同列敌人
     * 2) 相邻列敌人
     * 3) 任意活着的敌人
     */
    private fun aim(
        col: Int,
        isLeftTeam: Boolean,
        left: Array<Array<NpcStats?>>,
        right: Array<Array<NpcStats?>>
    ): NpcStats? {
        val enemies = if (isLeftTeam) right else left
        for (i in 0 until 3) {
            val npc = enemies[i][col]
            if (npc != null && npc.hp > 0) return npc
        }
        for (dc in intArrayOf(-1, 1)) {
            val c = col + dc
            if (c in 0..2) {
                for (i in 0 until 3) {
                    val npc = enemies[i][c]
                    if (npc != null && npc.hp > 0) return npc
                }
            }
        }
        for (i in 0 until 3) for (j in 0 until 3) {
            val npc = enemies[i][j]
            if (npc != null && npc.hp > 0) return npc
        }
        return null
    }

    /**
     * 普通攻击（含暴击、反伤、等级差加成）
     */
    fun attNormal(attacker: NpcStats, defender: NpcStats) {
        var damage = 0

        if (attacker.type == 1) {
            val base = attacker.phyAtt - defender.phyDef * 0.75
            val ratio = if (attacker.strength + defender.strength > 0) {
                1.0 + (attacker.strength - defender.strength).toDouble() /
                    (attacker.strength + defender.strength).toDouble()
            } else 1.0
            damage = (base * ratio).toInt()
        } else {
            val base = attacker.magAtt - defender.magDef * 0.75
            val ratio = if (attacker.intelligence + defender.intelligence > 0) {
                1.0 + (attacker.intelligence - defender.intelligence).toDouble() /
                    (attacker.intelligence + defender.intelligence).toDouble()
            } else 1.0
            damage = (base * ratio).toInt()
        }

        if (damage < 0) damage = 0
        damage += attacker.level / 10 + 1

        val levelDiff = (40 - (attacker.level - defender.level)) / 40.0
        val levelDamage = round(levelDiff * attacker.level * Random.nextInt(0, 6))
        damage += levelDamage.toInt()

        val critPer = attacker.crit - defender.critDef + (attacker.level - defender.level) * 10
        if (critPer > 0 && Random.nextInt(1, 1001) <= critPer) {
            damage *= 2
        }

        if (damage > defender.hp) damage = defender.hp
        defender.hp -= damage

        if (defender.buff2 > 0 && defender.buff2K.isNotBlank()) {
            val reflect = Formula.evalInt(defender.buff2K, mapOf("damage" to damage))
            attacker.hp -= reflect
            if (attacker.hp < 0) attacker.hp = 0
        }
    }
}
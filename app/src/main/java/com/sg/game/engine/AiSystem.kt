package com.sg.game.engine

import com.sg.game.data.StaticData
import com.sg.game.data.BattleReplay
import kotlin.random.Random

object AiSystem {

    private val aiTemplates = listOf(
        "黄巾力士", "黄巾贼", "山贼甲",
        "吕布", "华雄", "董卓"
    )

    private var lastTriggerTurn: Int = -1

    fun maybeTriggerAttack(state: com.threekingdoms.emperor.data.GameState): AttackInfo? {
        if (state.turnCount - lastTriggerTurn < 3) return null
        val playerNpcs = NpcManager.listForPlayer(state)
            .filter { (it["position"] as? Long)?.toInt() ?: -1 in 0..8 }
        if (playerNpcs.isEmpty()) return null
        if (Random.nextFloat() > 0.30f) return null
        lastTriggerTurn = state.turnCount

        val templateName = aiTemplates.random()
        val aiCount = 1 + Random.nextInt(2)
        val aiFormation = generateAiFormation(aiCount, templateName)
        return AttackInfo(
            templateName = templateName,
            aiFormation = aiFormation,
            aiCount = aiCount
        )
    }

    fun doBattle(
        state: com.threekingdoms.emperor.data.GameState,
        info: AttackInfo
    ): BattleReplay {
        val sysFormation = info.aiFormation
        val left = BattleEngine.buildTeam(currentFormation(state), level = 10)
        val right = BattleEngine.buildTeam(sysFormation, level = 8)
        return BattleEngine.runFight(currentFormation(state), sysFormation)
    }

    fun applyResult(
        ctx: android.content.Context,
        state: com.threekingdoms.emperor.data.GameState,
        info: AttackInfo,
        replay: BattleReplay
    ): AiResult {
        val won = replay.winner == "left"
        return if (won) {
            val goldBonus = 100 + (info.aiCount * 50)
            UserManager.addGold(ctx, goldBonus)
            if (Random.nextFloat() < 0.5f) {
                val pool = StaticData.allEquipTemplates
                if (pool.isNotEmpty()) {
                    val eq = pool.random()
                    EquipManager.addEquip(ctx, eq.id)
                    AiResult(true, goldBonus, eq.name, 0)
                } else {
                    AiResult(true, goldBonus, "", 0)
                }
            } else {
                AiResult(true, goldBonus, "", 0)
            }
        } else {
            val goldLoss = 100 + Random.nextInt(400)
            UserManager.addGold(ctx, -goldLoss)
            val lostEquip = if (Random.nextFloat() < 0.5f) {
                val equipList = EquipManager.listForPlayer(ctx)
                if (equipList.isNotEmpty()) {
                    val target = equipList.random()
                    val dbId = (target["db_id"] as? Long) ?: -1L
                    if (dbId > 0) {
                        val db = DatabaseHelper.get(ctx).writableDatabase
                        db.execSQL("DELETE FROM c_equip WHERE id=?", arrayOf(dbId))
                    }
                    target["equip_id"]?.toString() ?: "装备"
                } else null
            } else null
            AiResult(false, -goldLoss, lostEquip ?: "", 1)
        }
    }

    private fun currentFormation(state: com.threekingdoms.emperor.data.GameState): String {
        val npcs = NpcManager.listForPlayer(state)
            .filter { (it["position"] as? Long)?.toInt() ?: -1 in 0..8 }
        if (npcs.isEmpty()) return "2 0 0|0 0 0|0 0 0"
        val firstId = npcs.first()["npc_id"] ?: 2
        return "$firstId 0 0|0 0 0|0 0 0"
    }

    private fun generateAiFormation(count: Int, templateName: String): String {
        val template = StaticData.allNpcTemplates.firstOrNull { it.name == templateName }
        val baseId = template?.id ?: 1
        return when (count) {
            1 -> "$baseId 0 0|0 0 0|0 0 0"
            2 -> "$baseId 0 0|0 ${baseId + 1} 0|0 0 0"
            else -> "$baseId 0 0|0 ${baseId + 1} 0|0 ${baseId + 2} 0"
        }
    }

    data class AttackInfo(
        val templateName: String,
        val aiFormation: String,
        val aiCount: Int
    )

    data class AiResult(
        val won: Boolean,
        val goldChange: Int,
        val itemName: String,
        val troopsLost: Int
    )
}

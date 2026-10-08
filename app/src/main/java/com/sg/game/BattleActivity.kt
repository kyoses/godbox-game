package com.sg.game

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.NpcStats
import com.sg.game.data.StaticData
import com.sg.game.engine.BattleEngine
import com.sg.game.engine.BattleManager
import com.sg.game.ui.BattleFormationView

/**
 * 原生战斗 Activity：
 * - 玩家阵型（取自 c_npc.position）
 * - 敌方阵型（硬编码 5 个关卡）
 * - 点击"开始战斗"调用 BattleEngine
 * - 显示战报日志
 */
class BattleActivity : AppCompatActivity() {

    private lateinit var battleView: BattleFormationView
    private lateinit var tvLog: TextView

    // 关卡：敌方阵型（5 个）
    private val stages = arrayOf(
        "1 0 0|0 0 0|0 0 0" to "第一章·黄巾之乱",
        "2 0 0|0 3 0|0 0 0" to "第二章·怒鞭督邮",
        "3 0 0|0 0 0|0 2 4" to "第三章·三英战吕布",
        "5 0 0|0 3 0|0 0 4" to "第四章·连营之计",
        "5 0 0|0 4 0|0 0 4" to "第五章·三顾茅庐"
    )

    private var currentStage = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_battle)

        StaticData.ensureLoaded(this)

        battleView = findViewById(R.id.battleView)
        tvLog = findViewById(R.id.tvLog)

        findViewById<TextView>(R.id.tvTitle).text = stages[currentStage].second
        loadStage(currentStage)

        findViewById<Button>(R.id.btnStart).setOnClickListener { startBattle() }
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }
    }

    private fun loadStage(stage: Int) {
        val (sysIds, title) = stages[stage]
        val left = BattleEngine.buildTeam("2 0 0|0 0 0|0 0 0", level = 10)  // 玩家关羽
        val right = BattleEngine.buildTeam(sysIds, level = 5)
        battleView.refresh(left, right)
        tvLog.text = "$title\n准备就绪"
    }

    private fun startBattle() {
        val (sysIds, title) = stages[currentStage]
        val left = BattleEngine.buildTeam("2 0 0|0 0 0|0 0 0", level = 10)
        val right = BattleEngine.buildTeam(sysIds, level = 5)

        // 重新 build（每次攻击血量会变）
        val raw = BattleManager.fightToJson("2 0 0|0 0 0|0 0 0", sysIds)
        val sb = StringBuilder()
        sb.appendLine("=== $title ===")

        // 简单解析 log
        val logPattern = "\"log\":\\[(.*?)\\]".toRegex()
        val match = logPattern.find(raw)
        if (match != null) {
            val entries = match.groupValues[1].split("},").take(10)
            for (e in entries) {
                val t = "\"turn\":(\\d+)".toRegex().find(e)?.groupValues?.get(1) ?: "?"
                val a = "\"attacker\":(\\d+)".toRegex().find(e)?.groupValues?.get(1) ?: "?"
                val d = "\"defender\":(\\d+)".toRegex().find(e)?.groupValues?.get(1) ?: "?"
                val dmg = "\"damage\":(\\d+)".toRegex().find(e)?.groupValues?.get(1) ?: "0"
                sb.appendLine("第${t}合: 攻${a} → 防${d} (伤害$dmg)")
            }
        }

        val winner = "\"winner\":\"(left|right|draw)\"".toRegex().find(raw)?.groupValues?.get(1) ?: "?"
        sb.appendLine()
        sb.appendLine(">>> $title 结束: $winner 胜 <<<")

        tvLog.text = sb.toString()
        battleView.refresh(left, right)

        if (winner == "left") {
            currentStage = minOf(currentStage + 1, stages.size - 1)
            findViewById<TextView>(R.id.tvTitle).text = stages[currentStage].second
            Toast.makeText(this, "胜利！进入${stages[currentStage].second}", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "失败，请调整阵容再战", Toast.LENGTH_SHORT).show()
        }
    }
}
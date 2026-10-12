package com.sg.game

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.NpcStats
import com.sg.game.data.StaticData
import com.sg.game.engine.BattleEngine
import com.sg.game.engine.BattleManager
import com.sg.game.ui.BattleFormationView

/**
 * 原生战斗 Activity：
 * - 玩家阵型（取自 c_npc.position）
 * - 敌方阵型（13 关卡从 StaticData 读）
 * - 战报按回合延迟展示（模拟原版战斗动画）
 */
class BattleActivity : AppCompatActivity() {

    private lateinit var battleView: BattleFormationView
    private lateinit var tvLog: TextView
    private lateinit var btnStart: Button

    // 关卡：从 StaticData.allBattleTemplates 读取
    private val stages: List<Pair<String, String>> by lazy {
        StaticData.allBattleTemplates.sortedBy { it.dispOrder }
            .map { it.sysFormation to it.name }
    }

    private var currentStage = 0
    private var inBattle = false
    private val handler = Handler(Looper.getMainLooper())
    private val battleMessages = mutableListOf<String>()
    private val PLAYER_FORMATION = "2 0 0|0 0 0|0 0 0"  // 默认 关羽在中军

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_battle)

        StaticData.ensureLoaded(this)

        battleView = findViewById(R.id.battleView)
        tvLog = findViewById(R.id.tvLog)
        btnStart = findViewById(R.id.btnStart)

        findViewById<TextView>(R.id.tvTitle).text = "选择关卡"
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }
        btnStart.setOnClickListener { showStagePicker() }

        loadStage(currentStage)
    }

    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        super.onDestroy()
    }

    private fun loadStage(stage: Int) {
        val (sysIds, title) = stages[stage]
        findViewById<TextView>(R.id.tvTitle).text = title
        val left = BattleEngine.buildTeam(PLAYER_FORMATION, level = 10)
        val right = BattleEngine.buildTeam(sysIds, level = 5)
        battleView.refresh(left, right)
        tvLog.text = "$title\n点击'开始战斗'"
        inBattle = false
        btnStart.isEnabled = true
    }

    private fun showStagePicker() {
        if (inBattle) return
        val items = stages.mapIndexed { i, pair -> "${i + 1}. ${pair.second}" }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle("选择关卡")
            .setItems(items) { _, which ->
                currentStage = which
                loadStage(currentStage)
            }
            .setNegativeButton("取消", null)
            .show()
    }

    private fun startBattle() {
        if (inBattle) return
        inBattle = true
        btnStart.isEnabled = false
        battleMessages.clear()

        val (sysIds, title) = stages[currentStage]
        val left = BattleEngine.buildTeam(PLAYER_FORMATION, level = 10)
        val right = BattleEngine.buildTeam(sysIds, level = 5)
        val raw = BattleManager.fightToJson(PLAYER_FORMATION, sysIds)
        val replay = org.json.JSONObject(raw)

        // 准备战报
        val winner = replay.optString("winner")
        val leftArr = replay.optJSONArray("left")
        val rightArr = replay.optJSONArray("right")
        val log = replay.optJSONArray("log")

        battleMessages.add("⚔ $title 开战！")
        battleMessages.add("我方 ${leftArr?.length() ?: 0} 名武将 vs 敌方 ${rightArr?.length() ?: 0} 名武将")
        battleMessages.add("")

        if (log != null) {
            for (i in 0 until log.length()) {
                val e = log.getJSONObject(i)
                val turn = e.optInt("turn", i + 1)
                val a = e.optInt("attacker")
                val d = e.optInt("defender")
                val dmg = e.optInt("damage", 0)
                val attackerName = lookupName(a)
                val defenderName = lookupName(d)
                battleMessages.add("第${turn + 1}合  $attackerName 攻击 $defenderName  伤害 $dmg")
            }
        }
        battleMessages.add("")
        battleMessages.add(if (winner == "left") "🏆 我方胜利！" else if (winner == "right") "💀 我方失败…" else "⚖ 平局")
        battleMessages.add("")

        // 启动动画
        showMessagesSlowly(0)
    }

    private fun lookupName(id: Int): String {
        val arr = StaticData.allNpcTemplates
        return arr.firstOrNull { it.id == id }?.name ?: "武将#$id"
    }

    private fun showMessagesSlowly(index: Int) {
        if (index >= battleMessages.size) {
            inBattle = false
            btnStart.isEnabled = true
            // 胜利后弹下一关选项
            handler.postDelayed({ showPostBattleDialog() }, 500)
            return
        }
        // 累积显示
        val sb = StringBuilder()
        for (i in 0..index) {
            sb.appendLine(battleMessages[i])
        }
        tvLog.text = sb.toString()
        handler.postDelayed({ showMessagesSlowly(index + 1) }, 500)
    }

    private fun showPostBattleDialog() {
        val (sysIds, title) = stages[currentStage]
        val raw = BattleManager.fightToJson(PLAYER_FORMATION, sysIds)
        val replay = org.json.JSONObject(raw)
        val won = replay.optString("winner") == "left"
        val next = currentStage + 1
        val hasNext = next < stages.size
        val options = mutableListOf<String>()
        if (won) options.add("下一关")
        options.add("重打本关")
        options.add("返回选关")
        AlertDialog.Builder(this)
            .setTitle(if (won) "胜利！" else "失败")
            .setItems(options.toTypedArray()) { _, which ->
                when {
                    won && options[which] == "下一关" && hasNext -> {
                        currentStage = next
                        loadStage(currentStage)
                    }
                    options[which] == "重打本关" -> {
                        loadStage(currentStage)
                    }
                    options[which] == "返回选关" -> {
                        showStagePicker()
                    }
                }
            }
            .setNegativeButton("取消", null)
            .show()
    }
}

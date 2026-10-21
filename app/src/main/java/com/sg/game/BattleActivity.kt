package com.sg.game

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.BattleEngine
import com.sg.game.engine.DatabaseHelper
import com.sg.game.engine.EquipManager
import com.sg.game.engine.NpcManager
import com.sg.game.engine.UserManager
import com.sg.game.ui.BattleFormationView

class BattleActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_STAGE_INDEX = "stage_index"
        const val EXTRA_SYS_IDS = "sys_ids"
        const val EXTRA_STAGE_NAME = "stage_name"
    }

    private lateinit var battleView: BattleFormationView
    private lateinit var tvLog: TextView
    private lateinit var btnStart: Button
    private var currentStage: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_battle)

        StaticData.ensureLoaded(this)

        battleView = findViewById(R.id.battleView)
        tvLog = findViewById(R.id.tvLog)
        btnStart = findViewById(R.id.btnStart)

        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }
        btnStart.setOnClickListener { showStagePicker() }

        val idx = intent.getIntExtra(EXTRA_STAGE_INDEX, -1)
        val sysIds = intent.getStringExtra(EXTRA_SYS_IDS)
        val name = intent.getStringExtra(EXTRA_STAGE_NAME)
        if (idx >= 0 && sysIds != null) {
            currentStage = idx
            findViewById<TextView>(R.id.tvTitle).text = name ?: "Stage ${idx + 1}"
            btnStart.text = "Back"
            btnStart.setOnClickListener { finish() }
            doBattle(sysIds)
        } else {
            findViewById<TextView>(R.id.tvTitle).text = "Choose Stage"
            btnStart.text = "Choose"
            loadStage(0)
        }
    }

    private fun getPlayerFormation(): String {
        val npcs = NpcManager.listForPlayer(this)
            .filter { (it["position"] as? Int)?.toInt() ?: -1 in 0..8 }
        if (npcs.isEmpty()) return "2 0 0|0 0 0|0 0 0"
        val sb = StringBuilder()
        for (i in 0..2) for (j in 0..2) {
            val pos = i * 3 + j
            val npc = npcs.firstOrNull { (it["position"] as? Int)?.toInt() == pos }
            if (i > 0 || j > 0) sb.append(if (j == 0) "|" else ",")
            sb.append(npc?.get("npc_id") ?: 0)
        }
        return sb.toString()
    }

    private fun loadStage(stage: Int) {
        val stages = StaticData.allBattleTemplates.sortedBy { it.dispOrder }
        if (stage < 0 || stage >= stages.size) return
        val tpl = stages[stage]
        currentStage = stage
        findViewById<TextView>(R.id.tvTitle).text = tpl.name
        val left = BattleEngine.buildTeam(getPlayerFormation(), level = 10)
        val right = BattleEngine.buildTeam(tpl.sysFormation, level = 5)
        battleView.refresh(left, right)
        tvLog.text = "${tpl.name}\nClick 'Choose' to pick stage or 'Back' to return"
    }

    private fun showStagePicker() {
        val items = StaticData.allBattleTemplates.sortedBy { it.dispOrder }
            .mapIndexed { i, t -> "${i + 1}. ${t.name}" }
            .toTypedArray()
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Choose Stage")
            .setItems(items) { _, which ->
                currentStage = which
                loadStage(currentStage)
            }
            .setNegativeButton("Back", null)
            .show()
    }

    private fun doBattle(sysIds: String) {
        val left = BattleEngine.buildTeam(getPlayerFormation(), level = 10)
        val right = BattleEngine.buildTeam(sysIds, level = 5)
        battleView.refresh(left, right)
        val result = BattleEngine.runFight(getPlayerFormation(), sysIds)

        val sb = StringBuilder()
        sb.append("=== Battle Log ===\n")
        for (e in result.log) {
            sb.append("R").append(e.turn + 1).append(": ")
            sb.append(e.attacker).append(" -> ").append(e.defender)
            sb.append(" dmg=").append(e.damage).append("\n")
        }
        sb.append("\nWinner: ").append(result.winner)
        tvLog.text = sb.toString()

        if (result.winner == "left") {
            val gold = 100 + (currentStage + 1) * 50
            UserManager.addGold(this, gold)
            UserManager.addExp(this, 20)
            Toast.makeText(this, "Victory! +$gold gold", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Defeat", Toast.LENGTH_SHORT).show()
        }
    }
}

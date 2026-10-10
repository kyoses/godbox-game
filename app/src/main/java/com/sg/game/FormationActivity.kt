package com.sg.game

import android.app.AlertDialog
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.DatabaseHelper
import com.sg.game.engine.NpcManager

/**
 * 阵型调整界面
 *
 * - 上方：FormationView 画 3x3 阵位
 * - 下方：ListView 列出已招募武将（点 = 上阵或下阵）
 * - 按钮：清空阵型 / 自动排列
 */
class FormationActivity : AppCompatActivity() {

    private lateinit var formationView: com.sg.game.ui.FormationView
    private lateinit var lvNpcs: ListView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_formation)

        StaticData.ensureLoaded(this)
        DatabaseHelper.get(this)

        formationView = findViewById(R.id.formationView)
        lvNpcs = findViewById(R.id.lvNpcs)

        findViewById<Button>(R.id.btnClearFormation).setOnClickListener { clearFormation() }
        findViewById<Button>(R.id.btnAutoFormation).setOnClickListener { autoFormation() }
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }

        formationView.setOnCellClick { pos ->
            // 阵位点击：弹出已上阵武将，撤销
            toggleAtPosition(pos)
        }

        refresh()
    }

    private fun refresh() {
        val npcs = NpcManager.listForPlayer(this)
        val items = npcs.map { entry ->
            val npcId = (entry["npc_id"] as Long).toInt()
            val pos = (entry["position"] as Long).toInt()
            val mark = if (pos >= 0) "[阵$pos]" else "[待命]"
            val name = (entry["name"] as? String) ?: "武将$npcId"
            val level = (entry["level"] as Long).toInt()
            "$mark $name Lv.$level"
        }
        lvNpcs.adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, items)
        lvNpcs.setOnItemClickListener { _, _, adapterPos, _ ->
            val npcs2 = NpcManager.listForPlayer(this)
            if (adapterPos < npcs2.size) {
                onNpcClicked(npcs2[adapterPos])
            }
        }
        formationView.invalidate()
    }

    private fun onNpcClicked(entry: Map<String, Any>) {
        val npcId = (entry["npc_id"] as Long).toInt()
        val currentPos = (entry["position"] as Long).toInt()
        if (currentPos >= 0) {
            // 已上阵 → 撤下
            NpcManager.removeFromFormation(this, npcId)
            Toast.makeText(this, "下阵", Toast.LENGTH_SHORT).show()
        } else {
            // 待命 → 找空位上阵
            val empty = findEmptyPosition()
            if (empty < 0) {
                Toast.makeText(this, "阵位已满", Toast.LENGTH_SHORT).show()
            } else {
                NpcManager.setPosition(this, npcId, empty)
                Toast.makeText(this, "${entry["name"]} 上阵至 $empty", Toast.LENGTH_SHORT).show()
            }
        }
        refresh()
    }

    private fun findEmptyPosition(): Int {
        val npcs = NpcManager.listForPlayer(this)
        val occupied = npcs.mapNotNull { (it["position"] as? Long)?.toInt() }.toSet()
        for (i in 0..8) if (i !in occupied) return i
        return -1
    }

    private fun toggleAtPosition(pos: Int) {
        val npcs = NpcManager.listForPlayer(this)
        val target = npcs.firstOrNull { (it["position"] as? Long)?.toInt() == pos }
        if (target != null) {
            val npcId = (target["npc_id"] as Long).toInt()
            NpcManager.removeFromFormation(this, npcId)
            Toast.makeText(this, "$pos 位武将下阵", Toast.LENGTH_SHORT).show()
            refresh()
        }
    }

    private fun clearFormation() {
        AlertDialog.Builder(this)
            .setTitle("清空阵型")
            .setMessage("所有武将下阵？")
            .setPositiveButton("清空") { _, _ ->
                val npcs = NpcManager.listForPlayer(this)
                for (entry in npcs) {
                    val npcId = (entry["npc_id"] as Long).toInt()
                    NpcManager.removeFromFormation(this, npcId)
                }
                refresh()
            }
            .setNegativeButton("取消", null)
            .show()
    }

    private fun autoFormation() {
        val npcs = NpcManager.listForPlayer(this)
            .sortedByDescending { it["power"] as? Long ?: 0L }
        var pos = 0
        for (entry in npcs) {
            if (pos > 8) break
            val npcId = (entry["npc_id"] as Long).toInt()
            NpcManager.setPosition(this, npcId, pos)
            pos++
        }
        refresh()
    }
}
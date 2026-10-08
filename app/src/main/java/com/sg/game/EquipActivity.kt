package com.sg.game

import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.engine.EquipManager
import com.sg.game.engine.NpcManager
import com.sg.game.engine.Qianghua
import com.sg.game.engine.StaticData
import com.sg.game.engine.TaskManager

/**
 * 装备 + 强化界面
 */
class EquipActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple_list)

        StaticData.ensureLoaded(this)

        findViewById<TextView>(R.id.tvTitle).text = "装备管理"
        findViewById<Button>(R.id.btnAdd).text = "+ 获得新装备"
        findViewById<Button>(R.id.btnAdd).setOnClickListener { addEquip() }
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }

        refresh()
    }

    private fun refresh() {
        val list = EquipManager.listForPlayer(this)
        val items = list.map { entry ->
            val id = entry["equip_id"] as Long
            val lv = entry["up_level"] as Long
            val name = (StaticData.getEquipTemplate(id.toInt())?.optString("name", "装备$id")) ?: "装备$id"
            "$name (强化 +$lv)"
        }.ifEmpty { listOf("（空）") }
        findViewById<android.widget.ListView>(R.id.lvList).adapter =
            ArrayAdapter(this, android.R.layout.simple_list_item_1, items)
        findViewById<android.widget.ListView>(R.id.lvList).setOnItemClickListener { _, _, pos, _ ->
            if (list.isNotEmpty() && pos < list.size) {
                showUpgradeDialog(list[pos], pos + 1)
            }
        }
    }

    private fun addEquip() {
        val randomId = (1..6).random()
        EquipManager.addEquip(this, randomId)
        val name = StaticData.getEquipTemplate(randomId)?.optString("name", "装备$randomId") ?: "装备$randomId"
        Toast.makeText(this, "获得 $name", Toast.LENGTH_SHORT).show()
        refresh()
    }

    private fun showUpgradeDialog(entry: Map<String, Any>, dbId: Long) {
        val equipId = (entry["equip_id"] as Long).toInt()
        val curLv = (entry["up_level"] as Long).toInt()
        val type = StaticData.getEquipTemplate(equipId)?.optInt("type", 1) ?: 1
        val cost = Qianghua.calculateCost(curLv, type)
        AlertDialog.Builder(this)
            .setTitle("强化装备")
            .setMessage("当前等级: $curLv\n下一级需要: $cost 金")
            .setPositiveButton("强化") { _, _ ->
                val ok = EquipManager.upgrade(this, dbId, type, 10000)
                if (ok) {
                    Toast.makeText(this, "强化成功！LV${curLv + 1}", Toast.LENGTH_SHORT).show()
                    refresh()
                } else {
                    Toast.makeText(this, "金币不足", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("取消", null)
            .show()
    }
}
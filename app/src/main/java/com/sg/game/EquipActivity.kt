package com.sg.game

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.EquipManager
import com.sg.game.engine.NpcManager
import com.sg.game.engine.Qianghua

/**
 * 装备 + 强化 + 穿戴界面
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
            val id = entry["equip_id"] as Int
            val lv = entry["up_level"] as Int
            val status = (entry["status"] as? Int) ?: 0
            val name = (StaticData.getEquipTemplate(id)?.optString("name", "装备$id")) ?: "装备$id"
            val mark = if (status == 1) "🟢" else "⚪"
            "$mark $name (强化 +$lv)"
        }.ifEmpty { listOf("（空）") }
        findViewById<android.widget.ListView>(R.id.lvList).adapter =
            ArrayAdapter(this, android.R.layout.simple_list_item_1, items)
        findViewById<android.widget.ListView>(R.id.lvList).setOnItemClickListener { _, _, pos, _ ->
            if (list.isNotEmpty() && pos < list.size) {
                val entry = list[pos]
                val dbId = (entry["db_id"] as? Int)?.toLong() ?: (pos + 1).toLong()
                showActionDialog(entry, dbId)
            }
        }
    }

    private fun addEquip() {
        val pool = StaticData.allEquipTemplates
        if (pool.isEmpty()) return
        val randomId = pool.random().id
        EquipManager.addEquip(this, randomId)
        val name = StaticData.getEquipTemplate(randomId)?.optString("name", "装备$randomId") ?: "装备$randomId"
        Toast.makeText(this, "获得 $name", Toast.LENGTH_SHORT).show()
        refresh()
    }

    private fun showActionDialog(entry: Map<String, Any>, dbId: Long) {
        val equipId = entry["equip_id"] as Int
        val status = (entry["status"] as? Int) ?: 0
        val options = if (status == 1) {
            arrayOf("强化", "卸下", "取消")
        } else {
            arrayOf("强化", "穿戴", "取消")
        }
        AlertDialog.Builder(this)
            .setTitle("装备操作")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> showUpgradeDialog(entry, dbId)
                    1 -> if (status == 1) {
                        EquipManager.unequip(this, dbId)
                        Toast.makeText(this, "已卸下", Toast.LENGTH_SHORT).show()
                        refresh()
                    } else {
                        showEquipDialog(entry, dbId)
                    }
                }
            }
            .show()
    }

    private fun showUpgradeDialog(entry: Map<String, Any>, dbId: Long) {
        val equipId = entry["equip_id"] as Int
        val curLv = entry["up_level"] as Int
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

    /**
     * 穿戴：先选位置（1-武器/2-甲/3-盔/4-鞋），再选武将
     */
    private fun showEquipDialog(entry: Map<String, Any>, dbId: Long) {
        val equipId = entry["equip_id"] as Int
        val equipType = StaticData.getEquipTemplate(equipId)?.optInt("type", 1) ?: 1
        if (equipType < 1 || equipType > 4) {
            Toast.makeText(this, "此部位暂不支持穿戴", Toast.LENGTH_SHORT).show()
            return
        }
        val positions = arrayOf("武器位 (1)", "甲位 (2)", "盔位 (3)", "鞋位 (4)")
        AlertDialog.Builder(this)
            .setTitle("装备到哪个位置？")
            .setItems(positions) { _, p ->
                showNpcPicker(entry, dbId, p + 1)
            }
            .setNegativeButton("取消", null)
            .show()
    }

    private fun showNpcPicker(entry: Map<String, Any>, equipDbId: Long, position: Int) {
        val npcs = NpcManager.listForPlayer(this)
            .filter { (it["position"] as? Long)?.toInt() ?: -1 in 0..8 }  // 只在阵位上的
        if (npcs.isEmpty()) {
            Toast.makeText(this, "请先把武将上阵", Toast.LENGTH_SHORT).show()
            return
        }
        val names = npcs.map { entry ->
            "${entry["name"]} (db:${entry["db_id"]})"
        }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle("给哪个武将装备？")
            .setItems(names) { _, which ->
                val npcEntry = npcs[which]
                val npcDbId = (npcEntry["db_id"] as Long)
                EquipManager.equip(this, equipDbId, npcDbId, position)
                Toast.makeText(this,
                    "已装备到 ${npcEntry["name"]} 位置$position",
                    Toast.LENGTH_SHORT).show()
                refresh()
            }
            .setNegativeButton("取消", null)
            .show()
    }
}
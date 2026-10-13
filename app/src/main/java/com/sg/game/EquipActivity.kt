package com.sg.game

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.Button
import android.widget.ImageView
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.DatabaseHelper
import com.sg.game.engine.EquipManager
import com.sg.game.engine.NpcManager
import com.sg.game.engine.Qianghua
import com.sg.game.render.ImageLoader

class EquipActivity : AppCompatActivity() {

    private lateinit var lv: ListView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple_list)

        StaticData.ensureLoaded(this)

        findViewById<TextView>(R.id.tvTitle).text = "装备"
        findViewById<Button>(R.id.btnAdd).text = "+ 获得新装备"
        findViewById<Button>(R.id.btnAdd).setOnClickListener { addEquip() }
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }

        lv = findViewById(R.id.lvList)
        refresh()
    }

    private fun refresh() {
        val list = EquipManager.listForPlayer(this)
        lv.adapter = EquipAdapter(this, list)
    }

    private fun addEquip() {
        val pool = StaticData.allEquipTemplates
        if (pool.isEmpty()) return
        val randomId = pool.random().id
        EquipManager.addEquip(this, randomId)
        val name = pool.first { it.id == randomId }.name
        Toast.makeText(this, "获得 $name", Toast.LENGTH_SHORT).show()
        refresh()
    }

    fun callShowUpgradeDialog(equipDbId: Long) {
        val db = DatabaseHelper.get(this).readableDatabase
        val c = db.rawQuery("SELECT equip_id, up_level FROM c_equip WHERE id=?",
            arrayOf(equipDbId.toString()))
        if (!c.moveToFirst()) return
        val equipId = c.getInt(0)
        val curLv = c.getInt(1)
        c.close()
        val type = StaticData.getEquipTemplate(equipId)?.optInt("type", 1) ?: 1
        val cost = Qianghua.calculateCost(curLv, type)
        AlertDialog.Builder(this)
            .setTitle("强化装备")
            .setMessage("当前等级: +$curLv\n下一级需要: $cost 金")
            .setPositiveButton("强化") { _, _ ->
                val ok = EquipManager.upgrade(this, equipDbId, type, 100000)
                if (ok) {
                    Toast.makeText(this, "强化成功！LV${curLv + 1}", Toast.LENGTH_SHORT).show()
                    recreate()
                } else {
                    Toast.makeText(this, "金币不足", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("取消", null)
            .show()
    }

    fun callShowEquipDialog(equipDbId: Long) {
        val equipId = getEquipId(equipDbId) ?: return
        val equipType = StaticData.getEquipTemplate(equipId)?.optInt("type", 1) ?: 1
        if (equipType !in 1..4) {
            Toast.makeText(this, "此部位暂支持穿戴", Toast.LENGTH_SHORT).show()
            return
        }
        val positions = arrayOf("武器位 (1)", "甲位 (2)", "盔位 (3)", "鞋位 (4)")
        AlertDialog.Builder(this)
            .setTitle("装备到哪个位置？")
            .setItems(positions) { _, p ->
                showNpcPicker(equipDbId, p + 1)
            }
            .setNegativeButton("取消", null)
            .show()
    }

    private fun showNpcPicker(equipDbId: Long, position: Int) {
        val npcs = NpcManager.listForPlayer(this)
            .filter { (it["position"] as? Long)?.toInt() ?: -1 in 0..8 }
        if (npcs.isEmpty()) {
            Toast.makeText(this, "请先把武将上阵", Toast.LENGTH_SHORT).show()
            return
        }
        val names = npcs.map { "${it["name"]} (#${it["db_id"]})" }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle("给哪个武将装备？")
            .setItems(names) { _, which ->
                val npcDbId = (npcs[which]["db_id"] as Long)
                EquipManager.equip(this, equipDbId, npcDbId, position)
                Toast.makeText(this,
                    "已装备到 ${npcs[which]["name"]} 位置$position",
                    Toast.LENGTH_SHORT).show()
                recreate()
            }
            .setNegativeButton("取消", null)
            .show()
    }

    fun callShowDetailDialog(equipDbId: Long, equipId: Int) {
        val db = DatabaseHelper.get(this).readableDatabase
        val c = db.rawQuery("SELECT * FROM c_equip WHERE id=?",
            arrayOf(equipDbId.toString()))
        if (!c.moveToFirst()) return
        val upLv = c.getInt(c.getColumnIndexOrThrow("up_level"))
        c.close()
        val tpl = StaticData.getEquipTemplate(equipId) ?: return
        val type = tpl.optInt("type", 1)
        val typeName = when (type) {
            1 -> "武器"; 2 -> "甲"; 3 -> "盔"; 4 -> "鞋"; else -> "其他"
        }
        val upgradeMul = 1 + upLv * 0.1
        val strength = tpl.optInt("strength", 0)
        val msg = "名称: " + tpl.optString("name") + "\n类型: " + typeName +
            "\n强化: +" + upLv + "\n\n基础属性:\n" +
            "  武力 +" + (strength * strength / 10) + "\n" +
            "  智谋 +" + tpl.optInt("intelligence") + "\n" +
            "  物攻 +" + tpl.optInt("phyAtt") + "\n" +
            "  法攻 +" + tpl.optInt("magAtt") + "\n" +
            "  物防 +" + tpl.optInt("phyDef") + "\n" +
            "  法防 +" + tpl.optInt("magDef") + "\n" +
            "  速度 +" + tpl.optInt("speed") + "\n" +
            "  暴击 +" + tpl.optInt("crit") + "\n\n强化加成 x" +
            String.format("%.1f", upgradeMul) +
            "\n需等级: " + tpl.optInt("takeLevel")
        AlertDialog.Builder(this)
            .setTitle("装备详情")
            .setMessage(msg)
            .setPositiveButton("确定", null)
            .show()
    }

}

class EquipAdapter(
    private val ctx: android.content.Context,
    private val items: List<Map<String, Any>>
) : BaseAdapter() {
    private val inflater = LayoutInflater.from(ctx)

    override fun getCount(): Int = items.size
    override fun getItem(position: Int): Map<String, Any> = items[position]
    override fun getItemId(position: Int): Long = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: inflater.inflate(R.layout.item_equip_full, parent, false)
        val item = items[position]
        val equipId = (item["equip_id"] as Int)
        val upLevel = (item["up_level"] as Int)
        val status = (item["status"] as Int)
        val dbId = (item["db_id"] as Long)

        val tpl = StaticData.getEquipTemplate(equipId)
        val name = tpl?.name ?: "装备$equipId"
        val typeName = when (tpl?.type) {
            1 -> "武器"; 2 -> "甲"; 3 -> "盔"; 4 -> "鞋"; else -> "其他"
        }
        val img = view.findViewById<ImageView>(R.id.imgEquip)
        val bmp = ImageLoader.load(ctx, "equip/$equipId")
        if (bmp != null) img.setImageBitmap(bmp)
        view.findViewById<TextView>(R.id.tvEquipName).text = "$name ($typeName)"
        view.findViewById<TextView>(R.id.tvEquipLv).text = "强化 +$upLv  /  需 Lv.${tpl?.takeLevel ?: 1}"
        val phyAtt = tpl?.phyAtt ?: 0
        val magAtt = tpl?.magAtt ?: 0
        val strength = tpl?.strength ?: 0
        val speed = tpl?.speed ?: 0
        val statsText = buildString {
            if (phyAtt > 0) append("武+$phyAtt ")
            if (magAtt > 0) append("智+$magAtt ")
            if (strength > 0) append("力+$strength ")
            if (speed > 0) append("速+$speed")
        }.ifEmpty { "无属性" }
        view.findViewById<TextView>(R.id.tvEquipStats).text = statsText
        val equipText = view.findViewById<TextView>(R.id.tvEquipEquipped)
        if (status == 1) {
            equipText.text = "✅ 已装备"
            equipText.setTextColor(0xFF66FF66.toInt())
        } else {
            equipText.text = "⚪ 未装备"
            equipText.setTextColor(0xFF888888.toInt())
        }
        val btn = view.findViewById<Button>(R.id.btnEquipAction)
        btn.text = if (status == 1) "管理" else "穿戴"
        val activity = ctx as? EquipActivity
        btn.setOnClickListener {
            if (status == 1) {
                showOptions(activity, dbId, equipId, "已装备")
            } else {
                showOptions(activity, dbId, equipId, "未装备")
            }
        }
        view.setOnClickListener {
            if (status == 1) {
                showOptions(activity, dbId, equipId, "已装备")
            } else {
                showOptions(activity, dbId, equipId, "未装备")
            }
        }
        return view
    }

    private fun showOptions(activity: EquipActivity?, dbId: Long, equipId: Int, status: String) {
        if (activity == null) return
        val options = if (status == "已装备") {
            arrayOf("强化", "卸下", "查看详情", "取消")
        } else {
            arrayOf("强化", "穿戴", "查看详情", "取消")
        }
        AlertDialog.Builder(activity)
            .setTitle("装备操作")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> activity.callShowUpgradeDialog(dbId)
                    1 -> if (status == "已装备") {
                        EquipManager.unequip(activity, dbId)
                        Toast.makeText(activity, "已卸下", Toast.LENGTH_SHORT).show()
                        activity.recreate()
                    } else {
                        activity.callShowEquipDialog(dbId)
                    }
                    2 -> activity.callShowDetailDialog(dbId, equipId)
                }
            }
            .show()
    }
}

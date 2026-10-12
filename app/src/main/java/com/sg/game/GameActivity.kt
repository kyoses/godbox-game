package com.sg.game

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.DatabaseHelper
import com.sg.game.engine.EquipManager
import com.sg.game.engine.NpcManager
import com.sg.game.engine.PropManager
import com.sg.game.engine.TaskManager
import com.sg.game.engine.UserManager
import com.sg.game.ui.FormationView

/**
 * 主城：4 面板（资源/阵型/底部 4 按钮）
 */
class GameActivity : AppCompatActivity() {

    private lateinit var tvTitle: TextView
    private lateinit var tvGold: TextView
    private lateinit var tvExp: TextView
    private lateinit var tvStamina: TextView
    private lateinit var formationView: FormationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game)

        StaticData.ensureLoaded(this)
        DatabaseHelper.get(this)

        tvTitle = findViewById(R.id.tvTitle)
        tvGold = findViewById(R.id.tvGold)
        tvExp = findViewById(R.id.tvExp)
        tvStamina = findViewById(R.id.tvStamina)
        formationView = findViewById(R.id.formationView)

        findViewById<Button>(R.id.btnMap).setOnClickListener {
            startActivity(Intent(this, MapActivity::class.java))
        }
        findViewById<Button>(R.id.btnFormation).setOnClickListener {
            startActivity(Intent(this, FormationActivity::class.java))
        }
        findViewById<Button>(R.id.btnEquip).setOnClickListener {
            startActivity(Intent(this, EquipActivity::class.java))
        }
        findViewById<Button>(R.id.btnTask).setOnClickListener {
            startActivity(Intent(this, TaskActivity::class.java))
        }
        findViewById<Button>(R.id.btnRecruit).setOnClickListener {
            showRecruitDialog()
        }
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val info = UserManager.getPlayerInfo(this)
        // 简单解析
        val name = "\"主公\"" // 简化
        tvTitle.text = "三国霸业 · 永安宫"
        tvGold.text = "💰 " + extractInt(info, "gold")
        tvExp.text = "⭐ 等级 " + extractInt(info, "level") + " (" + extractInt(info, "exp") + " exp)"
        tvStamina.text = "⚡ 体力 " + extractInt(info, "stamina")
        formationView.invalidate()
    }

    private fun extractInt(json: String, key: String): Int {
        val pattern = "\"$key\":"
        val start = json.indexOf(pattern)
        if (start < 0) return 0
        val i = start + pattern.length
        val end = i
        var numEnd = end
        while (numEnd < json.length && (json[numEnd].isDigit() || json[numEnd] == '-')) numEnd++
        return json.substring(end, numEnd).toIntOrNull() ?: 0
    }

    private fun showRecruitDialog() {
        val templates = StaticData.allNpcTemplates.take(20)
        val view = layoutInflater.inflate(R.layout.dialog_recruit_npc, null)
        val lv = view.findViewById<android.widget.ListView>(R.id.lvNpcs)
        val items = templates.map { tpl ->
            mapOf(
                "id" to tpl.id,
                "name" to tpl.name,
                "phyAtt" to tpl.phyAtt,
                "magAtt" to tpl.magAtt,
                "phyDef" to tpl.phyDef,
                "magDef" to tpl.magDef,
                "strength" to tpl.strength,
                "intelligence" to tpl.intelligence,
                "speed" to tpl.speed
            )
        }
        val adapter = NpcRecruitAdapter(this, items)
        lv.adapter = adapter
        lv.setOnItemClickListener { _, _, pos, _ ->
            val tpl = templates[pos]
            NpcManager.addNpc(this, tpl.id)
            Toast.makeText(this, "招募 ${'$'}{tpl.name} 成功", Toast.LENGTH_SHORT).show()
            formationView.invalidate()
        }
        AlertDialog.Builder(this)
            .setView(view)
            .setNegativeButton("关闭", null)
            .show()
    }
}

/**
 * 招募列表 adapter：每个 item 显示 NPC 缩略图 + 名字 + 属性 + 招募按钮
 */
class NpcRecruitAdapter(
    private val ctx: android.content.Context,
    private val items: List<Map<String, Any>>
) : android.widget.BaseAdapter() {
    private val inflater = android.view.LayoutInflater.from(ctx)

    override fun getCount(): Int = items.size
    override fun getItem(position: Int): Map<String, Any> = items[position]
    override fun getItemId(position: Int): Long = position.toLong()

    override fun getView(position: Int, convertView: android.view.View?, parent: android.view.ViewGroup): android.view.View {
        val view = convertView ?: inflater.inflate(R.layout.item_npc_recruit, parent, false)
        val item = items[position]
        val npcId = (item["id"] as Int)
        val img = view.findViewById<android.widget.ImageView>(R.id.imgNpc)
        val bmp = com.sg.game.render.ImageLoader.load(ctx, "npc/${'$'}npcId")
        if (bmp != null) img.setImageBitmap(bmp)
        view.findViewById<android.widget.TextView>(R.id.tvName).text =
            "${'$'}{item["name"]} (#${'$'}npcId)"
        view.findViewById<android.widget.TextView>(R.id.tvStats).text =
            "武${'$'}{item["phyAtt"]} 智${'$'}{item["intelligence"]} 速${'$'}{item["speed"]}"
        view.findViewById<android.widget.Button>(R.id.btnRecruit).setOnClickListener {
            com.sg.game.engine.NpcManager.addNpc(ctx, npcId)
            android.widget.Toast.makeText(ctx, "已招募 ${'$'}{item["name"]}", android.widget.Toast.LENGTH_SHORT).show()
        }
        return view
    }
}
}
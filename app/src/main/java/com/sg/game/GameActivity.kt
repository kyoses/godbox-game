package com.sg.game

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.BaseAdapter
import android.widget.Button
import android.widget.ImageView
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.NpcTemplate
import com.sg.game.data.StaticData
import com.sg.game.engine.DatabaseHelper
import com.sg.game.engine.NpcManager
import com.sg.game.data.GameState
import com.sg.game.engine.UserManager
import com.sg.game.render.ImageLoader
import com.sg.game.ui.FormationView

class GameActivity : AppCompatActivity() {

    private lateinit var state: GameState
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
        findViewById<Button>(R.id.btnAdvance).setOnClickListener {
            advanceTurn()
        }
        findViewById<Button>(R.id.btnExit).setOnClickListener {
            finish()
        }
    }

    private fun advanceTurn() {
        state.turnCount++
        val info = com.sg.game.engine.AiSystem.maybeTriggerAttack(state)
        if (info != null) {
            val replay = com.sg.game.engine.AiSystem.doBattle(state, info)
            val result = com.sg.game.engine.AiSystem.applyResult(this, state, info, replay)
            showAiResultDialog(info, replay, result)
        } else {
            Toast.makeText(this, "推进一辰：当前安全", Toast.LENGTH_SHORT).show()
        }
        refresh()
    }

    private fun showAiResultDialog(
        info: com.sg.game.engine.AiSystem.AttackInfo,
        replay: com.sg.game.data.BattleReplay,
        result: com.sg.game.engine.AiSystem.AiResult
    ) {
        val lines = StringBuilder()
        lines.append("遭遇 ").append(info.templateName).append(" 袭击！\n\n")
        if (result.won) {
            lines.append("战斗胜利！\n")
            lines.append("金币 +").append(result.goldChange).append("\n")
            if (result.itemName.isNotEmpty()) {
                lines.append("战利品：").append(result.itemName).append("\n")
            }
        } else {
            lines.append("战斗失败\n")
            lines.append("损失金币 ").append(-result.goldChange).append("\n")
            if (result.itemName.isNotEmpty()) {
                lines.append("失去装备：").append(result.itemName).append("\n")
            }
        }
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(if (result.won) "胜利" else "失败")
            .setMessage(lines.toString())
            .setPositiveButton("确定", null)
            .show()
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val info = UserManager.getPlayerInfo(this)
        tvTitle.text = "三国霸业 · 永安宫"
        tvGold.text = "💰 " + extractInt(info, "gold")
        tvExp.text = "⭐ 等级 " + extractInt(info, "level") + " (" + extractInt(info, "exp") + " exp)"
        tvStamina.text = "⚡ 体力 " + extractInt(info, "stamina")
        formationView.invalidate()
    }

    private fun extractInt(json: String, key: String): Int {
        val pattern = "\"" + key + "\":"
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
        val items = templates.map { tpl ->
            mapOf(
                "id" to tpl.id,
                "name" to tpl.name,
                "phyAtt" to tpl.phyAtt,
                "intelligence" to tpl.intelligence,
                "speed" to tpl.speed
            )
        }
        val view = layoutInflater.inflate(R.layout.dialog_recruit_npc, null)
        val lv = view.findViewById<ListView>(R.id.lvNpcs)
        val adapter = NpcRecruitAdapter(this, items)
        lv.adapter = adapter
        lv.setOnItemClickListener { _, _, pos, _ ->
            val tpl = templates[pos]
            NpcManager.addNpc(this, tpl.id)
            Toast.makeText(this, "招募 " + tpl.name + " 成功", Toast.LENGTH_SHORT).show()
            formationView.invalidate()
        }
        AlertDialog.Builder(this)
            .setView(view)
            .setNegativeButton("关闭", null)
            .show()
    }
}

class NpcRecruitAdapter(
    private val ctx: android.content.Context,
    private val items: List<Map<String, Any>>
) : android.widget.BaseAdapter() {
    private val inflater = android.view.LayoutInflater.from(ctx)

    override fun getCount(): Int = items.size
    override fun getItem(position: Int): Map<String, Any> = items[position]
    override fun getItemId(position: Int): Long = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: inflater.inflate(R.layout.item_npc_recruit, parent, false)
        val item = items[position]
        val npcId = item["id"] as Int
        val name = item["name"] as String
        val img = view.findViewById<ImageView>(R.id.imgNpc)
        val bmp = ImageLoader.load(ctx, "npc/" + npcId)
        if (bmp != null) img.setImageBitmap(bmp)
        view.findViewById<TextView>(R.id.tvName).text = name + " (#" + npcId + ")"
        view.findViewById<TextView>(R.id.tvStats).text =
            "武" + item["phyAtt"] + " 智" + item["intelligence"] + " 速" + item["speed"]
        view.findViewById<Button>(R.id.btnRecruit).setOnClickListener {
            NpcManager.addNpc(ctx, npcId)
            Toast.makeText(ctx, "已招募 " + name, Toast.LENGTH_SHORT).show()
        }
        return view
    }
}

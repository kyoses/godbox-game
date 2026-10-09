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
        val templates = StaticData.allNpcTemplates.take(12)
        val names = templates.map { it.name }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle("招募武将")
            .setItems(names) { _, which ->
                NpcManager.addNpc(this, templates[which].id)
                Toast.makeText(this, "招募 ${names[which]} 成功", Toast.LENGTH_SHORT).show()
                formationView.invalidate()
            }
            .setNegativeButton("取消", null)
            .show()
    }
}
package com.sg.game

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData

/**
 * 地图：选关 → 跳到 BattleActivity
 */
class MapActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple_list)

        StaticData.ensureLoaded(this)

        findViewById<TextView>(R.id.tvTitle).text = "推图"
        findViewById<Button>(R.id.btnAdd).text = "选择关卡"
        findViewById<Button>(R.id.btnAdd).setOnClickListener { showStagePicker() }
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }

        val lv = findViewById<android.widget.ListView>(R.id.lvList)
        val items = StaticData.allBattleTemplates.sortedBy { it.dispOrder }
            .map { "${it.name} (Lv.${it.dispOrder * 5})" }
            .toTypedArray()
        lv.adapter = android.widget.ArrayAdapter(this, android.R.layout.simple_list_item_1, items)
        lv.setOnItemClickListener { _, _, pos, _ ->
            launchBattle(pos)
        }
    }

    private fun showStagePicker() {
        AlertDialog.Builder(this)
            .setTitle("选择关卡")
            .setItems(arrayOf("第一章", "第二章", "第三章", "第四章", "第五章")) { _, which ->
                launchBattle(which)
            }
            .setNegativeButton("取消", null)
            .show()
    }

    private fun launchBattle(stage: Int) {
        startActivity(Intent(this, BattleActivity::class.java))
    }
}
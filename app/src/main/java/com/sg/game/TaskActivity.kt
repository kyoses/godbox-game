package com.sg.game

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.TaskManager

/**
 * 任务界面
 */
class TaskActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple_list)

        StaticData.ensureLoaded(this)

        findViewById<TextView>(R.id.tvTitle).text = "任务"
        findViewById<Button>(R.id.btnAdd).text = "完成选中任务"
        findViewById<Button>(R.id.btnAdd).setOnClickListener { completeSelected() }
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }

        refresh()
    }

    private fun refresh() {
        val list = TaskManager.listAvailable(this)
        val items = list.map { entry ->
            val id = (entry["task_id"] as Long).toInt()
            val status = (entry["status"] as Long).toInt()
            val title = (entry["title"] as? String) ?: "任务$id"
            val mark = if (status == 1) "✅" else "⏳"
            "$mark $title"
        }.ifEmpty { listOf("（暂无任务）") }
        val lv = findViewById<ListView>(R.id.lvList)
        lv.adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, items)
    }

    private fun completeSelected() {
        val list = TaskManager.listAvailable(this)
        val pending = list.find { (it["status"] as Long) == 0L }
        if (pending == null) {
            Toast.makeText(this, "没有可完成的任务", Toast.LENGTH_SHORT).show()
            return
        }
        val taskId = (pending["task_id"] as Long).toInt()
        TaskManager.complete(this, taskId)
        Toast.makeText(this, "任务完成！奖励已发放", Toast.LENGTH_SHORT).show()
        refresh()
    }
}
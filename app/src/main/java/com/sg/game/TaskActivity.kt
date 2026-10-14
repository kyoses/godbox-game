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
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.TaskManager
import com.sg.game.render.ImageLoader

class TaskActivity : AppCompatActivity() {
    private lateinit var lv: ListView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple_list)
        StaticData.ensureLoaded(this)
        findViewById<TextView>(R.id.tvTitle).text = "任务"
        findViewById<Button>(R.id.btnAdd).visibility = android.view.View.GONE
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }
        lv = findViewById(R.id.lvList)
        refresh()
    }

    private fun refresh() {
        lv.adapter = TaskAdapter(this, TaskManager.listAvailable(this))
    }
}

class TaskAdapter(
    private val ctx: android.content.Context,
    private val items: List<Map<String, Any>>
) : BaseAdapter() {
    private val inflater = LayoutInflater.from(ctx)

    override fun getCount(): Int = items.size
    override fun getItem(position: Int): Map<String, Any> = items[position]
    override fun getItemId(position: Int): Long = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: inflater.inflate(R.layout.item_task, parent, false)
        val item = items[position]
        val taskId = (item["task_id"] as Long).toInt()
        val status = (item["status"] as Long).toInt()
        val title = (item["title"] as? String) ?: "任务$taskId"

        val tpl = StaticData.getTaskTemplate(taskId)
        val desc = tpl?.optString("desc", "") ?: ""
        val rewardGold = tpl?.optInt("reward_gold", 0) ?: 0
        val rewardExp = tpl?.optInt("reward_exp", 0) ?: 0
        val rewardPropId = tpl?.optInt("reward_prop", 0) ?: 0
        val propName = if (rewardPropId > 0) {
            StaticData.getPropTemplate(rewardPropId)?.optString("name", "道具" + rewardPropId) ?: "道具$rewardPropId"
        } else null

        view.findViewById<TextView>(R.id.tvTaskTitle).text = title
        view.findViewById<TextView>(R.id.tvTaskDesc).text = desc
        val rewardText = buildString {
            append("奖励：")
            if (rewardGold > 0) append("金币+$rewardGold ")
            if (rewardExp > 0) append("经验+$rewardExp ")
            if (propName != null) append(propName)
            if (isEmpty()) append("无")
        }
        view.findViewById<TextView>(R.id.tvTaskReward).text = rewardText
        val statusTv = view.findViewById<TextView>(R.id.tvTaskStatus)
        if (status == 1) {
            statusTv.text = "✅ 已完成"
            statusTv.setTextColor(0xFF66FF66.toInt())
        } else {
            statusTv.text = "⏳ 未完成"
            statusTv.setTextColor(0xFFFFCC66.toInt())
        }

        val imgView = view.findViewById<ImageView>(R.id.imgTask)
        val bmp = if (rewardPropId > 0) {
            ImageLoader.load(ctx, "prop/$rewardPropId")
        } else null
        if (bmp != null) imgView.setImageBitmap(bmp)
        else imgView.setImageBitmap(null)

        val btn = view.findViewById<Button>(R.id.btnTaskAction)
        if (status == 1) {
            btn.text = "✓ 完成"
            btn.isEnabled = false
        } else {
            btn.text = "完成"
            btn.isEnabled = true
            btn.setOnClickListener {
                TaskManager.complete(ctx, taskId)
                Toast.makeText(ctx, "任务完成！", Toast.LENGTH_SHORT).show()
                (ctx as? TaskActivity)?.recreate()
            }
        }
        return view
    }
}

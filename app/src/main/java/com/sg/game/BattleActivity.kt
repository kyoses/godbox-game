package com.sg.game

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.engine.BattleManager
import com.sg.game.engine.DatabaseHelper
import com.sg.game.data.StaticData
import org.json.JSONObject

/**
 * 原生战斗界面（不通过 WebView）
 * 从 MainActivity 接 formation + sysIds，运行 BattleEngine，展示战报。
 */
class BattleActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val formation = intent.getStringExtra(EXTRA_FORMATION) ?: "0,0,0|0,0,0|0,0,0"
        val sysIds = intent.getStringExtra(EXTRA_SYS_IDS) ?: "0,0,0|0,0,0|0,0,0"

        StaticData.ensureLoaded(this)
        DatabaseHelper.get(this)

        val result = BattleManager.fightToJson(formation, sysIds)
        val json = JSONObject(result)

        // 简单布局展示战报
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }
        val title = TextView(this).apply {
            text = "战斗结果：${json.optString("winner")} 胜"
            textSize = 24f
        }
        root.addView(title)

        val log = json.optJSONArray("log")
        if (log != null) {
            for (i in 0 until log.length()) {
                val entry = log.getJSONObject(i)
                val tv = TextView(this).apply {
                    text = "第${entry.optInt("turn")}回合: 攻${entry.optInt("attacker")} → 防${entry.optInt("defender")} 伤害${entry.optInt("damage")}"
                    textSize = 16f
                }
                root.addView(tv)
            }
        }

        val btn = Button(this).apply {
            text = "返回"
            setOnClickListener { finish() }
        }
        root.addView(btn)

        setContentView(root)
    }

    companion object {
        const val EXTRA_FORMATION = "formation"
        const val EXTRA_SYS_IDS = "sys_ids"
    }
}
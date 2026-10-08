package com.sg.game

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.sg.game.data.StaticData
import com.sg.game.engine.DatabaseHelper

/**
 * 启动入口：标题画面 → 点击"开始游戏" → GameActivity
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 预加载静态数据 + 数据库
        StaticData.ensureLoaded(this)
        DatabaseHelper.get(this)

        findViewById<Button>(R.id.btnStart).setOnClickListener {
            startActivity(Intent(this, GameActivity::class.java))
        }
    }
}
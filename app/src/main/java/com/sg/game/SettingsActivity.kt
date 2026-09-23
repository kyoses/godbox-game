package com.sg.game

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SettingsActivity : AppCompatActivity() {

    private lateinit var prefs: SharedPreferences
    private lateinit var etUrl: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        prefs = getSharedPreferences("sg_game", Context.MODE_PRIVATE)
        etUrl = findViewById(R.id.etUrl)
        etUrl.setText(prefs.getString(MainActivity.PREF_SERVER_URL, "") ?: "")

        findViewById<Button>(R.id.btnSave).setOnClickListener {
            val url = etUrl.text.toString().trim()
            prefs.edit().putString(MainActivity.PREF_SERVER_URL, url).apply()
            Toast.makeText(this, "已保存", Toast.LENGTH_SHORT).show()
            finish()
        }
    }
}
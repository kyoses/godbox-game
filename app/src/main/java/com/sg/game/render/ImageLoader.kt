package com.sg.game.render

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import java.io.File
import java.util.concurrent.ConcurrentHashMap

/**
 * 简单的图片缓存：按 key 缓存 Bitmap。
 *
 * 图片放 assets/img/{npc|equip|prop}/，key 例如：
 * - npc: "npc/caocao"
 * - equip: "equip/48"
 * - prop: "prop/hp1"
 */
object ImageLoader {

    private val cache = ConcurrentHashMap<String, Bitmap>()
    private val lock = Any()

    fun load(ctx: Context, key: String): Bitmap? {
        cache[key]?.let { return it }
        return synchronized(lock) {
            cache[key]?.let { return it
            val bmp = tryLoad(ctx, key)
            if (bmp != null) cache[key] = bmp
            bmp
        }
    }

    private fun tryLoad(ctx: Context, key: String): Bitmap? {
        val names = candidateNames(key)
        for (name in names) {
            try {
                ctx.assets.open("img/$name.png").use { input ->
                    return BitmapFactory.decodeStream(input)
                }
            } catch (_: Exception) { /* try next */ }
            try {
                ctx.assets.open("img/$name.jpg").use { input ->
                    return BitmapFactory.decodeStream(input)
                }
            } catch (_: Exception) { /* try next */ }
            try {
                ctx.assets.open("img/$name.gif").use { input ->
                    return BitmapFactory.decodeStream(input)
                }
            } catch (_: Exception) { /* try next */ }
        }
        return null
    }

    private fun candidateNames(key: String): List<String> = when {
        key.endsWith(".png") || key.endsWith(".jpg") || key.endsWith(".gif") -> listOf(key)
        else -> listOf("$key.png", "$key.jpg", "$key.gif", key)
    }
}
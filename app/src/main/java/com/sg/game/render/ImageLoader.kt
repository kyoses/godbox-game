package com.sg.game.render

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import java.util.concurrent.ConcurrentHashMap

object ImageLoader {

    private val cache = ConcurrentHashMap<String, Bitmap>()
    private val lock = Any()

    fun load(ctx: Context, key: String): Bitmap? {
        cache[key]?.let { cached -> return cached }
        synchronized(lock) {
            cache[key]?.let { cached -> return cached }
            val bmp = tryLoad(ctx, key)
            if (bmp != null) cache[key] = bmp
            return bmp
        }
    }

    private fun tryLoad(ctx: Context, key: String): Bitmap? {
        val names = candidateNames(key)
        for (name in names) {
            tryPng(ctx, name)?.let { return it }
            tryJpg(ctx, name)?.let { return it }
            tryGif(ctx, name)?.let { return it }
        }
        return null
    }

    private fun tryPng(ctx: Context, name: String): Bitmap? = try {
        ctx.assets.open("img/$name.png").use { BitmapFactory.decodeStream(it) }
    } catch (_: Exception) { null }

    private fun tryJpg(ctx: Context, name: String): Bitmap? = try {
        ctx.assets.open("img/$name.jpg").use { BitmapFactory.decodeStream(it) }
    } catch (_: Exception) { null }

    private fun tryGif(ctx: Context, name: String): Bitmap? = try {
        ctx.assets.open("img/$name.gif").use { BitmapFactory.decodeStream(it) }
    } catch (_: Exception) { null }

    private fun candidateNames(key: String): List<String> = when {
        key.endsWith(".png") || key.endsWith(".jpg") || key.endsWith(".gif") -> listOf(key)
        else -> listOf("$key.png", "$key.jpg", "$key.gif", key)
    }
}

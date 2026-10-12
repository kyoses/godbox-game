package com.sg.game.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RectF
import android.graphics.Shader
import android.util.AttributeSet
import android.view.View
import kotlin.math.cos
import kotlin.math.sin

/**
 * 主城背景：暗红渐变 + 金色装饰（瓦当+云纹+玉玺轮廓）。
 * 不依赖图片资源，程序生成。
 */
class CityBackgroundView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : View(context, attrs) {

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val path = Path()

    override fun onDraw(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0 || h <= 0) return

        // 背景渐变：暗红 → 墨黑
        paint.shader = LinearGradient(
            0f, 0f, 0f, h,
            intArrayOf(
                Color.rgb(58, 0, 0),    // 暗红
                Color.rgb(26, 0, 0),    // 暗红
                Color.rgb(15, 5, 5)     // 墨黑
            ),
            floatArrayOf(0f, 0.4f, 1f),
            Shader.TileMode.CLAMP
        )
        canvas.drawRect(0f, 0f, w, h, paint)
        paint.shader = null

        // 顶部金边
        paint.color = Color.rgb(201, 161, 74)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 3f
        canvas.drawLine(0f, 0f, w, 0f, paint)
        paint.style = Paint.Style.FILL

        // 顶部金色瓦当
        val tileSize = w / 16
        for (i in 0 until 16) {
            val x = i * tileSize
            path.reset()
            path.moveTo(x + tileSize * 0.1f, 0f)
            path.lineTo(x + tileSize * 0.9f, 0f)
            path.lineTo(x + tileSize * 0.7f, tileSize * 0.6f)
            path.lineTo(x + tileSize * 0.3f, tileSize * 0.6f)
            path.close()
            paint.color = Color.rgb(180, 140, 60)
            canvas.drawPath(path, paint)
        }

        // 中央装饰：金色圆徽（玉玺轮廓）
        val cx = w / 2f
        val cy = h * 0.3f
        val r = minOf(w, h) * 0.18f
        paint.color = Color.argb(60, 255, 215, 64)
        canvas.drawCircle(cx, cy, r, paint)
        paint.color = Color.rgb(255, 215, 64)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 4f
        canvas.drawCircle(cx, cy, r, paint)
        paint.style = Paint.Style.FILL

        // 内圆 - 篆书风格
        paint.color = Color.argb(180, 255, 215, 64)
        canvas.drawCircle(cx, cy, r * 0.85f, paint)
        paint.color = Color.rgb(40, 0, 0)
        canvas.drawCircle(cx, cy, r * 0.7f, paint)

        // 8 个金色装饰点（八卦）
        paint.color = Color.rgb(255, 215, 64)
        for (i in 0 until 8) {
            val angle = (i.toDouble() / 8.0) * 2 * Math.PI
            val px = (cx + (r * 0.95) * cos(angle)).toFloat()
            val py = (cy + (r * 0.95) * sin(angle)).toFloat()
            canvas.drawCircle(px, py, 4f, paint)
        }

        // 底部装饰：金色横线
        paint.color = Color.rgb(180, 140, 60)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2f
        canvas.drawLine(20f, h - 60f, w - 20f, h - 60f, paint)
        paint.style = Paint.Style.FILL

        // 两侧云纹
        for (side in intArrayOf(-1, 1)) {
            val baseX = if (side < 0) w * 0.05f else w * 0.95f
            for (i in 0 until 5) {
                val x = baseX + side * i * 12f
                val y = h * 0.65f + i * 18f
                paint.color = Color.argb(180 - i * 30, 200, 150, 100)
                canvas.drawCircle(x, y, 6f, paint)
            }
        }
    }
}
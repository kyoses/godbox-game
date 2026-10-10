package com.sg.game.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.util.AttributeSet
import android.view.View
import com.sg.game.data.NpcStats
import com.sg.game.data.StaticData

/**
 * 战斗阵型视图：左 3x3（玩家）vs 右 3x3（敌人），中间战斗日志
 *
 * 接收 NpcStats?[][] 两组 3x3 数组绘制
 */
class BattleFormationView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : View(context, attrs) {

    var leftTeam: Array<Array<NpcStats?>> = Array(3) { arrayOfNulls(3) }
    var rightTeam: Array<Array<NpcStats?>> = Array(3) { arrayOfNulls(3) }
    var battleLog: List<String> = emptyList()

    private val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL }
    private val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 2f
    }
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textSize = 20f
        isFakeBoldText = true
        color = Color.WHITE
    }
    private val path = Path()

    fun refresh(left: Array<Array<NpcStats?>>, right: Array<Array<NpcStats?>>) {
        leftTeam = left
        rightTeam = right
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val w = width.toFloat()
        val h = height.toFloat()

        fillPaint.color = Color.rgb(50, 25, 25)
        canvas.drawRect(0f, 0f, w, h, fillPaint)

        val cellW = w / 2f / 3.5f
        val cellH = h / 4.5f

        // 玩家（左半）
        for (i in 0..2) for (j in 0..2) {
            val npc = leftTeam[i][j]
            if (npc != null) {
                val px = cellW * 1.0f + j * cellW
                val py = cellH * 0.8f + i * cellH
                drawCell(canvas, npc, px, py, cellW, cellH, isLeft = true)
            }
        }
        // 敌人（右半）
        for (i in 0..2) for (j in 0..2) {
            val npc = rightTeam[i][j]
            if (npc != null) {
                val px = w / 2f + cellW * 0.5f + j * cellW
                val py = cellH * 0.8f + i * cellH
                drawCell(canvas, npc, px, py, cellW, cellH, isLeft = false)
            }
        }
    }

    private fun drawCell(canvas: Canvas, npc: NpcStats, cx: Float, cy: Float, cw: Float, ch: Float, isLeft: Boolean) {
        val w = cw * 0.42f
        val h = ch * 0.42f

        // 优先用图片
        val bmp = com.sg.game.render.ImageLoader.load(context, "npc/${npc.npcId}")
        if (bmp != null) {
            val padding = 2f
            val destW = cw - padding * 2
            val ratio = bmp.height.toFloat() / bmp.width
            val destH = destW * ratio
            val dstLeft = cx - destW / 2
            val dstTop = cy - destH / 2
            val dstRight = cx + destW / 2
            val dstBottom = cy + destH / 2
            canvas.drawBitmap(bmp, null,
                android.graphics.RectF(dstLeft, dstTop, dstRight, dstBottom), null)
            strokePaint.color = if (isLeft) Color.rgb(80, 200, 80) else Color.rgb(220, 80, 80)
            strokePaint.strokeWidth = 2f
        } else {
            // fallback：class 颜色
            val color = when (npc.npcClass) {
                1 -> Color.rgb(80, 140, 80)
                2 -> Color.rgb(100, 130, 200)
                3 -> Color.rgb(180, 100, 60)
                4 -> Color.rgb(160, 80, 200)
                else -> Color.rgb(150, 150, 150)
            }
            fillPaint.color = color
            strokePaint.color = if (isLeft) Color.rgb(80, 200, 80) else Color.rgb(220, 80, 80)
            strokePaint.strokeWidth = 2f

            // 菱形
            path.reset()
            path.moveTo(cx, cy - h)
            path.lineTo(cx + w, cy)
            path.lineTo(cx, cy + h)
            path.lineTo(cx - w, cy)
            path.close()
            canvas.drawPath(path, fillPaint)
            canvas.drawPath(path, strokePaint)
        }

        // 名字
        textPaint.textSize = 18f
        val nameW = textPaint.measureText(npc.name)
        canvas.drawText(npc.name, cx - nameW / 2, cy - 4, textPaint)
        // HP
        textPaint.textSize = 12f
        val hpText = "HP ${npc.hp}"
        val hpW = textPaint.measureText(hpText)
        canvas.drawText(hpText, cx - hpW / 2, cy + 12, textPaint)
    }
}
package com.sg.game.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import com.sg.game.data.NpcStats
import com.sg.game.engine.NpcManager
import com.sg.game.data.StaticData
import com.sg.game.engine.DatabaseHelper

/**
 * 3x3 阵型视图。Canvas 绘制菱形。
 *
 * 玩家阵型：从 c_npc.position (0-8) 读取
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
class FormationView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : View(context, attrs) {

    /** 格子点击回调：传入 0-8 的位置 */
    var onCellClick: ((Int) -> Unit)? = null

    /** 简化的 setter（用于 Kotlin 直接传 lambda） */
    fun setOnCellClick(callback: (Int) -> Unit) {
        this.onCellClick = callback
    }

    private var downX = 0f
    private var downY = 0f
    private var dragged = false

    private fun hitTest(x: Float, y: Float): Int {
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0 || h <= 0) return -1
        val cellW = w / 3f
        val cellH = h / 3f
        val col = (x / cellW).toInt().coerceIn(0, 2)
        val row = (y / cellH).toInt().coerceIn(0, 2)
        return row * 3 + col
    }

    private val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL }
    private val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 2f
    }
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textSize = 24f
        isFakeBoldText = true
        color = Color.WHITE
        setShadowLayer(2f, 1f, 1f, Color.BLACK)
    }
    private val path = Path()

    /**
     * 阵型字符串（标准 3x3 + 1 替补）："0,1,2|3,4,5|6,7,8" 共 9 个槽
     * 每个槽的 npcId 来自 c_npc.position
     */
    fun refreshFromDb(ctx: Context) {
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val ctx = context
        val w = width.toFloat()
        val h = height.toFloat()

        // 背景
        fillPaint.color = Color.rgb(40, 20, 20)
        canvas.drawRect(0f, 0f, w, h, fillPaint)

        // 计算菱形格子
        val cellW = w / 4f
        val cellH = h / 4f
        val cx0 = w / 2f
        val cy0 = h / 2f

        // 加载阵型数据
        val team = com.sg.game.engine.DatabaseHelper.get(ctx).let { db ->
            val npcList = com.sg.game.engine.NpcManager.listForPlayer(ctx)
            // 把 0-8 position 映射到 3x3
            val grid = arrayOfNulls<NpcStats>(9)
            for (n in npcList) {
                val pos = (n["position"] as? Long)?.toInt() ?: -1
                if (pos in 0..8) {
                    val npcId = (n["npc_id"] as? Long)?.toInt() ?: continue
                    val tpl = com.sg.game.data.StaticData.getNpcTemplate(npcId)
                    grid[pos] = NpcStats(
                        npcId = npcId,
                        name = n["name"] as? String ?: "武将$npcId",
                        type = tpl?.optInt("class", 1) ?: 1,
                        level = (n["level"] as? Long)?.toInt() ?: 1,
                        hp = 100, hpMax = 100,
                        phyAtt = tpl?.optInt("phy_att", 50) ?: 50,
                        magAtt = tpl?.optInt("mag_att", 50) ?: 50,
                        phyDef = tpl?.optInt("phy_def", 30) ?: 30,
                        magDef = tpl?.optInt("mag_def", 30) ?: 30,
                        strength = tpl?.optInt("strength", 30) ?: 30,
                        intelligence = tpl?.optInt("intelligence", 30) ?: 30,
                        speed = tpl?.optInt("speed", 50) ?: 50,
                        crit = tpl?.optInt("crit", 30) ?: 30,
                        critDef = tpl?.optInt("crit_def", 0) ?: 0,
                        img = tpl?.optString("img", "") ?: "",
                        imgSmall = tpl?.optString("img_small", "") ?: "",
                        npcClass = tpl?.optInt("class", 1) ?: 1
                    )
                }
            }
            grid
        }

        // 9 个格子坐标
        val positions = arrayOf(
            floatArrayOf(-1.5f, -1.5f), floatArrayOf(0f, -1.5f), floatArrayOf(1.5f, -1.5f),
            floatArrayOf(-1.5f, 0f),     floatArrayOf(0f, 0f),    floatArrayOf(1.5f, 0f),
            floatArrayOf(-1.5f, 1.5f),  floatArrayOf(0f, 1.5f),  floatArrayOf(1.5f, 1.5f)
        )
        for (i in 0..8) {
            val px = cx0 + positions[i][0] * cellW
            val py = cy0 + positions[i][1] * cellH
            val npc = team[i]
            drawCell(canvas, npc, px, py, cellW, cellH)
        }
    }

    private fun drawCell(canvas: Canvas, npc: NpcStats?, cx: Float, cy: Float, cw: Float, ch: Float) {
        val w = cw * 0.4f
        val h = ch * 0.4f
        if (npc == null) {
            // 空槽
            fillPaint.color = Color.argb(80, 60, 40, 40)
            strokePaint.color = Color.rgb(120, 80, 60)
            strokePaint.strokeWidth = 1.5f
        } else {
            // 有人
            val npcClass = npc.npcClass
            val color = when (npcClass) {
                1 -> Color.rgb(80, 140, 80)   // 绿
                2 -> Color.rgb(100, 130, 200) // 蓝
                3 -> Color.rgb(180, 100, 60)  // 橙
                4 -> Color.rgb(160, 80, 200)  // 紫
                else -> Color.rgb(150, 150, 150) // 灰
            }
            fillPaint.color = color
            strokePaint.color = Color.rgb(255, 215, 64) // 金色边框
            strokePaint.strokeWidth = 2f

            // 画名字
            textPaint.textSize = 22f
            val nameWidth = textPaint.measureText(npc.name)
            canvas.drawText(npc.name, cx - nameWidth / 2, cy - 5, textPaint)
            textPaint.textSize = 14f
            val lv = "Lv.${npc.level}"
            val lvWidth = textPaint.measureText(lv)
            canvas.drawText(lv, cx - lvWidth / 2, cy + 18, textPaint)
        }
        // 画菱形
        path.reset()
        path.moveTo(cx, cy - h)
        path.lineTo(cx + w, cy)
        path.lineTo(cx, cy + h)
        path.lineTo(cx - w, cy)
        path.close()
        canvas.drawPath(path, fillPaint)
        canvas.drawPath(path, strokePaint)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                downX = event.x
                downY = event.y
                dragged = false
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                if (kotlin.math.abs(event.x - downX) > 8 || kotlin.math.abs(event.y - downY) > 8) {
                    dragged = true
                }
            }
            MotionEvent.ACTION_UP -> {
                if (!dragged) {
                    val pos = hitTest(event.x, event.y)
                    if (pos >= 0) onCellClick?.invoke(pos)
                }
                return true
            }
        }
        return super.onTouchEvent(event)
    }
}
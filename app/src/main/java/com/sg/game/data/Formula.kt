package com.sg.game.data

import net.objecthunter.exp4j.ExpressionBuilder
import kotlin.math.round

/**
 * formulaValue DSL 解析器（PHP Utils::formulaValue 的 Kotlin 等价）
 *
 * 替换公式中的 {var} 占位符，调用 exp4j 求值。
 */
object Formula {

    /**
     * 求值 PHP 公式。
     * @param formula 如 "level*10 + strength*2 + 5"
     * @param vars 变量映射，如 mapOf("level" to 5.0, "strength" to 20.0)
     * @return 四舍五入到 3 位小数（与 PHP round(3) 等价）
     */
    fun eval(formula: String, vars: Map<String, Any>): Double {
        if (formula.isBlank()) return 0.0
        // 替换 {var} 占位符
        var expr = formula
        for ((key, value) in vars) {
            expr = expr.replace("{$key}", value.toString())
                .replace(key, value.toString())
        }
        return try {
            val exp = ExpressionBuilder(expr).build()
            val result = exp.evaluate()
            (round(result * 1000.0) / 1000.0)
        } catch (e: Exception) {
            0.0
        }
    }

    /**
     * 整数版本（PHP intval）
     */
    fun evalInt(formula: String, vars: Map<String, Any>): Int {
        return eval(formula, vars).toInt()
    }
}
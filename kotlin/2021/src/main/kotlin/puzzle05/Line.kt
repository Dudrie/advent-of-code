package puzzle05

import model.Coordinates
import kotlin.math.abs

class Line(startPoint: Coordinates, endPoint: Coordinates) {
    private val start: Coordinates
    private val end: Coordinates
    val isDiagonal: Boolean

    init {
        start = if (startPoint.x < endPoint.x) startPoint else endPoint
        end = if (startPoint.x < endPoint.x) endPoint else startPoint
        isDiagonal = (start.x != end.x && start.y != end.y)
    }

    fun isPointOnLine(point: Coordinates): Boolean {
        val horizontal = start.x..end.x
        val vertical = minOf(start.y, end.y)..maxOf(start.y, end.y)

        return if (isDiagonal) {
            horizontal.contains(point.x) && vertical.contains(point.y) && abs(start.x - point.x) == abs(start.y - point.y)
        } else {
            horizontal.contains(point.x) && vertical.contains(point.y)
        }
    }
}

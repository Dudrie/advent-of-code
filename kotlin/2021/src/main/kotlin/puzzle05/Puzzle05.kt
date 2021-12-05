package puzzle05

import common.PuzzleSolver
import model.Coordinates

class Puzzle05 : PuzzleSolver(5) {
    private val data by lazy {
        getPuzzleLines()
    }

    private var topLeft: Coordinates = Coordinates(Int.MAX_VALUE, Int.MAX_VALUE)
    private var bottomRight: Coordinates = Coordinates(0, 0)

    private val lines: List<Line> = data.map {
        val (start, end) = it.split(" -> ").map { point ->
            val (x, y) = point.split(",").map(String::toInt)
            Coordinates(x, y)
        }

        topLeft = topLeft.copy(
            x = minOf(topLeft.x, start.x, end.x), y = minOf(topLeft.y, start.y, end.y)
        )
        bottomRight = bottomRight.copy(
            x = maxOf(bottomRight.x, start.x, end.x), y = maxOf(bottomRight.y, start.y, end.y)
        )
        Line(start, end)
    }

    override fun solvePartA(): Number {
        return getOverlappingCount(lines.filter { !it.isDiagonal })
    }

    override fun solvePartB(): Number {
        return getOverlappingCount(lines)
    }

    private fun getOverlappingCount(list: List<Line>): Int {
        var overlappingCount = 0
        for (point in topLeft.getAllBetween(bottomRight)) {
            val count = list.count { it.isPointOnLine(point) }
            if (count >= 2) {
                overlappingCount++
            }
        }
        return overlappingCount
    }
}

fun main() {
    Puzzle05().solve()
}

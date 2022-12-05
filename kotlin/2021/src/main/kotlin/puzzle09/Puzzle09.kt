package puzzle09

import common.PuzzleSolver
import model.ALL_DIRECTIONS
import model.Coordinates
import model.Direction

class LavaCave(input: List<String>) {
    private val points: Array<Array<Int>>

    val width: Int
        get() = points[0].size

    val height: Int
        get() = points.size

    init {
        points = input.map { line ->
            line.toCharArray().map { it.digitToInt() }.toTypedArray()
        }.toTypedArray()
    }

    fun getHeightAt(col: Int, row: Int): Int = points[row][col]

    fun getAdjacentHeights(col: Int, row: Int): List<Int> {
        val coordinates = Coordinates(col, row)
        val listOfDirections = listOf(Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST)

        return listOfDirections.mapNotNull {
            val (newCol, newRow) = coordinates + it
            getSingleAdjacentHeight(newCol, newRow)
        }
    }

    fun getBasinSize(startPoint: LowPoint): Int {
        val points = getPointsInBasin(startPoint, mutableSetOf())

        return points.size
    }

    private fun getPointsInBasin(startPoint: LowPoint, checked: MutableSet<Coordinates>): Set<LowPoint> {
        if (startPoint.height == 9) {
            return setOf()
        }

        val newHeight = startPoint.height + 1
        val points = mutableSetOf(startPoint)
        checked += startPoint.point

        ALL_DIRECTIONS.forEach {
            val newPoint = startPoint.point + it

            if (isInCave(newPoint) && getHeightAt(newPoint) != 9 && !checked.contains(newPoint)) {
                checked += newPoint
                points += getPointsInBasin(LowPoint(getHeightAt(newPoint), newPoint), checked)
            }
        }

        return points
    }

    private fun getSingleAdjacentHeight(col: Int, row: Int): Int? {
        return if (isInCave(col, row)) {
            getHeightAt(col, row)
        } else {
            null
        }
    }

    private fun getHeightAt(point: Coordinates): Int = getHeightAt(point.x, point.y)

    private fun isInCave(point: Coordinates): Boolean = isInCave(point.x, point.y)

    private fun isInCave(col: Int, row: Int): Boolean {
        return row in points.indices && col in points[0].indices
    }
}

class Puzzle09 : PuzzleSolver(9) {
    private val data by lazy {
//        loadPuzzleTestData(1)
        getPuzzleLines()
    }

    private val lavaCave = LavaCave(data)

    override fun solvePartA(): Number {
        var sumOfRiskLevels = 0

        getLowPoints().forEach { sumOfRiskLevels += it.height + 1 }

        return sumOfRiskLevels
    }

    override fun solvePartB(): Number {
        val lowPoints = getLowPoints()
        val sizes = lowPoints.map { lavaCave.getBasinSize(it) }
        val (sizeA, sizeB, sizeC) = sizes.sortedDescending()

        return sizeA * sizeB * sizeC
    }

    private fun getLowPoints(): List<LowPoint> {
        val listOfLowPoints = mutableListOf<LowPoint>()

        for (row in 0 until lavaCave.height) {
            for (col in 0 until lavaCave.width) {
                var isMinimum = true
                val currentHeight = lavaCave.getHeightAt(col, row)
                val adjacentHeights = lavaCave.getAdjacentHeights(col, row)

                adjacentHeights.forEach {
                    if (it <= currentHeight) {
                        isMinimum = false
                    }
                }

                if (isMinimum) {
                    listOfLowPoints += LowPoint(currentHeight, Coordinates(col, row))
                }
            }
        }

        return listOfLowPoints
    }
}

data class LowPoint(val height: Int, val point: Coordinates)

fun main() {
    Puzzle09().solve()
}

package puzzle04

import common.PuzzleSolver

class Puzzle04 : PuzzleSolver(4) {
    private val data by lazy {
//        loadPuzzleTestData(1)
        getPuzzleLines()
    }

    private val pairs: List<Pair<IntRange, IntRange>> = data.map { line ->
        val (first, second) = line.split(",")
        val (aStart, aEnd) = first.split("-")
        val (bStart, bEnd) = second.split("-")

        val firstRange = aStart.toInt()..aEnd.toInt()
        val secondRange = bStart.toInt()..bEnd.toInt()

        firstRange to secondRange
    }

    override fun solvePartA(): Number = pairs.sumOf {
        val (first, second) = it

        val number = if (first.fullyContains(second) || second.fullyContains(first)) {
            1
        } else {
            0
        }

        number
    }

    override fun solvePartB(): Number = pairs.sumOf {
        val (first, second) = it
        val number = if (first.overlaps(second)) 1 else 0

        number
    }

}

private fun IntRange.fullyContains(range: IntRange): Boolean =
    first <= range.first && range.last <= last

private fun IntRange.overlaps(range: IntRange): Boolean =
    first <= range.last && range.first <= last

fun main() {
    Puzzle04().solve()
}

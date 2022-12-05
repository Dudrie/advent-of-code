package puzzle01

import common.PuzzleSolver

class Puzzle01 : PuzzleSolver(1) {
    private val data by lazy {
        getPuzzleLinesWithEmpty()
    }

    private val inventories: List<List<Int>>

    init {
        //loadPuzzleTestData(1)
        val inventories = mutableListOf<List<Int>>()
        var currentInventory: MutableList<Int> = mutableListOf()

        data.forEach { line ->
            if (line.isBlank()) {
                inventories.add(currentInventory)
                currentInventory = mutableListOf()
            } else {
                currentInventory += line.toInt(10)
            }
        }

        this.inventories = inventories
    }

    override fun solvePartA(): Number = inventories.maxOf { inv -> inv.sumOf { it } }

    override fun solvePartB(): Number =
        inventories.map { inv -> inv.sumOf { it } }.sortedDescending().subList(0, 3).sumOf { it }

}

fun main() {
    Puzzle01().solve()
}

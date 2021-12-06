package puzzle06

import common.PuzzleSolver

class Puzzle06 : PuzzleSolver(6) {
    private val data by lazy {
        getPuzzleInput()
    }
    private val initialLanternfish: List<Int> = data.split(",").map { it.toInt() }

    override fun solvePartA(): Number = runCalculation(80)

    override fun solvePartB(): Number = runCalculation(256)

    private fun runCalculation(days: Int): Long {
        val allFishes = createFishes()

        repeat(days) {
            var newFishes = 0L

            repeat(8) { day ->
                if (day == 0) {
                    newFishes = allFishes[0]
                }
                allFishes[day] = allFishes[day + 1]
            }
            allFishes[6] += newFishes
            allFishes[8] = newFishes
        }

        return allFishes.sum()
    }

    private fun createFishes(): MutableList<Long> {
        val fishes = mutableListOf<Long>()

        repeat(9) { fishes += 0 }

        initialLanternfish.forEach {
            fishes[it] += 1L
        }

        return fishes
    }
}

fun main() {
    Puzzle06().solve()
}

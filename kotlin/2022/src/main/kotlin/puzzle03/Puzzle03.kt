package puzzle03

import common.PuzzleSolver

class Puzzle03 : PuzzleSolver(3) {
    private val data by lazy {
//        loadPuzzleTestData(1)
        getPuzzleLines()
    }

    private val rucksacks = data.map { Rucksack(it) }

    override fun solvePartA(): Number = rucksacks.sumOf {
        getPriorityForChar(it.getSharedItem())
    }

    override fun solvePartB(): Number {
        var sum = 0

        for (i in rucksacks.indices step 3) {
            val ruckA = rucksacks[i]
            val ruckB = rucksacks[i + 1]
            val ruckC = rucksacks[i + 2]

            for (item in ruckA.items) {
                if (ruckB.hasItem(item) && ruckC.hasItem(item)) {
                    sum += getPriorityForChar(item)
                    break
                }
            }
        }

        return sum
    }

    private fun getPriorityForChar(char: Char): Int = when (char.code) {
        // Uppercase char
        in IntRange(65, 90) -> char.code - 38

        // Lowercase char
        in IntRange(97, 122) -> char.code - 96

        else -> throw Exception()
    }
}

private class Rucksack(line: String) {
    private val firstCompartment: String = line.substring(0, line.length / 2)
    private val secondCompartment: String = line.substring(line.length / 2)

    val items: String = line

    fun getSharedItem(): Char {
        for (char in firstCompartment) {
            if (secondCompartment.contains(char)) {
                return char
            }
        }

        throw NoSuchElementException("No common item found.")
    }

    fun hasItem(item: Char): Boolean =
        firstCompartment.contains(item) || secondCompartment.contains(item)
}

fun main() {
    Puzzle03().solve()
}

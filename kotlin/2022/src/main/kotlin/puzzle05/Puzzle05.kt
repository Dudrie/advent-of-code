package puzzle05

import common.PuzzleSolver
import java.util.*

class Puzzle05 : PuzzleSolver(5) {
    private val data by lazy {
//        loadPuzzleTestData(1)
        getPuzzleLinesWithEmpty()
    }

    private val firstRowWithMove = getEmptyLineIndex() + 1
    private val stacks: List<Stack<Char>> = loadCrates()

    private val moveRegex = Regex("move (\\d+) from (\\d+) to (\\d+)")

    override fun solvePartA(): String {
        data.listIterator(firstRowWithMove).forEach { moveCommand ->
            val (count, from, to) = moveRegex.find(moveCommand)?.destructured
                ?: throw Exception("Command does not match regex.")
            val startStack = stacks[from.toInt() - 1]
            val endStack = stacks[to.toInt() - 1]

            repeat(count.toInt()) {
                endStack.push(startStack.pop())
            }
        }

        return stacks.map { it.peek() }.joinToString("")
    }

    override fun solvePartB(): Number {
        TODO("Not yet implemented")
    }

    private fun loadCrates(): List<Stack<Char>> {
        val stacks = mutableListOf<Stack<Char>>()
        val stackInfos = data.subList(0, firstRowWithMove - 2)

        stackInfos.forEach { info ->
            // Skip the first "["
            for (i in 1 until info.length step 4) {
                val char = info[i]
                val stackIdx = i / 4

                if (stacks.size <= stackIdx) {
                    stacks.add(Stack())
                }

                if (char.isLetter()) {
                    stacks[stackIdx].push(char)

                    //stacks[stackIdx] = stack
                }
            }
        }

        return stacks.map { it.inverse() }
    }

    private fun getEmptyLineIndex(): Int = data.indexOfFirst { it == "" }
}

private fun <T> Stack<T>.inverse(): Stack<T> {
    val inverse = Stack<T>()

    while (isNotEmpty()) {
        inverse.push(pop())
    }

    return inverse
}

fun main() {
    Puzzle05().solve()
}

package puzzle04

import common.PuzzleSolver

class Puzzle04 : PuzzleSolver(4) {
    private val input by lazy { getPuzzleLines() }
    private val randomNumbers: List<Int>
    private val boardInputs: List<String>

    init {
        //loadPuzzleTestData(1)
        randomNumbers = input[0].split(",").map { it.toInt() }
        boardInputs = input.subList(1, input.size)
    }

    override fun solvePartA(): Number {
        val boards: MutableList<BingoBoard> = mutableListOf()

        for (i in boardInputs.indices step 5) {
            boards += BingoBoard(boardInputs.subList(i, i + 5))
        }

        val winningBoard: BingoBoard = determineWinningBoard(boards)
        winningBoard.draw()

        return winningBoard.getSumOfUnmarkedNumbers() * winningBoard.getLastCheckedNumber()
    }

    override fun solvePartB(): Number {
        TODO("Not yet implemented")
    }

    private fun determineWinningBoard(boards: List<BingoBoard>): BingoBoard {
        randomNumbers.forEach { number ->
            boards.forEach {
                it.checkNumber(number)
                if (it.hasWinningLine()) {
                    return it
                }
            }
        }

        throw Error("No board wins after all numbers have been drawn")
    }
}

fun main() {
    Puzzle04().solve()
}

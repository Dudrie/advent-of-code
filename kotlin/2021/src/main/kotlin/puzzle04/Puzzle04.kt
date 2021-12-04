package puzzle04

import common.PuzzleSolver

class Puzzle04 : PuzzleSolver(4) {
    private val input by lazy { getPuzzleLines() }
    private val randomNumbers: List<Int>
    private val boardInputs: List<String>

    init {
        randomNumbers = input[0].split(",").map { it.toInt() }
        boardInputs = input.subList(1, input.size)
    }

    override fun solvePartA(): Number {
        val boards = loadBoards()

        val (winningBoard) = determineWinningBoard(boards)
        winningBoard.draw()

        return winningBoard.getSumOfUnmarkedNumbers() * winningBoard.getLastCheckedNumber()
    }

    override fun solvePartB(): Number {
        val boards = loadBoards()
        var indexOfNextNumber = 0
        var lastWinningBoard: BingoBoard? = null

        while (boards.size > 0) {
            val (winningBoard, index) = determineWinningBoard(boards, indexOfNextNumber)

            lastWinningBoard = winningBoard
            boards.remove(winningBoard)

            // We continue at the same index because determineWinningBoard returns as soon as it finds a board with a winning line.
            indexOfNextNumber = index
        }

        if (lastWinningBoard == null) {
            throw Error("There are no winning boards.")
        }
        lastWinningBoard.draw()
        return lastWinningBoard.getSumOfUnmarkedNumbers() * lastWinningBoard.getLastCheckedNumber()
    }

    private fun loadBoards(): MutableList<BingoBoard> {
        val boards: MutableList<BingoBoard> = mutableListOf()

        for (i in boardInputs.indices step 5) {
            boards += BingoBoard(i / 5 + 1, boardInputs.subList(i, i + 5))
        }

        return boards
    }

    private fun determineWinningBoard(boards: List<BingoBoard>, startIdx: Int = 0): WinningBoardData {
        for (i in startIdx until randomNumbers.size) {
            val number = randomNumbers[i]

            boards.forEach {
                it.checkNumber(number)
                if (it.hasWinningLine()) {
                    return WinningBoardData(it, i)
                }
            }
        }

        throw Error("No board wins after all numbers have been drawn")
    }
}

data class WinningBoardData(val board: BingoBoard, val currentNumberIndex: Int)

fun main() {
    Puzzle04().solve()
}

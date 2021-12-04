package puzzle04

import model.Coordinates

class BingoBoard(inputLines: List<String>) {
    private val numbers: List<BingoNumber>
    private var lastCheckedIdx: Int? = null
    private var winningIndexes: List<Int> = mutableListOf()

    init {
        numbers = loadNumbersFromInput(inputLines)
    }

    fun checkNumber(value: Int) {
        numbers.forEachIndexed { index, bingoNumber ->
            if (bingoNumber.value == value) {
                bingoNumber.checked = true
                lastCheckedIdx = index
            }
        }
    }

    fun hasWinningLine(): Boolean {
        val (column, row) = getCoordinatesOfIndex(lastCheckedIdx ?: return false)

        checkRow(row)
        checkColumn(column)

        return winningIndexes.isNotEmpty()
    }

    fun getSumOfUnmarkedNumbers(): Int = numbers.sumOf {
        if (it.checked) 0 else it.value
    }

    fun getLastCheckedNumber(): Int {
        val index = lastCheckedIdx ?: throw Error("There are no checked numbers on this board")
        val (x, y) = getCoordinatesOfIndex(index)
        return getNumberAt(x, y).value
    }

    private fun checkRow(row: Int) {
        checkPart { Coordinates(it, row) }
    }

    private fun checkColumn(column: Int) {
        checkPart { Coordinates(column, it) }
    }

    private fun checkPart(getCoords: (idx: Int) -> Coordinates) {
        val winning = mutableListOf<Int>()

        for (i in 0 until 5) {
            val (x, y) = getCoords(i)
            if (!getNumberAt(x, y).checked) {
                return
            } else {
                winning += getIndexOfCoordinates(x, y)
            }
        }

        winningIndexes = winning
    }

    private fun getNumberAt(x: Int, y: Int): BingoNumber = numbers[getIndexOfCoordinates(x, y)]

    private fun getIndexOfCoordinates(x: Int, y: Int): Int = y * 5 + x

    private fun getCoordinatesOfIndex(index: Int) = Coordinates(index % 5, index / 5)

    private fun loadNumbersFromInput(inputLines: List<String>): List<BingoNumber> {
        val parsedNumbers = mutableListOf<BingoNumber>()
        inputLines.forEach {
            for (i in it.indices step 3) {
                val numberToParse = "${it[i]}${it[i + 1]}".replace(Regex("\\s"), "")
                parsedNumbers += BingoNumber(numberToParse.toInt())
            }
        }
        return parsedNumbers
    }

    fun draw() {
        var representation = ""
        for (y in 0 until 5) {
            for (x in 0 until 5) {
                representation += "\u001B[0m" + getNumberAt(x, y) + " \u001B[0m"
            }
            representation += "\n"
        }
        println(representation)
    }
}

data class BingoNumber(val value: Int, var checked: Boolean = false) {
    override fun toString(): String {
        var representation = ""
        if (checked) {
            representation += "\u001B[31m"
        }

        representation += value.toString().padStart(2, ' ')
        return representation
    }
}

class Puzzle03 : PuzzleSolver(3) {

    private val numbers by lazy { getPuzzleLines() }

    override fun solvePartA(): Number {
        var gammaRate = ""
        var epsilonRate = ""
        val numberLength = numbers[0].length

        for (i in 0 until numberLength) {
            val (zeroCount, oneCount) = getBitCountAt(i)
            gammaRate += if (zeroCount > oneCount) "0" else "1"
            epsilonRate += if (zeroCount > oneCount) "1" else "0"
        }

        return gammaRate.toInt(2) * epsilonRate.toInt(2)
    }

    override fun solvePartB(): Number {
        val oxygenFactor = getFilteredValueFromList(numbers.toList()) {
            val (zeroCount, oneCount) = it
            if (oneCount >= zeroCount) '1' else '0'
        }
        val co2Factor = getFilteredValueFromList(numbers.toList()) {
            val (zeroCount, oneCount) = it
            if (zeroCount <= oneCount) '0' else '1'

        }

        return oxygenFactor.toInt(2) * co2Factor.toInt(2)
    }

    private fun getFilteredValueFromList(list: List<String>, getRelevantBit: (it: BitCount) -> Char): String {
        var filteredList = list.toList()
        var currentPosition = 0

        while (filteredList.size > 1) {
            val commonBit = getRelevantBit(getBitCountAt(currentPosition, filteredList))

            filteredList = filteredList.filter { it[currentPosition] == commonBit }
            currentPosition++
        }

        return filteredList[0]
    }

    private fun getBitCountAt(pos: Int, list: List<String> = numbers): BitCount {
        var oneCount = 0
        list.forEach {
            if (it[pos] == '1') {
                oneCount++
            }
        }

        return BitCount(list.size - oneCount, oneCount)
    }
}

private data class BitCount(val zeroCount: Int, val oneCount: Int)

fun main() {
    Puzzle03().solve()
}

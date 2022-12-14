package puzzle06

import common.PuzzleSolver

class Puzzle06 : PuzzleSolver(6) {
    private val data by lazy {
//        loadPuzzleTestData(4)
        getPuzzleLines()
    }
    private val inputStream = data[0]

    override fun solvePartA(): Number = getMarkerPosition(4)

    override fun solvePartB(): Number = getMarkerPosition(14)

    private fun getMarkerPosition(distinctCount: Int): Int {
        var markerPosition = -1

        for (marker in 0..(inputStream.length - distinctCount + 1)) {
            var foundDuplicate = false

            for (i in 0 until distinctCount) {
                val char = inputStream[marker + i]

                for (k in (distinctCount - i - 1) downTo 1) {
                    if (inputStream[marker + i + k] == char) {
                        foundDuplicate = true
                        break
                    }
                }
            }

            if (!foundDuplicate) {
                markerPosition = marker + distinctCount
                break
            }
        }

        return markerPosition
    }
}

fun main() {
    Puzzle06().solve()
}

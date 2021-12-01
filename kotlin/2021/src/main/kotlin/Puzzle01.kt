class Puzzle01 : PuzzleSolver(1) {

    override fun solvePartA(): Number = getIncreasedCount(getPuzzleLinesToInt())

    override fun solvePartB(): Number {
        val data = getPuzzleLinesToInt()
        val sums: MutableList<Int> = mutableListOf()

        for (i in 0 until data.size - 2) {
            sums += 0

            for (k in 0..2) {
                sums[i] += data[i + k]
            }
        }

        return getIncreasedCount(sums)
    }

    private fun getIncreasedCount(list: List<Int>): Int {
        var previous = list[0]
        var increased = 0

        list.takeLast(list.size - 1).forEach {
            if (previous < it) {
                increased++
            }

            previous = it
        }

        return increased
    }

    private fun getPuzzleLinesToInt(): List<Int> = getPuzzleLines().map { it.toInt() }
}

fun main() {
    Puzzle01().solve()
}

import kotlin.system.measureTimeMillis

abstract class PuzzleSolver(private val puzzleNumber: Int) {
    private var inputReader: PuzzleInputReader = PuzzleInputReader(puzzleNumber)

    abstract fun solvePartA(): Number

    abstract fun solvePartB(): Number

    fun solve() {
        solvePart(PuzzlePart.A, this::solvePartA)
        solvePart(PuzzlePart.B, this::solvePartB)
    }

    @Suppress("unused")
    protected fun getPuzzleInput(): String = inputReader.getPuzzleInput()

    protected fun getPuzzleLines(): List<String> = inputReader.getPuzzleInputSplitByLines()

    @Suppress("unused")
    protected fun loadPuzzleTestData(testNo: Int) {
        inputReader = PuzzleInputReader(puzzleNumber, testNo)
    }

    private fun solvePart(part: PuzzlePart, action: () -> Number) {
        try {
            var solution: Number
            val time = measureTimeMillis { solution = action() }
            printSolution(solution, part, time)
        } catch (e: NotImplementedError) {
            println("Part B is not yet implemented")
        }
    }

    private fun printSolution(solution: Number, part: PuzzlePart, time: Long) {
        println("Part $part: $solution ($time ms)")
    }
}

enum class PuzzlePart {
    A, B
}

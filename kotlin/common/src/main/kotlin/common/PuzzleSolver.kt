package common

import kotlin.system.measureTimeMillis

abstract class PuzzleSolver(private val puzzleNumber: Int) {
    private var inputReader: PuzzleInputReader = PuzzleInputReader(puzzleNumber)

    abstract fun solvePartA(): Any

    abstract fun solvePartB(): Any

    fun solve() {
        solvePart(PuzzlePart.A, this::solvePartA)
        solvePart(PuzzlePart.B, this::solvePartB)
    }

    @Suppress("unused")
    protected fun getPuzzleInput(): String = inputReader.getPuzzleInput()

    protected fun getPuzzleLines(): List<String> = inputReader.getPuzzleInputSplitByLines()

    protected fun getPuzzleLinesWithEmpty(): List<String> =
        inputReader.getPuzzleInputWithEmptyLines()

    @Suppress("unused")
    protected fun loadPuzzleTestData(testNo: Int) {
        inputReader = PuzzleInputReader(puzzleNumber, testNo)
    }

    private fun solvePart(part: PuzzlePart, action: () -> Any) {
        try {
            var solution: Any
            val time = measureTimeMillis { solution = action() }
            printSolution(solution, part, time)
        } catch (e: NotImplementedError) {
            println("[Not ready] Part $part is not yet implemented")
        }
    }

    private fun printSolution(solution: Any, part: PuzzlePart, time: Long) {
        println("[Solution] Part $part: $solution ($time ms)")
    }
}

enum class PuzzlePart {
    A, B
}

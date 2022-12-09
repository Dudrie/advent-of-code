package common

import java.io.FileNotFoundException
import java.net.URL

data class PuzzleInputReader(val puzzleNumber: Int, val testNo: Int? = null) {

    fun getPuzzleInput(): String = loadInput()

    fun getPuzzleInputSplitByLines(): List<String> =
        getPuzzleInputWithEmptyLines().filter { it != "" }

    fun getPuzzleInputWithEmptyLines(): List<String> = this.loadInput().split(Regex("\r\n|\r|\n"))

    private fun loadInput(): String {
        val numString = puzzleNumber.toTwoDigitString()
        val testPostfix = if (testNo != null) {
            "Test${testNo.toTwoDigitString()}"
        } else {
            "Input"
        }
        val filePath = "Puzzle$numString/$testPostfix.txt"

        return loadResource(filePath).readText(Charsets.UTF_8).trimEnd()
    }

    private fun loadResource(filePath: String): URL {
        val url = this::class.java.classLoader.getResource(filePath)

        return url
            ?: throw FileNotFoundException("The puzzle file at \"$filePath\" could not be found.")
    }

}

fun Int.toTwoDigitString(): String = this.toString().padStart(2, '0')

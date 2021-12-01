import java.io.FileNotFoundException
import java.net.URL

data class PuzzleInputReader(val puzzleNumber: Number, val testNo: Number? = null) {

    fun getPuzzleInput(): String = loadInput()

    fun getPuzzleInputSplitByLines(): List<String> = getPuzzleInputWithEmptyLines().filter { it != "" }

    private fun getPuzzleInputWithEmptyLines(): List<String> = this.loadInput().split(Regex("\r\n|\r|\n"))

    private fun loadInput(): String {
        val numString = puzzleNumber.toTwoDigitString()
        val testPostfix = if (testNo != null) {
            "_Test${testNo.toTwoDigitString()}"
        } else {
            ""
        }
        val filePath = "puzzle$numString$testPostfix.txt"

        return loadResource(filePath).readText(Charsets.UTF_8)
    }

    private fun loadResource(filePath: String): URL {
        val url = this::class.java.classLoader.getResource(filePath)

        return url ?: throw FileNotFoundException("The puzzle file at \"$filePath\" could not be found.")
    }

}

fun Number.toTwoDigitString(): String = this.toString().padStart(2, '0')

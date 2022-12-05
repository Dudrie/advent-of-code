import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

group = "de.github.dudrie"
version = "1.0"

plugins {
    kotlin("jvm") version "1.7.20"
}

allprojects {
    group = rootProject.group
    version = rootProject.version

    repositories {
        mavenCentral()
    }

    tasks.withType<KotlinCompile>() {
        kotlinOptions.jvmTarget = "17"
    }

}

task("createPuzzle") {
    val currentYear = 2022
    val projectPath = "$currentYear/src/main"

    doLast {
        val puzzle: String by project

        if (puzzle == "") {
            throw Error("\"puzzle\" parameter must not be empty.")
        }

        val puzzleTwoDigits = puzzle.padStart(2, '0')
        val codePath = "$projectPath/kotlin"
        val resourcePath = "$projectPath/resources/Puzzle$puzzleTwoDigits"

        createNewPuzzleCodeFile(puzzle.toInt(), codePath)

        createNewFile("$resourcePath/Input.txt")
        createNewFile("$resourcePath/Test01.txt")
    }
}

fun createNewFile(filePath: String): File {
    val fileToCreate = file(filePath)

    fileToCreate.parentFile.mkdirs()
    val isFileCreated = fileToCreate.createNewFile()
    if (isFileCreated) {
        println("[CREATED] $filePath")
    } else {
        println("[ALREADY EXISTS] $filePath")
    }

    return fileToCreate
}

fun createNewPuzzleCodeFile(puzzleNo: Int, codePath: String) {
    val puzzleNoTwoDigits = puzzleNo.toString().padStart(2, '0')
    val filePath = "$codePath/puzzle$puzzleNoTwoDigits/Puzzle$puzzleNoTwoDigits.kt"
    val file = createNewFile(filePath)

    if (file.length() == 0L) {
        file.writer(Charsets.UTF_8).use {
            it.write(
                "package puzzle$puzzleNoTwoDigits\n" +
                        "\n" +
                        "import common.PuzzleSolver\n" +
                        "\n" +
                        "class Puzzle$puzzleNoTwoDigits : PuzzleSolver($puzzleNo) {\n" +
                        "    private val data by lazy {\n" +
                        "        getPuzzleLines()\n" +
                        "    }\n" +
                        "\n" +
                        "    override fun solvePartA(): Number {\n" +
                        "        TODO(\"Not yet implemented\")\n" +
                        "    }\n" +
                        "\n" +
                        "    override fun solvePartB(): Number {\n" +
                        "        TODO(\"Not yet implemented\")\n" +
                        "    }\n" +
                        "\n" +
                        "}\n" +
                        "\n" +
                        "fun main() {\n" +
                        "    Puzzle$puzzleNoTwoDigits().solve()\n" +
                        "}\n"
            )
        }

        println("[CREATED] Content of $filePath")
    }
}

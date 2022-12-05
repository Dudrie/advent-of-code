package puzzle02

import common.PuzzleSolver

class Puzzle02 : PuzzleSolver(2) {
    private val data by lazy {
        getPuzzleLines()
    }

    private val choices = listOf(
        RPSStrategy(RPSChoice.Rock, "A", "X", RPSChoice.Scissor, RPSChoice.Paper),
        RPSStrategy(RPSChoice.Paper, "B", "Y", RPSChoice.Rock, RPSChoice.Scissor),
        RPSStrategy(RPSChoice.Scissor, "C", "Z", RPSChoice.Paper, RPSChoice.Rock)
    )

    private val pointsForWin = 6
    private val pointsForDraw = 3
    private val pointsForLoss = 0

    override fun solvePartA(): Number {
        var sum = 0

        data.forEach { line ->
            sum += handleStrategy(line) { opponentsStrategy, yourStrategy
                ->
                yourStrategy.choice.shapeScore + if (opponentsStrategy == yourStrategy) {
                    pointsForDraw
                } else if (yourStrategy.beats == opponentsStrategy.choice) {
                    pointsForWin
                } else {
                    pointsForLoss
                }
            }
        }

        return sum
    }

    override fun solvePartB(): Number {
        var sum = 0

        data.forEach { line ->
            sum += handleStrategy(line) { opponentsStrategy, yourStrategy ->
                when (yourStrategy.yourId) {
                    // Loose
                    "X" -> opponentsStrategy.beats.shapeScore + 0

                    //Draw
                    "Y" -> opponentsStrategy.choice.shapeScore + 3

                    // Win
                    "Z" -> opponentsStrategy.beatenBy.shapeScore + 6

                    else -> throw Exception()
                }
            }

        }

        return sum
    }

    private fun handleStrategy(line: String, handler: (RPSStrategy, RPSStrategy) -> Int): Int {
        val (opponentId, yourId) = line.split(" ")
        val opponentsStrategy = choices.findNonNull { it.opponentId == opponentId }
        val yourStrategy = choices.findNonNull { it.yourId == yourId }

        return handler(opponentsStrategy, yourStrategy)
    }
}

private fun <T> List<T>.findNonNull(predicate: (T) -> Boolean): T {
    return find(predicate) ?: throw NoSuchElementException("No element was found matching the given predicate.")
}

private enum class RPSChoice(val shapeScore: Int) {
    Rock(1), Paper(2), Scissor(3)
}

private data class RPSStrategy(
    val choice: RPSChoice,
    val opponentId: String,
    val yourId: String,
    val beats: RPSChoice,
    val beatenBy: RPSChoice
)

fun main() {
    Puzzle02().solve()
}

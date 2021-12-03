class Puzzle02 : PuzzleSolver(2) {
    private lateinit var submarinePosition: SubmarinePosition
    private val commands by lazy { getPuzzleLines() }

    override fun solvePartA(): Number {
        submarinePosition = SubmarinePosition(0, 0, 0)

        commands.forEach {
            submarinePosition += SubmarineCommand(it)
        }

        return submarinePosition.horizontal * submarinePosition.depth
    }

    override fun solvePartB(): Number {
        submarinePosition = SubmarinePosition(0, 0, 0)
        commands.forEach {
            submarinePosition *= SubmarineCommand(it)
        }

        return submarinePosition.horizontal * submarinePosition.depth
    }

}

data class SubmarinePosition(val horizontal: Int, val depth: Int, val aim: Int) {
    /**
     * Evaluation of the command for part A
     */
    operator fun plus(command: SubmarineCommand): SubmarinePosition {
        return when (command.direction) {
            "forward" -> copy(horizontal = horizontal + command.amount)
            "up" -> copy(depth = depth - command.amount)
            "down" -> copy(depth = depth + command.amount)
            else -> throw Error("The given direction \"${command.direction}\" is not supported.")
        }
    }

    /**
     * Evaluation of the command for part B
     */
    operator fun times(command: SubmarineCommand): SubmarinePosition {
        return when (command.direction) {
            "forward" -> copy(horizontal = horizontal + command.amount, depth = depth + command.amount * aim)
            "up" -> copy(aim = aim - command.amount)
            "down" -> copy(aim = aim + command.amount)
            else -> throw Error("The given direction \"${command.direction}\" is not supported.")
        }
    }
}

class SubmarineCommand(commandString: String) {
    val direction: String
    val amount: Int

    init {
        val parts = commandString.split(Regex("\\s"))
        direction = parts[0]
        amount = parts[1].toInt()
    }
}

fun main() {
    Puzzle02().solve()
}

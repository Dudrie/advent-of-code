package puzzle08

val allSegments = listOf('a', 'b', 'c', 'd', 'e', 'f', 'g')

data class Digit(val value: Int, val segments: List<Char>) {
    val segmentCount = segments.size

    val segmentSet: Set<Char> = segments.toSet()
}

object Digits {
    private val digits: List<Digit> = listOf(
        Digit(0, listOf('a', 'b', 'c', 'e', 'f', 'g')),
        Digit(1, listOf('c', 'f')),
        Digit(2, listOf('a', 'c', 'd', 'e', 'g')),
        Digit(3, listOf('a', 'c', 'd', 'f', 'g')),
        Digit(4, listOf('b', 'c', 'd', 'f')),
        Digit(5, listOf('a', 'b', 'd', 'f', 'g')),
        Digit(6, listOf('a', 'b', 'd', 'e', 'f', 'g')),
        Digit(7, listOf('a', 'c', 'f')),
        Digit(8, listOf('a', 'b', 'c', 'd', 'e', 'f', 'g')),
        Digit(9, listOf('a', 'b', 'c', 'd', 'f', 'g'))
    )

    operator fun get(i: Int): Digit = digits[i]

    fun getDigitFromSegments(segments: List<Char>): Digit {
        val segmentSet = segments.toSet()

        for (digit in digits) {
            if (digit.segmentSet == segmentSet) {
                return digit
            }
        }

        throw Error("No digit found for the segments $segments")
    }

}

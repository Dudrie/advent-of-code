package puzzle08

import common.PuzzleSolver

class Puzzle08 : PuzzleSolver(8) {
    private val data by lazy {
        loadPuzzleTestData(2)
        getPuzzleLines()
    }

    private val displays: List<Display> = data.map { Display(it) }

    override fun solvePartA(): Number {
        var count = 0

        displays.forEach {
            it.output.forEach { segments ->
                val length = segments.length

                if (length == Digits[1].segmentCount || length == Digits[4].segmentCount || length == Digits[7].segmentCount || length == Digits[8].segmentCount) {
                    count++
                }
            }
        }
        return count
    }

    override fun solvePartB(): Number {
        displays[0].analysePatterns()
        TODO("Not yet implemented")
    }
}

class Display(input: String) {
    val patterns: List<String>
    val output: List<String>

    private val segmentMapping: MutableMap<Char, List<Char>> = getStartingSegmentMapping()

    init {
        val splitInput = input.split(' ')
        patterns = splitInput.subList(0, 10).map { it.sorted() }
        output = splitInput.subList(11, 15).map { it.sorted() }
    }

    fun analysePatterns() {
        generateMappingFromPatterns()
        val mapping = doFinalExclusion()

        
        TODO("Mappings durch 'Ausschlussverfahren' vervollständigen.")
    }

    private fun generateMappingFromPatterns() {
        patterns.forEach {
            when (it.length) {
                Digits[1].segmentCount -> adjustMapping(Digits[1].segments, it)
                Digits[4].segmentCount -> adjustMapping(Digits[4].segments, it)
                Digits[7].segmentCount -> adjustMapping(Digits[7].segments, it)
                Digits[8].segmentCount -> adjustMapping(Digits[8].segments, it)
                // Possible digits: 2 / 3 / 5
                5 -> adjustMapping(listOf('a', 'd', 'g'), it)
                // Possible digits: 0 / 6 / 9
                6 -> adjustMapping(listOf('a', 'b', 'f', 'g'), it)
            }
        }
    }

    private fun doFinalExclusion(): List<SegmentMapping> {
        var mapping = segmentMapping.map { (char, list) -> SegmentMapping(char, list.toMutableList()) }
        var isDone = false

        while (!isDone) {
            var hadChanges = false
            mapping = mapping.sortedBy { it.mappingSize }

            for (i in 0 until mapping.size - 1) {
                val current = mapping[i]

                if (current.mappingSize == 1) {
                    for (k in i + 1 until mapping.size) {
                        val toChange = mapping[k]
                        val wasRemoved = toChange.removeMapping(current.mapping[0])
                        hadChanges = hadChanges || wasRemoved
                    }
                }
            }

            isDone = !hadChanges
        }

        return mapping
    }

    private fun adjustMapping(segments: List<Char>, pattern: String) {
        val charsNotInPattern = inverseMapOfSegments(pattern.toCharArray().toList())

        segments.forEach {
            val currentSegments = segmentMapping[it]!!.toMutableList()

            charsNotInPattern.forEach { char -> currentSegments.remove(char) }
            segmentMapping[it] = currentSegments
        }
    }

    private fun getStartingSegmentMapping(): MutableMap<Char, List<Char>> {
        val segmentMapping = mutableMapOf<Char, List<Char>>()

        for (c in 'a'..'g') {
            segmentMapping[c] = allSegments.toList()
        }

        return segmentMapping
    }

    private fun inverseMapOfSegments(segments: List<Char>): List<Char> {
        val inversedSegments = allSegments.toMutableList()
        inversedSegments.removeAll(segments)
        return inversedSegments
    }
}

data class SegmentMapping(val segment: Char, val mapping: MutableList<Char>) {
    val mappingSize: Int
        get() = mapping.size

    fun removeMapping(char: Char) = mapping.remove(char)
}

fun main() {
    Puzzle08().solve()
}

private fun String.sorted() = toCharArray().sorted().joinToString("")

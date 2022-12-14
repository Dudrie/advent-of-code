package puzzle07

import common.PuzzleSolver
import java.util.*

class Puzzle07 : PuzzleSolver(7) {
    private val data by lazy {
//        loadPuzzleTestData(1)
        getPuzzleLines()
    }

    override fun solvePartA(): Number {
        val system = loadFileSystem()
        val stack = Stack<Directory>()
        var sum = 0

        // Don't include "/" in calculation
        stack.push(system.currentDirectory.getSubDirectories())

        while (stack.isNotEmpty()) {
            val directory = stack.pop()
            val directorySize = directory.size

            stack.push(directory.getSubDirectories())

            if (directorySize <= 100000) {
                sum += directorySize
            }
        }

        return sum
    }

    override fun solvePartB(): Number {
        val system = loadFileSystem()
        val diskSize = 70000000
        val required = 30000000
        val unused = diskSize - system.currentDirectory.size
        val missing = required - unused
        val candidates = mutableListOf<Directory>()

        val stack = Stack<Directory>()
        stack.push(system.currentDirectory)

        while (stack.isNotEmpty()) {
            val directory = stack.pop()
            stack.push(directory.getSubDirectories())

            if (directory.size >= missing) {
                candidates += directory
            }
        }

        candidates.sortBy { it.size }

        return candidates[0].size
    }

    private fun loadFileSystem(): FileSystem {
        val system = FileSystem()

        var lineIdx = 0
        while (lineIdx < data.size) {
            val currentLine = data[lineIdx]

            if (currentLine.startsWith("$")) {
                val (_, command) = currentLine.split(" ")

                when (command) {
                    "cd" -> system.changeDirectory(currentLine.split(" ")[2])
//                    "ls" -> // Do nothing
                }
            } else {
                val (prefix, name) = currentLine.split(" ")
                if (prefix == "dir") {
                    val directory = Directory(name, system.currentDirectory)
                    system.addToCurrentDir(directory)
                } else {
                    system.addToCurrentDir(File(name, prefix.toInt()))
                }
            }

            lineIdx++
        }

        system.changeDirectory("/")
        return system
    }
}

private fun <E> Stack<E>.push(elements: Iterable<E>) {
    elements.forEach { push(it) }
}

private class FileSystem {
    private val root = Directory("/", null)

    var currentDirectory: Directory = root
        private set

    fun changeDirectory(target: String) {
        when (target) {
            "/" -> currentDirectory = root
            ".." -> currentDirectory.parent?.let { currentDirectory = it }
            else -> currentDirectory = currentDirectory.getDirectory(target)
        }
    }

    fun addToCurrentDir(obj: FileObject) {
        currentDirectory.addObject(obj)
    }
}

private abstract class FileObject(val name: String) {
    abstract val size: Int
}

private class Directory(name: String, val parent: Directory?) : FileObject(name) {
    private val objects = mutableListOf<FileObject>()

    override val size: Int
        get() = objects.sumOf { it.size }

    fun addObject(obj: FileObject) {
        if (!contains(obj)) {
            objects.add(obj)
        }
    }

    fun getDirectory(name: String): Directory {
        for (obj in objects) {
            if (obj is Directory && obj.name == name) {
                return obj
            }
        }

        throw NoSuchElementException("There is no directory with the name $name.")
    }

    fun getSubDirectories(): List<Directory> {
        val list = mutableListOf<Directory>()
        objects.forEach {
            if (it is Directory) {
                list += it
            }
        }
        return list
    }

    private fun contains(obj: FileObject): Boolean =
        objects.find { it.name == obj.name } != null
}

private class File(name: String, override val size: Int) : FileObject(name)

fun main() {
    Puzzle07().solve()
}

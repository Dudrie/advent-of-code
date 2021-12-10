package model

data class Coordinates(val x: Int, val y: Int) {

    /**
     * Returns a list of [Coordinates] with all coordinates in the area between this and the [other].
     *
     * Both corners (upper left and lower right) are included in the list.
     */
    fun getAllBetween(other: Coordinates): List<Coordinates> {
        val startX = minOf(x, other.x)
        val endX = maxOf(x, other.x)
        val startY = minOf(y, other.y)
        val endY = maxOf(y, other.y)
        val list = mutableListOf<Coordinates>()

        for (y in startY..endY) {
            for (x in startX..endX) {
                list += Coordinates(x, y)
            }
        }

        return list
    }

    operator fun plus(vector: Vector): Coordinates = Coordinates(x + vector.deltaX, y + vector.deltaY)

    operator fun plus(direction: Direction): Coordinates = plus(direction.vector)

}

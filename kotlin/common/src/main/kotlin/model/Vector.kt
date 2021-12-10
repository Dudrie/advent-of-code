package model

val ALL_DIRECTIONS: List<Direction> = listOf(
    Direction.NORTH,
    Direction.NORTH_EAST,
    Direction.EAST,
    Direction.SOUTH_EAST,
    Direction.SOUTH,
    Direction.SOUTH_WEST,
    Direction.WEST,
    Direction.NORTH_WEST
)

enum class Direction(val vector: Vector) {
    NORTH(Vector(0, -1)),
    NORTH_EAST(Vector(1, -1)),
    EAST(Vector(1, 0)),
    SOUTH_EAST(Vector(1, 1)),
    SOUTH(Vector(0, 1)),
    SOUTH_WEST(Vector(-1, 1)),
    WEST(Vector(-1, 0)),
    NORTH_WEST(Vector(-1, -1))
}

data class Vector(val deltaX: Int, val deltaY: Int) {
    operator fun times(scalar: Int): Vector = Vector(deltaX * scalar, deltaY * scalar)
}

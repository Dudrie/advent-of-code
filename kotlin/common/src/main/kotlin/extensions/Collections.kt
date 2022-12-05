package extensions

fun <T> Iterable<T>.findNonNull(predicate: (T) -> Boolean): T {
    return find(predicate) ?: throw NoSuchElementException("No element was found matching the given predicate.")
}

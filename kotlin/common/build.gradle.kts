import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.5.31"
}

group = "de.github.dudrie"
version = "1.0"

tasks.withType<KotlinCompile>() {
    kotlinOptions.jvmTarget = "1.8"
}

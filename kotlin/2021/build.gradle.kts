plugins {
    kotlin("jvm")
}

dependencies {
    implementation(project(":common"))

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnit()
}

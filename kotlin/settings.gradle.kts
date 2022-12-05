rootProject.name = "advent-of-code"


include(":common")
include(":2021")
include("2022:advent-of-code.2022")
findProject(":2022:advent-of-code.2022")?.name = "advent-of-code.2022"

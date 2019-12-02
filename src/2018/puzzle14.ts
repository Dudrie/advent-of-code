const input: number = 110201;
// input = 9; // Testing

// Part A
let recipes: number[] = [3, 7];
let firstElf: number = 0;
let secondElf: number = 1;

while (recipes.length < input + 10) {
  const { firstElf: first, secondElf: second } = generateRecipes(recipes, firstElf, secondElf);

  firstElf = first;
  secondElf = second;
}

const tenRecipes: number[] = recipes.slice(input, input + 10);

console.log(`Part A -- Scores of the ten recipes: ${tenRecipes.join('')}`);

// Part B
recipes = [3, 7];
firstElf = 0;
secondElf = 1;

const inputLength: number = input.toString().length;
const wantedRecipes: number[] = input
  .toString()
  .split('')
  .map(n => Number.parseInt(n));

while (recipes.length < inputLength) {
  const { firstElf: first, secondElf: second } = generateRecipes(recipes, firstElf, secondElf);

  firstElf = first;
  secondElf = second;
}

let wasFound: boolean = false;

// We do NOT need to check, if the first recipes match in THIS case because the input starts with '11' while the recipse list starts with '37'. But we 'simulate' that skipped search.
let currSearchStartIdx: number = recipes.length - inputLength;

while (!wasFound) {
  // Generate new recipes
  const oldCount: number = recipes.length;
  const { firstElf: first, secondElf: second } = generateRecipes(recipes, firstElf, secondElf);

  firstElf = first;
  secondElf = second;

  let diff: number = recipes.length - oldCount;

  while (diff > 0 && !wasFound) {
    // Increase the starting index for the search
    currSearchStartIdx += 1;
    diff--;

    // Check, if the pattern matches
    wasFound = true;
    for (let i = currSearchStartIdx; i < currSearchStartIdx + inputLength; i++) {
      if (wantedRecipes[i - currSearchStartIdx] !== recipes[i]) {
        wasFound = false;
        break;
      }
    }
  }
}

console.log(`Part B -- Recipes before matching recipes: ${currSearchStartIdx}`);

// ========= HELPERS ==========
function generateRecipes(
  recipes: number[],
  firstElf: number,
  secondElf: number
): { firstElf: number; secondElf: number } {
  // We do not have enough recipes yet, so create new ones
  const newRecipes: number = recipes[firstElf] + recipes[secondElf];

  if (newRecipes > 9) {
    recipes.push(Math.floor(newRecipes / 10));
  }

  recipes.push(newRecipes % 10);

  // Advance elfs
  return {
    firstElf: (firstElf + recipes[firstElf] + 1) % recipes.length,
    secondElf: (secondElf + recipes[secondElf] + 1) % recipes.length,
  };
}

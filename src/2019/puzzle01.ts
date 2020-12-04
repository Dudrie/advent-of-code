import { readPuzzleInput, getLinesOfInput } from '../util/PuzzleInputReader';

function calcFuelOfModule(mod: number): number {
  return Math.floor(mod / 3) - 2;
}

function calcFuelOfModuleAndFuel(mod: number): number {
  const fuelOfModule = calcFuelOfModule(mod);

  if (fuelOfModule < 0) {
    return 0;
  }

  return fuelOfModule + calcFuelOfModuleAndFuel(fuelOfModule);
}

const input = readPuzzleInput(1);
const modules: number[] = getLinesOfInput(input).map((line) => Number.parseInt(line, 10));
const totalFuel = modules.reduce((mass, module) => mass + calcFuelOfModuleAndFuel(module), 0);

console.log(`A: Total fuel is ${totalFuel}`);

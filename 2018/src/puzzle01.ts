import { readPuzzleInput, getLinesOfInput } from './util/utils';

let input: string = readPuzzleInput(1);

let freqChanges: number[] = getLinesOfInput(input).map((str) => Number.parseInt(str));
let frequency: number = 0;

// Part 1
freqChanges.forEach((ch) => frequency += ch);
console.log(`Part 1 -- Frequency: ${frequency}`);

// Part 2
frequency = 0;
let foundFrequencies: number[] = [];
let duplicateFreq: number | undefined = undefined;

while (duplicateFreq === undefined) {
    for (let i = 0; i < freqChanges.length && duplicateFreq === undefined; i++) {
        frequency += freqChanges[i];
        
        if (hasFrequency(foundFrequencies, frequency)) {
            duplicateFreq = frequency;
        }

        foundFrequencies.push(frequency);
    }
}

console.log(`Part 2 -- Duplicate frequency: ${duplicateFreq}`);

function hasFrequency(listOfFrequencies: number[], currentFreq: number): boolean {
    for (let f of listOfFrequencies) {
        if (f === currentFreq) {
            return true;
        }
    }

    return false;
}
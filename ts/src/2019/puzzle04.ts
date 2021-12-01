interface Interval {
  start: number;
  end: number;
}

function isValidPassword(password: number): boolean {
  const pwString = password.toString();

  if (pwString.length !== 6) {
    return false;
  }

  let hasDuplicate = false;
  let isDecreasing = false;

  for (let i = 0; i < pwString.length - 1; i++) {
    const character = pwString.charAt(i);

    let k = 0;
    let currentCharacter = pwString.charAt(i + 1);

    while (character === currentCharacter) {
      currentCharacter = pwString.charAt(i + 1 + k);
      k++;
    }

    if (k === 2) {
      hasDuplicate = true;
    }

    i += k > 0 ? k - 1 : 0;

    const nextCharacter = pwString.charAt(i + 1);

    if (Number.parseInt(nextCharacter) < Number.parseInt(character)) {
      isDecreasing = true;
    }
  }

  return hasDuplicate && !isDecreasing;
}

const range: Interval = { start: 123257, end: 647015 };
const passwords: number[] = [];

// console.log(`Check 111111 -- ${isValidPassword(111111)}`);
// console.log(`Check 223450 -- ${isValidPassword(223450)}`);
// console.log(`Check 123789 -- ${isValidPassword(123789)}`);

// console.log(`Check 112233 -- ${isValidPassword(112233)}`);
// console.log(`Check 123444 -- ${isValidPassword(123444)}`);
// console.log(`Check 111122 -- ${isValidPassword(111122)}`);

for (let pw = range.start; pw <= range.end; pw++) {
  if (isValidPassword(pw)) {
    passwords.push(pw);
  }
}

console.log(`A: Possible password count: ${passwords.length}`);

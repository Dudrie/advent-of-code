import { getLinesOfInput, readPuzzleInput } from '../util/PuzzleInputReader';

// let testInput: string = `
// [1518-11-01 00:00] Guard #10 begins shift
// [1518-11-01 00:05] falls asleep
// [1518-11-01 00:25] wakes up
// [1518-11-01 00:30] falls asleep
// [1518-11-01 00:55] wakes up
// [1518-11-01 23:58] Guard #99 begins shift
// [1518-11-02 00:40] falls asleep
// [1518-11-02 00:50] wakes up
// [1518-11-03 00:05] Guard #10 begins shift
// [1518-11-03 00:24] falls asleep
// [1518-11-03 00:29] wakes up
// [1518-11-04 00:02] Guard #99 begins shift
// [1518-11-04 00:36] falls asleep
// [1518-11-04 00:46] wakes up
// [1518-11-05 00:03] Guard #99 begins shift
// [1518-11-05 00:45] falls asleep
// [1518-11-05 00:55] wakes up
// `;

const lines: string[] = getLinesOfInput(readPuzzleInput(4));
// lines = getLinesOfInput(testInput);

const SLEEP: string = 'falls asleep';
const WAKE_UP: string = 'wakes up';
const START_SHIFT: string = 'shift';

const guardsById: { [id: number]: Guard } = {};
let guardIdOnShift: number = -1;
let startedSleepMinute: number = 0;

const logEntries: LogEntry[] = [];

for (const line of lines) {
  logEntries.push(parseLogEntry(line));
}

// ASC
logEntries.sort((a, b) => {
  if (a.month === b.month) {
    if (a.day === b.day) {
      return a.minute - b.minute;
    }

    return a.day - b.day;
  }

  return a.month - b.month;
});

for (const logEntry of logEntries) {
  if (logEntry.action.indexOf(START_SHIFT) !== -1) {
    const regex: RegExp = /#([0-9]+)/;
    const result: string[] | null = regex.exec(logEntry.action);

    if (result && result.length > 1) {
      guardIdOnShift = Number.parseInt(result[1]);
    } else {
      throw new Error(`Guard ID could not be parsed: ${logEntry}`);
    }
  } else if (logEntry.action.indexOf(SLEEP) !== -1) {
    startedSleepMinute = logEntry.minute;
  } else if (logEntry.action.indexOf(WAKE_UP) !== -1) {
    const guard: Guard = guardsById[guardIdOnShift] || {
      id: guardIdOnShift,
      sleepTimeByDay: {},
      totalSleepTime: 0,
    };
    determineSleepTime(guard, startedSleepMinute, logEntry.minute, logEntry.day);
    startedSleepMinute = -1;

    guardsById[guardIdOnShift] = guard;
  } else {
    console.error(`LogEntry action could not be parsed: "${logEntry}"`);
  }
}

// Sort the guards by sleep time and take the most tired one.
const guards: Guard[] = Object.values(guardsById);
guards.sort((a, b) => b.totalSleepTime - a.totalSleepTime); // DESC

const mostTiredGuard: Guard = guards[0];
const sleepMinutes: { [id: string]: { [min: number]: number } } = {};

// We're tracking the minutes where a guard sleeps for every guard so we can use this in B.
for (const g of guards) {
  const sleepyTime: { [min: number]: number } = {};

  for (const sleepTimeThatDay of Object.values(g.sleepTimeByDay)) {
    for (const min of sleepTimeThatDay) {
      sleepyTime[min] = (sleepyTime[min] || 0) + 1;
    }
  }

  sleepMinutes[g.id] = sleepyTime;
}

const mostTiredSleepMinutes: { [min: number]: number } = sleepMinutes[mostTiredGuard.id];

let minuteMostAsleep: number = -1;
for (const key of Object.keys(mostTiredSleepMinutes)) {
  const currentMinute: number = Number.parseInt(key);
  const currentMaxTime: number = mostTiredSleepMinutes[minuteMostAsleep] || 0;

  if (mostTiredSleepMinutes[currentMinute] > currentMaxTime) {
    minuteMostAsleep = currentMinute;
  }
}

console.log(
  `PART A -- Answer is: ${mostTiredGuard.id} * ${minuteMostAsleep} = ${
    mostTiredGuard.id * minuteMostAsleep
  }`
);

// Part B
let mostInOneMinuteId: number = -1;
let currentMax: { minute: number; times: number } = { minute: -1, times: -1 };
for (const key in sleepMinutes) {
  const id: number = Number.parseInt(key);
  const timesPerMinute: [string, number][] = Object.entries(sleepMinutes[id]).sort(
    (a, b) => b[1] - a[1]
  ); // DESC

  if (timesPerMinute[0][1] > currentMax.times) {
    currentMax = { minute: Number.parseInt(timesPerMinute[0][0]), times: timesPerMinute[0][1] };
    mostInOneMinuteId = id;
  }
}

console.log(
  `Part B -- Answer is: ${mostInOneMinuteId} * ${currentMax.minute} = ${
    mostInOneMinuteId * currentMax.minute
  }`
);

// ========== HELPERS ==========
type LogEntry = { month: number; day: number; minute: number; action: string };
type SleepingTimeByDay = { [day: number]: number[] };
type Guard = { id: number; sleepTimeByDay: SleepingTimeByDay; totalSleepTime: number };

function parseLogEntry(entryString: string): LogEntry {
  const regex: RegExp = /\[[0-9]{4}-([0-9]{2})-([0-9]{2}) [0-9]{2}:([0-9]{2})\] (.*)/;
  const result: string[] | null = regex.exec(entryString);

  if (!result) {
    throw new Error('ERROR -- NOT WORKING! CALL SANTA IMMEDIATLY!');
  }

  const month: number = Number.parseInt(result[1]);
  const day: number = Number.parseInt(result[2]);
  const minute: number = Number.parseInt(result[3]);
  const action: string = result[4];

  return { month, day, minute, action };
}

/**
 * Adds all passed sleeping times to the given guard.
 *
 * Internally respects that the `endMin` does not count towards the sleeping time. This method adjust the sleeping times of the given guard aswell.
 *
 * @param guard Guard sleeping
 * @param startMin Minute guard started sleeping
 * @param endMin Minute guard waked up
 * @param day Day of the guard duty
 */
function determineSleepTime(guard: Guard, startMin: number, endMin: number, day: number) {
  const sleepingTimesThisDay: number[] = guard.sleepTimeByDay[day] || [];

  for (let i = startMin; i < endMin; i++) {
    sleepingTimesThisDay.push(i);
  }

  guard.sleepTimeByDay[day] = sleepingTimesThisDay;
  guard.totalSleepTime += endMin - startMin;
}

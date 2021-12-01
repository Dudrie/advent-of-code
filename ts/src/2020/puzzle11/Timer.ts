/**
 * Timer that can be paused and resumed.
 */
export class Timer {
  private timer: NodeJS.Timeout | undefined;
  private lastStart: number;
  private remaining: number;
  private stopped: boolean;

  constructor(private readonly func: () => void, private readonly interval: number) {
    this.func = func;
    this.interval = interval;

    this.remaining = 0;
    this.lastStart = -1;
    this.stopped = false;
  }

  /**
   * Runs the given function. After running a new Timeout is started which will run the function again.
   * @private
   */
  private runFunc(): void {
    this.func();

    if (!this.stopped) {
      this.startTimer();
    }
  }

  /**
   * Starts a timer after which the `runFunc` will get called.
   * @returns The started timer (should only be used inside the constructor of this class).
   * @private
   */
  private startTimer(time: number = this.interval): NodeJS.Timeout {
    if (this.stopped) {
      throw new Error('Can not start a timer that was completly stopped.');
    }

    this.timer = setTimeout(() => this.runFunc(), time);
    this.lastStart = Date.now();
    return this.timer;
  }

  /**
   * Pauses this timer.
   *
   * Can be resumed with `resume`.
   */
  pause(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.remaining = Date.now() - this.lastStart;
    }
  }

  /**
   * Resume the timer and sets it to only the time that remained at the last pause.
   */
  resume(): void {
    this.startTimer(this.remaining);
    this.remaining = 0;
  }

  /**
   * Stops the timer completely.
   *
   * It can NOT be resumed afterwards.
   */
  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.stopped = true;
  }

  /**
   *Starts the timer for the first time.
   *
   * If you want to resume a paused timer use `resume` instead.
   */
  start(): void {
    if (this.lastStart != -1) {
      throw new Error(
        'Timer was already started and it can not be started again. Use resume to unpause a paused timer.'
      );
    }

    this.startTimer();
  }
}

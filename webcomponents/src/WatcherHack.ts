export type WatcherHackListener<T> = (after: T) => void;

export class WatcherHack<T> {
  private last: T;
  private readonly listeners: WatcherHackListener<T>[] = [];
  private interval: number | undefined;

  constructor(
    private readonly check: () => T,
    private readonly comparator: (a: T, b: T) => number = (a, b) => a === b ? 0 : 1,
  ) {
  }

  checkNow(): void {
    try {
      const before = this.last;
      const after = this.check();
      if (this.comparator(before, after) !== 0) {
        this.last = after;
        this.listeners.filter(listener => {
          try {
            listener(after);
            return false;
          } catch (e) {
            return true;
          }
        }).forEach(busted => {
          const index = this.listeners.findIndex(l => l === busted);
          if (index >= 0) {
            this.listeners.splice(index, 1);
          }
        });
      }
    } catch (e) {
      console.log("WatcherHack crashed during check");
      this.listeners.splice(0, this.listeners.length);
      if (this.interval !== undefined) {
        clearInterval(this.interval);
        this.interval = undefined;
      }
    }
  }

  subscribe(listener: WatcherHackListener<T>): void {
    try {
      if (this.interval === undefined) {
        this.interval = setInterval(() => this.checkNow(), 1000) as unknown as number;
        this.last = this.check();
      }
      listener(this.last);
      this.listeners.push(listener);
    } catch (e) {
      console.warn("WatcherHack listener crashed on subscribe", e);
    }
  }
}

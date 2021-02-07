import {ReadWriteRemove} from "./ReadWriteRemove";

export class StoredValue<T> implements ReadWriteRemove<T> {
  constructor(
    private readonly key: string,
    private readonly defaultValue: T,
  ) {
  }

  public read(): T {
    if (localStorage == null) {
      return this.defaultValue;
    }
    try {
      const json = localStorage.getItem(this.key);
      if (json == null) {
        return this.defaultValue;
      }
      return JSON.parse(json);
    } catch (e) {
      console.warn(`LocalStorage failed.  ${this.key} was not read.`);
      return this.defaultValue;
    }
  }

  public remove(): boolean {
    if (localStorage == null) {
      return false;
    }
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (e) {
      console.warn(`LocalStorage failed. "${this.key}" was not removed.`)
      return false;
    }
  }

  public write(value: T): boolean {
    if (localStorage == null) {
      return false;
    }
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.key, serialized);
      return true;
    } catch (e) {
      console.warn(`LocalStorage failed.  ${this.key} was not saved.`);
      return false;
    }
  }
}

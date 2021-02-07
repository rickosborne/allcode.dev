export interface ReadWrite<T> {
  read(): T;
  write(value: T): boolean;
}

export interface ReadWriteRemove<T> extends ReadWrite<T> {
  remove(): boolean;
}

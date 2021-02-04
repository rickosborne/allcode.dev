export function removeIf<T>(
  items: T[],
  predicate: (item: T) => boolean,
  onRemove?: (item: T, index: number) => void,
): void {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (predicate(item)) {
      items.splice(i, 1);
      if (onRemove != null) {
        onRemove(item, i);
      }
    }
  }
}

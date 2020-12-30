import {MonoTypeOperatorFunction, Observable, OperatorFunction} from "rxjs";
import {distinctUntilChanged, filter} from "rxjs/operators";

export function unindent(source: string): string {
  let delimiter = '\r\n';
  if (source.includes('\r\n')) {
    delimiter = '\r\n';
  } else if (source.includes('\r')) {
    delimiter = '\r';
  } else if (source.includes('\n')) {
    delimiter = '\n';
  } else {
    // single line
    return source.replace(/^\s+|\s+$/g, '');
  }
  const lines = source.split(delimiter);
  while (lines.length > 0 && lines[0].match(/^\s*$/)) {
    lines.shift();
  }
  while (lines.length > 0 && lines[lines.length - 1].match(/^\s*$/)) {
    lines.pop();
  }
  if (lines.length === 0) {
    return '';
  }
  const first = lines[0];
  const initialMatch = first.match(/^(\s+)/);
  if (initialMatch == null) {
    return lines.join(delimiter);
  }
  const leading = initialMatch[0];
  return lines.map(line => {
    if (line.startsWith(leading)) {
      return line.substr(leading.length);
    }
    return line;
  }).join(delimiter);
}

export function nonNull<T, U extends Exclude<T, null | undefined>>(): OperatorFunction<T, U> {
  return filter<T, U>((item: T): item is U => item != null);
}

export function arrayIdentityChanged<T extends Array<unknown>>(): MonoTypeOperatorFunction<T> {
  return distinctUntilChanged((a, b) => a !== b ||
    a.length !== b.length ||
    a.filter((v, n) => v !== b[n]).length > 0);
}

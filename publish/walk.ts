import * as fs from "fs";
import * as path from "path";

export enum WalkResult {
  // noinspection JSUnusedGlobalSymbols
  CONTINUE,
  SKIP,
  ABORT,
}

export enum WalkOrder {
  // noinspection JSUnusedGlobalSymbols
  DEPTH,
  BREADTH,
}

export function ls(dir: string): fs.Dirent[] {
  return fs.readdirSync(dir, {encoding: "utf8", withFileTypes: true})
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface WalkDirEnt {
  file: fs.Dirent,
  parent: string,
  relative: string,
}

export function walk(
  dir: string,
  callback: (wd: WalkDirEnt) => WalkResult,
  order: WalkOrder = WalkOrder.DEPTH,
): void {
  const files = ls(dir).map((file): WalkDirEnt => ({
    file,
    parent: "",
    relative: file.name,
  }));
  let file: WalkDirEnt | undefined;
  while ((file = files.shift())) {
    const result = callback(file);
    if (result === WalkResult.ABORT) {
      return;
    } else if (result === WalkResult.CONTINUE && file.file.isDirectory()) {
      const parent = (file.parent === "" ? "" : (file.parent + "/")) + file.file.name;
      const more = ls(path.join(dir, file.relative)).map((child): WalkDirEnt => ({
        file: child,
        parent,
        relative: parent + "/" + child.name,
      }));
      if (order === WalkOrder.DEPTH) {
        files.unshift(...more);
      } else {
        files.push(...more);
      }
    }
  }
}

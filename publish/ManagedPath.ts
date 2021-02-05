import * as console from "console";
import * as fs from "fs";
import * as path from "path";

import {removeIf} from "./removeIf";
import {walk, WalkResult} from "./walk";

/**
 * A thin, caching, write-oriented filesystem abstraction.
 * Instead of nuking the target directory, it tries to intelligently track files to clean up later.
 * Hopefully, this means less disruptive deployments.
 */
export class ManagedPath {
  private readonly dirsToRemove: string[] = [];
  private readonly filesToRemove: string[] = [];
  public readonly root: string;

  constructor(
    public readonly givenDir: string,
  ) {
    this.root = givenDir;
    fs.mkdirSync(this.root, {recursive: true});
  }

  applyChanges(): void {
    let relative: string | undefined;
    console.log(`#  clean-up ${this.filesToRemove.length} files, ${this.dirsToRemove.length} directories`);
    while ((relative = this.filesToRemove.shift())) {
      console.log(`~ ${relative}`);
      fs.unlinkSync(this.join(relative));
    }
    while ((relative = this.dirsToRemove.shift())) {
      console.log(`~ ${relative}/`);
      fs.rmdirSync(this.join(relative))
    }
  }

  copy(externalPath: string, ...relatives: string[]): void {
    const key = path.join(...relatives);
    console.log(`=> ${key}`);
    fs.copyFileSync(externalPath, this.join(key));
    this.keepFile(key);
  }

  join(...suffix: string[]): string {
    return path.join(this.root, ...suffix);
  }

  keepDir(key: string): void {
    removeIf(this.dirsToRemove, dir => key.startsWith(dir), dir => {
      console.log(`!~ ${dir}/ (${this.dirsToRemove.length} dirs remain)`);
    });
  }

  keepFile(key: string): void {
    removeIf(this.filesToRemove, f => key === f, f => {
      console.log(`!~ ${f} (${this.filesToRemove.length} files remain)`);
      this.keepDir(path.dirname(f));
    });
  }

  markAllForRemoval(): void {
    walk(this.root, ({file, relative}) => {
      if (file.isFile()) {
        this.filesToRemove.push(relative);
      } else if (file.isDirectory()) {
        this.dirsToRemove.push(relative);
      }
      return WalkResult.CONTINUE;
    });
    console.log(`#  tombstone ${this.filesToRemove.length} files, ${this.dirsToRemove.length} directories`);
  }

  mkDir(...parts: string[]): void {
    const key = path.join(...parts);
    fs.mkdirSync(this.join(key), {recursive: true});
    this.keepDir(key);
  }

  write(relative: string, text: string): void {
    fs.writeFileSync(this.join(relative), text, {encoding: "utf8"});
    console.log(`+  ${relative} (${text.length} bytes)`);
    this.keepFile(relative);
  }
}

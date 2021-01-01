import { Component, OnInit } from '@angular/core';
import {unindent} from "../util";

@Component({
  selector: 'learn-loop-basics',
  templateUrl: './loop-basics.component.html',
  styleUrls: ['./loop-basics.component.scss']
})
export class LoopBasicsComponent implements OnInit {
  public readonly sources: Record<string, string> = {
    java: unindent(`
      int count = 1;
      while (count <= 5) {
        count++;
      }
    `),
    typescript: unindent(`
      let count: number = 1;
      while (count <= 5) {
        count++;
      }
    `),
    php: unindent(`
      $count = 1;
      while ($count <= 5) {
        $count++;
      }
    `),
    perl: unindent(`
      my $count = 1;
      while ($count <= 5) {
        $count++;
      }
    `),
    ruby: unindent(`
      $count = 1
      while ($count <= 5) do
        $count++;
      end
    `),
    bash: unindent(`
      COUNT=1
      while [ $COUNT -le 5 ] ; do
        COUNT=$(( $COUNT + 1 ))
      done
    `),
    basic: unindent(`
      Dim count as Integer = 1
      While count <= 5
        count += 1
      End While
    `),
    pascal: unindent(`
      count := 1
      WHILE (count <= 5) DO
        BEGIN
          count := count + 1
        END;
    `),
    python: unindent(`
      count = 1
      while (count <= 5):
          count++
    `),
    js: unindent(`
      var count = 1;
      while (count <= 5) {
        count++;
      }
    `),
  };

  constructor() { }

  ngOnInit(): void {
  }

}

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
  };

  constructor() { }

  ngOnInit(): void {
  }

}

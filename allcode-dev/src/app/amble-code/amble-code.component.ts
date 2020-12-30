import {Component, Input, OnInit} from '@angular/core';
import {CodeLanguageKey} from "../languages";

@Component({
  selector: 'amble-code',
  templateUrl: './amble-code.component.html',
  styleUrls: ['./amble-code.component.scss']
})
export class AmbleCodeComponent implements OnInit {
  @Input("languageId")
  public languageId: CodeLanguageKey | undefined;

  @Input("languageIds")
  public languageIds: CodeLanguageKey[] | undefined;

  @Input("source")
  public source: string | null | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

}

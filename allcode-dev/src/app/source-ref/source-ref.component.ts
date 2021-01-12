import {Component, Input, OnInit} from '@angular/core';
import {CodeLanguageKey} from "../languages";

@Component({
  selector: 'source-ref',
  templateUrl: './source-ref.component.html',
  styleUrls: ['./source-ref.component.scss']
})
export class SourceRefComponent implements OnInit {
  @Input("selector")
  public selector!: string;

  @Input("languageId")
  public languageId: CodeLanguageKey | undefined;

  @Input("count")
  public count: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}

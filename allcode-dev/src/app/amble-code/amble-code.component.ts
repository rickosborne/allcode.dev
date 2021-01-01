import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CodeLanguageKey, LANGUAGE_NAME} from "../languages";

@Component({
  selector: 'amble-code',
  templateUrl: './amble-code.component.html',
  styleUrls: ['./amble-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AmbleCodeComponent implements OnInit {
  @Input("highlighted")
  public highlighted!: string;
  @Input("languageId")
  public languageId: CodeLanguageKey | undefined;
  @Input("languageIds")
  public languageIds: CodeLanguageKey[] | undefined;
  @Output("nextLanguage")
  public nextLanguage = new EventEmitter<void>();
  @Output("prevLanguage")
  public prevLanguage = new EventEmitter<void>();
  @Output("randomizeLanguage")
  public randomizeLanguage = new EventEmitter<void>();
  @Input("source")
  public source!: string;

  constructor() {
  }

  @Output("label")
  public get label(): string {
    const ids = this.languageId != null ? [this.languageId] : (this.languageIds || []);
    return ids.map(id => LANGUAGE_NAME[id]).sort().join(" / ");
  }

  ngOnInit(): void {
  }

  onLanguageDblClick() {
    this.randomizeLanguage.emit();
  }
}

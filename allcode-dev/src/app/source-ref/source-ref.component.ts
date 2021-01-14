import {Component, Input} from '@angular/core';
import {CodeLanguageKey} from "../languages";

@Component({
  selector: 'source-ref',
  templateUrl: './source-ref.component.html',
  styleUrls: ['./source-ref.component.scss']
})
export class SourceRefComponent {
  @Input("count")
  public count: number = 1;
  @Input("languageId")
  public languageId: CodeLanguageKey | undefined;
  @Input("selector")
  public selector!: string;

  constructor() {
  }

  public doesApplyTo(...langIds: CodeLanguageKey[]): boolean {
    return this.languageId == null || langIds.includes(this.languageId);
  }

  public match(rootEl: Element): Element[] {
    const matches: Element[] = [];
    const els = rootEl.querySelectorAll(this.selector);
    if (els != null && els.length > 0) {
      for (let i = 0; i < this.count; i++) {
        const el = els.item(i);
        matches.push(el);
      }
    }
    return matches;
  }

}

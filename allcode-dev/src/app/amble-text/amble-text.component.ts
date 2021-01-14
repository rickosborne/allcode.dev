import {Component, ElementRef, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'amble-text',
  templateUrl: './amble-text.component.html',
  styleUrls: ['./amble-text.component.scss']
})
export class AmbleTextComponent {
  @Input("slot")
  public slot!: string;
  public readonly element: Element;

  constructor(public readonly elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
  }

  @Output("text")
  public get text(): string {
    return (this.element as any).innerText as string;
  }

  @Output("html")
  public get html(): string {
    return (this.element as any).innerHTML as string;
  }

}

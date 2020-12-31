import {Component, EventEmitter, Input, Output} from '@angular/core';

export enum ButtonState {
  normal = 'normal',
  active = 'active',
  inactive = 'inactive',
}

@Component({
  selector: 'icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent {
  @Input("active")
  public active: keyof typeof ButtonState = 'normal';
  @Output("clicked")
  public readonly clicked = new EventEmitter<MouseEvent>();
  @Input("icon")
  public icon: string | undefined;
  @Input("icons")
  public icons: string[] | undefined;
  private isDisabled: boolean = false;
  @Input("label")
  public label: string | null | undefined;
  @Input("value")
  public value: any;
  @Input("wrap")
  public wrap: boolean = false;

  constructor() {
  }

  public get allIcons(): string[] {
    return Array.isArray(this.icons) ? this.icons : typeof this.icon === 'string' ? [this.icon] : [];
  }

  public get disabled(): boolean | "disabled" | null | undefined {
    return this.isDisabled;
  }

  @Input("disabled")
  public set disabled(value: boolean | "disabled" | null | undefined) {
    this.isDisabled = !!value;
  }

  public onClick($event: MouseEvent) {
    this.clicked.emit($event);
  }
}

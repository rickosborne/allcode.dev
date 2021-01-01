import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ButtonState, IconButtonComponent} from "../icon-button/icon-button.component";

@Component({
  selector: 'icon-radio',
  templateUrl: './icon-radio.component.html',
  styleUrls: ['./icon-radio.component.scss']
})
export class IconRadioComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(IconButtonComponent)
  public buttons!: QueryList<IconButtonComponent>;
  @Output("change")
  public change = new EventEmitter<void>();
  private readonly destroy$ = new Subject<void>();
  @Input("label")
  public label!: string;
  @Input("name")
  public name: string | undefined;
  @Input("value")
  public value: any;
  @Output("value")
  public valueChange = new EventEmitter<any>();

  constructor() {
  }

  public ngAfterContentInit(): void {
    this.buttons.forEach(button => {
      // if (button.active === ButtonState.normal) {
      //   button.active = ButtonState.inactive;
      // }
      button.clicked
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.value = button.value;
          this.valueChange.emit(button.value);
          this.change.emit()
          this.buttons.forEach(other => {
            other.active = button === other ? ButtonState.active : ButtonState.inactive;
          });
        });
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

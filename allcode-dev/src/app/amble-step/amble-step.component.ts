import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LessonRefComponent} from "../lesson-ref/lesson-ref.component";

@Component({
  selector: 'amble-step',
  templateUrl: './amble-step.component.html',
  styleUrls: ['./amble-step.component.scss']
})
export class AmbleStepComponent implements AfterContentInit {
  @Input("descriptionMarkup")
  public descriptionMarkup: string | null | undefined;
  @Input("extraMarkup")
  public extraMarkup: string | null | undefined;
  @ContentChildren(LessonRefComponent)
  public lessonRefs!: QueryList<LessonRefComponent>;
  public readonly lessonRefs$ = new BehaviorSubject<LessonRefComponent[]>([]);
  @Input("stepKey")
  public stepKey: string | null | undefined;

  constructor() {
  }

  ngAfterContentInit(): void {
    this.lessonRefs$.next(this.lessonRefs.toArray());
    this.lessonRefs.changes.subscribe(refs => {
      if (Array.isArray(refs)) {
        this.lessonRefs$.next(refs as LessonRefComponent[]);
      }
    })
  }

}

import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HasLessonRefs} from "../HasLessonRefs";
import {HasSourceRefs} from "../HasSourceRefs";
import {LessonRefComponent} from "../lesson-ref/lesson-ref.component";
import {SourceRefComponent} from "../source-ref/source-ref.component";
import {wireQueryList} from "../util";

@Component({
  selector: 'amble-step',
  templateUrl: './amble-step.component.html',
  styleUrls: ['./amble-step.component.scss']
})
export class AmbleStepComponent implements AfterContentInit, HasLessonRefs, HasSourceRefs {
  @Input("descriptionMarkup")
  public descriptionMarkup: string | null | undefined;
  @Input("extraMarkup")
  public extraMarkup: string | null | undefined;
  @ContentChildren(LessonRefComponent)
  public lessonRefs!: QueryList<LessonRefComponent>;
  public readonly lessonRefs$ = new BehaviorSubject<LessonRefComponent[]>([]);
  @ContentChildren(SourceRefComponent)
  public sourceRefs!: QueryList<SourceRefComponent>;
  public readonly sourceRefs$ = new BehaviorSubject<SourceRefComponent[]>([]);
  @Input("stepKey")
  public stepKey: string | null | undefined;

  constructor() {
  }

  ngAfterContentInit(): void {
    wireQueryList(this.lessonRefs, this.lessonRefs$);
    wireQueryList(this.sourceRefs, this.sourceRefs$);
  }

}

import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LessonRefComponent} from "../lesson-ref/lesson-ref.component";

@Component({
  selector: 'amble-question',
  templateUrl: './amble-question.component.html',
  styleUrls: ['./amble-question.component.scss']
})
export class AmbleQuestionComponent implements AfterContentInit {
  @Input("answer")
  public answer!: string;
  @Input("explanationKey")
  public explanationKey: string | undefined;
  @Input("highlightAnswer")
  public highlightAnswer: string | undefined;
  @Input("highlightQuestion")
  public highlightQuestion: string | undefined;
  @ContentChildren(LessonRefComponent)
  public lessonRefs!: QueryList<LessonRefComponent>;
  public readonly lessonRefs$ = new BehaviorSubject<LessonRefComponent[]>([]);
  @Input("question")
  public question!: string;
  @Input("rationale")
  public rationale: string | undefined;

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

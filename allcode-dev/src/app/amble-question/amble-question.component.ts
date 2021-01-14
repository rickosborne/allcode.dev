import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AmbleTextComponent} from "../amble-text/amble-text.component";
import {HasLessonRefs} from "../HasLessonRefs";
import {HasSourceRefs} from "../HasSourceRefs";
import {LessonRefComponent} from "../lesson-ref/lesson-ref.component";
import {SourceRefComponent} from "../source-ref/source-ref.component";
import {wireQueryList, wireTextSlots} from "../util";

export enum AmbleQuestionSourceHighlightWhen {
  Question = 'Question',
  Answer = 'Answer',
  Rationale = 'Rationale',
}

@Component({
  selector: 'amble-question',
  templateUrl: './amble-question.component.html',
  styleUrls: ['./amble-question.component.scss']
})
export class AmbleQuestionComponent implements AfterContentInit, HasLessonRefs, HasSourceRefs {
  @Input("answer")
  public answer!: string;
  @Input("explanationKey")
  public explanationKey: string | undefined;
  @Input("highlightAnswer")
  public highlightAnswer: string | undefined;
  @Input("highlightQuestion")
  public highlightQuestion: string | undefined;
  public highlightWhen: AmbleQuestionSourceHighlightWhen = AmbleQuestionSourceHighlightWhen.Answer;
  @ContentChildren(LessonRefComponent)
  public lessonRefs!: QueryList<LessonRefComponent>;
  public readonly lessonRefs$ = new BehaviorSubject<LessonRefComponent[]>([]);
  @Input("question")
  public question!: string;
  @Input("rationale")
  public rationale: string | undefined;
  @ContentChildren(SourceRefComponent)
  public sourceRefs!: QueryList<SourceRefComponent>;
  public readonly sourceRefs$ = new BehaviorSubject<SourceRefComponent[]>([]);
  @ContentChildren(AmbleTextComponent)
  public textChildren!: QueryList<AmbleTextComponent>;

  constructor() {
  }

  ngAfterContentInit(): void {
    wireQueryList(this.lessonRefs, this.lessonRefs$);
    wireQueryList(this.sourceRefs, this.sourceRefs$);
    wireTextSlots(this.textChildren, {
      question: q => this.question = q,
      answer: a => this.answer = a,
      rationale: r => this.rationale = r,
    });
  }

  @Input("highlightWhen")
  public set _highlightWhen(value: string | AmbleQuestionSourceHighlightWhen | null | undefined) {
    if (value === AmbleQuestionSourceHighlightWhen.Answer || value === AmbleQuestionSourceHighlightWhen.Question || value === AmbleQuestionSourceHighlightWhen.Rationale) {
      this.highlightWhen = value;
    } else {
      this.highlightWhen = AmbleQuestionSourceHighlightWhen.Answer;
    }

  }

}

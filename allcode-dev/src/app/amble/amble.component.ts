import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from "rxjs";
import {map, startWith, takeUntil} from "rxjs/operators";
import {AmbleCodeComponent} from "../amble-code/amble-code.component";
import {AmbleQuestionComponent} from "../amble-question/amble-question.component";
import {AmbleStepComponent} from "../amble-step/amble-step.component";
import {FullscreenService, FullscreenState} from "../fullscreen.service";
import {CodeLanguageKey} from "../languages";
import {SessionService} from "../session.service";
import {arrayIdentityChanged, nonNull} from "../util";

export enum AmbleCodeLayout {
  One = 'One',
  TwoHoriz = 'TwoHoriz',
  TwoVert = 'TwoVert',
  Four = 'Four',
}

export const AmbleCodeLayoutCount: Record<AmbleCodeLayout, number> = {
  One: 1,
  TwoHoriz: 2,
  TwoVert: 2,
  Four: 4
}

export enum AmbleFooterMode {
  Hidden = 'hidden',
  Step = 'step',
  Quiz = 'quiz',
}

export enum QuestionMode {
  Question = 'question',
  Answer = 'answer',
  Rationale = 'rationale',
}

export enum StepExtraMode {
  Step = 'step',
  Extra = 'extra',
}

@Component({
  selector: 'amble',
  templateUrl: './amble.component.html',
  styleUrls: ['./amble.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AmbleComponent implements AfterContentInit, OnDestroy {
  @ViewChild("ambleRoot")
  public ambleRoot!: ElementRef;
  @ContentChildren(AmbleCodeComponent)
  public codeChildren!: QueryList<AmbleCodeComponent>;
  public readonly codeChildren$ = new BehaviorSubject<AmbleCodeComponent[]>([]);
  public readonly codeLayout$ = new BehaviorSubject<AmbleCodeLayout>(AmbleCodeLayout.One);
  public currentQuestion: AmbleQuestionComponent | undefined;
  public currentQuestionNum: number = -1;
  public currentStep: AmbleStepComponent | undefined;
  public currentStepNum: number = -1;
  public currentWalkDescription: string = '';
  @Input("descriptionMarkdown")
  public descriptionMarkdown: string | null | undefined;
  private readonly destroy$ = new Subject<void>();
  public footerMode: AmbleFooterMode = AmbleFooterMode.Hidden;
  public fullscreenState: FullscreenState = FullscreenState.normal;
  public readonly languageRank$: Observable<CodeLanguageKey[]>;
  @ContentChildren(AmbleQuestionComponent)
  public questionChildren!: QueryList<AmbleQuestionComponent>;
  public questionChildren$ = new BehaviorSubject<AmbleQuestionComponent[]>([]);
  public questionMode: QuestionMode = QuestionMode.Question;
  @ContentChildren(AmbleStepComponent)
  public stepChildren!: QueryList<AmbleStepComponent>;
  public readonly stepChildren$ = new BehaviorSubject<AmbleStepComponent[]>([]);
  @Input("titleMarkdown")
  public titleMarkdown: string | null | undefined;
  public readonly visibleCode$: Observable<AmbleCodeComponent[]>;
  public stepExtraMode: StepExtraMode = StepExtraMode.Step;

  constructor(
    private readonly session: SessionService,
    private readonly fullscreen: FullscreenService,
  ) {
    this.languageRank$ = session.getUser$().pipe(
      nonNull(),
      map(user => user.languageRank || []),
      startWith([] as CodeLanguageKey[]),
    );
    this.visibleCode$ = combineLatest([
      this.codeLayout$,
      this.codeChildren$,
      this.languageRank$.pipe(arrayIdentityChanged()),
    ]).pipe(
      map(([layout, allChildren, languageRank]) => {
        const wantCount = AmbleCodeLayoutCount[layout];
        const visible: AmbleCodeComponent[] = [];
        for (let languageId of languageRank) {
          allChildren
            .filter(child => child.languageId === languageId ||
              (Array.isArray(child.languageIds) && child.languageIds.includes(languageId)))
            .filter(child => !visible.includes(child))
            .forEach(child => visible.push(child));
        }
        const stillNeed = wantCount - visible.length;
        if (stillNeed > 0) {
          visible.push(...allChildren.filter(child => !visible.includes(child)).slice(0, stillNeed + 1));
        }
        return visible.slice(0, wantCount);
      }),
    );
  }

  backQuestion() {
    this.questionMode = QuestionMode.Question;
    this.moveThrough(this.currentQuestion, this.questionChildren, -1, q => this.currentQuestion = q, n => this.currentQuestionNum = n);
  }

  backStep() {
    this.stepExtraMode = StepExtraMode.Step;
    this.moveThrough(this.currentStep, this.stepChildren, -1, s => this.currentStep = s, n => this.currentStepNum = n);
  }

  forwardQuestion() {
    this.questionMode = QuestionMode.Question;
    this.moveThrough(this.currentQuestion, this.questionChildren, 1, q => this.currentQuestion = q, n => this.currentQuestionNum = n);
  }

  forwardStep() {
    this.stepExtraMode = StepExtraMode.Step;
    this.moveThrough(this.currentStep, this.stepChildren, 1, s => this.currentStep = s, n => this.currentStepNum = n);
  }

  goFullscreen() {
    if (this.fullscreenState === FullscreenState.full) {
      this.fullscreenState = FullscreenState.working;
      this.fullscreen.relinquish(this.ambleRoot.nativeElement).then(state => {
        this.fullscreenState = state;
      });
    } else {
      this.fullscreenState = FullscreenState.working;
      this.fullscreen.request(this.ambleRoot.nativeElement, {navigationUI: "hide"})
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe(state => {
          this.fullscreenState = state;
        });
    }
  }

  // noinspection JSMethodCanBeStatic
  private moveThrough<T>(
    currentItem: T,
    itemsQueryList: QueryList<T>,
    step: number,
    itemSetter: (item: T) => void,
    numSetter: (n: number) => void,
  ): void {
    if (currentItem == null || itemsQueryList.length === 0) {
      return;
    }
    const items = itemsQueryList.toArray();
    const currentIndex = items.indexOf(currentItem);
    const nextIndex = (currentIndex + items.length + step) % items.length;
    const nextItem = items[nextIndex];
    numSetter(nextIndex);
    itemSetter(nextItem);
  }

  ngAfterContentInit(): void {
    this.prepChildren(this.codeChildren, this.codeChildren$);
    this.prepChildren(this.stepChildren, this.stepChildren$, step => this.currentStep = step, n => this.currentStepNum = n);
    if (this.stepChildren.length > 0) {
      this.footerMode = AmbleFooterMode.Step;
    }
    this.prepChildren(this.questionChildren, this.questionChildren$, q => this.currentQuestion = q, n => this.currentQuestionNum = n);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prepChildren<T>(
    queryList: QueryList<T>,
    bs$: BehaviorSubject<T[]>,
    currentSetter?: (item: T) => void,
    numSetter?: (num: number) => void,
  ): void {
    const items = queryList.toArray();
    bs$.next(items);
    queryList.changes.subscribe(children => {
      if (Array.isArray(children)) {
        bs$.next(children as T[]);
      }
    });
    if (currentSetter != null && items.length > 0) {
      currentSetter(items[0]);
      if (numSetter != null) {
        numSetter(0);
      }
    }
  }

  toggleAnswer() {
    if (this.questionMode === QuestionMode.Question) {
      this.questionMode = QuestionMode.Answer;
    } else {
      this.questionMode = QuestionMode.Question;
    }
  }

  toggleQuiz() {
    if (this.footerMode !== AmbleFooterMode.Quiz) {
      this.footerMode = AmbleFooterMode.Quiz;
    } else if (this.stepChildren.length === 0) {
      this.footerMode = AmbleFooterMode.Hidden;
    } else {
      this.footerMode = AmbleFooterMode.Step;
    }
  }

  toggleRationale() {
    if (this.questionMode === QuestionMode.Rationale) {
      this.questionMode = QuestionMode.Answer;
    } else {
      this.questionMode = QuestionMode.Rationale;
    }
  }

  toggleStepExtra() {
    this.stepExtraMode = this.stepExtraMode === StepExtraMode.Step ? StepExtraMode.Extra : StepExtraMode.Step;
  }

  resetStepExtraMode() {
    this.stepExtraMode = StepExtraMode.Step;
  }
}

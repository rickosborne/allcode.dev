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
import {HasLessonRefs} from "../HasLessonRefs";
import {CachingHighlighter, HighlightService} from "../highlight.service";
import {CodeLanguageKey} from "../languages";
import {LessonRefComponent} from "../lesson-ref/lesson-ref.component";
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
  public readonly highlighter: CachingHighlighter;
  public readonly languageRank$: Observable<CodeLanguageKey[]>;
  public lessonRefs: LessonRefComponent[] = [];
  @ContentChildren(AmbleQuestionComponent)
  public questionChildren!: QueryList<AmbleQuestionComponent>;
  public questionChildren$ = new BehaviorSubject<AmbleQuestionComponent[]>([]);
  public questionMode: QuestionMode = QuestionMode.Question;
  public refsVisible: boolean = false;
  @ContentChildren(AmbleStepComponent)
  public stepChildren!: QueryList<AmbleStepComponent>;
  public readonly stepChildren$ = new BehaviorSubject<AmbleStepComponent[]>([]);
  public stepExtraMode: StepExtraMode = StepExtraMode.Step;
  @Input("titleMarkdown")
  public titleMarkdown: string | null | undefined;
  public visibleCode: AmbleCodeComponent[] = [];

  constructor(
    private readonly session: SessionService,
    private readonly fullscreen: FullscreenService,
    highlight: HighlightService,
  ) {
    this.languageRank$ = session.getUser$().pipe(
      nonNull(),
      map(user => user.languageRank || []),
      startWith([] as CodeLanguageKey[]),
    );
    this.highlighter = highlight.buildCachingHighlighter();
    combineLatest([
      this.codeLayout$,
      this.codeChildren$,
      this.languageRank$.pipe(arrayIdentityChanged()),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([layout, allChildren, languageRank]) => {
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
        this.visibleCode = visible.slice(0, wantCount);
      });
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

  nextLanguage(code: AmbleCodeComponent) {
    const children = this.codeChildren.toArray();
    const currentIndex = children.indexOf(code);
    if (currentIndex < 0) {
      return;
    }
    const hc = children.reduce((prev, cur, idx) => {
      if (this.visibleCode.includes(cur)) {
        return prev;
      }
      let lowest = prev.lowest;
      let closest = prev.closest;
      if (idx < prev.lowest) {
        lowest = idx;
      }
      if (idx > currentIndex && idx < prev.closest) {
        closest = idx;
      }
      return {lowest, closest};
    }, {lowest: children.length, closest: children.length});
    const newIndex = hc.closest < children.length ? hc.closest : hc.lowest;
    if (newIndex < 0) {
      return;
    }
    const replacement = children[newIndex];
    console.log(`nextLanguage ${currentIndex} ${code.label} => ${newIndex} ${replacement.label}`, hc);
    this.visibleCode = this.visibleCode.map(child => {
      return child === code ? replacement : child;
    });
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

  prevLanguage(code: AmbleCodeComponent) {
    const children = this.codeChildren.toArray();
    const currentIndex = children.indexOf(code);
    if (currentIndex < 0) {
      return;
    }
    const hc = children.reduce((prev, cur, idx) => {
      if (this.visibleCode.includes(cur)) {
        console.log(`Skipping ${idx} ${cur.label} as it's already visible`);
        return prev;
      }
      let highest = prev.highest;
      let closest = prev.closest;
      if (idx > prev.highest) {
        highest = idx;
      }
      if (idx < currentIndex && idx > prev.closest) {
        closest = idx;
      }
      return {highest, closest};
    }, {highest: -1, closest: -1});
    const newIndex = hc.closest >= 0 ? hc.closest : hc.highest;
    if (newIndex < 0) {
      return;
    }
    const replacement = children[newIndex];
    console.log(`prevLanguage ${currentIndex} ${code.label} => ${newIndex} ${replacement.label}`, hc);
    this.visibleCode = this.visibleCode.map(child => {
      return child === code ? replacement : child;
    });
  }

  randomizeLanguage(code: AmbleCodeComponent): void {
    const notPresent = this.unusedLanguages();
    if (notPresent.length > 0) {
      const replacement = notPresent[Math.floor(Math.random() * notPresent.length)];
      console.log("randomizeLanguage", code.label, replacement);
      this.visibleCode = this.visibleCode.map(child => {
        return child === code ? replacement : child;
      });
    }
  }

  resetStepExtraMode(): void {
    this.stepExtraMode = StepExtraMode.Step;
  }

  showReferences(current: HasLessonRefs): void {
    this.lessonRefs = current.lessonRefs.toArray();
    this.refsVisible = true;
  }

  toggleAnswer(): void {
    if (this.questionMode === QuestionMode.Question) {
      this.questionMode = QuestionMode.Answer;
    } else {
      this.questionMode = QuestionMode.Question;
    }
  }

  toggleQuiz(): void {
    if (this.footerMode !== AmbleFooterMode.Quiz) {
      this.footerMode = AmbleFooterMode.Quiz;
    } else if (this.stepChildren.length === 0) {
      this.footerMode = AmbleFooterMode.Hidden;
    } else {
      this.footerMode = AmbleFooterMode.Step;
    }
  }

  toggleRationale(): void {
    if (this.questionMode === QuestionMode.Rationale) {
      this.questionMode = QuestionMode.Answer;
    } else {
      this.questionMode = QuestionMode.Rationale;
    }
  }

  toggleStepExtra(): void {
    this.stepExtraMode = this.stepExtraMode === StepExtraMode.Step ? StepExtraMode.Extra : StepExtraMode.Step;
  }

  private unusedLanguages(): AmbleCodeComponent[] {
    return this.codeChildren.filter(child => {
      return !this.visibleCode.includes(child);
    });
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CodeLanguageKey, LANGUAGE_NAME} from "../languages";
import {SourceRefComponent} from "../source-ref/source-ref.component";

@Component({
  selector: 'amble-code',
  templateUrl: './amble-code.component.html',
  styleUrls: ['./amble-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AmbleCodeComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input("highlightClass")
  public highlightClass: string = 'highlight';
  @Input("highlighted")
  public highlighted!: string;
  private readonly highlightedEl$ = new BehaviorSubject<Element | undefined>(undefined);
  @Input("languageId")
  public languageId: CodeLanguageKey | undefined;
  @Input("languageIds")
  public languageIds: CodeLanguageKey[] | undefined;
  public readonly lastHighlighted$ = new BehaviorSubject<Element[]>([]);
  @Output("nextLanguage")
  public readonly nextLanguage = new EventEmitter<void>();
  @Output("prevLanguage")
  public readonly prevLanguage = new EventEmitter<void>();
  @Output("randomizeLanguage")
  public readonly randomizeLanguage = new EventEmitter<void>();
  @Input("source")
  public source!: string;
  private readonly sourceRefs$ = new BehaviorSubject<SourceRefComponent[]>([]);

  constructor() {
    combineLatest([this.sourceRefs$, this.highlightedEl$]).pipe(
      takeUntil(this.destroy$),
    ).subscribe(([refs, el]) => {
      if (el == null) {
        return;
      }
      this.lastHighlighted$.value.forEach(el => el.classList.remove(this.highlightClass));
      const applicable = refs.filter(ref => ref.doesApplyTo(...this.langIds));
      const nextHighlighted: Element[] = [];
      for (const ref of applicable) {
        const matches = ref.match(el);
        if (matches.length > 0) {
          for (const match of matches) {
            match.classList.add(this.highlightClass);
            nextHighlighted.push(match);
          }
          break;
        }
      }
      this.lastHighlighted$.next(nextHighlighted);
    });
  }

  @ViewChild("highlightedEl")
  public set highlightedEl(el: ElementRef) {
    this.highlightedEl$.next(el == null || el.nativeElement == null ? undefined : el.nativeElement);
  }

  @Output("label")
  public get label(): string {
    return this.langIds.map(id => LANGUAGE_NAME[id]).sort().join(" / ");
  }

  public get langIds(): CodeLanguageKey[] {
    return this.languageId != null ? [this.languageId] : (this.languageIds || []);
  }

  @Input("sourceRefs")
  public set sourceRefs(sourceRefs$: Observable<SourceRefComponent[]>) {
    sourceRefs$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(refs => {
      this.sourceRefs$.next(refs);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLanguageDblClick() {
    this.randomizeLanguage.emit();
  }
}

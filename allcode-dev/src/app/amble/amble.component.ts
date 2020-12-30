import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {AmbleCodeComponent} from "../amble-code/amble-code.component";
import {AmbleStepComponent} from "../amble-step/amble-step.component";
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

@Component({
  selector: 'amble',
  templateUrl: './amble.component.html',
  styleUrls: ['./amble.component.scss']
})
export class AmbleComponent implements AfterContentInit {
  @ContentChildren(AmbleCodeComponent)
  public codeChildren!: QueryList<AmbleCodeComponent>;
  public readonly codeChildren$ = new BehaviorSubject<AmbleCodeComponent[]>([]);
  public readonly codeLayout$ = new BehaviorSubject<AmbleCodeLayout>(AmbleCodeLayout.One);
  @Input("descriptionMarkdown")
  public descriptionMarkdown: string | null | undefined;
  public readonly languageRank$: Observable<CodeLanguageKey[]>;
  @ContentChildren(AmbleStepComponent)
  public stepChildren!: QueryList<AmbleStepComponent>;
  public readonly stepChildren$ = new BehaviorSubject<AmbleStepComponent[]>([]);
  @Input("titleMarkdown")
  public titleMarkdown: string | null | undefined;
  public readonly visibleCode$: Observable<AmbleCodeComponent[]>;

  constructor(
    private readonly session: SessionService
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

  ngAfterContentInit(): void {
    this.codeChildren$.next(this.codeChildren.toArray());
    this.codeChildren.changes.subscribe(children => {
      if (Array.isArray(children)) {
        this.codeChildren$.next(children as AmbleCodeComponent[]);
      }
    });
    this.stepChildren$.next(this.stepChildren.toArray());
    this.stepChildren.changes.subscribe(children => {
      if (Array.isArray(children)) {
        this.stepChildren$.next(children as AmbleStepComponent[]);
      }
    });
  }

}

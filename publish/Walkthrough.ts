import {
  guardAll,
  guardAllOf,
  guardArrayOf,
  guardAtMostOne,
  guardExactlyOne,
  guardProperty,
  guardStringNamed,
  guardUndefinedOr,
  isString,
  NoisyGuard,
} from "./guards";
import {HasRefs, hasTitle, isLinkRef, LinkRef, maybeHasRefs} from "./RefLink";

export interface HasSource {
  source: string;
}

export const hasSource = guardStringNamed("source");

export interface HasSyntax {
  syntax: string;
}

export const hasSingleSyntax: NoisyGuard<HasSyntax> = guardStringNamed("syntax");

export interface HasSyntaxes {
  syntaxes: string[];
}

export const hasSyntaxes: NoisyGuard<HasSyntaxes> = guardProperty("syntaxes", guardArrayOf(isString));

export type WalkthroughSource = HasSource & (HasSyntax | HasSyntaxes);

export const isWalkthroughSource: NoisyGuard<WalkthroughSource> = guardAll(
  hasSource,
  guardExactlyOne(
    hasSingleSyntax,
    hasSyntaxes,
  ),
);

export interface HasDescription {
  description: string;
}

export const hasDescription = guardStringNamed("description");

export interface HasSelector {
  selector: string;
}

export const hasSelector = guardStringNamed("selector");

export type WalkthroughHighlight = HasSelector & (Partial<HasSyntax> | Partial<HasSyntaxes>);

export const isWalkthroughHighlight: NoisyGuard<WalkthroughHighlight> = guardAll(
  hasSelector,
  guardAtMostOne(
    hasSingleSyntax,
    hasSyntaxes,
  ),
);

export interface HasHighlights {
  highlight: WalkthroughHighlight[];
}

export const hasHighlights: NoisyGuard<HasHighlights> = guardProperty("highlight", guardArrayOf(isWalkthroughHighlight));

export interface WalkthroughExplanation extends HasDescription, Partial<HasRefs> {
  extra?: string;
  highlight?: WalkthroughHighlight[];
}

export const isWalkthroughExplanation: NoisyGuard<WalkthroughExplanation> = guardAll(
  hasDescription,
  maybeHasRefs,
  guardAllOf({
    extra: guardUndefinedOr(isString),
    highlight: guardUndefinedOr(guardArrayOf(isWalkthroughHighlight)),
  }),
);

export enum AssessmentHighlightWhen {
  answer = "answer",
  question = "question",
  rationale = "rationale",
}

export function isAssessmentHighlightWhen(value: unknown, noisy = false): value is AssessmentHighlightWhen {
  const result = value === AssessmentHighlightWhen.question ||
    value === AssessmentHighlightWhen.answer ||
    value === AssessmentHighlightWhen.rationale;
  if (!result && noisy) {
    console.warn(`Invalid HighlightWhen: ${typeof value === "string" ? value : typeof value}`);
  }
  return result;
}

export interface WalkthroughAssessment {
  answer: string;
  highlight?: WalkthroughHighlight[];
  highlightWhen?: AssessmentHighlightWhen;
  question: string;
  rationale?: string;
  refs?: LinkRef[];
}

export const isWalkthroughAssessment: NoisyGuard<WalkthroughAssessment> = guardAllOf({
  answer: isString,
  highlight: guardUndefinedOr(guardArrayOf(isWalkthroughHighlight)),
  highlightWhen: guardUndefinedOr(isAssessmentHighlightWhen),
  question: isString,
  rationale: guardUndefinedOr(isString),
  refs: guardUndefinedOr(guardArrayOf(isLinkRef)),
});

export interface Walkthrough extends HasDescription {
  assessment?: WalkthroughAssessment[];
  explanation?: WalkthroughExplanation[];
  sources: WalkthroughSource[];
  title: string;
}

export const isWalkthrough: NoisyGuard<Walkthrough> = guardAll(
  hasDescription,
  hasTitle,
  guardAllOf({
    assessment: guardUndefinedOr(guardArrayOf(isWalkthroughAssessment)),
    explanation: guardUndefinedOr(guardArrayOf(isWalkthroughExplanation)),
    sources: guardArrayOf(isWalkthroughSource),
  }),
);

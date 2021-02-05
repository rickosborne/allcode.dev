import { AmbleElement } from './AmbleElement';
import { AmbleHasLinks, AmbleHasSourceRefs } from './AmbleInterfaces';
import { AmbleSourceRefElement } from './AmbleSourceRefElement';
export declare const HIGHLIGHT_WHEN_Q = "Question";
export declare const HIGHLIGHT_WHEN_A = "Answer";
export declare const HIGHLIGHT_WHEN_R = "Rationale";
export declare type HighlightWhen = typeof HIGHLIGHT_WHEN_Q | typeof HIGHLIGHT_WHEN_A | typeof HIGHLIGHT_WHEN_R;
export declare class AmbleQuestionElement extends AmbleElement implements AmbleHasLinks, AmbleHasSourceRefs {
    readonly answerEl: HTMLElement | null;
    readonly highlightWhen: HighlightWhen;
    readonly links: HTMLElement[];
    readonly questionEl: HTMLElement | null;
    readonly rationaleEl: HTMLElement | null;
    readonly sourceRefs: AmbleSourceRefElement[];
    constructor();
}

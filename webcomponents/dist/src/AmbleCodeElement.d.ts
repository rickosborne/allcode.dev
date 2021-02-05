import { PropertyValues } from 'lit-element';
import { Part, TemplateResult } from 'lit-html';
import { AmbleElement } from './AmbleElement';
import { CachingHighlighter } from './AmbleSourceFormatter';
import { AmbleSourceRefElement } from './AmbleSourceRefElement';
export declare type UnsafeHtmlLike = (part: Part) => void;
export declare const CodeChangeRequestEventType = "codechangerequest";
export declare class CodeChangeRequestEvent extends Event {
    readonly step: number;
    readonly codeElement: AmbleCodeElement;
    constructor(step: number, codeElement: AmbleCodeElement);
}
export declare class AmbleCodeElement extends AmbleElement {
    private _codeEl;
    _navControls: boolean;
    highlightClass: string;
    readonly highlighted: import("./ResolvablePromise").ResolvablePromise<UnsafeHtmlLike>;
    highlighter: CachingHighlighter;
    index: number;
    private previousHighlightSelector;
    private readonly previousHighlights;
    source: string;
    syntax: string;
    get codeEl(): HTMLElement | undefined;
    set navControls(show: boolean);
    clearHighlighted(): void;
    private emitChangeRequest;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    onNextLanguage(): void;
    onPrevLanguage(): void;
    render(): TemplateResult;
    setHighlightedSourceRefs(refs: AmbleSourceRefElement[] | undefined): void;
}

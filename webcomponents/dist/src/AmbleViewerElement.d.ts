import { PropertyValues } from 'lit-element';
import { TemplateResult } from 'lit-html';
import { AmbleCodeElement } from './AmbleCodeElement';
import { AmbleElement } from './AmbleElement';
import { AmbleHasLinks, AmbleHasSourceRefs } from './AmbleInterfaces';
import { AmbleQuestionElement } from './AmbleQuestionElement';
export declare const FOOTER_MODE_STEP = "step";
export declare const FOOTER_MODE_QUIZ = "quiz";
export declare const FOOTER_MODE_NONE = "none";
export declare const QUIZ_MODE_Q = "question";
export declare const QUIZ_MODE_A = "answer";
export declare const QUIZ_MODE_R = "rationale";
export declare const BODY_LAYOUT_1 = "1";
export declare const BODY_LAYOUT_2H = "2H";
export declare const BODY_LAYOUT_2V = "2V";
export declare const BODY_LAYOUT_4 = "4";
export declare const BODY_LAYOUT_REFS = "R";
export declare type BodyLayout = typeof BODY_LAYOUT_1 | typeof BODY_LAYOUT_2H | typeof BODY_LAYOUT_2V | typeof BODY_LAYOUT_4 | typeof BODY_LAYOUT_REFS;
export declare const CODE_COUNT_BY_LAYOUT: Record<BodyLayout, number>;
export declare type QuizMode = typeof QUIZ_MODE_Q | typeof QUIZ_MODE_A | typeof QUIZ_MODE_R;
export declare type FooterMode = typeof FOOTER_MODE_STEP | typeof FOOTER_MODE_QUIZ | typeof FOOTER_MODE_NONE;
export declare class AmbleViewerElement extends AmbleElement {
    private _codeChildren;
    private readonly _renderedQuestions;
    private readonly _visibleCode;
    bodyLayout: BodyLayout;
    currentQuestion: AmbleQuestionElement | undefined;
    currentQuestionNum: number;
    currentRenderedQuestion: Element | undefined;
    private currentStep;
    currentStepNum: number;
    description: string;
    footerMode: FooterMode;
    private isFullScreen;
    private readonly questionChildren;
    quizMode: QuizMode;
    private readonly sources;
    private readonly stepChildren;
    stepExtraMode: string;
    title: string;
    trackProgress: boolean;
    private visibleCodeCount;
    constructor();
    get codeChildren(): AmbleCodeElement[];
    get currentHasLinks(): (AmbleHasLinks & AmbleHasSourceRefs) | undefined;
    get renderedQuestions(): Element[];
    get visibleCode(): AmbleCodeElement[];
    backQuestion(): void;
    backStep(): void;
    changeQuestion(step: number): void;
    changeStep(delta: number): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    forwardQuestion(): void;
    forwardStep(): void;
    goFullscreen(): void;
    goQuizMode(): void;
    goStepMode(): void;
    hideFooter(): void;
    private onCodeChangeRequest;
    private rehighlight;
    render(): TemplateResult;
    setCurrentQuestion(index: number): void;
    setCurrentStep(index: number): void;
    setFooterMode(mode: typeof FOOTER_MODE_STEP | typeof FOOTER_MODE_QUIZ | typeof FOOTER_MODE_NONE): void;
    setLayout(layout: BodyLayout): void;
    setQuizMode(mode: QuizMode): void;
    toggleAnswer(): void;
    toggleLayout(): void;
    toggleRationale(): void;
    toggleReferences(): void;
    toggleStepExtra(): void;
}
